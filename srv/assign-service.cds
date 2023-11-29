using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/assign'
service AssignService {

  entity SessionAssignments as projection on cap.Assignments
    actions {
      function credentials() returns Creds
    }

  @readonly
  entity Sessions as projection on cap.Sessions;

  type Creds {
    token    : Integer;
    user     : String;
    password : String;
  }

  // disable lists, only allow access by key
  @Capabilities : {
    ReadRestrictions : { Readable: false, ReadByKeyRestrictions : { Readable } }
  }
  aspect ByKeyOnly {}
  extend SessionAssignments with ByKeyOnly;
  extend Sessions with ByKeyOnly;

}
