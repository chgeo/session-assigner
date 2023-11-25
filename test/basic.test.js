const cds = require('@sap/cds/lib')

describe('Basic flows', () => {

  const { GET, POST, expect } = cds.test (__dirname+'/..')

  test('create session, assignment, token', async () => {
    const { data: session } = await POST(`/api/admin/Sessions`, {
      ID: 'session1',
      rangeFrom: 2,
      rangeTo: 3
    })
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
