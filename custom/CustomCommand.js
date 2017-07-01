const Command = require('../sub/Command.js');
const PROM = require('../sub/UtilProm.js');

class CustomCommand extends Command {
  
  constructor( _client ) {
    super( _client );
  }
  
  _listMethods() {
    return Object.getOwnPropertyNames( this.protoObj )
      .concat( Object.getOwnPropertyNames( Object.getPrototypeOf( this.protoObj ) ) );
  }
  
  _hasMethod(cmd) {
    return this.protoObj.hasOwnProperty(cmd) ||
      Object.getPrototypeOf(this.protoObj).hasOwnProperty(cmd);
  }
  
  
  // [Internal] [Promise] Split the message up and check each word for <:emoji:id>, then send that emoji as a file embed
  _processEmoji( msg, config ) {
    // Split up msg
    let splitMsg = msg.cleanContent
      .substr(config.prefix.length).trim() // remove prefix and extra space
      .toLowerCase()
      .split(" "); 
    // Check each word for an emoji id and save the URL if the id is valid
    return Promise.all( splitMsg.map( (word) => {
      return this._getEmojiFromWord(word, msg.guild.emojis);
    } ) )
      // Filter out bad results
      .then( PROM.filterUndef )
      // Send emoji URLs, if any
      .then( (emojiURLs) => { 
        PROM.sendFiles(msg.channel, emojiURLs)
        .catch( (err) => {
          if (err.msg == 'No files to send') { return; }
          else { PROM.errorHandler }
        } ); } )
      .catch( PROM.errorHandler );
  }
  // [Internal] [Promise] Given a word, find an emoji ID and if exists, return its url
  // Silently continues chain if no ID is found or if ID is invalid
  _getEmojiFromWord( word, emojis ) {
    return new Promise( (resolve,reject) => {
      if ( word.startsWith("<") && word.endsWith(">") ) {
        // Get the snowflake after :phrase: and before >
        let id = word.substring( word.lastIndexOf(":")+1, word.indexOf(">") );
        if (id != "") { 
          PROM.getFromCollection(id,emojis)
            .then( (emoji) => { resolve(emoji.url); },
                   // skip if fail
                   (err) => { resolve(); } 
                 )
            .catch( PROM.errorHandler ); 
        } 
        //else { reject("Missing ID for Emoji"); }
        else { resolve(); }
      } else { resolve(); }
    } );
  }  
  // [Internal] [SYNC] Simple emoji replacement: send emoji as file embed then delete source message
  // Assumes message is of the form 'PREFIX<:emoji:id>'
  _simpleEmoji( msg, config ) {
    let word = msg.cleanContent.substr(config.prefix.length).trim();
    let id = word.substring( word.lastIndexOf(":")+1, word.indexOf(">") );
    let emoji = msg.guild.emojis.get(id);
    if (emoji) {
      PROM.sendFiles(msg.channel, [emoji.url])
        .then( (m) => { return msg.delete(); } )
        .catch( PROM.errorHandler );
    }
  }
  
}

module.exports = CustomCommand;