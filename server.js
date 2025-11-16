const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Dynamic PORT for Render/Heroku/etc
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io setup
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // When new user joins
    socket.on("new-user-joined", (name) => {
        console.log("User joined:", name);
        socket.broadcast.emit("user-joined", name);
    });

    // When a message is sent
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });
});

// Start server
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
