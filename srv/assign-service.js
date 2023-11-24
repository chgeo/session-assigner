const cds = require('@sap/cds')

class AssignService extends cds.ApplicationService { init(){

  const { SessionAssignments } = require('#cds-models/AssignService')
  const { Assignments, Sessions } = require('#cds-models/sap/cap/assignments')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', SessionAssignments, async res => {
    if (!res.data.name) {
      res.data.name = cds.utils.uuid()
    }
  })

  // fill in unique token
  this.after ('CREATE', SessionAssignments, async result => {
    const { maxNumber } = await SELECT.one('max(numberToken) as maxNumber').from(Assignments)
    const newToken = maxNumber + 1
    const res = await UPDATE(Assignments, { name: result.name, session_ID: result.session_ID })
      .with({numberToken: newToken})
    // console.log(newToken, res)
  })

  this.on ('token', SessionAssignments, async req => {
    const { name } = req.params[0]
    const assignment = await SELECT.from(Assignments, { name })
    if (!assignment)  return req.reject(404, 'No such assignment for ' + name)

    console.log('>> token for', name, assignment)

    const session = await SELECT.from(Sessions, {ID: assignment.session_ID})

    let [from,to] = session.numberRange.split('-')
    from = parseInt(from)
    to = parseInt(to)
    const token = randomInt(from, to)
    return {
      token,
      credentials: {
        user: session.userPattern.replace('<token>', token),
        password: session.passwordPattern.replace('<token>', token)
      }
    }
  })

  return super.init()
}}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { AssignService }
