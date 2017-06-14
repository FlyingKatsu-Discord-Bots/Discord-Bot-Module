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

const Discord = require('discord.js');

class DiscordBot {
  
  constructor ( botConfig ) {
    // TODO: verify config file
    this.config = {}; 
    this.config.bot = botConfig;
    // TODO: initialize default things
    // Create the bot client and set the event handlers
    this.botClient = new Discord.Client();
  }
  
  /* Start running everything needed for the bot */
  start() {
    // TODO: Start up the database, if it exists
    // TODO: Start up the server, if it exists
    // Log bot into Discord
    this.botClient.login(this.config.bot.token);
  }
  
  /* Set up database based on config settings */
  initDatabase( config ) {
    this.config.database = config;
    // TODO: verify config
    // TODO: set up database handlers
  }
  /* Set up server based on config settings */
  initServer( config ) {
    this.config.webhook = config;
    // TODO: verify config
    // TODO: set up http responders
  }
  /* Set up master guild based on config settings */
  initMasterGuild( config ) {
    this.config.master = config;
    // TODO: verify config
  }
  /* Set up regular guild based on config settings */
  initGuild( config ) {
    this.config.guild = config;
    // TODO: verify config
  }  
  /* Set up event handlers for Discord.js, using custom handlers if defined */
  initBotHandlers( custom ) {
    // Must use Arrow Syntax to preserve the "this" inside of custom's class
    // Connection handlers
    this.botClient.on( 'ready', () => custom.onReady() );
    this.botClient.on( 'disconnect', (event) => custom.onDisconnect(event) );
    this.botClient.on( 'reconnecting', () => custom.onReconnecting() );
    this.botClient.on( 'resume', (num) => custom.onReplayed(num) );
    this.botClient.on( 'guildUnavailable', (guild) => custom.onGuildUnavailable(guild) );
    
    // Warn/Error handlers
    this.botClient.on( 'warn', (info) => custom.onWarn(info) );
    this.botClient.on( 'debug', (info) => custom.onDebug(info) );
    this.botClient.on( 'error',(err) => custom.onError(err) );
    
    // User activity handlers
    this.botClient.on( 'message', (msg) => custom.onMessage(msg) );
    this.botClient.on( 'messageDelete', (msg) => custom.onMessageDelete(msg) );
    this.botClient.on( 'messageUpdate', (oldMsg,newMsg) => custom.onMessageUpdate(oldMsg,newMsg) );
    this.botClient.on( 'presenceUpdate', (oldMember,newMember) => custom.onPresenceUpdate(oldMember,newMember) );
    this.botClient.on( 'guildMemberUpdate', (oldMember,newMember) => custom.onGuildMemberUpdate(oldMember,newMember) );
    
    // Admin activity handlers
    this.botClient.on( 'roleCreate', (role) => custom.onRoleCreate(role) );
    this.botClient.on( 'roleDelete', (role) => custom.onRoleDelete(role) );
    this.botClient.on( 'roleUpdate', (oldRole,newRole) => custom.onRoleUpdate(oldRole,newRole) );
    
    this.botClient.on( 'channelCreate', (channel) => custom.onChannelCreate(channel) );
    this.botClient.on( 'channelDelete', (channel) => custom.onChannelDelete(channel) );
    this.botClient.on( 'channelUpdate', (oldChannel,newChannel) => custom.onChannelUpdate(oldChannel,newChannel) );
    
    this.botClient.on( 'guildCreate', (guild) => custom.onGuildCreate(guild) );
    this.botClient.on( 'guildDelete', (guild) => custom.onGuildDelete(guild) );
    this.botClient.on( 'guildUpdate', (oldGuild,newGuild) => custom.onGuildUpdate(oldGuild,newGuild) );
    
    this.botClient.on( 'guildMemberAdd', (member) => custom.onGuildMemberAdd(member) );
    this.botClient.on( 'guildMemberRemove', (member) => custom.onGuildMemberRemove(member) );
    
    this.botClient.on( 'guilBanAdd', (guild,user) => custom.onGuildBanAdd(guild,user) );
    this.botClient.on( 'guildBanRemove', (guild,user) => custom.onGuildBanRemove(guild,user) );
    
    // TODO add handlers for reactions, emojis
    
  }
  /* Set up error handlers, using custom handlers if defined */
  initErrorHandlers( custom ) {
    // TODO
  }
  /* Set custom utilities, such as embed formatting */
  initUtil( custom ) {
    // TODO
  }
  /* Set custom command references
   */
  initCommands( custom ) {
    // TODO
  }  
  
}

module.exports = DiscordBot;