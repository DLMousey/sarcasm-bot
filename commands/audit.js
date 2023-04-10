import {activityLog} from "../utils/activityLog.js";
import {openDb} from "../utils/openDb.js";
import {EmbedBuilder} from "discord.js";

export async function audit(message, args) {
    const db = await openDb()

    const row = await db.get('SELECT * FROM activity WHERE output_message_id = ?', [args.join(' ')])
    const channel = await message.channel.fetch()
    message.delete()

    if (row === undefined) {
        message.channel.send(`${message.author} invalid message id provided`)
        return
    }

    const rowCount = await db.get('SELECT COUNT(*) AS c FROM activity WHERE author_id = ?', [row.author_id])
    const op = await channel.members.find(m => m.id == row.author_id)
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Audit Result')
        .setTimestamp()
        .addFields(
            { name: 'Original author', value: op.user.username },
            { name: 'Original input', value: row.args },
            { name: 'User invocations', value: rowCount.c.toString(10) }
        )
        .setThumbnail(`https://cdn.discordapp.com/avatars/${op.user.id}/${op.user.avatar}.png?size=2048`)
        .setFooter({
            text: 'See who invoked a sarcasm bot command with !audit <message_id>',
        })

    message.channel.send({ embeds: [embed] })
}
