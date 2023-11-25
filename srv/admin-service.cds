using { sap.cap } from '../db/schema';

@protocol: 'rest'
@path: '/api/admin'
service AdminService {

  entity Sessions as projection on cap.Sessions;

}
