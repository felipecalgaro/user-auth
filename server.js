const express = require('express');
const app = express()
const bcrypt = require('bcrypt');

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = {
      name: req.body.name,
      password: hashedPassword
    }

    users.push(user)
    res.sendStatus(201)
  } catch (error) {
    res.sendStatus(500)
    console.log(error);
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user === undefined) res.status(404).send('User not found')

  try {
    await bcrypt.compare(req.body.password, user.password) ? res.send('Logged successfully') : res.send('Not allowed')
  } catch (error) {
    res.sendStatus(500)
    console.log(error);
  }
})

app.listen(3000)