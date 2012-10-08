var io = require('socket.io').listen(8000);
var users =[];
// open the socket connection
io.sockets.on('connection', function (socket) {
   
   // listen for the chat even. and will recieve
   // data from the sender.
   socket.on('chat', function (data) {
   
      // default value of the name of the sender.
      var sender = 'unregistered';
      
      // get the name of the sender
      socket.get('nickname', function (err, name) {
         console.log('Chat message by ', name);
         console.log('error ', err);
         if(name!="")sender = name;
      });   

      // broadcast data recieved from the sender
      // to others who are connected, but not 
      // from the original sender.
      socket.broadcast.emit('chat', {
         msg : data, 
         msgr : sender
      });
   });
   
   // listen for user registrations
   // then set the socket nickname to 
   socket.on('register', function (name) {
	 socket.broadcast.emit('online_user', {
         msgr : name
      });
	   /* users.push(name);
	  for(var i=0; i<users.length; i++)
	  {
      socket.broadcast.emit('online_user', {
         msgr : users[i]
      });
	  }*/
      // make a nickname paramater for this socket
      // and then set its value to the name recieved
      // from the register even above. and then run
      // the function that follows inside it.
      socket.set('nickname', name, function () {
      
         // this kind of emit will send to all! :D
         io.sockets.emit('chat', {
            msg : "Hi " + name + ' !, Welcome to the chat world.', 
            msgr : "Mr. Server"
         });
      });
   });

});