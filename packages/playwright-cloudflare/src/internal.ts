import type { SuiteInfo, TestCaseInfo, TestEndPayload } from '../internal';
import { setCurrentlyLoadingFileSuite } from 'playwright/lib/common/globals';
import { Suite, TestCase } from 'playwright/lib/common/test';
import { loadConfig } from 'playwright/lib/common/configLoader';
import { bindFileSuiteToProject } from 'playwright/lib/common/suiteUtils';
import { rootTestType } from 'playwright/lib/common/testType';
import { WorkerMain } from 'playwright/lib/worker/workerMain';
import { ManualPromise } from 'playwright-core/lib/utils';

export { debug } from 'playwright-core/lib/utilsBundle';

// @ts-ignore
export const _baseTest: TestType<{}, {}> = rootTestType.test;

export const _rootSuites: Suite[] = [];

export function setCurrentTestFile(file?: string) {
  if (!file) {
    setCurrentlyLoadingFileSuite(undefined);
    return;
  }

  const suite = new Suite(file, 'file');
  suite._requireFile = file;
  suite.location = { file, line: 0, column: 0 };
  setCurrentlyLoadingFileSuite(suite);
  _rootSuites.push(suite);
}

function toInfo(test: Suite | TestCase): SuiteInfo | TestCaseInfo {
  if (test instanceof Suite) {
    return {
      type: test._type as any,
      file: test._requireFile!,
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      entries: test._entries.map(toInfo),
    };
  } else if (test instanceof TestCase) {
    return {
      type: 'test',
      file: test._requireFile!,
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      testId: test.id,
    };
  }

  throw new Error('Invalid test');
}

export const playwrightTestConfig = {
  projects: [
    {
      timeout: 5000,
      name: 'workers',
    },
  ],
};

const configLocation = {
  resolvedConfigFile: 'playwright.config.ts',
  configDir: 'playwright.config.ts',
};

async function bindSuites() {
  const fullConfig = await loadConfig(configLocation);
  const [project] = fullConfig.projects;
  return _rootSuites.map(s => bindFileSuiteToProject(project, s));
}

export async function testSuites(): Promise<SuiteInfo[]> {
  const suites = await bindSuites();
  return suites.map(toInfo) as SuiteInfo[];
}

class TestWorker extends WorkerMain {
  private _donePromise = new ManualPromise<void>();
  private _testResult?: TestEndPayload;

  constructor(options?: { timeout?: number }) {
    super({
      workerIndex: 0,
      parallelIndex: 0,
      repeatEachIndex: 0,
      projectId: 'workers',
      config: {
        location: configLocation,
        configCLIOverrides: {
          timeout: 5000,
          ...options,
        },
      },
      artifactsDir: `/tmp/tests`,
    });
  }

  async testResult() {
    await this._donePromise;
    return this._testResult!;
  }

  protected override dispatchEvent(method: string, params: any): void {
    if (method === 'testEnd')
      this._testResult = params;
    if (method === 'done')
      this._donePromise.resolve();
  }
}

export class TestRunner {
  private _options: { timeout?: number; } | undefined;

  constructor(options?: { timeout?: number }) {
    this._options = options;
  }
  
  async runTest(file: string, testId: string): Promise<TestEndPayload> {
    const testWorker = new TestWorker(this._options);
    try {
      const [result] = await Promise.all([
        testWorker.testResult(),
        testWorker.runTestGroup({ file, entries: [{ testId, retry: 0 }] }),
      ]);
      return result;
    } finally {
      await testWorker.gracefullyClose();
    }
  }
}
