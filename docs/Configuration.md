# Configuration

## Table of Contents
- [Guild](#guild) - Required
- [Database](#database) - Required
- [Bot](#bot) - Required for Discord (but not for command line tests)
- [Master Guild](#master-guild) - Optional
- [Server](#server) - Optional

## Guild
[REQUIRED]

The data needed to configure any guild that adds your hosted bot.  This determines the majority of how your bot will serve your users, allowing individual guild admins to control optional features or custom command prefixes.
```json
{
  "configurable": {},
  "permissions": {},
  "commands": {},
  "struct": {}
}

```

## Database
[REQUIRED]

The data needed to configure a LevelUp database, which allows each guild to store unique data between boots/crashes. Currently just the filepath for storing the database. Could be helpful for managing multiple databases.
```json
{
  "filename": "path/to/your/database"
}

```

## Bot
[REQUIRED FOR DISCORD]

The data needed to login to Discord, using info from Discord Developers page.  This is not needed for testing locally via command line prompts.
```json
{
  "name": "Your Bot's Name",
  "token": "Your Bot's Token from Discord Developer Page",
  "id": "Your Bot's ID from Discord Developer Page",
  "repo": "A url to your code repository",
  "docs": "A url to your bot's documentation",
}

```

## Master Guild
[OPTIONAL]

The data needed to configure a master developer guild.  This is the guild that allows the bot master to control who can use their hosted bot, and is a good place to post bot updates and provide help.  Much of the data in this config mirrors that of [Guild](#guild) config, with the exception of a master guildID and a master userID (helpful for troubleshooting the bot in other guilds).
```json
{
  "guildID": "Your master guild's Discord ID",
  "userID": "Your Discord User ID (not your tag)",
  "configurable": {},
  "permissions": {},
  "commands": {},
  "struct": {}
}

```

## Server
[OPTIONAL]

The data needed to configure an HTTP or HTTPS server for receiving or sending HTTP/S requests/responses.  Good for things like Twitter or GitLab webhooks.
```json
{
  "address": "localhost or an IP address",
  "port": "9000 or whatever you like",
  "pfx": "required if useSSL is true and you don't have both key and cert files",
  "pass": "required if useSSL is true and using pfx file",
  "key": "required if useSSL is true and you don't have a pfx",
  "cert": "required if useSSL is true and you don't have a pfx",
  "useSSL": false
}

```
