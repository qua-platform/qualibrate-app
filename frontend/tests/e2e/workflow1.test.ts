import { expect, test } from "@playwright/test";

// Test for Workflow 1
test("Workflow1 - Running a Calibration Node", async ({ page }, testInfo) => {
  const NodeElementRunningColor = "rgb(50, 51, 57) none repeat scroll 0% 0% / auto padding-box border-box";

  // 0. Prerequisite:
  // Be sure that the QUAlibrate application is running locally at http://127.0.0.1:8001/

  // 1. Navigate to the Application
  // Open http://127.0.0.1:8001/ in your web browser.
  await page.goto("http://localhost:8001/");
  expect(page.url()).toBe("http://localhost:8001/"); // page loaded successfully

  // 2. Verify Calibration Nodes
  // Check that at least one calibration node (e.g., test_cal) is displayed in the Node Library.
  await expect(page.getByTestId("nodes-and-job-wrapper")).toBeVisible({ timeout: 1000 }); // Node page loaded sucessfully
  await expect(page.getByTestId("nodes-page-wrapper")).toBeVisible(); // Node page loaded sucessfully
  // await expect(page.getByTestId('title-wrapper')).toBeVisible(); // title wrapper is visible
  // await expect(page.getByTestId('title-wrapper')).toContainText('Run calibration node'); // title is correct
  await expect(page.getByTestId("refresh-button")).toBeVisible(); // refresh button is visible
  await expect(page.getByTestId("menu-item-nodes")).toBeVisible(); // node library is showing as the landing page
  await expect(page.getByTestId("node-list-wrapper")).toBeVisible(); // node library list of nodes are visible
  await expect(page.getByTestId("node-element-test_cal")).toBeVisible(); // test_cal 'calibration node tab' is visible in the node library
  await expect(page.getByTestId("title-or-name-test_cal")).toBeVisible({ timeout: 1000 }); // test_cal label is visible in the node library
  // Check that the test_cal node has no visible parameters
  const testCalNode = page.getByTestId("node-element-test_cal");
  await expect(testCalNode.getByTestId("node-parameters-wrapper")).toBeHidden();
  await expect(testCalNode.getByTestId("parameter-values-resonator")).toBeHidden();
  await expect(testCalNode.getByTestId("parameter-values-sampling_points")).toBeHidden();
  await expect(testCalNode.getByTestId("parameter-values-noise_factor")).toBeHidden();

  // 3. Select a Calibration Node
  // Click the test_cal node.
  await page.getByTestId("node-element-test_cal").click();
  await page.waitForTimeout(1000);
  // Check that the 3 different labels exist
  await expect(testCalNode.getByTestId("node-parameters-wrapper")).toBeVisible({ timeout: 1000 });
  await expect(testCalNode.getByTestId("parameter-values-resonator")).toBeVisible();
  await expect(testCalNode.getByTestId("parameter-values-sampling_points")).toBeVisible();
  await expect(testCalNode.getByTestId("parameter-values-noise_factor")).toBeVisible();
  // Has corresponding default parameters
  const resonatorField = testCalNode.getByTestId("input-field-resonator");
  const samplingPointsField = testCalNode.getByTestId("input-field-sampling_points");
  const noiseFactorField = testCalNode.getByTestId("input-field-noise_factor");
  const waitTimeField = testCalNode.getByTestId("input-field-wait_time");
  await expect(resonatorField).toHaveValue("q1.resonator");
  await expect(samplingPointsField).toHaveValue("100");
  await expect(noiseFactorField).toHaveValue("0.1");
  // Their feilds are modifiable,
  await resonatorField.click();
  await samplingPointsField.click();
  await noiseFactorField.click();
  await waitTimeField.click();

  // 4. Change a node parameter value
  // Varify that it's possible to replace the default parameter values with new ones
  await resonatorField.click();
  await resonatorField.fill("q2.resonator");
  await samplingPointsField.click();
  await expect(page.getByTestId('node-element-test_cal').getByTestId('parameter-values-resonator').getByRole('img')).toBeVisible(); // the resonator parameter has a description icon
  await samplingPointsField.fill("1000");
  await noiseFactorField.click();
  await noiseFactorField.fill("0.2");
  await resonatorField.click();
  await waitTimeField.click();
  await waitTimeField.fill("5");
  await expect(resonatorField).toHaveValue("q2.resonator");
  await expect(samplingPointsField).toHaveValue("1000");
  await expect(noiseFactorField).toHaveValue("0.2");
  await expect(waitTimeField).toHaveValue("5");
  await page.getByTestId("node-element-test_cal").click();
  await expect(page.getByTestId("parameter-description-icon-resonator")).toBeTruthy();
  const screenshotPathStep4 = `screenshot-after-step4-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPathStep4 });
  await testInfo.attach('screenshot-after-step4', { path: screenshotPathStep4, contentType: 'image/png' });

  // 5. Run the Calibration Node
  // Click the Run button for test_cal.
  await page.getByTestId("run-button").click();

  if (await page.getByTestId("status-running").isVisible()) {
    console.log("Running status appeared");
    await expect(page.getByTestId("node-element-test_cal")).toHaveCSS("background", NodeElementRunningColor); // node background color changes to blue
    await expect(page.getByTestId("status-running-percentage")).toBeVisible(); // percentage appears
    await expect(page.getByTestId("status-running-percentage")).toContainText("0%"); // percentage stays at 0% because test_cal doesn't not implemented yet to change progress percentage 
    await expect(page.getByTestId("status-running-stop")).toBeVisible(); // stop button appears
  }
  // Verify finishing of the node:
  if (await page.getByTestId("status-finished").isVisible()) {
    console.log("Finished status appeared");
    await page.getByTestId("tooltip-trigger").hover(); // hover over the tooltip to show the tooltip content
    await expect(page.getByTestId('tooltip-status')).toBeVisible();
    await expect(page.getByTestId('tooltip-run-start')).toBeVisible();
    await expect(page.getByTestId('tooltip-run-duration')).toBeVisible();
    await expect(page.getByTestId('tooltip-idx')).toBeVisible();
    await expect(page.getByTestId("status-finished-percentage")).toBeHidden(); // percentage disappears
    await expect(page.getByTestId("status-running-stop")).toBeHidden(); // stop button disappears
    await expect(page.getByTestId("status-running")).toBeHidden(); // running status disappears
  }

  const screenshotPathStep5 = `screenshot-after-step5-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPathStep5 });
  await testInfo.attach('screenshot-after-step5', { path: screenshotPathStep5, contentType: 'image/png' });
  const screenshotPathFinished = `screenshot-after-finished-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPathFinished });
  await testInfo.attach('screenshot-after-step6', { path: screenshotPathFinished, contentType: 'image/png' });
  // parameters here match parameters in node parameter feilds
  await expect(page.getByTestId("parameters-wrapper")).toBeVisible({ timeout: 1000 });
  await expect(page.getByTestId("parameter-title")).toContainText("Parameters");
  await expect(page.getByTestId("parameters-list")).toBeVisible();
  await expect(page.getByTestId("parameter-item-resonator")).toBeVisible();
  await resonatorField.fill("q2.resonator");
  await expect(resonatorField).toHaveValue("q2.resonator");
  await expect(page.getByTestId("parameter-value-resonator")).toContainText("q2.resonator");
  await expect(page.getByTestId("parameter-item-sampling_points")).toBeVisible();
  await samplingPointsField.fill("1000");
  await expect(samplingPointsField).toHaveValue("1000");
  await expect(page.getByTestId("parameter-value-sampling_points")).toContainText("1000");
  await expect(page.getByTestId("parameter-item-noise_factor")).toBeVisible();
  await noiseFactorField.fill("0.2");
  await expect(noiseFactorField).toHaveValue("0.2");
  await expect(page.getByTestId("parameter-value-noise_factor")).toContainText("0.2");

  // 6. Check Results Section
  await expect(page.getByTestId("results-wrapper")).toBeVisible();

  // 7. Check/Update State Values
  // Verify the State Updates section displays suggested changes.
  await expect(page.getByTestId("states-column-wrapper")).toBeVisible();
  await expect(page.getByTestId("state-updates-top-wrapper")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("state-wrapper")).toBeVisible();
  await expect(page.getByTestId("state-title")).toBeVisible();
  await expect(page.getByTestId("update-all-button")).toBeVisible();
  await expect(page.getByTestId("state-update-wrapper-#/channels/ch1/intermediate_frequency")).toBeVisible();
  await expect(page.getByTestId("state-update-wrapper-#/channels/ch2/intermediate_frequency")).toBeVisible();
  const ch1 = page.getByTestId("state-update-value-wrapper-0");
  const ch2 = page.getByTestId("state-update-value-wrapper-1");
  await expect(ch1).toBeVisible({ timeout: 1000 });
  await expect(ch2).toBeVisible();
  // Update the state value for ch1 to 20000000
  await expect(ch1.getByTestId("value-container")).toContainText("100000000");
  await expect(ch1.getByTestId("value-input")).toHaveValue("50000000");
  ch1.getByTestId("value-input").click();
  ch1.getByTestId("value-input").fill("20000000");
  await expect(ch1.getByTestId("update-before-icon")).toBeVisible();
  await resonatorField.click(); // Clicking (anywhere) away from input feild to spawn undo button
  await expect(ch1.getByTestId("undo-icon-wrapper")).toBeVisible();
  await resonatorField.click(); // Clicking (anywhere) away from input feild to spawn undo button
  ch1.getByTestId("update-before-icon").click(); // Click the icon to update the state
  await expect(ch1.getByTestId("update-after-icon")).toBeVisible(); 
  // Update the state value for ch2 to [1,2,4,5]
  await expect(ch2.getByTestId("value-input")).toBeVisible({ timeout: 1000 });
  await expect(ch2.getByTestId("value-container")).toContainText("80000000");
  await expect(ch2.getByTestId("value-input")).toHaveValue("[1,2,4]");
  ch2.getByTestId("value-input").click();
  ch2.getByTestId("value-input").fill("[1,2,4,5]");
  await resonatorField.click(); // Clicking (anywhere) away from input feild to spawn undo button
  await expect(ch2.getByTestId("update-before-icon")).toBeVisible();
  await resonatorField.click(); // Clicking (anywhere) away from input feild to spawn undo button
  await expect(ch2.getByTestId("undo-icon-wrapper")).toBeVisible();

  ch2.getByTestId("update-before-icon").click(); // Click the icon to update the state
  await expect(ch2.getByTestId("update-after-icon")).toBeVisible();
});
