import '@cloudflareTests/browser-rendering/api.spec';

import '@workerTests/page/elementhandle-bounding-box.spec';
import '@workerTests/page/elementhandle-click.spec';
import '@workerTests/page/elementhandle-content-frame.spec';
import '@workerTests/page/elementhandle-convenience.spec';
import '@workerTests/page/elementhandle-eval-on-selector.spec';
import '@workerTests/page/elementhandle-misc.spec';
import '@workerTests/page/elementhandle-owner-frame.spec';
import '@workerTests/page/elementhandle-press.spec';
import '@workerTests/page/elementhandle-query-selector.spec';
import '@workerTests/page/elementhandle-screenshot.spec';
import '@workerTests/page/elementhandle-scroll-into-view.spec';
import '@workerTests/page/elementhandle-select-text.spec';
import '@workerTests/page/elementhandle-type.spec';
import '@workerTests/page/elementhandle-wait-for-element-state.spec';
import '@workerTests/page/eval-on-selector-all.spec';
import '@workerTests/page/eval-on-selector.spec';
import '@workerTests/page/expect-boolean.spec';
import '@workerTests/page/expect-matcher-result.spec';
import '@workerTests/page/expect-misc.spec';
import '@workerTests/page/expect-timeout.spec';
import '@workerTests/page/expect-to-have-text.spec';
import '@workerTests/page/expect-to-have-value.spec';
import '@workerTests/page/frame-evaluate.spec';
import '@workerTests/page/frame-frame-element.spec';
import '@workerTests/page/frame-goto.spec';
import '@workerTests/page/frame-hierarchy.spec';
// import '@workerTests/page/interception.spec';
import '@workerTests/page/jshandle-as-element.spec';
import '@workerTests/page/jshandle-evaluate.spec';
import '@workerTests/page/jshandle-json-value.spec';
import '@workerTests/page/jshandle-properties.spec';
import '@workerTests/page/jshandle-to-string.spec';
import '@workerTests/page/locator-click.spec';
import '@workerTests/page/locator-convenience.spec';
import '@workerTests/page/locator-element-handle.spec';
import '@workerTests/page/locator-evaluate.spec';
import '@workerTests/page/locator-frame.spec';
import '@workerTests/page/locator-highlight.spec';
import '@workerTests/page/locator-is-visible.spec';
import '@workerTests/page/locator-list.spec';
import '@workerTests/page/locator-misc-1.spec';
import '@workerTests/page/locator-misc-2.spec';
import '@workerTests/page/locator-query.spec';
import '@workerTests/page/matchers.misc.spec';
import '@workerTests/page/network-post-data.spec';
import '@workerTests/page/page-accessibility.spec';
import '@workerTests/page/page-add-init-script.spec';
import '@workerTests/page/page-add-locator-handler.spec';
import '@workerTests/page/page-add-script-tag.spec';
import '@workerTests/page/page-add-style-tag.spec';
import '@workerTests/page/page-autowaiting-basic.spec';
import '@workerTests/page/page-autowaiting-no-hang.spec';
import '@workerTests/page/page-basic.spec';
import '@workerTests/page/page-check.spec';
import '@workerTests/page/page-click-during-navigation.spec';
import '@workerTests/page/page-click-react.spec';
import '@workerTests/page/page-click-scroll.spec';
import '@workerTests/page/page-click-timeout-1.spec';
import '@workerTests/page/page-click-timeout-2.spec';
import '@workerTests/page/page-click-timeout-3.spec';
import '@workerTests/page/page-click-timeout-4.spec';
import '@workerTests/page/page-click.spec';
import '@workerTests/page/page-close.spec';
import '@workerTests/page/page-dialog.spec';
import '@workerTests/page/page-dispatchevent.spec';
import '@workerTests/page/page-drag.spec';
import '@workerTests/page/page-emulate-media.spec';
import '@workerTests/page/page-evaluate-handle.spec';
import '@workerTests/page/page-evaluate-no-stall.spec';
import '@workerTests/page/page-evaluate.spec';
import '@workerTests/page/page-event-console.spec';
import '@workerTests/page/page-event-load.spec';
import '@workerTests/page/page-event-network.spec';
import '@workerTests/page/page-event-pageerror.spec';
import '@workerTests/page/page-event-popup.spec';
import '@workerTests/page/page-event-request.spec';
import '@workerTests/page/page-expose-function.spec';
import '@workerTests/page/page-fill.spec';
import '@workerTests/page/page-focus.spec';
import '@workerTests/page/page-goto.spec';
import '@workerTests/page/page-history.spec';
import '@workerTests/page/page-keyboard.spec';
// import '@workerTests/page/page-leaks.spec';
import '@workerTests/page/page-mouse.spec';
import '@workerTests/page/page-navigation.spec';
import '@workerTests/page/page-network-idle.spec';
import '@workerTests/page/page-network-request.spec';
import '@workerTests/page/page-network-response.spec';
import '@workerTests/page/page-network-sizes.spec';
import '@workerTests/page/page-object-count.spec';
import '@workerTests/page/page-request-continue.spec';
import '@workerTests/page/page-request-fallback.spec';
import '@workerTests/page/page-request-fulfill.spec';
import '@workerTests/page/page-request-intercept.spec';
import '@workerTests/page/page-route.spec';
// import '@workerTests/page/page-screenshot.spec';
import '@workerTests/page/page-select-option.spec';
import '@workerTests/page/page-set-content.spec';
import '@workerTests/page/page-set-extra-http-headers.spec';
// import '@workerTests/page/page-set-input-files.spec';
import '@workerTests/page/page-strict.spec';
import '@workerTests/page/page-wait-for-function.spec';
import '@workerTests/page/page-wait-for-load-state.spec';
import '@workerTests/page/page-wait-for-navigation.spec';
import '@workerTests/page/page-wait-for-request.spec';
import '@workerTests/page/page-wait-for-response.spec';
import '@workerTests/page/page-wait-for-selector-1.spec';
import '@workerTests/page/page-wait-for-selector-2.spec';
import '@workerTests/page/page-wait-for-url.spec';
import '@workerTests/page/queryselector.spec';
import '@workerTests/page/retarget.spec';
import '@workerTests/page/selectors-css.spec';
import '@workerTests/page/selectors-frame.spec';
import '@workerTests/page/selectors-get-by.spec';
import '@workerTests/page/selectors-misc.spec';
import '@workerTests/page/selectors-react.spec';
import '@workerTests/page/selectors-register.spec';
import '@workerTests/page/selectors-role.spec';
import '@workerTests/page/selectors-text.spec';
import '@workerTests/page/selectors-vue.spec';
import '@workerTests/page/wheel.spec';
import '@workerTests/page/workers.spec';

