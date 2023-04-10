import {getUserId} from "../utils/getUserId.js";
import {alternateCase} from "../utils/alternateCase.js"
import {activityLog} from "../utils/activityLog.js";

export async function mock(message, args) {
    let authorId

    try {
        authorId = getUserId(args)
    } catch {
        // User ID not detected, assume it's supposed to be an inline mock
        // Delete the original message and mock the content
        message.delete()
        message.channel.send(alternateCase(args.join(' '))).then(output => {
            activityLog(message.author.id, message.content, output.id)
        })
        return
    }

    const messages = await message.channel.awaitMessages().filter(m => m.author.id === authorId)
    if (!messages.first()) {
        message.channel.send(`${message.author} no user id, or invalid user id provided`)
        return
    }

    const lastMessage = messages.first();
    return message.channel.send(lastMessage.author + ' ' + alternateCase(lastMessage.content)).then(output =>
        activityLog(authorId, message.content, output.id)
    )
}
