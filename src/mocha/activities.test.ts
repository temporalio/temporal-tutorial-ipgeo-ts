import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
const axios = require('axios');
const sinon = require('sinon');

describe('ip activity', async () => {
  it('successfully gets the ip', async () => {
    const env = new MockActivityEnvironment();
    const fakeIP = '123.45.67.89';
    const stub = sinon.stub(axios, 'get').resolves({ data: `${fakeIP}\n` });
    const ip = await env.run(activities.getIP);
    assert.strictEqual(ip, fakeIP);
    stub.restore();
  });

  it('successfully gets the location', async () => {
    const ip = '123.45.67.89';
    const fakeLocation = {
      city: 'Sample City',
      regionName: 'Sample Region',
      country: 'Sample Country'
    };

    const stub = sinon.stub(axios, 'get').resolves({ data: fakeLocation });
    const env = new MockActivityEnvironment();
    const location = await env.run(activities.getLocationInfo, ip);
    assert(stub.calledWith(`http://ip-api.com/json/${ip}`));
    assert.strictEqual(location, `${fakeLocation.city}, ${fakeLocation.regionName}, ${fakeLocation.country}`);
    stub.restore();
  });

});
