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
  
  /* ============================================
                Database - related
  ============================================ */

  // [Thenable] If DB config, create a DB, otherwise continue chain
  startDB () {
    return new Promise( (resolve, reject) => {
      if ( this.config.database ) {
        this.createDB( this.config.database.filename )
          .then( (err,db) => {
            if (err) { reject( err ); }
            else { PROM.log('core', 'Successfully created a database').then(resolve); }
          } )
          .catch( console.error );
      } else {
        resolve();
      }
    } );
  }  
  // [Thenable] Promiseified db create using levelDB via then-levelup
  createDB ( filename ) {
    return new Promise( (resolve) => require('then-levelup')(require('level')( filename, resolve )) );
  }
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