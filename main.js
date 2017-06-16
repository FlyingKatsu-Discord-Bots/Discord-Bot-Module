// Get the module stuff we need
const DiscordBot = require('./sub/DiscordBot.js');
// Get customizations for this bot
const BotHandler = require('./custom/CustomBotHandler.js');
// TODO: add links for custom error, util, commands, http response, db
const Command = require('./sub/Command.js');

// Define/Load config data here
const BotConfig = require('./config/bot.json');
const MasterConfig = require('./config/master.json');
const GuildConfig = require('./config/guild.json');
const WebhookConfig = require('./config/webhook.json');
const DatabaseConfig = require('./config/database.json');


// Create the bot
const ExampleBot = new DiscordBot( BotConfig );


// Add master config to control who can use this bot
ExampleBot.initMasterGuild( MasterConfig );
// Add guild config for defining what the bot can do in each server
ExampleBot.initGuild( GuildConfig );


// [OPTIONAL] Add webhook config for HTTP/S server listening
ExampleBot.initServer( WebhookConfig );
// [OPTIONAL] Add database config for preserving user data
ExampleBot.initDatabase( DatabaseConfig );


// Set up the Discord.js event handlers
ExampleBot.initBotHandlers( new BotHandler(ExampleBot) );
// TODO: add inits for custom error, util, commands, http response, db
ExampleBot.initCommand( new Command(ExampleBot) );

// Login to Discord, after starting up the server and/or database if initialized
ExampleBot.start();


// Handle NodeJS Process stuff for exiting

process.stdin.resume();

function exitHandler(opt,err) {
  console.log("I'm invoked!");
  if (err) console.log(err.stack);
  if (opt.asyncAllowed) {
    console.log("Quitting...");
    ExampleBot.quit()
      .then( process.exit )
      .catch( console.error );
  } else {
    if (opt.cleanup) console.log('Cleaning...');
    if (opt.exit) process.exit();
  }
}

process.on('exit', (code) => { exitHandler({cleanup:true},null) } );
process.on('SIGINT', () => { exitHandler({exit:true,asyncAllowed:true},null) });
process.on('SIGTERM', () => { exitHandler({exit:true,asyncAllowed:true},null) });
process.on('uncaughtException', (err) => { exitHandler({exit:true},err) });
process.on('beforeExit', (code) => { ExampleBot.quit(); });
