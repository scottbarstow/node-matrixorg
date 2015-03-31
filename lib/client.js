"use strict"

var superagent = require('superagent');

function Client(options) {
  if(!(this instanceof Client)){
    return new Client(options);
  }

  if(typeof options !== "object"){
    throw "Invalid options argument.  You must specify a host"
  }

  this.host = options.host;
  this.version = options.version || "v1";
  this.access_token = null;
  this.user_id = null;

  this.prepareRequest = function(req){
    return req.accept("json");
  }

  this.prepareUrl = function(path){
    return options.host + "/_matrix/client/api/" + this.version + ((path[0] == "/")?path:("/" + path)) +
      (this.access_token ? "?access_token=" + encodeURIComponent(this.access_token):"");
  }
}

module.exports = Client;

Client.prototype = {

  //Authentication methods
  login: function(loginType, data, callback){
    data.type = loginType;
    return this.makeRequest("post", "/login", data, callback);
  },

  register: function(loginType, data, callback){
    data.type = loginType;
    return this.makeRequest("post", "/register", data, callback)
  },

  setPresence: function(presence, msg, callback){
    var path = encodeUri("/presence/$userId/status", {
      $userId:this.user_id
    });

    var validStates = ["offline", "online", "unavailable"];
    if (validStates.indexOf(presence) == -1) {
        throw new Error("Bad presence value: "+ presence);
    }
    var content = {
        presence: presence, 
        status_msg: msg
    };
    return this.makeRequest("put", path, content, callback);
  },

  //Room methods
  joinRoom: function(roomIdOrAlias, callback){
    var path = encodeUri("/rooms/$roomId/join", {$roomId:roomIdOrAlias});
    return this.makeRequest("post", path, callback);
  },

  createRoom: function(data, callback){
    return this.makeRequest("post", "/createRoom", data, callback)
  },

  leaveRoom: function(roomId, callback){
    var path = encodeUri("/rooms/$roomId/leave", {$roomId:roomId});
    return this.makeRequest("post", path, callback)
  },

  inviteToRoom: function(roomId, userId, callback){
    var path = encodeUri("/rooms/$roomId/invite", {$roomId:roomId});
    var data = {
      user_id: userId
    }
    return this.makeRequest("post", path, data, callback);

  },

  banFromRoom: function(roomId, userId, reason, callback){
    var path = encodeUri("/rooms/$roomId/ban", {$roomId:roomId})
    var data = {
      user_id:userId,
      reason:reason
    }
    return this.makeRequest("post", path, data, callback);
  },


  // Internals 
  makeRequest: function(method, path){
    var callback = arguments[arguments.length -1];
    var request = this.createRequest(method, path);
    if(arguments.length > 3){
      var data = arguments[2];
     if(method === "get"){
        request.query(data);
     }
     else{
        request.type("json").send(data);
     }
    }
    var self = this;
    request.buffer().end(function(res){
      self.checkResponse(res, callback);
    });   
  },

  createRequest: function(method, path){
    return this.prepareRequest(superagent[method](this.prepareUrl(path)));
  },

  checkResponse: function(res, callback){
    if(res.ok){
      return callback(null, processResponse(res.body));
    }
    if(res.body){
      var message = res.body.message || res.body.code;
      if(message){
        return callback(new Error(message));
      }
    }
    return callback(new Error("Http code " + res.status, res.status));
  }
}


var encodeUri = function(pathTemplate, variables) {
    for (var key in variables) {
        if (!variables.hasOwnProperty(key)) { continue; }
        pathTemplate = pathTemplate.replace(
            key, encodeURIComponent(variables[key])
        );
    }
    return pathTemplate;
};


var processResponse = function(obj){
  if(Array.isArray(obj)){
    var i, l = obj.length, list = new Array(l);
    for(i = 0; i < l; i ++){
      list[i] = processResponse(obj[i]);
    }
    return list;
  }
  else if(typeof obj === "object"){
    var k, res = {};
    for(k in obj){
      res[k] = processResponse(obj[k]);
    }
    return res;
  }
  else if(typeof obj === "string" && /^\d{4}\-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}(\.\d{3})?Z$/.test(obj)){
    return new Date(obj);
  }
  return obj;
}


