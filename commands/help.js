import {EmbedBuilder} from "discord.js";
import {activityLog} from "../utils/activityLog.js";

export async function help(message, args) {
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('nEeD sOmE hElP?')
        .setURL('https://github.com/dlmousey/sarcasm-bot')
        .setDescription('Available commands for sarcasm bot')
        .setThumbnail('https://i.kym-cdn.com/entries/icons/original/000/022/940/mockingspongebobbb.jpg')
        .setTimestamp()
        .addFields(
            { name: 'Mock (by user)', value: `${process.env.BOT_PREFIX}mock @user` },
            { name: 'Mock (by message id)', value: `${process.env.BOT_PREFIX}mockid 1234567890` },
            { name: 'Mock (inline)', value: `${process.env.BOT_PREFIX}mock some text that will be mocked inline here` },
            { name: 'Display information about the bot', value: `${process.env.BOT_PREFIX}info` },
            { name: 'Display this help prompt', alue: `${process.env.BOT_PREFIX}help`}
        )
        .setFooter({
            text: 'Sarcasm bot is open source',
            iconURL: 'https://github.com/dlmousey/sarcasm-bot'
        })

    message.delete()
    message.channel.send({ embeds: [embed] }).then(output => activityLog(message.author.id, message.content, output.id))
}
