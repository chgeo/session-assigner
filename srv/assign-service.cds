using { sap.cap.assignments as db } from '../db/schema';

@protocol: 'rest'
service AssignService {

  entity Assignments as projection on db.Assignments actions {
    action token() returns db.Token
  }

}