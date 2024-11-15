import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { getAddressFromIP } from '../workflows';
import assert from 'assert';

describe('getAddressFromIP', () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow with mocked Activities', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities: {
        getIP: async (): Promise<string> => '1.1.1.1',
        getLocationInfo: async (_ip: string): Promise<string> => "Planet Earth"
      },
    });

    const result = await worker.runUntil(
      client.workflow.execute(getAddressFromIP, {
        args: ['Temporal'],
        workflowId: 'test',
        taskQueue,
      })
    );
    assert.equal(result, "Hello, Temporal. Your IP is 1.1.1.1 and your location is Planet Earth");
  });
});
