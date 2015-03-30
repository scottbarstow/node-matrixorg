"use strict";

var Client = require("./client")
var PRESENCE_PATH = "presence";

function Presence(userId) {
  this.userId = userId;
}

Presence.updateStatus = function(client, options, callback){
  //TODO: do some parameter checking
  client.makeRequest("put", PRESENCE_PATH + "/" + client.user_id + "/status", options, callback);
}

module.exports = Presence;
