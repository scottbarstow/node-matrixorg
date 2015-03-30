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
          room.client.should.be.ok;
          done();
        }
      })
    })
  });
  describe("#leave", function() {
    it("should leave room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/leave?access_token=access_token").reply(200);
      var client = helper.createClient("access_token");
      var roomToLeave = new Room("test_room_id");
      roomToLeave.client = client;
      roomToLeave.leave(function(err, res){
        if(err){
          done(new Error("Should not have failed"))
        }
        return done();
      });
    })
  })

  describe("#invite",function() {
    it("should invite a user to a room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/invite?access_token=access_token").reply(200);
      var room = new Room("test_room_id");
      room.client = helper.createClient("access_token");
      room.invite({"user_id":"@user_id:localhost"}, function(err, res){
        if(err){
          done(new Error("Should not have failed"));
        }
        return done();
      })
    })
  })

  describe("#join",function() {
    it("should join a user to a room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/join?access_token=access_token").reply(200);
      var room = new Room("test_room_id");
      room.client = helper.createClient("access_token");
      room.join(function(err, res){
        if(err){
          done(new Error("Should not have failed"));
        }
        return done();
      })
    })
  })

  describe("#ban",function() {
    it("should ban user from a room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/ban?access_token=access_token").reply(200);
      var room = new Room("test_room_id");
      room.client = helper.createClient("access_token");
      room.ban({"user_id":"@user_id:localhost", "reason":"talks too much"}, function(err, res){
        if(err){
          done(new Error("Should not have failed"));
        }
        done();
      })
    }),
    it ("should fail due to null options", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/ban?access_token=access_token").reply(200);
      var room = new Room("test_room_id");
      room.client = helper.createClient("access_token");
      room.ban(null, function(err, res){
        if(err){
          return done();
        }
        done(new Error("Should have failed."));
      })
    })
    it ("should fail due to null user id", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/test_room_id/ban?access_token=access_token").reply(200);
      var room = new Room("test_room_id");
      room.client = helper.createClient("access_token");
      room.ban({"user_id":null, "reason":"talk too much"}, function(err, res){
        if(err){
          return done();
        }
        done(new Error("Should have failed."));
      })
    })

  })

})