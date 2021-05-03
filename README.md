# sarcasm-bot
For those times when adding a little sArCaSm is all that's needed to get the point across, but you can't be bothered with
all that pesky capitalisation. All it takes is a `!mock @user` command and the bot will grab the last text message the user
posted to the channel and it'll repost that message with a sprinkle of sarcasm.

![sarcasm-bot-in-action](https://puu.sh/CFB6z/25cec89b67.png)

# Dev setup

- Clone down the repo

- run `npm install`

- Follow jagrosh's super handy guide for [adding bots to your Discord server](https://github.com/jagrosh/MusicBot/wiki/Adding-Your-Bot-To-Your-Server)

- Make a copy `auth.json.example` and rename the copy to `auth.json`

- Add your auth key to the `auth.json` file you just created

- run `npm start`

# Production setup

Support has been added for running this via docker, strongly recommended for your sanity because nobody
wants to babysit a process running in PM2 anymore - let docker handle it. You could also throw it into k8s
this way if you're so inclined.

To run this via docker;
```
docker run -d -e BOT_TOKEN=YourAuthTokenHere -e BOT_PREFIX=! docker.pkg.github.com/dlmousey/sarcasm-bot/sarcasm-bot:latest
```

To run via docker-compose;
```yml
services:
  sarcasm:
    image: docker.pkg.github.com/dlmousey/sarcasm-bot/sarcasm-bot:latest
    environment:
      - BOT_TOKEN=YourAuthTokenHere
      - BOT_PREFIX=!
```

## Supported environment variables
The bot's behaviour can be tweaked by setting environment variables when you run the docker image

| Key | Description | Required | Default |
| --- | ----------- | -------- | ------- |
| BOT_TOKEN | Auth token used to authenticate the bot with discord | Yes | n/a |
| BOT_PREFIX | The character used to denote a command (eg. `!mock`) | Yes | `!` |
| BOT_RATELIMIT | The amount of time users must wait between commands | No | 3 |

If either required environment variable is missing the bot will fall back to attempting to load them from 
`auth.json` and `bot.config.json`, neither of which are included in the docker image so that will fail.
