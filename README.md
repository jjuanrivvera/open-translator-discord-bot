# open-translator-discord-bot

Discord translator bot that use LibreTranslate or Google Translator built with discordjs v12


# Folder structure
```
src/
    commands/
    config/
    events/
    helpers/
    models/
    util/
tests/
```

# Requirements
- Docker and Docker Compose (optional)
- MongoDB with guilds collection
- guilds collection fields: id, name, prefix, provider, autoTranslate

# Run
Run with docker using the command: `docker-compose up -d`

# Available commands

Let's assume the prefix is `!`. The `<>` is for required arguments and `[]` for optional ones.

## Help

Displays help menu

### Usage: `!help`
<br>

## Image

Translate image text

### Usage: `!image <language> [link|attachment]`

### Example: `!image es https://static.dezeen.com/uploads/2015/03/Nike-Just-Do-It_dezeen_sq.jpg`

Note: this command requires a lot cpu and it may not work on cloud-providers free tier instances
<br>

## Invite

Invite this bot to discord server

### Usage: `!invite`
<br>

## Languages

Display available languages supported by provider

### Usage: `!languages <provider>`
<br>

## Ping

Ping comand

### Usage: `!ping`
<br>

## Prefix

Manage prefix

### Usage: `!prefix [prefix]`

### Example: `!prefix +`
<br>

## Provider

Manage provider

### Usage: `!provider [provider]`

### Example: `!provider libre-translate`
<br>

## Translate

Translate command

### Usage: `!<language> <text>`
