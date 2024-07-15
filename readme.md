## Get k6

- `choco install k6`
- `apt-get install k6`
- `brew install k6`
- `docker pull grafana/k6`

## Run dummy api

If go is installed:  `go run .`
Else, there is a windows executable at /bin/dummy.exe (run from cmd).

## Demo

First, we'll run a very simple k6 scenario.
This script will simulate 10 virtual users (vus) running 10k request (in total) to the dummy api.

Run the command and wait for the result `k6 run k6/simple-post-example.js`


### Read the results

In the results, you will see many data about the scenario.
We will focus on the *http_req_duration*  and the *http_reqs* lines to get a broad view of the endpoint speed.

*http_req_duration* shows the average/min/max duration for one request. It also shows percentile data (p(9x)). 
This value represents the response time below which 9x% of requests fall. In other words, 9x% of your users experience response times equal to or faster than this value.

*http_reqs* line resume the number of requests done in the scenario, and calculates the number of request the endpoint is able to handle par second.


> You can check that the API posts count with a GET to http://localhost:7777/count
To reset the counter, send a DELETE to http://localhost:7777 or restart the API.


## Stages

Now we will look at stages. 
It's a way to spawn virtual users in, you guessed it, stages.

`  stages: [  
    { duration: '1m30s', target: 150 },  
    { duration: '10s', target: 0 }  
  ],`
  
This code will ramp up vus from 0 to 150 in 1m30, and then drop to 0 in 10s.

For this command, we will use the web dashboard.

Run the command : `k6 run --out 'web-dashboard' k6/progressive-load-testing.js`

> To get smoother results on dashboard, set K6_WEB_DASHBOARD_PERIOD env variable to 1s (default 10s)  
> To automatically open dashboard, set K6_WEB_DASHBOARD_OPEN to true  
> Powershell : `$env:K6_WEB_DASHBOARD_PERIOD="1s"; $env:K6_WEB_DASHBOARD_OPEN="true";`


## Lifecycle, request params and checks


In this example, we will use [a lifecyle function](https://k6.io/docs/using-k6/test-lifecycle/#overview-of-the-lifecycle-stages) to handle "authentication".
The setup is called once, and is used to set up data.

In this case, I'm using the setup to get a token from the API. That means that all the virtual users will share the same token.

I'm also using [checks](https://k6.io/docs/using-k6/checks/) to make assertions on the API response.

Run the command : `k6 run k6/lifecycle-params-and-check.js`

## Custom metrics

We will now take a really simple example for a custom metrics.

Run the command : `k6 run k6/custom-metrics.js`

In this exemple, you will find in the scenario file these lines : 

`const connectionTimeTrend = new Trend('connection_time');` this line is used to create a new custom metric
`connectionTimeTrend.add(response.timings.connecting);` this line is used to insert a data point to this metric

When the test is finished running, you will be able to see the custom metrics as the first line of the result table.
