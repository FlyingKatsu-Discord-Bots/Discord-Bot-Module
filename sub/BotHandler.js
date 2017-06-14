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
      console.log(`\n${d.toLocaleString()}\nWARNING: ${info}\n`);
    }
  }
  onDebug( info ) { 
    if (info) {
      let d = new Date();
      console.log(`\n${d.toLocaleString()}\nDEBUG: ${info}\n`);
    }
  }
  onError( error ) { 
    if (error) {
      let d = new Date();
      console.log(`\n${d.toLocaleString()}\nERROR: ${error.code}\n${error.message}\n`);
    }
  }
  
  
  /* ====================================
       User Activity Events
     ================================== */
  onMessage( msg ) {  }
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