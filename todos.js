const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./database')
const router = express.Router()
require('dotenv').config()

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.status(403).send({message: 'No token provided'})

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res.status(500).send({message: 'Failed to authenticate token'})
    req.userId = decoded.id
    next()
  })
}

// Create a new to-do
router.post('/todos', verifyToken, (req, res) => {
  const {description, status} = req.body

  const stmt = db.prepare(
    'INSERT INTO todos (user_id, description, status) VALUES (?, ?, ?)',
  )
  stmt.run(req.userId, description, status, err => {
    if (err) {
      return res.status(500).send({message: 'Failed to create to-do'})
    }
    res.status(200).send({message: 'To-do created successfully'})
  })
  stmt.finalize()
})

// Get all to-dos for the logged-in user
router.get('/todos', verifyToken, (req, res) => {
  db.all('SELECT * FROM todos WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) {
      return res.status(500).send({message: 'Failed to retrieve to-dos'})
    }
    res.status(200).send(rows)
  })
})

// Update a to-do
router.put('/todos/:id', verifyToken, (req, res) => {
  const {description, status} = req.body
  const {id} = req.params

  const stmt = db.prepare(
    'UPDATE todos SET description = ?, status = ? WHERE id = ? AND user_id = ?',
  )
  stmt.run(description, status, id, req.userId, err => {
    if (err) {
      return res.status(500).send({message: 'Failed to update to-do'})
    }
    res.status(200).send({message: 'To-do updated successfully'})
  })
  stmt.finalize()
})

// Delete a to-do
router.delete('/todos/:id', verifyToken, (req, res) => {
  const {id} = req.params

  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
  stmt.run(id, req.userId, err => {
    if (err) {
      return res.status(500).send({message: 'Failed to delete to-do'})
    }
    res.status(200).send({message: 'To-do deleted successfully'})
  })
  stmt.finalize()
})

module.exports = router
