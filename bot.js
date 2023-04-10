import {Client, EmbedBuilder, Events, GatewayIntentBits} from "discord.js"
import {openDb} from "./utils/openDb.js"
import {mock} from "./commands/mock.js"
import {info} from "./commands/info.js";
import {audit} from "./commands/audit.js";
import {help} from "./commands/help.js";
import {alternateCase} from "./utils/alternateCase.js";
import {activityLog} from "./utils/activityLog.js"

const auth = (process.env.BOT_TOKEN) ? { token: process.env.BOT_TOKEN } : require('./auth.json')
const botConfig = (process.env.BOT_PREFIX) ? { prefix: process.env.BOT_PREFIX } : require('./bot.config.json')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]})

const useMap = {}

console.log((process.env.BOT_TOKEN) ? 'Auth token from environment' : 'Auth token from auth.json')
console.log((process.env.BOT_PREFIX) ? 'Bot config from environment' : 'Bot config from bot.config.json')
console.log((process.env.BOT_PREFIX))

client.once(Events.ClientReady, c => {
  openDb(true).then()
  console.log(`sIgNeD iN tO dIsCoRd As ${c.user.tag}`)
} )

client.on(Events.MessageCreate, (message) => {
  if (!message.content.startsWith(botConfig.prefix) || message.author.bot) { return }

  const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (useMap[message.author.id]) {
    const lastUse = new Date(useMap[message.author.id])
    const now = (new Date()).getTime()

    const diffTime = Math.abs(lastUse.getTime() - now)
    const diffSeconds = Math.trunc(diffTime / 1000)

    const rateLimit = (process.env.BOT_RATELIMIT) ? process.env.BOT_RATELIMIT : 3
    if (diffSeconds <= rateLimit) {
      console.log(`[ABUSE DETECTION] ${message.author.username} - ${diffSeconds} seconds since last call`)
      return
    }
  }

  useMap[message.author.id] = Date.now()

  switch (command) {
    case 'mock':
      mock(message, args)
      break
    case 'mockid':
      message.channel.fetch().then(channel => {
        channel.messages.fetch(args[0]).then(targetMessage => {
          message.delete()
          channel.send(alternateCase(targetMessage.content)).then(output => {
            activityLog(message.author.id, message.content, output.id).catch(err => console.error(err))
          })
        })
      })
      break
    case 'info':
      info(message, args)
      break
    case 'help':
      help(message, args)
    case 'audit':
      audit(message, args)
      break
    default:
      message.channel.send('Invalid command provided - run `!help` for a list')
  }
})

client.login(auth.token)
