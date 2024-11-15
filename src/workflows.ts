import * as workflow from '@temporalio/workflow';

// Only import the activity types
import type * as activities from './activities';


// Load Activities and assign the Retry Policy
const { getIP, getLocationInfo} = workflow.proxyActivities<typeof activities>({
  retry: {
    initialInterval: '1 second',
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
    // maximumAttempts: 5,
  },
  startToCloseTimeout: '1 minute',
});

// The Temporal Workflow.
// Just a TypeScript function.
export async function getAddressFromIP(name: string): Promise<string> {

  try {
    const ip = await getIP();
    try {
      const location = await getLocationInfo(ip);
      return `Hello, ${name}. Your IP is ${ip} and your location is ${location}`;
    } catch (e) {
      throw new workflow.ApplicationFailure("Failed to get location");
    }
  } catch (e) {
    throw new workflow.ApplicationFailure("Failed to get IP");
  }

}
