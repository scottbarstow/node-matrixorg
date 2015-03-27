"use strict";

var matrix = require("..")


var client = new matrix.Client({"host":"http://localhost:8008"});

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// client.register({"user":"test", "password":"password", "type":"m.login.password"}, function(err, res){
//   if(err){
//     console.log(err)
//   }else {
//     console.log(res.access_token);


//   }
// })


//Create a room
client.login({"type":"m.login.password", "user":"test","password":"password"}, function(err, res){
  if(err){
    console.log(err)
  }else {
    matrix.Room.create(client, {"room_alias":"test_room"}, function(err, room){
      console.log(JSON.stringify(room))
    })
  }
})

