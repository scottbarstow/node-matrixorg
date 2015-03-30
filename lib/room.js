"use strict";

var Client = require("./client")
var ROOMS_PATH = "rooms";

function Room(id) {
  this.room_id = id;
}

Room.create = function(client, room, callback){
  client.makeRequest("post", "createRoom", room, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.__proto__ = Room.prototype;
    callback(null, item)
  })
}

Room.prototype.leave = function(callback){
  this.client.makeRequest("post", ROOMS_PATH + "/" + this.room_id + "/leave", callback);
}

Room.prototype.invite = function(options, callback){
  this.client.makeRequest("post", ROOMS_PATH + "/" + this.room_id + "/invite", options, callback);
}

Room.prototype.join = function(callback){
  this.client.makeRequest("post", ROOMS_PATH + "/" + this.room_id + "/join", {}, callback)
}

Room.prototype.ban = function(options, callback){
  if(!options || !options.user_id){
    return callback(new Error("You must pass valid parameters"));
  }
  this.client.makeRequest("post", ROOMS_PATH + "/" + this.room_id + "/ban", options, callback)
}

module.exports = Room;