import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
import sinon from 'sinon';

describe('ip activity', async () => {
  it('successfully gets the ip', async () => {
    const env = new MockActivityEnvironment();
    const fakeIP = '123.45.67.89';
    const stub = sinon.stub(global, 'fetch').resolves({
      json: () => Promise.resolve(`${fakeIP}\n`),
    } as Response);
    const ip = await env.run(activities.getIP);
    assert.strictEqual(ip, fakeIP);
    stub.restore();
  });
});

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
    const env = new MockActivityEnvironment();
    const location = await env.run(activities.getLocationInfo, ip);
    assert(stub.calledWith(`http://ip-api.com/json/${ip}`));
    assert.strictEqual(location, `${fakeLocation.city}, ${fakeLocation.regionName}, ${fakeLocation.country}`);
    stub.restore();
  });
});
