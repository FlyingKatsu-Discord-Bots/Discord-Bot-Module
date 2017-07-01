const BotHandler = require('../sub/BotHandler.js');
const PROM = require('../sub/UtilProm.js');

class CustomBotHandler extends BotHandler {
  
  constructor( _client ) {
    super( _client );
  }
  
  onReady() {
    PROM.log( 'fluff', "Before I'm ready!" )
      .then( () => { return Promise.resolve( super.onReady() ); } )
      .then( () => { return PROM.log( 'fluff', "After I'm ready!" ); } )
      .catch( PROM.errorHandler );    
  }
  
  processMessage( msg, config ) {
    
    PROM.log('fluff', config);
    
    // Auto Enlarge Emojis in short messages
    if ( config.autoBigEmoji.data ) {
      if (msg.content.length < config.maxCharsToSplit.data) {
        this.client.command._processEmoji(msg,config);
      }
    } else {
      // Check for an auto enlarge emoji command of form PREFIX<:emoji:id>
      if ( msg.cleanContent.startsWith(config.prefix.data+"<:") ) {
        this.client.command._simpleEmoji(msg,config);
        return; // Nothing more to process
      }
    }
    
    // Process commands as usual
    super.processMessage( msg, config );  
  }
  
}

module.exports = CustomBotHandler;