using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/moderator'
service ModeratorService {

  entity Sessions as projection on cap.Sessions;
  entity SessionAssignments as projection on cap.Assignments;

}
