const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"])

const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const http = require('http')
const { Server } = require('socket.io')

const upload = require('./config/multer')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

const PORT = process.env.PORT ? process.env.PORT : "3000"

const authCtrl = require('./controllers/auth')
const usersCtrl = require('./controllers/users')
const setsCtrl = require('./controllers/set')
const buildsCtrl =require('./controllers/builds')
const listingsCtrl = require('./controllers/listings')
const commentsCtrl = require('./controllers/comments')
const messagesCtrl = require('./controllers/messages')
const queueCtrl = require('./controllers/queue')
const buildMatchCtrl = require('./controllers/buildMatch')

const verifyToken = require('./middleware/verify-token')
const Message = require('./models/message')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}. 🥭`)
})

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes go here
// app.get('/auth/sign-token', authCtrl.signToken)
// app.get('/auth/verify-token', authCtrl.verifyToken)
app.post('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-in', authCtrl.signIn)


//user routes
app.get('/users', verifyToken, usersCtrl.index)
app.get('/users/:userId', verifyToken, usersCtrl.show)
app.put('/users/:userId',verifyToken,upload.single('avatar'),usersCtrl.update)
app.put('/users/:userId/follow', verifyToken, usersCtrl.followToggle)

app.get('/sets' , setsCtrl.index)
app.get('/sets/search', setsCtrl.search)
app.get('/sets/:setId', setsCtrl.show)

//builds routes
app.post('/builds' , verifyToken, upload.single('image'),buildsCtrl.create)
app.get('/builds' , verifyToken, buildsCtrl.index)
app.get('/builds/:buildId', verifyToken, buildsCtrl.show)
app.put('/builds/:buildId', verifyToken, upload.single('image'), buildsCtrl.update)
app.delete('/builds/:buildId', verifyToken, buildsCtrl.deleteBuild)
app.put('/builds/:buildId/like', verifyToken, buildsCtrl.likeToggle)
app.get('/themes' ,verifyToken, setsCtrl.themes)


app.post('/builds/:buildId/comments', verifyToken, commentsCtrl.create)
app.delete('/comments/:commentId', verifyToken, commentsCtrl.deleteComment)
app.get('/listings', verifyToken, listingsCtrl.index)
app.get('/listings/:listingId', verifyToken, listingsCtrl.show)
app.post('/listings', verifyToken, upload.array('photos'), listingsCtrl.create)
app.put('/listings/:listingId', verifyToken, upload.array('photos'), listingsCtrl.update)
app.delete('/listings/:listingId', verifyToken, listingsCtrl.deleteListing)

//message routes
app.get('/messages/:roomId', verifyToken, messagesCtrl.index)
app.get('/messages', verifyToken, messagesCtrl.conversations)
//queue routes
app.post('/queue', verifyToken, queueCtrl.create)
app.delete('/queue/:queueId', verifyToken, queueCtrl.deleteQueue)
app.get('/queue/:queueId/status', verifyToken, queueCtrl.status)

//buildmatch routes
app.get('/matches/:matchId', verifyToken, buildMatchCtrl.show)
app.put('/matches/:matchId', verifyToken, buildMatchCtrl.update)

io.on('connection', (socket) => {
  console.log('Socket connected: ', socket.id)

  app.set('io', io)

socket.on('join room', (roomId) => {
    socket.join(roomId)
    console.log(`Socket ${socket.id} joined room ${roomId}`)
  })

  socket.on('leave room', (roomId) => {
    socket.leave(roomId)
  })

socket.on('chat message', async (messageData) => {
    console.log('Chat event received:', messageData)

    const saved = await Message.create({
      roomId: messageData.roomId,
      sender: messageData.sender,
      username: messageData.username,
      text: messageData.text,
    })

    console.log('Chat event broadcast:', saved)

    io.to(messageData.roomId).emit('chat message', saved)
  })


  
  socket.on('disconnect', () => {
    console.log('Socket disconnected: ', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}! 😀`)
})
