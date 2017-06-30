const util = require('util');

class Client {

  constructor (token) {
    // TODO
    this.token = token;
  }

  login () {
    return new Promise ( (resolve) => {
      //process.stdin.resume(); // old streams are paused by default
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (text) => {
        console.log(`Received data ${util.inspect(text)}`);
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