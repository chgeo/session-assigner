const cds = require('@sap/cds')

describe('Basic flows', () => {

  const { GET, POST, expect } = cds.test (__dirname+'/..')

  test('create session, assignment, token', async () => {
    const { data: session } = await POST(`/api/moderator/Sessions`, {
      ID: 'session1',
      rangeFrom: 2,
      rangeTo: 3
    }, { auth: { username: 'alice', password: '' }})
    expect(session).to.containSubset({ ID: 'session1' })

    const { data: assignment } = await POST(`/api/assign/SessionAssignments`, {
      session_ID: session.ID,
      name: 'name1'
    })
    expect(assignment).to.containSubset({ name: 'name1', session_ID: session.ID, token: 2})

    const { data: creds } = await GET(`/api/assign/SessionAssignments(name='${assignment.name}',session_ID='${assignment.session_ID}')/credentials`)
    expect(creds).to.containSubset({ token: 2, user: 'user-2@email', password: 'Abc-2'})
  })

})

describe('negative', () => {

  const { GET, POST, expect } = cds.test (__dirname+'/..')

  it.each([
    [ 'get all sessions', GET, `/api/assign/Sessions`, 405],
    [ 'get all assignments', GET, `/api/assign/SessionAssignments`, 405],
    [ 'create a session', POST, `/api/assign/Sessions`, 405 ],

    [ 'get sessions w/o auth', GET, `/api/moderator/Sessions`, 401 ],
    [ 'get assignment w/o auth', GET, `/api/moderator/SessionAssignments`, 401 ],
  ]
  )('must not allow to %s', async (errorMessage, verb, url, expectedStatus) => {
    try {
      await verb(url)
      throw new Error(errorMessage)
    } catch (err) {
      expect(err.response.status).to.equal(expectedStatus)
    }
  })
})
