import {openDb} from "./openDb.js";

export async function activityLog(authorId, args, outputMessageId) {
    const db = await openDb()
    // await db.exec(`INSERT INTO activity VALUES(NULL, ${authorId}, ${args}, ${outputMessageId})`)
    await db.run(
        'INSERT INTO activity (id, author_id, args, output_message_id) VALUES (NULL, ?, ?, ?)',
        [authorId, args, outputMessageId]
    )
}
