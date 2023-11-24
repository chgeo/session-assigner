using { sap.cap.assignments as db } from '../db/schema';

@protocol: 'rest'
@path: '/api/admin'
service AdminService {

  entity Sessions as projection on db.Sessions;

}