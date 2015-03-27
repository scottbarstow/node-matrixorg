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

  this.prepareRequest = function(req){
    return req.accept("json");
  }

  this.prepareUrl = function(path){
    return options.host + "/_matrix/client/api/" + this.version + ((path[0] == "/")?path:("/" + path)) +
      (this.access_token ? "?access_token=" + this.access_token:"");
  }
}

Client.login = function(options, callback){

}


Client.prototype.login = function(options, callback){
  var self = this;
  this.makeRequest("post", "login", options, function(err, res){
    if(err){
      callback(err)
    }else {
      self.access_token = res.access_token;
      callback(null,res);
    }
  })
}

Client.prototype.register = function(options, callback) {
  this.makeRequest("post", "register", options, callback);
}

Client.prototype.createRequest = function(method, path){
  return this.prepareRequest(superagent[method](this.prepareUrl(path)));
}

Client.prototype.makeRequest = function(method, path){
 var callback = arguments[arguments.length - 1];
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
}

Client.prototype.checkResponse = function(res, callback){
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
};

function processResponse(obj){
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

module.exports = Client;

