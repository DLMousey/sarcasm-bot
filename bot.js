const Discord = require('discord.js')
const auth = (process.env.BOT_TOKEN) ? { token: process.env.BOT_TOKEN } : require('./auth.json')
const botConfig = (process.env.BOT_PREFIX) ? { prefix: process.env.BOT_PREFIX } : require('./bot.config.json')
const client = new Discord.Client()

console.log((process.env.BOT_TOKEN) ? 'Auth token from environment' : 'Auth token from auth.json')
console.log((process.env.BOT_PREFIX) ? 'Bot config from environment' : 'Bot config from bot.config.json')

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
    case 'info':
      info(message)
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

function info(message) {
  message.channel.send({
    embed: {
      color: 0x0099ff,
      title: 'sArCaSm BoT',
      url: 'https://github.com/dlmousey/sarcasm-bot',
      author: {
        name: 'DLMousey',
        icon_url: 'https://cdn.discordapp.com/avatars/204254057202712576/5ed81c678acd658317bf31ab013e28de.webp?size=128',
        url: 'https://github.com/dlmousey/sarcasm-bot'
      },
      description: 'An idea born of alcohol and lack of impulse control. \r\n May contain nuts.',
      thumbnail: {
        url: 'https://i.kym-cdn.com/entries/icons/original/000/022/940/mockingspongebobbb.jpg'
      },
      timestamp: new Date(),
      footer: {
        text: 'Now available in docker flavour, see repo',
        icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        url: 'https://github.com/DLMousey/sarcasm-bot/compare'
      }
    }
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
