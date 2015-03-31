"use strict";

var Client = require("./client")
var PRESENCE_PATH = "presence";

function Presence(userId) {
  this.userId = userId;
}

Presence.updateStatus = function(client, options, callback){
  //TODO: do some parameter checking
}

module.exports = Presence;
