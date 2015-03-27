"use strict";

var Client = require("./client")

function Room(id) {
  var path = "rooms"
}

Room.create = function(client, room, callback){
  client.makeRequest("post", "createRoom", room, callback)
}



module.exports = Room;