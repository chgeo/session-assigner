import http from 'k6/http'
import encoding from 'k6/encoding'
import { sleep } from 'k6'
import { crypto } from "k6/experimental/webcrypto";

const baseURL = 'http://localhost:' + (__ENV.PORT || '4004')

const sessionByScenario = {
  full_session:       { rangeFrom: 501, rangeTo: 530 },
  overbooked_session: { rangeFrom: 601, rangeTo: 610 }
}

/** @type { import('k6/options').Options } */
export const options = {
  scenarios: {
    full_session: {
      executor: 'per-vu-iterations',
      vus: 30,
      iterations: 1,
      exec: full_session.name,
      tags: { scenario: 'full_session' }
    },
    overbooked_session: {
      executor: 'per-vu-iterations',
      vus: 15,
      iterations: 1,
      exec: overbooked_session.name,
      tags: { scenario: 'overbooked_session' }
    },
  },
  thresholds: {
    'http_req_failed{scenario:full_session}'      : ['rate<0.01'], // basic threshold, also to fail on general errors (network etc.)
    'http_req_failed{scenario:overbooked_session}': ['rate<34'],   // out of 15 users for 10 slots, 5 don't get one (33%)
  }
}

const credentials = `alice:`
const Authorization = `Basic ${encoding.b64encode(credentials)}`
const contentTypeJson = { 'Content-Type': 'application/json' }

export function setup() {
  for (const [scenario, session] of Object.entries(sessionByScenario)) {
    session.ID = `K6_${scenario}_${crypto.randomUUID()}`
    http.post(baseURL + '/api/moderator/Sessions',
      JSON.stringify(session),
      { headers: { Authorization, 'Content-Type': 'application/json' }
    })
  }
  return sessionByScenario // this gets passed to the functions below
}

export function full_session(sessionByScenario) {
  postAssignment(sessionByScenario.full_session.ID)
}

export function overbooked_session(sessionByScenario) {
  postAssignment(sessionByScenario.overbooked_session.ID)
}

function postAssignment(session_ID) {
  http.post(baseURL + '/api/assign/SessionAssignments',
    JSON.stringify({ session_ID }),
    { headers: contentTypeJson }
  )
  sleep(1)
}
