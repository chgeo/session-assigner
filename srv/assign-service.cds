using { sap.cap.assignments as db } from '../db/schema';

@protocol: 'rest'
@path: '/api/assign'
service AssignService {

  entity SessionAssignments as projection on db.Assignments
  actions {
    action credentials() returns db.Credentials
  }

}