using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/moderator'
@requires: 'authenticated-user'
service ModeratorService {

  @(requires: ['moderator'])
  entity Sessions as projection on cap.Sessions;

  @(requires: ['moderator'])
  entity SessionAssignments as projection on cap.Assignments;

}
