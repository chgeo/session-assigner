const cds = require('@sap/cds')

class ModeratorService extends cds.ApplicationService { init(){

  const { Sessions, SessionAssignments } = require('#cds-models/ModeratorService')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', Sessions, ({ data }) => {
    const sessions = Array.isArray(data) ? data : [data]
    for (const session of sessions) {
      if (!session.ID) {
        session.ID = 'session-' + cds.utils.uuid().split('-')[0]
      }
    }
  })

  this.before ('CREATE', Sessions, async res => {
    const sessions = Array.isArray(res.data) ? res.data : [res.data]
    for (const { rangeFrom, rangeTo } of sessions) {
      if (! (rangeFrom < rangeTo) ) {
        return res.reject(400, `Invalid number range: ${rangeFrom} must be lower than ${rangeTo}`)
      }
    }
  })

  this.after(['CREATE', 'UPDATE'], SessionAssignments, (data) => {
    // @ts-ignore
    cds.emit('assignment.changed', data)
  })

  return super.init()
}}

module.exports = { ModeratorService }
