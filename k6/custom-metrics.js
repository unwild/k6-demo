
import http from "k6/http";
import { sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend } from 'k6/metrics';

const connectionTimeTrend = new Trend('connection_time'); // Create a custom metric with Trend object and name used to display results

export const options = {
  stages: [
    { duration: '1m30s', target: 150 },
    { duration: '10s', target: 0 }
  ],
};

export default function () {
    const response = http.post('http://localhost:7777/fast', randomString(6));

    connectionTimeTrend.add(response.timings.connecting); // "timings":{"duration":0,"blocked":0,"looking_up":0,"connecting":0,"tls_handshaking":0,"sending":0,"waiting":0,"receiving":0}

    sleep(10)
}

