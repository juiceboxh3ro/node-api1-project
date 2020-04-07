const express = require('express')
const server = express()
const port = 5000

let shortid = require('shortid')
// id: shortid.generate()

// middleware
server.use(express.json())

// ghetto database
let users = [
  {
    id: 0,
    name: "Jane Doe",
    bio: "Not Tarzan's Wife, another Jane"
  }
]

// endpoints
server.get('/', (req, res) => {
  res.json({API: "I'm awake..."})
})

server.get('/api/users', (req, res) => {
  if(users) {
    res.status(200).json(users)
  } else {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  }
})

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id
  const user = users.find(u => u.id == id)
  if(user) {
    res.status(200).json(user)
  } else {
    res.status(500).json({ errorMessage: "The user information could not be retrieved." })
  }
})

server.post('/api/users', (req, res) => {
  if(req.body.name && req.body.bio) {
    try {
      const newUser = req.body
      // newUser.id = shortid.generate()
      users.push(newUser)
      res.status(201).json(users)
    } catch (error) {
      console.error(error)
    }
  } else {  
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
  }
})

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id
  const userToDelete = users.find(u => u.id == id)
  if(userToDelete) {
    try {
      users = users.filter(i => i.id != userToDelete.id)
      res.status(201).json(users)
    } catch (error) {
      res.status(500).json({ errorMessage: "The user could not be removed" })
    }
  } else if (!userToDelete) {
    res.status(404).json({ message: "The user with the specified ID does not exist."})
  }
})

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id
  const userToUpdate = users.find(u => u.id == id)
  if(req.body.name && req.body.bio) {
    if(userToUpdate) {
      try {
        userToUpdate.name = req.body.name
        userToUpdate.bio = req.body.bio
        res.status(200).json(users)
      } catch (error) {
        res.status(500).json({ errorMessage: "The user information could not be modified."})
      }
    } else {
      res.status(404).json({ errorMessage: "The user with the specified ID does not exist."})
    }
  } else {
    res.status(400).json({ errorMessage: "Please provide new name and bio for the user."})
  }
})

server.listen(port, console.log(`\nListening on port ${port}\n`))