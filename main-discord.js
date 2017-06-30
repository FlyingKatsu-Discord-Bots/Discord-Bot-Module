// Get the module stuff we need
const DiscordClient = require('./sub/DiscordClient.js');
// Utilities (mostly promisified)
const PROM = require('./sub/UtilProm.js');

// Get customizations for this bot
const BotHandler = require('./custom/CustomBotHandler.js');
// Custom Commands
const Command = require('./sub/Command.js');

// Define/Load config data here
const Constants = require('./sub/Constants.js');
const Config = {
  bot: require('./config/bot.json'),
  master: require('./config/master.json'),
  guild: require('./config/guild.json'),
  server: require('./config/server.json'),
  database: require('./config/database.json')
};

// Bot Setup stuff
const ExampleBot = new DiscordClient( Config, Constants );
// Set up the Discord.js event handlers
ExampleBot.initBotHandler( new BotHandler(ExampleBot) );
// Set up custom commands
ExampleBot.command = new Command(ExampleBot);

// [Optional] Set up Server's listening handler
ExampleBot.initServerHandler( ()=>{} );

// Start up the database, then the client, then the server
ExampleBot.start()
  .then( () => { return PROM.log('core','Completed start up sequence. Ready to bot!'); } )
  .catch( PROM.errorHandler );


// Quit Procedure
process.stdin.resume();
const exitHandler = function (opt,err) {
  if (err) console.error(err.stack);
  if (opt.asyncAllowed) {
    PROM.log('core','Quitting...')
      .then( () => { return ExampleBot.quit(); } )
      .then( () => { return PROM.log('core', 'Completed Shut Down. Good night, Bot!'); } )
      .then( process.exit )
      .catch( PROM.errorHandler );
  } else {
    if (opt.cleanup) PROM.debug.core('Cleaning...');
    if (opt.exit) process.exit();
  }
}
process.on('exit', (code) => { exitHandler({cleanup:true},null); } );
process.on('SIGINT', () => { exitHandler({exit:true,asyncAllowed:true},null); });
process.on('SIGTERM', () => { exitHandler({exit:true,asyncAllowed:true},null); });
process.on('uncaughtException', (err) => { exitHandler({exit:true},err); });
process.on('beforeExit', (code) => { ExampleBot.quit(); });