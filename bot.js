const Discord = require('discord.js')
const auth = require('./auth.json')
const botConfig = require('./bot.config.json')
const client = new Discord.Client()

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
      clap(message, args)
      break
    default:
  }
})

function mock(message, args) {
  message.channel.fetchMessages()
    .then(messages => {
      const filteredMessages = getUserId(args)
        .then((id) => messages.filter(m => m.author.id === id))
        .catch((e) => message.channel.send(`${message.author} ${e.message}`))

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

function clap(message, args) {
  message.channel.fetchMessages()
    .then(messages => {
      const filteredMessages = getUserId(args)
        .then((id) => messages.filter(m => m.author.id === id))
        .catch((e) => message.channel.send(`${message.author} ${e.message}`))

      const lastMessage = filteredMessages.first()
      const newMessageParts = []

      for (let i = 0; i < lastMessage.content.length; i++) {
        if (lastMessage.content[i] === ' ') {
          newMessageParts.push('👏')
          continue
        }

        newMessageParts.push(lastMessage.content[i].toUpperCase())
      }

      message.channel.send(lastMessage.author + ' ' + newMessageParts.join(''))
    })
}

const getUserId = (args) => {
  return new Promise((resolve, reject) => {
    if (args.length) {
      resolve(args[0].replace(/[^0-9]/g, ''))
    }

    reject(new Error('No user id, or invalid user id provided'))
  })
}

client.login(auth.token)
