import express, { Request, Response } from 'express';
import path from 'path';

import { Connection, Client } from '@temporalio/client';
import { getAddressFromIP  } from '../src/workflows';
import {TASK_QUEUE_NAME} from '../src/shared'
import { nanoid } from 'nanoid';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML files from the 'server/views' folder
app.use(express.static(path.join(__dirname, 'views')));

let temporalClient: Client;

// Temporal Client Initialization
async function initializeTemporal() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  temporalClient = new Client({ connection });
}

// Start the Temporal Workflow
async function startWorkflow(name: string): Promise<string> {
  const result = await temporalClient.workflow.execute(getAddressFromIP, {
    taskQueue: TASK_QUEUE_NAME,
    args: [name],
    workflowId: 'workflow-' + nanoid(),
  });
  return result;
}

// Route to handle HTMX form submission
app.post('/submit', async (req: Request, res: Response) => {
  try {
    const result = await startWorkflow(req.body.name);
    res.send(`<p>${result}</p>`);
  } catch (e) {
    res.send('<p>An error occurred</p>');
  }
});

// Route to handle cURL request
app.post('/api', async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const result = await startWorkflow(req.body.name);
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: 'An error occurred.' + e});
  }
});

// Start the server
async function run() {
  const port = 3000;
  await initializeTemporal();
  app.listen(port, () => console.log('Server running on port ' + port));
}

run().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
