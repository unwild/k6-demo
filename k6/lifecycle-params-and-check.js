
import http from "k6/http";
import { sleep, check } from 'k6';

// progressively ramp up users (50 every 30s)
// then ramp down to 0 in 10s
export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '1s', target: 0 }
  ],
};


export function setup() {

  // just imagine that every user is the same 👀
  const tokenResponse = http.get('http://localhost:7777/token');
  return { token: tokenResponse.body };

}

// each virtual user make one request every 10 seconds
export default function (data) {

  const params = {
    headers: {
      'Authorization': data.token,
    },
  };

  const res = http.get('http://localhost:7777/bank/info', params);
  
  // assert that response status code is not 401
  check(res, {
    'is authenticated' : (r) => r.status != 401,
    'is not empty': (r) => r.body.length > 0
  });

  sleep(10)
}

