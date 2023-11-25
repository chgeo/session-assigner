namespace sap.cap;

using { cuid } from '@sap/cds/common';

entity Sessions {
  key ID          : String;
  descr           : String;
  numberRange     : String @assert.format:'\d+\s*-\s*\d+' default '1-30';
  userPattern     : String @assert.format:'.*<token>.*' default 'user-<token>@email';
  passwordPattern : String @assert.format:'.*<token>.*' default 'Abc-<token>';
  assignments     : Composition of many Assignments
                      on assignments.session = $self;
}

@assert.unique:{ token:[
  session,
  token
] }
entity Assignments {
  key name    : String;
  key session : Association to Sessions;
  token       : Integer;
}

type Credentials {
  token    : Integer;
  user     : String;
  password : String;
}
