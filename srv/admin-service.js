const cds = require('@sap/cds')

class AdminService extends cds.ApplicationService { init(){

  const { Sessions } = require('#cds-models/AdminService')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', Sessions, autoFillID)

  this.before ('CREATE', Sessions, async res => {
    if (res.data.numberRange) {
      const { numberRange } = res.data
      let [from,to] = numberRange.split('-')
      from = parseInt(from)
      to = parseInt(to)
      if (! (from < to) ) {
        return res.reject(400, `Invalid number range ${numberRange}: ${from} must be lower than ${to}`)
      }
    }
  })


  return super.init()
}}

function autoFillID(res) {
  if (!res.data.ID) {
    res.data.ID = 'session-' + cds.utils.uuid().split('-')[0]
  }
}

module.exports = { AdminService }
