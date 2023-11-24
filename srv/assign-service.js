const cds = require('@sap/cds')

class AssignService extends cds.ApplicationService { init(){

  const { SessionAssignments } = require('#cds-models/AssignService')
  const { Assignments, Sessions } = require('#cds-models/sap/cap/assignments')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', SessionAssignments, autoFillName)

  // fill in unique token
  this.after ('CREATE', SessionAssignments, async ({ name, session_ID }, req) => {
    const { maxNumber } = await SELECT.one('max(token) as maxNumber').from(Assignments).byKey({ session_ID })
    const token = maxNumber + 1
    await UPDATE(Assignments).byKey({ name, session_ID }).with({ token })
    return req.reply({ name, session_ID, token })
  })

  this.on ('credentials', SessionAssignments, async req => {
    const { name, session_ID } = req.params[0]
    const assignment = await SELECT.one.from(Assignments).byKey({ name, session_ID })
    if (!assignment)  return req.reject(404, `No such assignment '${name}' in session ${session_ID}`)
    const { token } = assignment

    const session = await SELECT.one.from(Sessions).byKey({ID: session_ID})
    if (!session)  return req.reject(404, `No session data for ${session_ID}`)
    if (!session.userPattern)  return req.reject(404, `No userPattern in session ${session_ID}`)
    if (!session.passwordPattern)  return req.reject(404, `No passwordPattern in session ${session_ID}`)
    // let [from,to] = session.numberRange.split('-')
    // from = parseInt(from)
    // to = parseInt(to)
    return {
      token,
      user: session.userPattern.replace('<token>', token),
      password: session.passwordPattern.replace('<token>', token)
    }
  })

  return super.init()
}}

function autoFillName(res) {
  if (!res.data.name) {
    res.data.name = 'name-' + cds.utils.uuid().split('-')[0]
  }
}

module.exports = { AssignService }
