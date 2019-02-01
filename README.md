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
Basically the same steps as dev setup minus running `npm start`.
I'd recommend running this bot with some form of npm process manager in production, i use [PM2](http://pm2.keymetrics.io/)
and it keeps everything ticking along nicely.
