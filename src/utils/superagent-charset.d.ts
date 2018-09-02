declare module 'superagent-charset' {
  import * as superagent from 'superagent';

  interface SuperAgentRequest extends superagent.SuperAgentRequest {
    charset: (encoding?: string) => this;
  }

  interface SuperAgentStatic extends superagent.SuperAgentStatic {
    (url: string): SuperAgentRequest;
    (method: string, url: string): SuperAgentRequest;
  }

  export default function(args: superagent.SuperAgentStatic): SuperAgentStatic;
}
