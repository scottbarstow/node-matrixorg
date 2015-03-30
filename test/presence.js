var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Presence = lib.Presence;

describe("Presence", function(){
  before(function(){
    nock.disableNetConnect();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("#update status", function() {
    var presence = {
      "presence":"online",
      "status_msg": "Test message"
    }

    it("Should update status successfully", function(done){
      helper.nock().put("/_matrix/client/api/v1/presence/@test:localhost/status?access_token=access_token").reply(200);
      var client = helper.createClient("access_token", "@test:localhost");
      Presence.updateStatus(client, presence, function(err,res){
        if(err){
          return done(err);
        }else {
          res.should.be.ok;
          done();
        }
      })
    })
  });
});