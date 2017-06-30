const util = require('util');
const EventEmitter = require('events');

class Client extends EventEmitter {

  constructor () {
    super();
  }

  login () {
    return new Promise ( (resolve) => {
      //process.stdin.resume(); // old streams are paused by default
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (text) => {
        console.log(`Received data ${util.inspect(text)}`);
        
        if ( text.startsWith('msg ') ) {
          
          let msg = {
            id: '0000000000000',
            content: text.substr(4),
            cleanContent: text.substr(4),
            channel: { id: '1111111111111', type:'text'},
            author: { id: '2222222222222', bot: false, username: 'FakeUser', tag:'1234' },
            member: { id: '1111111111111',  nickname:'Member' },
            guild: { id: '3333333333333' },
            mentions: {
              channels: new Map(),
              everyone: false,
              members: new Map(),
              roles: new Map(),
              users: new Map()
            },
            attachments: new Map()
          };
          
          this.emit( 'message', msg );
        }
        
      });
      resolve();
    });
  }

  destroy() {
    return new Promise ( (resolve) => {
      Promise.resolve( process.stdin.pause() )
        .then( () => { return Promise.resolve( process.stdin.destroy() ); } )
        .then(resolve);
    });
  }

}

const FakeDiscord = {
  Client: Client
}

module.exports = FakeDiscord;