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
      let filteredMessages
      try {
        filteredMessages = messages.filter(m => m.author.id === getUserId(args))
      } catch (err) {
        message.channel.send(`${message.author} ${err.message}`)
        return
      }

      const letters = filteredMessages.first().content.split('')
      const mocked = letters.reduce((sentence, word, i) => {
        i % 2 === 0 ? sentence + word : sentence + word.toUpperCase()
      })
      message.channel.send(filteredMessages.first().author + ' ' + mocked)
    })
}

function clap(message, args) {
  message
    .channel
    .fetchMessages()
    .then(messages => {
      let filteredMessages
      try {
        filteredMessages = messages.filter(m => m.author.id === getUserId(args))
      } catch (err) {
        message.channel.send(`${message.author} ${err.message}`)
        return
      }

      const words = filteredMessages.first().content.split(' ')
      const clapped = words.reduce((string, word) => string + ' 👏 ' + word)
      message.channel.send(filteredMessages.first().author + ' ' + `👏 ${clapped} 👏`)
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
