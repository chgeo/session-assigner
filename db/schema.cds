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

entity Assignments {
  key name: String;
  session: Association to Sessions;
}

type Token {
  token: String;
  credentials: {
    user: String;
    password: String;
  }
}

