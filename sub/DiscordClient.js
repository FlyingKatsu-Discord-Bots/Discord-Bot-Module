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
  initBotHandler ( custom ) {
    // Must use Arrow Syntax to preserve the "this" inside of custom's class
    // Connection handlers
    this.client.on( 'ready', () => custom.onReady() );
    this.client.on( 'disconnect', (event) => custom.onDisconnect(event) );
    this.client.on( 'reconnecting', () => custom.onReconnecting() );
    this.client.on( 'resume', (num) => custom.onReplayed(num) );
    this.client.on( 'guildUnavailable', (guild) => custom.onGuildUnavailable(guild) );
    
    // Warn/Error handlers
    this.client.on( 'warn', (info) => custom.onWarn(info) );
    this.client.on( 'debug', (info) => custom.onDebug(info) );
    this.client.on( 'error',(err) => custom.onError(err) );
    
    // User activity handlers
    this.client.on( 'message', (msg) => custom.onMessage(msg) );
    this.client.on( 'messageDelete', (msg) => custom.onMessageDelete(msg) );
    this.client.on( 'messageUpdate', (oldMsg,newMsg) => custom.onMessageUpdate(oldMsg,newMsg) );
    this.client.on( 'presenceUpdate', (oldMember,newMember) => custom.onPresenceUpdate(oldMember,newMember) );
    this.client.on( 'guildMemberUpdate', (oldMember,newMember) => custom.onGuildMemberUpdate(oldMember,newMember) );
    
    // Admin activity handlers
    this.client.on( 'roleCreate', (role) => custom.onRoleCreate(role) );
    this.client.on( 'roleDelete', (role) => custom.onRoleDelete(role) );
    this.client.on( 'roleUpdate', (oldRole,newRole) => custom.onRoleUpdate(oldRole,newRole) );
    
    this.client.on( 'channelCreate', (channel) => custom.onChannelCreate(channel) );
    this.client.on( 'channelDelete', (channel) => custom.onChannelDelete(channel) );
    this.client.on( 'channelUpdate', (oldChannel,newChannel) => custom.onChannelUpdate(oldChannel,newChannel) );
    
    this.client.on( 'guildCreate', (guild) => custom.onGuildCreate(guild) );
    this.client.on( 'guildDelete', (guild) => custom.onGuildDelete(guild) );
    this.client.on( 'guildUpdate', (oldGuild,newGuild) => custom.onGuildUpdate(oldGuild,newGuild) );
    
    this.client.on( 'guildMemberAdd', (member) => custom.onGuildMemberAdd(member) );
    this.client.on( 'guildMemberRemove', (member) => custom.onGuildMemberRemove(member) );
    
    this.client.on( 'guilBanAdd', (guild,user) => custom.onGuildBanAdd(guild,user) );
    this.client.on( 'guildBanRemove', (guild,user) => custom.onGuildBanRemove(guild,user) );
    
    // TODO add handlers for reactions, emojis
    
  }
  //initServerHandler ( _handler ) { super.initServerHandler( _handler ); }
  
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
  //createDB ( filename ) { super.createDB( filename ); }
  //closeDB () { super.closeDB(); }
  
  // [Thenable] Start Server
  //startServer () { super.startServer(); }
  //listenServer () { super.listenServer(); }
  //closeServer () { super.closeServer(); }
  
}

module.exports = DiscordClient;