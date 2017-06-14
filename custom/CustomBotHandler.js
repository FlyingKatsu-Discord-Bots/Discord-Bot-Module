const BotHandler = require('../sub/BotHandler.js');

class CustomBotHandler extends BotHandler {
  
  constructor( bot ) {
    super( bot );
  }
  
  onReady() {    
    console.log("Before I'm ready!");    
    super.ready();    
    console.log("After I'm ready!");    
  }
  
}

module.exports = CustomBotHandler;