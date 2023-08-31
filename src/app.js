const path = require('path')
//Http server connection
const http = require('http')
const express = require('express');

//import socket.io
const socketio = require('socket.io');

//importing message.js file
const {generateMessage, generateLocation} = require('../src/utils/message')

//import bsd word for words filtering
const Filter = require('bad-words');

//Define paths
const publicFolderPath = path.join(__dirname, '../public')
const PORT = process.env.PORT || 3000;

//App server set up
const app = express();
const server = http.createServer(app)
const io = socketio(server);


app.use(express.static(publicFolderPath));

let welcomeMessage = 'Welcome Online'

//Setting connection using socket.io
io.on('connection', (socket) => {
        
    console.log('New Connection')

    socket.on('join', ({username, room}) => {
        socket.join(room)

        // Chat task: Asking the server to emit message when a user joins
        socket.emit('message', generateMessage(welcomeMessage))
        
        //for notifying old users that a new user has joined
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has join`))

    })

    //for sending messages and acknowledging event 
    socket.on('user message', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('No Profane word acceptable')
        }

        io.emit('message', generateMessage(message)); //This emit a message to all connections on the server
        callback()
    })

    //to notify users that a user has left
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })

   //Listening for location data
    socket.on('location', (location, callback) => {

        const url = `https://google.com/maps?q=${location.lat},${location.long}`
        const text = 'My location'

        io.emit('locationMessage', generateLocation(url, text))
        callback('Location Shared!') //This sends a message to the clients as an additional response to their request
    })
})



server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})


module.exports = {app}