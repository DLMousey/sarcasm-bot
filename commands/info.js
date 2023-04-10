import {EmbedBuilder} from "discord.js";
import {activityLog} from "../utils/activityLog.js";

export async function info(message, args) {
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('sArCaSm BoT')
        .setURL('https://github.com/dlmousey/sarcasm-bot')
        .setAuthor({
            name: 'DLMousey',
            iconURL: 'https://cdn.discordapp.com/avatars/204254057202712576/a_2715ac797b51b43c7d9ddd6b3b5907b3.png?size=2048',
            url: 'https://github.com/dlmousey/sarcasm-bot'
        })
        .setThumbnail('https://i.kym-cdn.com/entries/icons/original/000/022/940/mockingspongebobbb.jpg')
        .setTimestamp()
        .setFooter({
            text: 'Now available in docker flavour, see repo',
            iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
        })

    message.delete()
    message.channel.send({ embeds: [embed] }).then(output => activityLog(message.author.id, message.content, output.id))
}
