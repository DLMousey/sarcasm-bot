const Discord = require('discord.js')
const auth = (process.env.BOT_TOKEN) ? { token: process.env.BOT_TOKEN } : require('./auth.json')
const botConfig = (process.env.BOT_PREFIX) ? { prefix: process.env.BOT_PREFIX } : require('./bot.config.json')
const client = new Discord.Client()

if (process.env.BOT_TOKEN) {
    console.log("Using auth token from environment");
} else {
    console.log("Using auth token from auth.json");
}

if (process.env.BOT_PREFIX) {
    console.log("Using bot config from envirnoment");
} else {
    console.log("Using bot config from bot.config.json");
}

client.on('ready', () => console.log('Signed in, Ready to rock and roll'))

client.on('message', (message) => {
  if (!message.content.startsWith(botConfig.prefix) || message.author.bot) { return }

  const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  switch (command) {
    case 'mock':
      mock(message, args)
      break
    case 'clap':
      replacer(message, args, ' ', '👏', true)
      break
    case 'b':
      replacer(message, args, 'b', '🅱')
      break
    default:
  }
})

function mock(message, args) {
  message.channel.fetchMessages()
    .then(messages => {
      let filteredMessages
      try {
        filteredMessages = messages.filter(m => m.author.id === getUserId(args))
      } catch (err) {
        message.channel.send(`${message.author} ${err.message}`)
        return
      }

      const lastMessage = filteredMessages.first()
      const newMessageParts = []
      for (let i = 0; i < lastMessage.content.length; i++) {
        if (lastMessage.content[i] === ' ') {
          newMessageParts.push(' ')
          continue
        }

        if (i % 2 === 0) {
          newMessageParts.push(lastMessage.content[i].toUpperCase())
        } else {
          newMessageParts.push(lastMessage.content[i].toLowerCase())
        }
      }

      message.channel.send(lastMessage.author + ' ' + newMessageParts.join(''))
    })
}

function replacer(message, args, from, to, caps = false) {
  message.channel.fetchMessages()
    .then(messages => {
      let filteredMessages
      try {
        filteredMessages = messages.filter(m => m.author.id === getUserId(args))
      } catch (err) {
        message.channel.send(`${message.author} ${err.message}`)
        return
      }

      const lastMessage = filteredMessages.first()
      const newMessageParts = []
      for (let i = 0; i < lastMessage.content.length; i++) {
        if (lastMessage.content[i].toLowerCase() === from) {
          newMessageParts.push(to)
          continue
        }

        newMessageParts.push(caps ? lastMessage.content[i].toUpperCase() : lastMessage.content[i])
      }

      message.channel.send(lastMessage.author + ' ' + newMessageParts.join(''))
    })
}

const getUserId = (args) => {
  let userId = null
  if (args.length) {
    userId = args[0].replace(/[^0-9]/g, '')
  }

  if (!userId) {
    throw new Error('No user id, or invalid user id provided')
  }

  return userId
}

client.login(auth.token)
