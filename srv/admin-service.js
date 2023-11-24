const cds = require('@sap/cds')

class AdminService extends cds.ApplicationService { init(){

  const { Sessions } = require('#cds-models/AdminService')

  // auto-fill name w/ a unique value, just to ease testing
  this.before ('CREATE', Sessions, autoFillID)


  return super.init()
}}

function autoFillID(res) {
  if (!res.data.ID) {
    res.data.ID = 'session-' + cds.utils.uuid().split('-')[0]
  }
}

module.exports = { AdminService }
