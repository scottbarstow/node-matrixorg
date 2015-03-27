var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Room = lib.Room;

describe("Room", function(){
  before(function(){
    nock.disableNetConnect();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("#create", function() {
    var roomResponse = {
      "room_alias":"test_room",
      "room_id": "test_room_id"
    }

    it("Should create room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/createRoom?access_token=access_token").reply(200, roomResponse);
      var client = helper.createClient("access_token");
      Room.create(client, {"room_alias":"test_room"}, function(err,room){
        if(err){
          return done(err);
        }else {
          room.room_id.should.eql(roomResponse.room_id);
          done();
        }
      })
    })
  });
})