/*

  Similar to DiscordBot.js except that 
  this uses a special setup for 
  interacting with a faked Discord 
  client through a command-line interface
  
  Handy for testing interactive logic
  without needing a Discord bot or server
  to test it with
  
*/

const Client = require('./Client.js');
const FakeDiscord = require('./FakeDiscord.js');

const PROM = require('./UtilProm.js');


class CLI extends Client {
  
  constructor ( _config, _constants ) {
    super( _config, _constants );
    this.client = new FakeDiscord.Client();
  }
  
  // [SYNC] Initializations
  //initBotHandler ( custom ) { super.initBotHandler(custom); }
  //initServerHandler ( _handler ) { super.initServerHandler( _handler ); }
  
  // [Thenable] Main Methods
  //start () { super.start(); }
  //quit () { super.quit(); }
  
  // [Thenable] Start up a Discord.js client
  startClient () {
    return this.client.login()
      .then( () => { return PROM.log('core', 'Ready to receive CLI commands'); } )
      .catch( PROM.errorHandler );
  }
  // [Thenable] Log out of a Discord.js client
  closeClient () {
    return this.client.destroy()
      .then( () => { return PROM.log('core', 'Closed the CLI prompt'); } )
      .catch( PROM.errorHandler );
  }
  
  // [Thenable] Start Database
  //startDB () { super.startDB(); }
  //createDB ( filename ) { super.createDB( filename ); }
  //closeDB () { super.closeDB(); }
  
  // [Thenable] Start Server
  //startServer () { super.startServer(); }
  //listenServer () { super.listenServer(); }
  //closeServer () { super.closeServer(); }
  
}

module.exports = CLI;