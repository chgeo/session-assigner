const cds = require('@sap/cds')

class AssignService extends cds.ApplicationService { init(){

  const { SessionAssignments } = require('#cds-models/AssignService')
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
  this.after ('CREATE', SessionAssignments, async ({ name, session_ID }, req) => {
    const session = await SELECT.one.from(Sessions).byKey({ID: session_ID})
    if (!session)  return req.reject(404, `No session data for ${session_ID}`)
    const { rangeFrom, rangeTo } = session

    const { max } = await SELECT.one('max(token) as max').from(Assignments).byKey({ session_ID })
    if (max >= rangeTo)  return req.reject(400, `No more numbers: reached allowed limit of ${rangeTo}`)

    const token = max ? max + 1 : rangeFrom
    await UPDATE(Assignments).byKey({ name, session_ID }).with({ token })
    return req.reply({ name, session_ID, token })
  })

  this.on ('credentials', SessionAssignments, async req => {
    const { name, session_ID } = req.params[0]
    const assignment = await SELECT.one.from(Assignments).byKey({ name, session_ID })
    if (!assignment)  return req.reject(404, `No such assignment '${name}' in session '${session_ID}'`)
    const { token } = assignment

    const session = await SELECT.one.from(Sessions).byKey({ID: session_ID})
    if (!session)  return req.reject(404, `No session data for '${session_ID}'`)
    return {
      token,
      user: session.userPattern.replace('<token>', token),
      password: session.passwordPattern.replace('<token>', token)
    }
  })

  return super.init()
}}

module.exports = { AssignService }
