using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/assign'
service AssignService {

  entity SessionAssignments as projection on cap.Assignments
    actions {
      function credentials() returns Creds
    }

  type Creds {
    token    : Integer;
    user     : String;
    password : String;
  }
}
