import { ManualPromise } from 'playwright-core/lib/utils';
import { loadConfig } from 'playwright/lib/common/configLoader';
import { setCurrentlyLoadingFileSuite } from 'playwright/lib/common/globals';
import { bindFileSuiteToProject } from 'playwright/lib/common/suiteUtils';
import { Suite, TestCase } from 'playwright/lib/common/test';
import { rootTestType } from 'playwright/lib/common/testType';
import { WorkerMain } from 'playwright/lib/worker/workerMain';

import type { SuiteInfo, TestCaseInfo, TestContext, TestEndPayload } from '../internal';

export { isUnderTest, setUnderTest } from 'playwright-core/lib/utils';
export { debug } from 'playwright-core/lib/utilsBundle';
export { mergeTests } from 'playwright/lib/common/testType';

export * from 'playwright-core/lib/zipBundle';
export * from 'playwright-core/lib/utilsBundle';

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
      name: 'chromium',
    },
  ],
};

export const configLocation = {
  resolvedConfigFile: '/tmp/workerTests/playwright.config.ts',
  configDir: '/tmp/workerTests',
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
      projectId: playwrightTestConfig.projects[0].name,
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
    return this._testResult;
  }

  protected override dispatchEvent(method: string, params: any): void {
    if (method === 'testEnd')
      this._testResult = params;
    if (method === 'done')
      this._donePromise.resolve();
  }
}

let context: TestContext | undefined;

export function currentTestContext() {
  if (!context)
    throw new Error(`Test context not initialized`);
  return context;
}

export class TestRunner {
  private _testContext: TestContext;
  private _options: { timeout?: number; } | undefined;

  constructor(testContext: TestContext, options?: { timeout?: number }) {
    this._testContext = testContext;
    this._options = options;
  }

  async runTest(file: string, testId: string): Promise<TestEndPayload> {
    context = this._testContext;
    const testWorker = new TestWorker(this._options);
    try {
      const [result] = await Promise.all([
        testWorker.testResult(),
        testWorker.runTestGroup({ file, entries: [{ testId, retry: 0 }] }),
      ]);
      return result ?? {
        testId,
        annotations: [{ type: 'error', description: 'testEnd event not triggered' }],
        errors: [],
        expectedStatus: 'passed',
        status: 'failed',
        hasNonRetriableError: false,
        duration: 0,
        timeout: 0,
      };
    } finally {
      await testWorker.gracefullyClose();
      context = undefined;
    }
  }
}
