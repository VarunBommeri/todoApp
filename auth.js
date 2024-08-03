const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./database')
const router = express.Router()
require('dotenv').config()

// Registration endpoint
router.post('/register', (req, res) => {
  const {username, password} = req.body
  const hashedPassword = bcrypt.hashSync(password, 8)

  const stmt = db.prepare(
    'INSERT INTO users (username, password) VALUES (?, ?)',
  )
  stmt.run(username, hashedPassword, err => {
    if (err) {
      return res.status(500).send({message: 'User registration failed'})
    }
    res.status(200).send({message: 'User registered successfully'})
  })
  stmt.finalize()
})

// Login endpoint
router.post('/login', (req, res) => {
  const {username, password} = req.body

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({message: 'Invalid credentials'})
    }

    const token = jwt.sign({id: user.id}, process.env.SECRET, {
      expiresIn: 86400,
    }) // 24 hours
    res.status(200).send({auth: true, token})
  })
})

module.exports = router
