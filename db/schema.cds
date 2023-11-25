namespace sap.cap;

using { cuid } from '@sap/cds/common';

entity Sessions {
  key ID          : String;
  descr           : String;
  rangeFrom       : Integer default '1';
  rangeTo         : Integer default '30';
  userPattern     : String @assert.format:'.*<token>.*' default 'user-<token>@email';
  passwordPattern : String @assert.format:'.*<token>.*' default 'Abc-<token>';
  assignments     : Composition of many Assignments
                      on assignments.session = $self;
}

@assert.unique: {
  token: [ session, token ]
}
entity Assignments {
  key name    : String;
  key session : Association to Sessions;
  token       : Integer;
}
