namespace sap.cap.assignments;

using { cuid } from '@sap/cds/common';

entity Sessions {
  key ID: String;
  descr: String;
  numberRange: String default '1-30';
  userPattern: String default 'user-<token>@email';
  passwordPattern: String default 'Abc-<token>';
  assignments: Composition of many Assignments on assignments.session = $self;
}

@assert.unique: {
  token: [ session, token ]
}
entity Assignments {
  key name: String;
  key session: Association to Sessions;
  token: Integer;
}

type Credentials {
  token: Integer;
  user: String;
  password: String;
}
