const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let users = [];
const port = 3000;


// static route 
app.use(express.static(__dirname + '/public'));

// init views 
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');


// socket.io connection setup 
io.sockets.on('connection', (socket)=>{
    // set username
    socket.on('set user', (newUser, callback) => {
        if(users.indexOf(newUser)!=-1){
            callback(false);
        }
        else{
            callback(true);
            socket.username = newUser;
            users.push(socket.username);
            console.log('connection  : user : ' , socket.username , 'jioned ... ');    
            updateUsers();
        }
    });

    socket.on('disconnect', function (data) {
        
        if(!socket.username) return;
        console.log('disconnection : user : ' , socket.username , 'left ... ');
        users.splice(users.indexOf(socket.username));
        updateUsers();
    });


    socket.on('send msg', (message) =>{
        console.log(message);
        io.sockets.emit('show msg', {msg: message, user: socket.username});
    });

    function updateUsers() {
        io.sockets.emit('users', users);
    }

});


app.get('/', (req, res,next) => {
    res.render('index');
});


server.listen(port,()=>{
console.log('sever started on port ', port);
});