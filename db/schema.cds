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
  token: [ session, numberToken ]
}
entity Assignments {
  key name: String;
  key session: Association to Sessions;
  numberToken: Integer;
}

type Token {
  token: Integer;
  credentials: {
    user: String;
    password: String;
  }
}
