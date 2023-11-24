const cds = require('@sap/cds')

class AssignService extends cds.ApplicationService { init(){

  const { Assignments, Sessions } = cds.entities ('sap.cap.assignments')

  this.on ('token', 'Assignments', async req => {
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
      token: '' + token,
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
