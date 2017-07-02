const util = require('util');

// Promiseified Utilities
const Prom = {
  
  // [SYNC] debug loggers
  debug: { 
    fluff: util.debuglog('BotFluff'), 
    discord_fluff: util.debuglog('DisFluff'),
    discord_core: util.debuglog('DisCore'),
    core: util.debuglog('BotCore')
  },
 
  // Resolves a promise of an array filtered into only values that satisfy the fn
  filter: ( array, fn ) => {
    return new Promise( (resolve) => {
      resolve( array.filter(fn) );
    } );
  },
  
  filterUndef: ( array ) => {
    return new Promise( (resolve) => {
      let a = array.filter( (d) => { return typeof d !== 'undefined'; } );
      resolve( a );
    } );
  },
  
  // Resolves a collection result
  // Rejects if no result, key, or collection
  getFromCollection: ( key, collection ) => {
    return new Promise( (resolve,reject) => {
      if (collection) {
        if (collection.has(key)) { 
          let result = collection.get(key);
          if ( result ) { resolve(result); }
          else { 
            reject( {name: "Internal", message: 'Collection.get(key) was falsey'} ); 
          }
        } else { 
          reject( {name: "Internal", message: 'No such key'} ); 
        }
      } else { 
        reject( {name: "Internal", message:'No such collection'} ); 
      }
    } );
  },
  
  // Resolves a sent message, given file attachments
  // Rejects if no files to send
  sendFiles: ( channel, files, text='' ) => {
    return new Promise( (resolve,reject) => {
      if ( files && files.length > 0 ) {
        channel.send( text, { files: files } )
          .then(resolve)
          .catch( Prom.errorHandler );
      }
      else { reject( {name: "Internal", message: 'No files to send'} ); }
    })
  },
  
  // Thenable debug log
  log: ( lvl, msg ) => {
    return Promise.resolve( Prom.debug[lvl](msg) );
  },
  
  // [SYNC] 
  convertType: {
    string: (v) => { 
      return (typeof v === "string") ? v : v.toString(); 
    },
    number: (v) => { 
      return (typeof v === "number") ? v : Number(v); 
    },
    boolean: (v) => { 
      if (typeof v === "boolean") { return v; }
      else if (typeof v === "string") { 
        let n = Number(v);
        if ( isNaN(n) ) { return v.toLowerCase() === "true"; }
        else { return Boolean(n); }
      }
      else { return Boolean(v); } // number, object, array, null, undefined
    }
  },
  
  // Returns a promise resolution
  // Send an error to a channel or through webhook
  sendUserError: {
    MissingArgs: ( channel, user, data )=>{
      return channel.send( `${user} ${data.cmd} expects ${data.numExp} arguments, but received ${data.num} instead...` )
      .catch(Prom.errorHandler);
    },
    InvalidKey: ( channel, user, data )=>{
      let tags = "```";
      return channel.send( `${user} \`${data.key}\` is not a valid \`keyword\` for \`${data.cmd}\`\nPlease use one of the following keywords instead:\n${tags}\n${data.keywords.join(' | ')}\n${tags}` )
      .catch(Prom.errorHandler);
    },
    InvalidInput: ( channel, user, data )=>{
      return channel.send( `${user} \`${data.cmd}\` expects a \`value\` of type \`${data.type}\`, but received \`${data.val}\` of type \`${data.valType}\` instead...` )
      .catch(Prom.errorHandler);
    }
  },
  
  sendCode: (channel, user, code, lang) => {
    let tags = "```";
    return channel.send(`${user}\n${tags}${lang}\n${code}\n${tags}`)
      .catch(Prom.errorHandler);
  },
  
  // [SYNC]
  errorHandler: ( err ) => {
    // Handle DiscordAPIErrors
    if (err.name == "DiscordAPIError") {
      Prom.debug.core(`[${err.name}:${err.code}] ${err.message}`);
    }
    // Handle Internal Errors
    else if (err.name == "BotModuleError") {
      Prom.debug.core(`[${err.name}] ${err.message}`);
    }
    // TODO: Handle Database Errors
    else {
      Prom.debug.fluff(err);
    }
  }
  
}


module.exports = Prom;