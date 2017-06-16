class Command {
  
  constructor( bot ) {
    this.bot = bot;    
  }
  
  ping( msg, arg, prefix ) { 
    msg.channel.send('pong')
      //.then()
      .catch( console.error );
  }
  
  official( msg, arg, prefix ) {
    this.bot.botClient.fetchWebhook("308032053436481536")
      .then( (hook) => {
        hook.send(msg.content)
          //.then()
          .catch( console.error );
        } )
      .catch(console.error);
  }
  
  create( msg, arg, prefix ) { 
    switch( arg[0] ) {
      case "webhook":
        this.createWebhook(msg,arg,prefix);
        break;
        
      default:
        msg.reply(`Expected an argument DATA_TYPE in \`${prefix}CREATE DATA_TYPE LABEL\``)
          .catch( console.error );
        break;
    }
  }
  /* Deletes (or moves when API allows) the existing LABEL webhook and makes a new one in the specified channel */
  createWebhook( msg, arg, prefix ) { // create webhook label #channel|channelID|this
    if (arg[1] != null) {
      let channel = (!isNaN(arg[2])) ? 
          msg.guild.channels.get(arg[2]) : (msg.mentions.channels) ?
          msg.mentions.channels.first() : msg.channel;
      if (channel == null) channel = msg.channel;
      let label = arg[1];
      let hookInfo = this.bot.config.guild.struct.webhook[label];      
      // See if the webhook label is already defined
      this.bot.database.get( `G:${msg.guild.id}|W:${label}`)
        // If already defined move (or delete and recreate) the hook to the specified channel        
        // Attempt to get the webhook object from discord client
        .then( (wid) => { return this.bot.botClient.fetchWebhook( wid ); } )
        // Attempt to change the webhook's channelID and send a message
        //.then( (hook) => { 
        //  hook.channelID = channel.id;
        //  return hook;
        //} )
        //.then( (hook) => { return hook.send(`Webhook \`${label}\` has been moved to ${channel}`); } )
        // TODO: When API fixes channelID, uncomment the above and remove this temp solution
        .then ( (hook) => { return hook.delete(); } )
        .then ( () => { return this.bot.database.del(`G:${msg.guild.id}|W:${label}`); } )
        .then ( () => { this.createWebhook(msg,arg,prefix); } )
        // END TEMP SOLUTION
        // TODO: Set up any initializations here
        //.then()
        // TODO: Report success of initializations here
        //.then()
        .catch( (err) => { 
          if (err.name === "NotFoundError" ) { // Webhook doesnt exist yet so let's create one
            // Attempt to create a webhook in the specified channel
            channel.createWebhook( hookInfo.name, hookInfo.avatar )
              // Attempt to put webhook.id into database
              .then( (hook) => { return this.bot.database.put( `G:${msg.guild.id}|W:${label}`, hook.id ); } )
              // Retrieve the webhook id from the database
              .then( () => { return this.bot.database.get( `G:${msg.guild.id}|W:${label}`); } )
              // Attempt to get the webhook object from discord client
              .then( (wid) => { return this.bot.botClient.fetchWebhook( wid ); } )
              // Re-Attempt to update the avatar because API's create webhook is buggy
              // TODO: remove this line when API is fixed
              .then( (hook) => { return hook.edit(hookInfo.name, hookInfo.avatar); } )
              // Attempt to send a message through the new hook
              .then( (hook) => { return hook.send(`Webhook \`${label}\` will now send messages here in ${channel}`); } )
              // TODO: Set up any initializations here
              //.then()
              // TODO: Report success of initializations here
              //.then()
              .catch( console.error );
          } else { console.error(err); }
      });
    } else {
      // Notify that label is not valid
      msg.reply(`Expected argument LABEL in \`${prefix}CREATE WEBHOOK LABEL (DESTINATION_CHANNEL)\``)
        .catch( console.error );
    }
  }
  
  /* Ignore this as the API doesn't support it yet */
  moveWebhook( msg, arg, prefix ) { // move webhook label #channel|channelID|this
    if (arg[1] != null) {
      let channel = (!isNaN(arg[2])) ? 
          msg.guild.channels.get(arg[2]) : (msg.mentions.channels) ?
          msg.mentions.channels.first() : msg.channel;
      if (channel == null) channel = msg.channel;
      let label = arg[1];
      // Attempt to fetch webhookID from database
      this.bot.database.get( `G:${msg.guild.id}|W:${label}` )
        // Attempt to get the webhook object from discord client
        .then( (wid) => { return this.bot.botClient.fetchWebhook( wid ); } )
        // Attempt to change the webhook's channelID and send a message
        .then( (hook) => { 
          hook.channelID = channel.id; 
          return hook.send(`Webhook \`${label}\` has been moved to ${channel}`); 
        } )
        // TODO: Set up any initializations here
        //.then()
        // TODO: Report success of initializations here
        //.then()
        .catch( console.error );
    } else {
      // Notify that label is not valid
      msg.reply(`Expected argument LABEL in \`${prefix}MOVE WEBHOOK LABEL (DESTINATION_CHANNEL)\``)
        .catch( console.error );
    }
  }
  
  set( msg, arg, prefix ) {
    switch( arg[0] ) {
      case "webhook":
        this.setWebhook(msg,arg,prefix);
        break;
        
      default:
        msg.reply(`Expected an argument DATA_TYPE in \`${prefix}SET DATA_TYPE LABEL\``)
          .catch( console.error );
        break;
    }
  }
  /* Redefine the value (webhookID) for the key Guild|WebhookLabel */
  setWebhook( msg, arg, prefix ) {    
    if ( arg[1] != null && !isNaN(arg[2]) ) {
      let label = arg[1]; let wid = arg[2];
      // Attempt to put label-wid pair in the db
      this.bot.database.put( `G:${msg.guild.id}|W:${label}`, wid )
        // Try to retrieve the ID
        .then( () => { return this.bot.database.get( `G:${msg.guild.id}|W:${label}` ); } )
        // Try to retrieve the webhook object
        .then( (val) => { return this.bot.botClient.fetchWebhook( val ); } )
        // Report our success via webhook of ID
        .then( (hook) => { return hook.send(`Hello, I am a \`${label}\` webhook now`); } )
        // TODO: Set up any initializations here
        //.then()
        // TODO: Report success of initializations here
        //.then()
        .catch( console.error );
    } else {
      // Reply that the supplied arg is invalid
      msg.reply(`Expected arguments LABEL, HOOK_ID in \`${prefix}SET WEBHOOK LABEL HOOK_ID\``)
        .catch( console.error );
    }
  }
  
  test( msg, arg, prefix ) {    
    switch( arg[0] ) {
      case "webhook":
        this.testWebhook(msg,arg,prefix);
        break;
        
      default:
        msg.reply(`Expected an argument DATA_TYPE in \`${prefix}TEST DATA_TYPE LABEL\``)
          .catch( console.error );
        break;
    }
  }
  /* Send a test message through the specified webhook */
  testWebhook( msg, arg, prefix ) {
    if ( arg[1] != null ) {
      let label = arg[1];
      // Attempt to fetch webhookID from database
      this.bot.database.get( `G:${msg.guild.id}|W:${label}` )
        // Attempt to get the webhook object from discord client
        .then( (wid) => { return this.bot.botClient.fetchWebhook( wid ); } )
        // Attempt to send a message through the retrieved hook
        .then( (hook) => { return hook.send(`Testing webhook ${label}...`) } )
        .catch( (err) => { 
          if (err.name === "NotFoundError") {
            msg.reply(`No webhook has been assigned to the label ${label} yet! Use \`SET WEBHOOK LABEL HOOK_ID\` to assign a webhook ID to this label. Webhook IDs are the first string of numbers found in the webhook's url when you edit a webhook via server or channel settings.`)
              .catch( console.error );
          } else { console.error(err); }
        } );
    } else {
      // Reply that the supplied arg is invalid
      msg.reply(`Expected an argument LABEL in \`${prefix}TEST WEBHOOK LABEL\``)
        .catch( console.error );
    }
  }
  
  
}

module.exports = Command;