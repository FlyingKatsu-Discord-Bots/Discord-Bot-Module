/*
  
  Extendable class for setting up and
  shutting down a client interface,
  whether it is a Discord.js client or
  a command-line interface for testing
  custom bot interactions
  
  Really just a convenient place to 
  store the shared Database and Server
  helper functions
  
*/

const PROM = require('./UtilProm.js');


class Client {
  
  constructor ( _config, _constants ) {
    this.constants = _constants;
    this.config = _config;
    this.client = null;
  }
  
  // [Thenable]
  start () {
    return this.startDB()
      .then( () => { return this.startClient(); } )
      .then( () => { return this.startServer(); } )
      .catch( PROM.errorHandler );
  }
  // [Thenable]
  quit () {
    return this.closeServer()
      .then( () => { return this.closeClient(); } )
      .then( () => { return this.closeDB(); } )
      .catch( PROM.errorHandler );
  }
  
  /* ============================================
                Client - related
  ============================================ */
  
  // [Thenable]
  startClient () { }
  closeClient () { }
  
  // [SYNC]
  initBotHandler ( _custom ) {
    // Must use Arrow Syntax to preserve the "this" inside of _custom's class
    // Connection handlers
    this.client.on( 'ready', () => _custom.onReady() );
    this.client.on( 'disconnect', (event) => _custom.onDisconnect(event) );
    this.client.on( 'reconnecting', () => _custom.onReconnecting() );
    this.client.on( 'resume', (num) => _custom.onReplayed(num) );
    this.client.on( 'guildUnavailable', (guild) => _custom.onGuildUnavailable(guild) );
    
    // Warn/Error handlers
    this.client.on( 'warn', (info) => _custom.onWarn(info) );
    this.client.on( 'debug', (info) => _custom.onDebug(info) );
    this.client.on( 'error',(err) => _custom.onError(err) );
    
    // User activity handlers
    this.client.on( 'message', (msg) => _custom.onMessage(msg) );
    this.client.on( 'messageDelete', (msg) => _custom.onMessageDelete(msg) );
    this.client.on( 'messageUpdate', (oldMsg,newMsg) => _custom.onMessageUpdate(oldMsg,newMsg) );
    this.client.on( 'presenceUpdate', (oldMember,newMember) => _custom.onPresenceUpdate(oldMember,newMember) );
    this.client.on( 'guildMemberUpdate', (oldMember,newMember) => _custom.onGuildMemberUpdate(oldMember,newMember) );
    
    // Admin activity handlers
    this.client.on( 'roleCreate', (role) => _custom.onRoleCreate(role) );
    this.client.on( 'roleDelete', (role) => _custom.onRoleDelete(role) );
    this.client.on( 'roleUpdate', (oldRole,newRole) => _custom.onRoleUpdate(oldRole,newRole) );
    
    this.client.on( 'channelCreate', (channel) => _custom.onChannelCreate(channel) );
    this.client.on( 'channelDelete', (channel) => _custom.onChannelDelete(channel) );
    this.client.on( 'channelUpdate', (oldChannel,newChannel) => _custom.onChannelUpdate(oldChannel,newChannel) );
    
    this.client.on( 'guildCreate', (guild) => _custom.onGuildCreate(guild) );
    this.client.on( 'guildDelete', (guild) => _custom.onGuildDelete(guild) );
    this.client.on( 'guildUpdate', (oldGuild,newGuild) => _custom.onGuildUpdate(oldGuild,newGuild) );
    
    this.client.on( 'guildMemberAdd', (member) => _custom.onGuildMemberAdd(member) );
    this.client.on( 'guildMemberRemove', (member) => _custom.onGuildMemberRemove(member) );
    
    this.client.on( 'guilBanAdd', (guild,user) => _custom.onGuildBanAdd(guild,user) );
    this.client.on( 'guildBanRemove', (guild,user) => _custom.onGuildBanRemove(guild,user) );
    
    // TODO add handlers for reactions, emojis
    
  }
  
  /* ============================================
                Database - related
  ============================================ */

  // [Thenable] If DB config, create a DB, otherwise continue chain
  startDB () {
    return new Promise( (resolve, reject) => {
      if ( this.config.database ) {
        this.initDB( this.config.database.filename, (err,db) => {
          if (err) return reject(err);
          else return PROM.log('core', 'Successfully created a database')
            .then( resolve )
            .catch( PROM.errorHandler ); 
        } );
      } else {
        resolve();
      }
    } );
  }  
  // [SYNC] Assigns a levelup db to our client.database
  initDB ( _filename, _handler ) {
    this.database = require('then-levelup')( require('level')(_filename, _handler) );
  }
  // [Thenable] Promiseified db close
  closeDB () {
    return new Promise( (resolve,reject) => {
      if (this.database) {
        this.database.close()
          .then( (err) => {
            if (err) { reject( err ); }
            else { PROM.log('core', 'Closed the database').then(resolve); }
          } )
          .catch( PROM.errorHandler );
      } else { resolve(); }
    } );
  }
  
  /* ============================================
                Server - related
  ============================================ */
  
  // [SYNC] Initialize a server with the given listening handler
  initServerHandler ( _handler ) {
    if (this.config.server) {
      if ( this.config.server.useSSL ) { // Use secured HTTPS server
        const fs = require('fs');

        if ( this.config.server.pfx && this.config.server.pass ) {            
          let options = {
            pfx: fs.readFileSync(this.config.server.pfx),
            passphrase: this.config.server.pass
          };
          this.server = require('https').createServer( options, _handler );

        } else if ( this.config.server.key && this.config.server.cert ) {

          let options = {
            key: fs.readFileSync(this.config.server.key),
            cert: fs.readFileSync(this.config.server.cert)
          };
          this.server = require('https').createServer( options, _handler );

        } else {
          reject( { name:"Internal",message:"Missing PFX or Key+Cert files in server config" } );
        }

      } else { // Use unsecure HTTP server
        this.server = require('http').createServer( _handler );
      }
    }
  }
  
  // [Thenable] If Server, start listening, otherwise continue chain
  startServer () {
    return new Promise( (resolve, reject) => {
      if ( this.server ) {
        this.listenServer()
          .then( () => { 
            return PROM.log('core', `Server is ready to listen at ${this.server.address().address}:${this.server.address().port}`).then(resolve);
          } )
          .catch( (err) => reject(err) );
      } else {
        resolve();
      }
    } );
  }  
  // [Thenable] Promiseified server.listen
  listenServer () {
    return new Promise( (resolve) => this.server.listen( 
      this.config.server.port, 
      this.config.server.address, 
      resolve 
    ) );
  }
  // [Thenable] Promiseified server.close
  closeServer () {
    return new Promise( (resolve,reject) => {
      if (this.server && this.server.listening) {
        this.server.close( (err) => {
          if (err) { reject(err); }
          else { PROM.log('core', 'Closed the server').then(resolve); }
        } );
      } 
      else { resolve(); }
    } );
  }
  
}

module.exports = Client;