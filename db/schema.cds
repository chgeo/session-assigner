namespace sap.cap.assignments;

using { cuid } from '@sap/cds/common';

entity Sessions : cuid {
  name: String;
  descr: String;
  numberRange: String;
  userPattern: String;
  passwordPattern: String;
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
