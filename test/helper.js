var Client = require("../").Client;
var nock = require("nock");
module.exports = {
  createClient: function(access_token, user_id){
    var client = new Client({"host":"http://localhost:8448"})
    client.access_token = access_token || null;
    client.user_id = user_id || null;
    return client;
  },

  nock: function(){
    return nock("http://localhost:8448");
  }
};
