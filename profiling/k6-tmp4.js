import http from 'k6/http';
import { sleep } from 'k6';
import encoding from 'k6/encoding';

export const options = {
  scenarios: {
      shufflenet_test: {
      executor: 'ramping-arrival-rate',
      startRate: 20,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 80,
      stages: [
        { target: 30, duration: '1m' },
        { target: 50, duration: '3m' },
        { target: 30, duration: '1m' },
      ],
      gracefulStop: '1s', // do not wait for iterations to finish in the end
      tags: { test_type: 'shufflenet' }, // extra tags for the metrics generated by this scenario
      exec: 'shufflenet', // the function this scenario will execute
    },
    squeezenet_test: {
      executor: 'ramping-arrival-rate',
      startRate: 20,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 80,
      stages: [
        { target: 30, duration: '1m' },
        { target: 50, duration: '3m' },
        { target: 30, duration: '1m' },
      ],
      tags: { test_type: 'squeezenet' }, // different extra metric tags for this scenario
      exec: 'squeezenet', // this scenario is executing different code than the one above!
    },
    mobilenet_test: {
      executor: 'ramping-arrival-rate',
      startRate: 20,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 80,
      stages: [
        { target: 30, duration: '1m' },
        { target: 50, duration: '3m' },
        { target: 30, duration: '1m' },
      ],
      tags: { test_type: 'mobilenet' }, // different extra metric tags for this scenario
      exec: 'mobilenet', // same function as the scenario above, but with different env vars
   }, 
    bert_test: {
      executor: 'ramping-arrival-rate',
      startRate: 20,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 80,
      stages: [
        { target: 30, duration: '1m' },
        { target: 50, duration: '3m' },
        { target: 30, duration: '1m' },
      ],
      tags: { test_type: 'bert' }, // different extra metric tags for this scenario
      //env: { MY_CROC_ID: '1' }, // and we can specify extra environment variables as well!
      exec: 'bert', // this scenario is executing different code than the one above!
    },
    paddle_test: {
      executor: 'ramping-arrival-rate',
      startRate: 300,
      timeUnit: '1m',
      preAllocatedVUs: 2,
      maxVUs: 50,
      stages: [
        { target: 200, duration: '1m' },
        { target: 400, duration: '3m' },
        { target: 60, duration: '1m' },
      ],
      tags: { test_type: 'paddle' }, // different extra metric tags for this scenario
      exec: 'paddle', // this scenario is executing different code than the one above!
    },
  },
  discardResponseBodies: true,
  thresholds: {
    'http_req_duration{test_type:bert}': ['p(95)<250', 'p(99)<350'],
    'http_req_duration{test_type:shufflenet}': ['p(99)<500'],
    'http_req_duration{test_type:mobilenet}': ['p(95)<300'],
    'http_req_duration{test_type:squeezenet}': ['p(95)<300'],
    'http_req_duration{scenario:paddle_tes}': ['p(95)<900'],
  },
};

let shufflenet_model = {
        method: 'GET',
        url: 'http://10.106.46.112:8080/function/shufflenet/',
};
let squeezenet_model = {
        method: 'GET',
        url: 'http://10.106.46.112:8080/function/squeezenet',
};
let mobilenet_model = {
        method: 'GET',
        url: 'http://10.106.46.112:8080/function/mobilenet',
};
let bertsquad_model  = {
        method: 'GET',
        url: 'http://10.106.46.112:8080/function/bert-squad/?question=What%20food%20does%20Harry%20like?&&context=My%20name%20is%20Harry%20and%20I%20grew%20up%20in%20Canada.%20I%20love%20bananas.',
};
let bertsquad_mount_model  = {
        method: 'GET',
        url: 'http://10.106.46.112:8080/function/bert-squad-mounted/?question=What%20food%20does%20Harry%20like?&&context=My%20name%20is%20Harry%20and%20I%20grew%20up%20in%20Canada.%20I%20love%20bananas.',
};
const binFile = open('zh.wav', 'b');
const paddledata = {
  audio: encoding.b64encode(binFile),
  audio_format: "wav",
  sample_rate: 16000,
  lang: "zh_cn",
}
let paddle_model = {
        method: 'POST',
        url: 'http://10.106.46.112:8080/function/paddlespeech/paddlespeech/asr',
        body: JSON.stringify(paddledata),
        params: {
            headers: { 'Content-Type': 'application/json'},
        },
};


export function shufflenet() {
  http.get(shufflenet_model.url);
}

export function squeezenet() {
  http.get(squeezenet_model.url);
}

export function mobilenet() {
  http.get(mobilenet_model.url);
}

export function bert() {
  http.get(bertsquad_model.url);
}

export function paddle() {
  http.post(paddle_model.url, paddle_model.body, paddle_model.params)
}

