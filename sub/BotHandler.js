class BotHandler {
  
  /* @param bot is the DiscordBot instance to which we will give these handlers */
  constructor( bot ) {
    this.bot = bot;
  }
  
  /* ====================================
       Connection Events
     ================================== */
  onReady() {
    console.log(this.bot.config.bot.name);
  }  
  onDisconnect( event ) {  }
  onReconnecting(  ) {  }
  onResume( numReplayed ) {  }
  onGuildUnavailable( guild ) {  }
  
  
  /* ====================================
       Debug Events
     ================================== */
  onWarn( info ) { 
    if (info) {
      let d = new Date();
      console.log(`\n${d.toLocaleString()}\nWARNING: ${info}`);
    }
  }
  onDebug( info ) { 
    if (info) {
      let d = new Date();
      console.log(`\n${d.toLocaleString()}\nDEBUG: ${info}`);
    }
  }
  onError( error ) { 
    if (error) {
      let d = new Date();
      console.log(`\n${d.toLocaleString()}\nERROR: ${error.code}\n${error.message}`);
    }
  }
  
  
  /* ====================================
       User Activity Events
     ================================== */
  onMessage( msg ) {    
    // Ignore messages from DMs, Group DMs, and Voice
    if (msg.channel.type != "text") return;
    // Ignore bot messages
    if (msg.author.bot) return;
    
    console.log(`Received msg: ${msg.content}`);
    
    // TODO: check status of msg.guild in db, then get prefix
    let prefix = this.bot.config.bot.prefix;
    
    // Only read messages starting with command prefix
    if (msg.content.startsWith(prefix)) {
      // Parse out the command from message args
      let [cmd, ...arg] = msg.content.substring(this.bot.config.bot.prefix.length).toLowerCase().split(" ");
      console.log(`Received cmd: ${cmd}`);
      // Only process command if it is recognized
      // TODO: check role/commandsets for restricted command actions
      if ( Object.getPrototypeOf(this.bot.command).hasOwnProperty(cmd) ) {
        this.bot.command[cmd](msg, arg, prefix);
      }
    }
    // TODO: consider inline commands for reaction images or mentioning bot entities
  }
  onMessageDelete( msg ) {  }
  onMessageUpdate( oldMsg, newMsg ) {  }
  
  
  onPresenceUpdate( oldMember, newMember ) {  }
  onGuildMemberUpdate( oldMember, newMember ) {  }
  
  
  /* ====================================
       Admin Role Events
     ================================== */
  onRoleCreate( role ) {  }
  onRoleDelete( role ) {  }
  onRoleUpdate( oldRole, newRole ) {  }
  
  
  /* ====================================
       Admin Channel Events
     ================================== */
  onChannelCreate( channel ) {  }
  onChannelDelete( channel ) {  }
  onChannelUpdate( oldChannel, newChannel ) {  }
  
  
  /* ====================================
       Admin Guild Events
     ================================== */
  onGuildCreate( guild ) {  }
  onGuildDelete( guild ) {  }
  onGuildUpdate( oldGuild, newGuild ) {  }
  
  
  onGuildMemberAdd( member ){  }
  onGuildMemberRemove( member ){  }
  
  
  onGuildBanAdd( guild, user ){  }
  onGuildBanRemove( guild, user ){  }
  
}

module.exports = BotHandler;