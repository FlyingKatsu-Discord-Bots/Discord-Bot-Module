/* 

Main entry point for bots

All event handlers are defined internally, 
so new bot owners just need to 
1. copy config-dummy/files into config/files, 
2. customize the config files, 
3. and start main.js

If desired, bot owners can customize the 
extended classes found in custom/

New bot owners should use pm2 to 
auto-start main.js on boot and to 
auto-restart on crashes

*/

const Client = require('./Client.js');
const Discord = require('discord.js');

const PROM = require('./UtilProm.js');


class DiscordClient extends Client {
  
  constructor ( _config, _constants ) {
    super( _config, _constants );
    this.client = new Discord.Client();
  }
  
  // [SYNC] Initializations
  //initBotHandler ( _custom ) { super.initBotHandler(_custom); }
  //initServerHandler ( _handler ) { super.initServerHandler( _handler ); }
  //initDB ( _filename, _handler ) { super.initDB(_filename,_handler); }
  
  // [Thenable] Main Methods
  //start () { super.start(); }
  //quit () { super.quit(); }
  
  // [Thenable] Start up a Discord.js client
  startClient () {
    return this.client.login(this.config.bot.token)
      .then( () => { return PROM.log('core', 'Logged into Discord'); } )
      .catch( PROM.errorHandler );
  }
  // [Thenable] Log out of a Discord.js client
  closeClient () {
    return this.client.destroy()
      .then( () => { return PROM.log('core', 'Logged out of Discord'); } )
      .catch( PROM.errorHandler );
  }
  
  // [Thenable] Start Database
  //startDB () { super.startDB(); }
  //closeDB () { super.closeDB(); }
  
  // [Thenable] Start Server
  //startServer () { super.startServer(); }
  //listenServer () { super.listenServer(); }
  //closeServer () { super.closeServer(); }
  
}

module.exports = DiscordClient;