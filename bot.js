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

function mock (message, args) {
  message.channel.fetchMessages()
    .then(messages => {
      const targetUserId = args[0].replace(/[^0-9]/g, '')
      const filteredMessages = messages.filter(m => m.author.id === targetUserId)

      const lastMessage = filteredMessages.first()
      const newMessageParts = []
      for (let i = 0; i < lastMessage.content.length; i++) {
        if (lastMessage.content[i] === ' ') {
          newMessageParts.push(' ')
          continue
        }

        message.channel.send(lastMessage.author + ' ' + newMessageParts.join(''))
      }
    })
}

function clap (message, args) {
  message.channel.fetchMessages()
    .then(messages => {
      const targetUserId = args[0].replace(/[^0-9]/g, '')
      const filteredMessages = messages.filter(m => m.author.id === targetUserId)

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

client.login(auth.token)
