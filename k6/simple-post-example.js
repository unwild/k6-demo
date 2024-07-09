
import http from "k6/http";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// 10 virtual users totaling 10k posts
export const options = {
  vus: 10,
  iterations: 10000,
};

export default function () {
  const response = http.post(`http://localhost:7777/fast/${randomString(10)}`, ""); // Change to linear to see diff
}

