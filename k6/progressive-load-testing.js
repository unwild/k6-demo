
import http from "k6/http";
import { sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// progressively ramp up users (50 every 30s)
// then ramp down to 0 in 10s
export const options = {
  stages: [
    { duration: '1m30s', target: 150 },
    { duration: '10s', target: 0 }
  ],
};

// each virtual user make one request every 10 seconds
export default function () {
    http.post('http://localhost:7777/fast', randomString(6)); // Change to linear to see diff
    sleep(10)
}

