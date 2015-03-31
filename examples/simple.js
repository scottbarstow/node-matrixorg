"use strict";

var Promise = require("bluebird");
var matrix = Promise.promisifyAll(require(".."));

var client = new matrix.Client({"host":"http://localhost:8008"});
var Room = matrix.Room;
var Presence = matrix.Presence;

//Create a room
client.login({"type":"m.login.password", "user":"test","password":"password"}, function(err, res){
  // Room.create(client, {"room_alias_name":"a test room 6"}, function(err, room){
  //   if(!err){
  //     room.join(function(e,r){
  //       if(!e)
  //         console.log("Joined room!");
  //     })
  //   }
  // })


  var presenceUpdate = {
    "presence":"online",
    "status_msg": "I'm online baby!"
  };

  Presence.updateStatus(client, presenceUpdate, function(err, res){
    if(err){
      console.log("Could not update status" + err.message)
    }else{
      console.log("updated status");
    }
  })
});

