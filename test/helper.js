var Client = require("../").Client;
var nock = require("nock");
module.exports = {
  createClient: function(){
    return new Client({"host":"http://localhost:8448"});
  },

  nock: function(){
    return nock("http://localhost:8448");
  }
};