import '@workerTests/library/browsercontext-pages.spec';

export const skipTests: string[][] = [
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "path option should create subdirectories"], // Error: Error: [unenv] fs.readFile is not implemented yet!
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should capture full element when larger than viewport in parallel"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-larger-than-viewport-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should capture full element when larger than viewport"], // Error: TypeError: Class constructor Inflate cannot be invoked without 'new'
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should scroll 15000px into view"], // Error: TypeError: Class constructor Inflate cannot be invoked without 'new'
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should scroll element into view"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-scrolled-into-view-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should take into account padding and border"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-padding-border-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should wait for element to stop moving"], // Error: TypeError: Class constructor Inflate cannot be invoked without 'new'
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should wait for visible"], // Error: TypeError: Class constructor Inflate cannot be invoked without 'new'
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should work for an element with an offset"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-fractional-offset-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should work for an element with fractional dimensions"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-fractional-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should work when main world busts JSON.stringify"], // Error: TypeError: Class constructor Inflate cannot be invoked without 'new'
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should work with a rotated element"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-rotate-workers.png, writing actual.
  ["page/elementhandle-screenshot.spec.ts", "element screenshot", "should work"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/elementhandle-screenshot.spec.ts-snapshots/screenshot-element-bounding-box-workers.png, writing actual.
  ["page/expect-boolean.spec.ts", "not.toBeOK"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-boolean.spec.ts", "toBeOK fail with promise"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-boolean.spec.ts", "toBeOK should print response with text content type when fails", "image content type"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-boolean.spec.ts", "toBeOK should print response with text content type when fails", "no content type"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-boolean.spec.ts", "toBeOK should print response with text content type when fails", "text content type"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-boolean.spec.ts", "toBeOK"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/expect-matcher-result.spec.ts", "toHaveScreenshot should populate matcherResult"], // Error: TypeError: Cannot read properties of undefined (reading 'message')
  ["page/expect-misc.spec.ts", "toBeInViewport", "should have good stack"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/frame-evaluate.spec.ts", "should dispose context on cross-origin navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/frame-evaluate.spec.ts", "should execute after cross-site navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/frame-evaluate.spec.ts", "should not allow cross-frame element handles when frames do not script each other"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/frame-evaluate.spec.ts", "should work in iframes that failed initial navigation"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/frame-goto.spec.ts", "should continue after client redirect"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/frame-hierarchy.spec.ts", "should handle nested frames @smoke"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/frame-hierarchy.spec.ts", "should persist mainFrame on cross-process navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/frame-hierarchy.spec.ts", "should refuse to display x-frame-options:deny iframe"], // Error: Test timeout of 5000ms exceeded.
  ["page/locator-misc-1.spec.ts", "hover should support noWaitAfter"], // Error: Test timeout of 5000ms exceeded.
  ["page/locator-misc-1.spec.ts", "should focus and blur a button"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/locator-misc-2.spec.ts", "should scroll into view"], // Error: Test timeout of 5000ms exceeded.
  ["page/locator-misc-2.spec.ts", "should take screenshot"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/locator-misc-2.spec.ts-snapshots/screenshot-element-bounding-box-workers.png, writing actual.
  ["page/network-post-data.spec.ts", "should get post data for file/blob"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/network-post-data.spec.ts", "should get post data for navigator.sendBeacon api calls"], // Error: Error: expect(received).toStrictEqual(expected) // deep equality
  ["page/page-add-init-script.spec.ts", "should work after a cross origin navigation"], // Error: Error: page.goto: url: expected string, got undefined
  ["page/page-add-init-script.spec.ts", "should work with CSP"], // Error: TypeError: server.setCSP is not a function
  ["page/page-add-locator-handler.spec.ts", "should throw when handler times out"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-add-locator-handler.spec.ts", "should work with toHaveScreenshot"], // Error: TypeError: zones.preserve is not a function
  ["page/page-add-locator-handler.spec.ts", "should work"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-autowaiting-basic.spec.ts", "should await cross-process navigation when clicking anchor"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-autowaiting-basic.spec.ts", "should await form-get on click"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-autowaiting-basic.spec.ts", "should await form-post on click"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-autowaiting-basic.spec.ts", "should await navigation when clicking anchor"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-autowaiting-basic.spec.ts", "should work with waitForLoadState(load)"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-autowaiting-no-hang.spec.ts", "assigning location to about:blank"], // Error: Error: page.evaluate: Execution context was destroyed, most likely because of a navigation.
  ["page/page-basic.spec.ts", "async stacks should work"], // Error: Error: expect(received).not.toBe(expected) // Object.is equality
  ["page/page-basic.spec.ts", "has navigator.webdriver set to true"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-basic.spec.ts", "should have sane user agent"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-click-scroll.spec.ts", "should scroll into view element in iframe"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click-timeout-2.spec.ts", "should timeout waiting for display:none to be gone"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click-timeout-2.spec.ts", "should timeout waiting for visibility:hidden to be gone"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click-timeout-3.spec.ts", "should report wrong hit target subtree"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click-timeout-3.spec.ts", "should timeout waiting for hit target"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click.spec.ts", "should click a button that is overlayed by a permission popup"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click.spec.ts", "should click offscreen buttons"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-click.spec.ts", "should click the button after a cross origin navigation "], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-click.spec.ts", "should scroll and click the button with smooth scroll behavior"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-dispatchevent.spec.ts", "should dispatch click after a cross origin navigation "], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-drag.spec.ts", "Drag and drop", "should be able to drag the mouse in a frame"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-drag.spec.ts", "Drag and drop", "should respect the drop effect"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-evaluate-handle.spec.ts", "should accept object handle as an argument"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-evaluate.spec.ts", "should work with function shorthands"], // Error: Error: page.evaluate: SyntaxError: Unexpected token '{'
  ["page/page-evaluate.spec.ts", "should work right after a cross-origin navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-evaluate.spec.ts", "should work from-inside an exposed function"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-evaluate.spec.ts", "should await promise from popup"], // Error: Tearing down "context" exceeded the test timeout of 10000ms.
  ["page/page-evaluate.spec.ts", "should work with new Function() and CSP"], // Error: TypeError: server.setCSP is not a function
  ["page/page-evaluate.spec.ts", "should work with CSP"], // Error: TypeError: server.setCSP is not a function
  ["page/page-evaluate.spec.ts", "should work with overridden Object.defineProperty"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/test
  ["page/page-evaluate.spec.ts", "should work with busted Array.prototype.map/push"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/test  ["page/page-event-console.spec.ts", "should work for different console API calls"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-event-load.spec.ts", "should fire once with iframe navigation"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/home
  ["page/page-event-network.spec.ts", "Page.Events.RequestFailed @smoke"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-event-network.spec.ts", "should support redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-event-network.spec.ts","interrupt request.response() and request.allHeaders() on page.close"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-event-popup.spec.ts", "should not treat navigations as new popups"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-event-popup.spec.ts","should be able to capture alert"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should emit for immediately closed popups 2"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-event-popup.spec.ts","should report popup opened from iframes"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with clicking target=_blank and rel=noopener"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with clicking target=_blank"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with empty url"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with fake-clicking target=_blank and rel=noopener"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with noopener and about:blank"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with noopener and no url"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-popup.spec.ts","should work with noopener and url"], // Error: Error: browser.newContext: Target page, context or browser has been closed
  ["page/page-event-request.spec.ts", "should return response body when Cross-Origin-Opener-Policy is set"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-expose-function.spec.ts", "exposeBinding should work @smoke"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "exposeBinding(handle) should work with element handles"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-expose-function.spec.ts", "exposeBindingHandle should not throw during navigation"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "exposeBindingHandle should throw for multiple arguments"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "exposeBindingHandle should work"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should alias Window, Document and Node"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should await returned promise"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should be callable from-inside addInitScript"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-expose-function.spec.ts", "should not result in unhandled rejection"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-expose-function.spec.ts", "should serialize cycles"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should support throwing \"null\""], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-expose-function.spec.ts", "should survive navigation"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should throw exception in page context"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-expose-function.spec.ts", "should work after cross origin navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-expose-function.spec.ts", "should work on frames before navigation"], // Error: Error: frame.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should work on frames"], // Error: Error: frame.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should work with busted Array.prototype.map/push"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/test
  ["page/page-expose-function.spec.ts", "should work with complex objects"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should work with handles and complex objects"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should work with overridden console object"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-expose-function.spec.ts", "should work with setContent"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-expose-function.spec.ts", "should work"], // Error: Error: page.evaluate: Error: Invalid arguments: should be exactly one string.
  ["page/page-fill.spec.ts","should fill contenteditable"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-focus.spec.ts", "should emit blur event"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-focus.spec.ts", "should emit focus event"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-focus.spec.ts", "should traverse focus"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-goto.spec.ts", "js redirect overrides url bar navigation "], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/a
  ["page/page-goto.spec.ts", "should capture cross-process iframe navigation request"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-goto.spec.ts", "should fail when main resources failed to load"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-goto.spec.ts", "should fail when replaced by another navigation"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-goto.spec.ts", "should fail when server returns 204"], // Error: Error: expect(received).not.toBe(expected) // Object.is equality
  ["page/page-goto.spec.ts", "should not crash when RTCPeerConnection is used"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/rtc.html
  ["page/page-goto.spec.ts", "should properly wait for load"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-goto.spec.ts", "should report raw buffer for main resource"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-goto.spec.ts", "should return from goto if new navigation is started"], // Error: Error: expect(received).toBeFalsy()
  ["page/page-goto.spec.ts", "should return last response in redirect chain"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-goto.spec.ts", "should return when navigation is committed if commit is specified"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-goto.spec.ts", "should succeed on url bar navigation when there is pending navigation"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/a
  ["page/page-goto.spec.ts", "should use http for no protocol"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-goto.spec.ts", "should wait for load when iframe attaches and detaches"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-goto.spec.ts", "should work cross-process"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-goto.spec.ts", "should work when navigating to 404"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/not-found
  ["page/page-goto.spec.ts", "should work with Cross-Origin-Opener-Policy after redirect"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-goto.spec.ts", "should work with cross-process that fails before committing"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-goto.spec.ts", "should work with redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-history.spec.ts", "goBack/goForward should work with bfcache-able pages"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-history.spec.ts", "page.goBack during renderer-initiated navigation"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-history.spec.ts", "page.goBack should work @smoke"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-history.spec.ts", "page.goForward during renderer-initiated navigation"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-history.spec.ts", "page.reload should work with cross-origin redirect"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-history.spec.ts", "page.reload should work with same origin redirect"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-history.spec.ts", "regression test for issue 20791"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/main.html
  ["page/page-history.spec.ts", "should reload proper page"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/main.html
  ["page/page-keyboard.spec.ts", "should have correct Keydown/Keyup order when pressing Escape key"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should press plus"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should press shift plus"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should report multiple modifiers"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should report shiftKey"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should send proper codes while typing with shift"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should send proper codes while typing"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should shift raw codes"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should support multiple plus-separated modifiers"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should support plus-separated modifiers"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should support simple copy-pasting"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should support simple cut-pasting"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-keyboard.spec.ts", "should work after a cross origin navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-keyboard.spec.ts", "should work with keyboard events with empty.html"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-mouse.spec.ts", "hover should support noWaitAfter"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-mouse.spec.ts", "should select the text with mouse"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-navigation.spec.ts", "should work with _blank target"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-navigation.spec.ts", "should work with cross-process _blank target"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-network-request.spec.ts", "page.reload return 304 status code"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/test.html
  ["page/page-network-request.spec.ts", "should get the same headers as the server CORS"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-request.spec.ts", "should get the same headers as the server"], // Error: TypeError: Cannot read properties of undefined (reading 'headers')
  ["page/page-network-request.spec.ts", "should not get preflight CORS requests when intercepting"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-request.spec.ts", "should not return allHeaders() until they are available"], // Error: TypeError: Cannot read properties of undefined (reading 'headers')
  ["page/page-network-request.spec.ts", "should not work for a redirect and interception"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-network-request.spec.ts", "should override post data content type"], // Error: Error: expect(received).toBeTruthy()
  ["page/page-network-request.spec.ts", "should report raw headers"], // Error: TypeError: Cannot read properties of undefined (reading 'sort')
  ["page/page-network-request.spec.ts", "should report raw response headers in redirects"], // Error: TypeError: server.setExtraHeaders is not a function
  ["page/page-network-request.spec.ts", "should return event source"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-network-request.spec.ts", "should return headers"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-network-request.spec.ts", "should return navigation bit"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-network-request.spec.ts", "should work for a redirect"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-network-response.spec.ts", "should behave the same way for headers and allHeaders"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-network-response.spec.ts", "should bypass disk cache when context interception is enabled"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-response.spec.ts", "should bypass disk cache when page interception is enabled"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-response.spec.ts", "should reject response.finished if context closes"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-network-response.spec.ts", "should report all headers"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-network-response.spec.ts", "should report multiple set-cookie headers"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-network-response.spec.ts", "should return multiple header value"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/headers
  ["page/page-network-response.spec.ts", "should return set-cookie header after route.fulfill"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-response.spec.ts", "should return status text"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/cool
  ["page/page-network-response.spec.ts", "should return uncompressed text"], // Error: TypeError: server.enableGzip is not a function
  ["page/page-network-response.spec.ts", "should throw when requesting body of redirected response"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-network-response.spec.ts", "should work @smoke"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-sizes.spec.ts", "should handle redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-network-sizes.spec.ts", "should set bodySize to 0 when there was no response body"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-sizes.spec.ts", "should throw for failed requests"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-network-sizes.spec.ts", "should work with 200 status code"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-sizes.spec.ts", "should work with 401 status code"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-sizes.spec.ts", "should work with 404 status code"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-network-sizes.spec.ts", "should work with 500 status code"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-request-continue.spec.ts", "continue should delete headers on redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-request-continue.spec.ts", "continue should propagate headers to redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-request-continue.spec.ts", "should intercept css variable with background url"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/test.html
  ["page/page-request-continue.spec.ts", "should work with Cross-Origin-Opener-Policy"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-request-fulfill.spec.ts", "headerValue should return set-cookie from intercepted response"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-request-fulfill.spec.ts", "should allow mocking svg with charset"], // Error: Error: A snapshot doesn't exist at /playwright.config.ts/page/page-request-fulfill.spec.ts-snapshots/mock-svg-workers.png, writing actual.
  ["page/page-request-fulfill.spec.ts", "should fetch original request and fulfill"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-fulfill.spec.ts", "should fulfill with fetch response that has multiple set-cookie"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-fulfill.spec.ts", "should fulfill with fetch result and overrides"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-fulfill.spec.ts", "should fulfill with fetch result"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-fulfill.spec.ts", "should fulfill with global fetch result"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-fulfill.spec.ts", "should fulfill with gzip and readback"], // Error: TypeError: server.enableGzip is not a function
  ["page/page-request-fulfill.spec.ts", "should include the origin header"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-request-fulfill.spec.ts", "should not modify the headers sent to the server"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-request-intercept.spec.ts", "should fulfill intercepted response using alias"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should fulfill intercepted response"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should fulfill popup main request using alias"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should fulfill response with empty body"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should fulfill with any response"], // Error: Error: requestContext.get: [unenv] https.request is not implemented yet!
  ["page/page-request-intercept.spec.ts", "should give access to the intercepted response body"], // Error: Error: requestContext.fetch: [unenv] https.request is not implemented yet!
  ["page/page-request-intercept.spec.ts", "should give access to the intercepted response"], // Error: Error: requestContext.fetch: [unenv] https.request is not implemented yet!
  ["page/page-request-intercept.spec.ts", "should intercept with post data override"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should intercept with url override"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should not follow redirects when maxRedirects is set to 0 in route.fetch"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-request-intercept.spec.ts", "should override with defaults when intercepted response not provided"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-request-intercept.spec.ts", "should support fulfill after intercept"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-route.spec.ts", "should allow null origin for about:blank"], // Error: Error: page.evaluate: TypeError: Failed to execute 'fetch' on 'Window': Failed to parse URL from undefined/something
  ["page/page-route.spec.ts", "should fulfill with redirect status"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-route.spec.ts", "should intercept @smoke"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-route.spec.ts", "should intercept main resource during cross-process navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-route.spec.ts", "should not auto-intercept non-preflight OPTIONS"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-route.spec.ts", "should not work with redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-route.spec.ts", "should respect cors overrides"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-route.spec.ts", "should support ? in glob pattern"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/index
  ["page/page-route.spec.ts", "should work when header manipulation headers with redirect"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-route.spec.ts", "should work when POST is redirected with 302"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-route.spec.ts", "should work with badly encoded server"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/malformed?rnd=%911
  ["page/page-route.spec.ts", "should work with encoded server"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/some%20nonexisting%20page
  ["page/page-route.spec.ts", "should work with equal requests"], // Error: Error: expect(received).toEqual(expected) // deep equality
  ["page/page-route.spec.ts", "should work with redirect inside sync XHR"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-route.spec.ts", "should work with redirects for subresources"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-set-extra-http-headers.spec.ts", "should not duplicate referer header"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-set-extra-http-headers.spec.ts", "should work with redirects"], // Error: TypeError: server.setRedirect is not a function
  ["page/page-wait-for-function.spec.ts", "should survive cross-process navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-wait-for-function.spec.ts", "should work with strict CSP policy"], // Error: TypeError: server.setCSP is not a function
  ["page/page-wait-for-load-state.spec.ts", "should respect timeout"], // Error: ReferenceError: __filename is not defined
  ["page/page-wait-for-navigation.spec.ts", "should respect timeout"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-wait-for-navigation.spec.ts", "should work for cross-process navigations"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-wait-for-navigation.spec.ts", "should work with commit"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/page-wait-for-navigation.spec.ts", "should work with url match"], // Error: Error: page.goto: net::ERR_HTTP_RESPONSE_CODE_FAILURE at https://test-workers.rui-figueira.workers.dev/frame.html
  ["page/page-wait-for-request.spec.ts", "should respect timeout"], // Error: ReferenceError: __filename is not defined
  ["page/page-wait-for-request.spec.ts", "should work with url match regular expression from a different context"], // Error: Error: [unenv] vm.runInContext is not implemented yet!
  ["page/page-wait-for-response.spec.ts", "should respect default timeout"], // Error: ReferenceError: __filename is not defined
  ["page/page-wait-for-response.spec.ts", "should work with re-rendered cached IMG elements"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-wait-for-selector-1.spec.ts", "should report logs while waiting for hidden"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-wait-for-selector-1.spec.ts", "should report logs while waiting for visible"], // Error: Test timeout of 5000ms exceeded.
  ["page/page-wait-for-selector-2.spec.ts", "should have correct stack trace for timeout"], // Error: Error: expect(received).toContain(expected) // indexOf
  ["page/page-wait-for-selector-2.spec.ts", "should survive cross-process navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/page-wait-for-url.spec.ts", "should work with commit"], // Error: Error: expect(received).toBe(expected) // Object.is equality
  ["page/selectors-get-by.spec.ts", "getByTestId should escape id"], // Error: Test timeout of 5000ms exceeded.
  ["page/selectors-get-by.spec.ts", "getByTestId should work for regex"], // Error: Test timeout of 5000ms exceeded.
  ["page/selectors-text.spec.ts","should work @smoke"], // Error: Test timeout of 5000ms exceeded.
  ["page/selectors-text.spec.ts","should work with large DOM"], // Error: Test timeout of 5000ms exceeded.
  ["page/workers.spec.ts", "should clear upon cross-process navigation"], // Error: Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  ["page/workers.spec.ts", "should emit created and destroyed events"], // Error: Error: expect(received).toContain(expected) // indexOf
];
