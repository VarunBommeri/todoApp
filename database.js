const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  // Create users table
  db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `)

  // Create todos table
  db.run(`
        CREATE TABLE todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            description TEXT,
            status TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `)
})

module.exports = db
