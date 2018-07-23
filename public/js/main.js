$(document).ready(function () {
    let messages = [];
    let socket = io.connect('http://127.0.0.1:3000');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let userForm = $('#userForm');
    let username = $('#username');
    let users = $('#users');
    let error = $('#error');
// add user form submit handler
    userForm.on('submit', function(e) {

        socket.emit('set user', username.val(), function (data) {
           if(data){
               $('#userFormWrap').hide();
               $('#mainWrap').show();
           } 
           else{
               error.html('username is taken');
           }
        });
        e.preventDefault();
    });


// submit chat message 
    chatForm.on('submit', function(e){
        socket.emit('send msg', message.val());
        e.preventDefault();
    })

    // show message
    socket.on('show msg', function(data){
        var d = new Date();
        var tstamp = d.toLocaleTimeString()

        if(username.val() == data.user)
            chatWindow.append( '<div class="chatdarker chatcontainer"><img src="https://www.gravatar.com/avatar/'+ data.user +'?s=32&d=identicon" alt="Avatar"><p>' +  data.msg + '</p>  <span class="time-right"> '+ tstamp +'</span> </div>');
        else
            chatWindow.append( '<div class="chatcontainer"><img  class="right" src="https://www.gravatar.com/avatar/'+ data.user +'?s=32&d=identicon" alt="Avatar"><p>' +  data.msg + '</p>  <span class="time-left"> '+ tstamp +'</span> </div>');
    });

    socket.on('users', function (data) {
       let userList = '';
       for (let i = 0; i < data.length; i++) {
        userList += '<li class="list-group-item">' + data[i] + '</li>';
       } 
       users.html(userList);
    });
});