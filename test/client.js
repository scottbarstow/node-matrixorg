var Client = require("../").Client;
var nock = require("nock");
var helper = require("./helper");
var should = require("should")
describe("client tests", function(){
  before(function(){
    nock.disableNetConnect();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#constructor", function(){
    it("should create client instance", function(done){
      var opts = {host:"http://localhost:8448"}
      var client = new Client(opts);
      client.should.be.instanceof(Client);
      Client(opts).should.be.instanceof(Client);
      done();
    });
  });

  describe("#login", function() {
    var response = {
      "access_token": "atoken",
      "home_server": "localhost",
      "user_id":"@example:localhost"
    }

    it("should login successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/login").reply(200, response);
      helper.createClient().login({"username":"test", "password":"password"}, function(err, res){
        if(err){
          return done(err)
        }
        res.access_token.should.eql(response.access_token)
        done();
      })
    })
  })
});