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
  
}

module.exports = CustomBotHandler;