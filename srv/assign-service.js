const cds = require('@sap/cds')

class AssignService extends cds.ApplicationService { init(){

  const { SessionAssignments, SessionAssignment } = require('#cds-models/AssignService')
  const { Assignments, Sessions } = require('#cds-models/sap/cap')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', SessionAssignments, ({ data }) => {
    const assignments = Array.isArray(data) ? data : [data]
    for (const assignment of assignments) {
      if (!assignment.name) {
        assignment.name = 'name-' + cds.utils.uuid().split('-')[0]
      }
    }
  })


  // fill in unique token
  this.after ('CREATE', SessionAssignments, async (data, req) => {
    const assignments = Array.isArray(data) ? data : [data]
    for (const assignment of assignments) {
      const { name, session_ID} = assignment
      const session = await SELECT.one.from(Sessions).byKey({ID: session_ID})
      if (!session)  return req.reject(404, `No such session: ${session_ID}`)

      const tokens = await findFreeTokens(session)
      if (!tokens.length) {
        const slotCount = session.rangeTo - session.rangeFrom + 1
        return req.reject(400, `No more numbers: reached allowed limit of ${slotCount} slots in session ${session_ID}`)
      }

      // try all token candidates, to compensate collisions with parallel requests
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        try {
          await UPDATE(Assignments).byKey({ name, session_ID }).with({ token })
          return req.reply({ name, session_ID, token })
        } catch (err) {
          if (i+1 === tokens.length) {
            // give up, parallel requests have consumed all free tokens
            throw err
          }
        }
      }
    }
  })

  this.on ('credentials', SessionAssignment, credentials)

  this.after(['CREATE', 'UPDATE'], SessionAssignments, (data) => {
    // @ts-ignore
    cds.emit('assignment.changed', data)
  })

  /**
   * @param {import('#cds-models/AssignService').Session} session
   */
  async function findFreeTokens(session) {
    const { ID: session_ID, rangeFrom, rangeTo } = session

    // try to find an unused token somwhere within the range
    const tokensFree = []
    const tokens = (await SELECT.from(Assignments).columns(a => { a.token }).where({ session_ID }))
      .map(res => res.token)
    for (let i = rangeFrom; i <= rangeTo; i++) {
      if (!tokens.includes(i)) {
        tokensFree.push(i)
      }
    }
    return tokensFree
  }

  /**
   * @param {import('@sap/cds').Request} req
   * @returns {Promise<import('#cds-models/AssignService').Creds|Error>}
   */
  async function credentials (req) {
    /** @type { import('#cds-models/AssignService').SessionAssignment } */
    // @ts-ignore
    const boundAssignment = req.params[0]
    const { name, session_ID } = boundAssignment
    const assignment = await SELECT.one.from(Assignments).byKey({ name, session_ID })
    if (!assignment) return req.reject(404, `No such assignment '${name}' in session '${session_ID}'`)
    const { token } = assignment

    const session = await SELECT.one.from(Sessions).byKey({ ID: session_ID })
    if (!session) return req.reject(404, `No session data for '${session_ID}'`)
    return {
      token,
      user: session.userPattern.replace('<token>', '' + token),
      password: session.passwordPattern.replace('<token>', '' + token)
    }
  }

  return super.init()
}}

module.exports = { AssignService }
