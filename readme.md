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