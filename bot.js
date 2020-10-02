const Discord = require("discord.js");
const auth = require("./auth.json");
const botConfig = require("./bot.config.json");
const client = new Discord.Client();

client.on("ready", () => console.log("Signed in, Ready to rock and roll"));

client.on("message", (message) => {
  if (!message.content.startsWith(botConfig.prefix) || message.author.bot)
    return;

  const args = message.content
    .slice(botConfig.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command !== "mock") return;

  message.channel.fetchMessages().then((messages) => {
    // The targeted user which is about to fucking flamed
    let targetUserId;
    if (args[0]) targetUserId = args[0].replace(/[^0-9]/g, "");
    else targetUserId = message.author.id;

    // The filtered message which doesn't include the person about to be flamed
    const filteredMessages = messages.filter(
      (m) => m.author.id == targetUserId
    );

    // Get the message you are about to mock which is by the flamed user
    const lastMessage = filteredMessages.first();
    const newMessageParts = [];
    for (let i = 0; i < lastMessage.content.length; i++) {
      if (lastMessage.content[i] == " ") {
        newMessageParts.push(" ");
        continue;
      }

      if (i % 2 == 0) {
        newMessageParts.push(lastMessage.content[i].toUpperCase());
      } else {
        newMessageParts.push(lastMessage.content[i].toLowerCase());
      }
    }

    message.channel.send(lastMessage.author + " " + newMessageParts.join(""));
  });
});

client.login(auth.token);
