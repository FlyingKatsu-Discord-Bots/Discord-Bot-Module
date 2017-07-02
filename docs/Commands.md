# Commands

## Table of Contents
- [Ping](#ping)
- [Config](#config)

## Ping

### `prefix PING`
The bot will reply with `@Username pong`

This just serves as a basic test command to ensure the bot can understand commands.


## Config

See [Configuration](Configuration.md) for more information about guild config data.

### `prefix CONFIG`
The bot will reply with a JSON-formatted config data object, similar to the following:
```json
{
  "prefix": {
    "value": "!",
    "type": "string"
  },
  "autoBigEmoji": {
    "value": false,
    "type": "boolean"
  },
  "keyword": {
    "value": 123,
    "type": "number"
  }
}
```

### `prefix CONFIG keyword`
The bot will set CONFIG.keyword to its default value, then reply with something like `@Username set config.prefix = !`

If the keyword does not exist in config data, the bot will instead reply with an InvalidKey error message and a list of valid keywords, like 
> @Username `key` is not a valid `keyword` for `prefix CONFIG keyword`

> Please use one of the following keywords instead:

> ```prefix | autoBigEmoji | keyword```

### `prefix CONFIG keyword value`
The bot will set CONFIG.keyword to the provided value, if the value matches the intended data type.

If the data type matches, the bot will reply with something like `@Username set config.prefix = >>>`

If the data type does not match, the bot will reply with an InvalidInput error message such as:
> @Username `prefix CONFIG keyword value` expects a `value` of type `number`, but received `foo` of type `string` instead...
