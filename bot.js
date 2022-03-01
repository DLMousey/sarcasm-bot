const Discord = require('discord.js')
const auth = (process.env.BOT_TOKEN) ? { token: process.env.BOT_TOKEN } : require('./auth.json')
const botConfig = (process.env.BOT_PREFIX) ? { prefix: process.env.BOT_PREFIX } : require('./bot.config.json')
const client = new Discord.Client()

const useMap = {}

console.log((process.env.BOT_TOKEN) ? 'Auth token from environment' : 'Auth token from auth.json')
console.log((process.env.BOT_PREFIX) ? 'Bot config from environment' : 'Bot config from bot.config.json')

client.on('ready', () => console.log('Signed in, Ready to rock and roll'))

client.on('message', (message) => {
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
    case 'mocksingle':
    case 'mockSingle':
    case 'mockone':
      mockSingle(message, args)
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
    case 'help':
      help(message)
      break
    case 'imagine':
      break
    default:
      message.channel.send('Invalid command provided - run `!help` for a list')
  }
})

function alternateCase(text) {
  return text.split('').map((char, idx) =>
    idx & 1 ? char.toLowerCase() : char.toUpperCase()
  ).join('')
}

function mockSingle(message, args) {
  message.channel.fetchMessage(args[0])
    .then(message => {
      message.channel.send(alternateCase(message.content))
    })
}

function mockInline(message, args) {
  message.channel.send(alternateCase(args.join(' ')))
}

function mock(message, args) {
  let authorId

  try {
    authorId = getUserId(args)
  } catch {
    // user id not detected, assume it's supposed to be an inline mockery - delete
    // original message and mock the content
    message.delete()
    mockInline(message, args)
    return
  }

  message.channel.fetchMessages()
    .then(messages => {
      const filteredMessages = messages.filter(m => m.author.id === authorId)

      const lastMessage = filteredMessages.first()
      if (!lastMessage) {
        message.channel.send(`${message.author} No user id, or invalid user id provided`)
        return
      }

      message.channel.send(lastMessage.author + ' ' + alternateCase(lastMessage.content))
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
      if (!lastMessage) {
        message.channel.send(`${message.author} No user id, or invalid user id provided`)
        return
      }

      message.channel.send(lastMessage.author + ' ' + alternateCase(lastMessage.content))
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

function help(message) {
  message.channel.send({
    embed: {
      color: 0x0099ff,
      title: 'nEeD sOmE hElP?',
      description: 'Available commands - All `@`s _must_ be mentions.',
      fields: [
        {
          name: 'Mock command',
          value: '`!mock @user`',
          inline: true
        },
        {
          name: 'Mock single message',
          value: '!mockSingle <messageId> || !mocksingle <messageId> || !mockOne <messageId>',
          inline: true
        },
        {
          name: 'Clap command',
          value: '`!clap @user`'
        },
        {
          name: 'B command',
          value: '`!b @user`'
        },
        {
          name: 'Info command',
          value: '`!info`'
        },
        {
          name: 'Help command',
          value: '`!help`'
        }
      ]
    }
  })
}

const getUserId = (args) => {
  let userId = null

  if (args.length === 1) {
    userId = args[0].replace(/[^0-9]/g, '')
  }

  if (userId.length !== 18) {
    throw new Error('No user id, or invalid user id provided')
  }

  return userId
}

client.login(auth.token)
