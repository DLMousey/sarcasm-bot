import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function openDb(checkSchema = false) {
    const db = await open({
        filename: '/tmp/sarcasm-bot.db',
        driver: sqlite3.Database
    })

    if (checkSchema) {
        await db.exec('CREATE TABLE IF NOT EXISTS activity (' +
            'id integer not null constraint activity_pk primary key autoincrement,' +
            'author_id TEXT not null,' +
            'args TEXT,' +
            'output_message_id TEXT)'
        );
    }

    return db;
}
