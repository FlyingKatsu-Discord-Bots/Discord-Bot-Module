const util = require('util');
const EventEmitter = require('events');

let _emojis = new Map();
_emojis.set( "12345", { url:"Smiley" } );
_emojis.set( "54321", { url:"Frowny" } );

class Client extends EventEmitter {

  constructor () {
    super();
  }

  login () {
    return new Promise ( (resolve) => {
      //process.stdin.resume(); // old streams are paused by default
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (text) => {
        //console.log(`Received data ${util.inspect(text)}`);
        
        if ( text.startsWith('msg ') ) {
          
          let msg = {
            id: '0000000000000',
            content: text.substring(4,text.length-2),
            cleanContent: text.substring(4,text.length-2),
            channel: { 
              id: '1111111111111', 
              type:'text', 
              send:(txt,opt={}) => {
                console.log("[Bot] says: ",txt);
                if (opt.files) console.log("Files: ", opt.files);
                return Promise.resolve({content:txt, delete:()=>{console.log('deleted!')}});
              } },
            author: { id: '2222222222222', bot: false, username: 'FakeUser', tag:'1234' },
            member: { id: '1111111111111',  nickname:'Member' },
            guild: { id: '3333333333333', emojis: _emojis },
            mentions: {
              channels: new Map(),
              everyone: false,
              members: new Map(),
              roles: new Map(),
              users: new Map()
            },
            attachments: new Map(),
            delete: ()=>{ console.log('deleted!') }
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