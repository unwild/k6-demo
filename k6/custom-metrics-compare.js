
import http from "k6/http";
import { sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend } from 'k6/metrics';

const fastEndpointTrend = new Trend('fast_endpoint');
const slowEndpointTrend = new Trend('slow_endpoint');

export const options = {
  stages: [
    { duration: '30s', target: 150 },
    { duration: '10s', target: 0 }
  ],
};

export default function () {
    const fresponse = http.post('http://localhost:7777/fast', randomString(6));
    fastEndpointTrend.add(fresponse.timings.duration);

    sleep(1)

    const sresponse = http.post('http://localhost:7777/linear', randomString(6));
    slowEndpointTrend.add(sresponse.timings.duration);

    sleep(1)
}

