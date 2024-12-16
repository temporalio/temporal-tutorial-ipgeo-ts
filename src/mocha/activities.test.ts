// @@@SNIPSTART ts-ipgeo-activity-test-setup
import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
import sinon from 'sinon';
// @@@SNIPEND

// @@@SNIPSTART ts-ipgeo-activity-test-ip
describe('ip activity', async () => {
  it('successfully gets the ip', async () => {
    const fakeIP = '123.45.67.89';
    const stub = sinon.stub(global, 'fetch').resolves({
      text: () => Promise.resolve(`${fakeIP}\n`),
    } as Response);

    try {
      const env = new MockActivityEnvironment();
      const ip = await env.run(activities.getIP);
      assert.strictEqual(ip, fakeIP);
    } finally {
      stub.restore();
    }
  });
});
// @@@SNIPEND

// @@@SNIPSTART ts-ipgeo-activity-test-location
describe('getLocation activity', async () => {
  it('successfully gets the location', async () => {
    const ip = '123.45.67.89';
    const fakeLocation = {
      city: 'Sample City',
      regionName: 'Sample Region',
      country: 'Sample Country'
    };

    const stub = sinon.stub(global, 'fetch').resolves({
      json: () => Promise.resolve(fakeLocation),
    } as Response);

    try {
      const env = new MockActivityEnvironment();
      const location = await env.run(activities.getLocationInfo, ip);
      assert.strictEqual(location, `${fakeLocation.city}, ${fakeLocation.regionName}, ${fakeLocation.country}`);
    } finally {
      stub.restore();
    }
  });
});
// @@@SNIPEND
