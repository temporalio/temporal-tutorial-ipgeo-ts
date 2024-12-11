import { Connection, Client } from '@temporalio/client';
import { getAddressFromIP } from './workflows';
import { nanoid } from 'nanoid';
import { TASK_QUEUE_NAME } from './shared';
import process from 'process';

async function run() {

  if (process.argv.length <= 2) {
    console.error('Must specify a name as the command-line argument');
    process.exit(1);
  }

  const name = process.argv[2];
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({ connection });

  const handle = await client.workflow.start(getAddressFromIP, {
    taskQueue: TASK_QUEUE_NAME,
    args: [name],
    workflowId: 'getAddressFromIP-' + nanoid(),
  });
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
