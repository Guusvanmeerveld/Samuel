<p align="center"><img src="img/logo-banner.png" width="400"></p>

# Tempo
> Tempo is a simple, yet feature rich Discord music bot

## Index
- [Tempo](#tempo)
  - [Index](#index)
  - [Description](#description)
  - [Features](#features)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Building](#building)
    - [Requirements:](#requirements)
    - [Local](#local)
    - [Docker](#docker)
  - [Development](#development)

## Description

Tempo's main development goal was to create a bot that is both self hostable yet also easily accessible to the average user. Because of this, a lot of the commands are quite simple and self explanitory, but can also be powerful.

## Features

- Search & playback of SoundCloud tracks, albums & playlists.
- Full support for (currently) 2 languages.
- Caching of song data using either JSON or Redis.
- (WIP) Youtube & Spotify playback.
- (WIP) Search for lyrics.

## Commands

For a more complete list go to [commands.config.ts](src/config/commands.config.ts)

- help: Get information about a command or show a general list of commands.
- disconnect: Disconnect the bot from the voice channel.
- join: Make the bot join your voice channel.
- stop: Stop the music.
- pause: Pause the music.
- resume: Resume the music.
- skip: Skip through the queue.
- search: Search for a song
- ping: Ping the bot to check the latency
- playskip: Play a song ignoring the queue.
- play: Play a song in your current voice channel.
- volume: Set the bots volume.

## Configuration

Even though Tempo is a simple bot, it does have a lot of customizable features. To customize & configure the bot, simply create environment variables with the desired values. This can be done using a `.env` file in development and using `docker-compose` or `docker run` in production.

- `BOT_TOKEN`: A required token which is used to authorize with Discord.
- `DISCORD_API_VERSION`: Not required nor recommended, but a optional variable which can be used to change the api version if that is for any reason required. Default: `9`
- `BOT_COLOR`: Not required, can be set to change color of the bots embeds. Default: `BLURPLE`. Uses the ColorResolvable type from Discord.js. Down below is a list of valid colors:
  - 'DEFAULT'
  - 'WHITE'
  - 'AQUA'
  - 'GREEN'
  - 'BLUE'
  - 'YELLOW'
  - 'PURPLE'
  - 'LUMINOUS_VIVID_PINK'
  - 'FUCHSIA'
  - 'GOLD'
  - 'ORANGE'
  - 'RED'
  - 'GREY'
  - 'DARKER_GREY'
  - 'NAVY'
  - 'DARK_AQUA'
  - 'DARK_GREEN'
  - 'DARK_BLUE'
  - 'DARK_PURPLE'
  - 'DARK_VIVID_PINK'
  - 'DARK_GOLD'
  - 'DARK_ORANGE'
  - 'DARK_RED'
  - 'DARK_GREY'
  - 'LIGHT_GREY'
  - 'DARK_NAVY'
  - 'BLURPLE'
  - 'GREYPLE'
  - 'DARK_BUT_NOT_BLACK'
  - 'NOT_QUITE_BLACK'
  - 'RANDOM'
- `CACHE_LOCATION`: Not required, specifies the location of the cache <ins>directory</ins>, which can be useful in a Docker environment. Default: `{APP_DIR}/.cache`
- `CACHE_TIMEOUT`: Not required, specifies the amount of time request data will be cached for in <ins>milliseconds</ins>. Default: `50000`
- `REDIS_URL`: Not required, specifies the url to connect with the Redis database.
- `REDIS_PASSWORD`: Not required, used in combination with `REDIS_URL` to specify the password for the user.
- `REDIS_USER`: Not required, used in combination with `REDIS_URL` to specify the user.
- `SOUNDCLOUD_TOKEN`: Required token to authorize with Soundcloud. For more information on how to acquire this token, please refer to [this](https://stackoverflow.com/a/43962626/14346660) link.
- `PING_ADDRESS`: Not required, specifies the address to ping for the network check. Default: `ping.archlinux.org`.
- `LANGUAGE`: Not required, specifies the language the bot should use. Default: `EN`. Supported languages:
  - 'EN'
  - 'NL'

## Building

Because Tempo is a Typescript based project, it is recommended to use Yarn as the primary Node development tool.

### Requirements:
When building locally:
- Node v16+
- Yarn
- Git

When building for Docker:
- Docker
- Git

To get started, clone the repo:
```
git clone https://github.com/Guusvanmeerveld/Tempo tempo
cd tempo
```

Now, you have the choice to either build for Docker or build locally.

### Local

First, install the dependencies:

```
yarn install
```

Then, use the build command to create a `dist` output.

```
yarn build
```

The finished `index.js` can be found in the output folder. To start the bot run `yarn start`.

### Docker

To create a local Docker image, either build it using `docker build` or `docker-compose`:

```
docker build . -t guusvanmeerveld/tempo
docker run -d guusvanmeerveld/tempo --name tempo
```

OR

```
docker-compose up -d
```

## Development

Development is very similair to building locally, as it has the same requirements. First, start off by git cloning the repo (as seen in the [building](#building) section). Then, install the dependencies using `yarn install`. Finally, to run the bot in development mode, run `yarn dev`. To easily add enviroment variables, create a `.env` file containing your variables.