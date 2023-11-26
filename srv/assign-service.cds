using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/assign'
service AssignService {

  @Capabilities : { ReadRestrictions : {
    Readable:false,
    ReadByKeyRestrictions : { Readable },
  }}
  entity SessionAssignments as projection on cap.Assignments
    actions {
      function credentials() returns Creds
    }

  @readonly
  @Capabilities : { ReadRestrictions : {
    Readable:false,
    ReadByKeyRestrictions : { Readable },
  }}
  entity Sessions as projection on cap.Sessions;

  type Creds {
    token    : Integer;
    user     : String;
    password : String;
  }
}
