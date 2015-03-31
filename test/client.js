var Client = require("../").Client;
var nock = require("nock");
var helper = require("./helper");
var should = require("should")
describe("Matrix Client tests", function(){
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
      helper.createClient().login("m.login.password", {"username":"test", "password":"password"}, function(err, res){
        if(err){
          return done(err)
        }
        res.access_token.should.eql(response.access_token)
        done();
      })
    })
  })

  describe("#register", function() {
    var response = {
      "access_token": "atoken",
      "home_server": "localhost",
      "user_id":"@example:localhost"
    }
    it("should register successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/register").reply(200, response);
      helper.createClient().register("m.login.password", {"username":"test", "password":"password", "type":"m.login.password"}, function(err, res){
        if(err){
          return done(err)
        }
        res.access_token.should.eql(response.access_token)
        done();
      })
    })
  }),

  describe("#presence tests", function() {
    it("Should update status successfully", function(done){

      helper.nock().put("/_matrix/client/api/v1/presence/" + encodeURIComponent("@test:localhost")+ "/status?access_token=access_token").reply(200);
      var client = helper.createClient("access_token", "@test:localhost");
      client.setPresence("online", "test msg", function(err,res){
        if(err){
          return done(err);
        }else {
          res.should.be.ok;
          done();
        }
      })
    })
  });

  describe("#room tests", function() {
    it("Should create room successfully", function(done){
      var roomResponse = {
        "room_alias":"test_room",
        "room_id": "test_room_id"
      }
      helper.nock().post("/_matrix/client/api/v1/createRoom?access_token=access_token").reply(200, roomResponse);
      var client = helper.createClient("access_token");
      client.createRoom({"room_alias_name":"test room"}, function(err, room){
        if(err){
          done(new Error("create room failed"))
        }
        room.room_alias.should.eql("test_room");
        done();
      })
    });

    it("should join a user to a room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/" + encodeURIComponent("test_room_id") + "/join?access_token=access_token").reply(200);
      var client = helper.createClient("access_token");
      client.joinRoom("test_room_id", function(err,res){
        if(err){
          done(new Error("Should not have failed"));
        }
        return done();
     })
    });

    it("should leave a room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/leave?access_token=access_token").reply(200);
      var client = helper.createClient("access_token");
      client.leaveRoom("test_room_id", function(err, res){
        if(err){
          done(new Error("should not have failed"));
        }
        return done();
      })
    });

    it("should invite user to room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/invite?access_token=access_token").reply(200);
      helper.createClient("access_token").inviteToRoom("test_room_id", "test_user_id", 
        function(err,res){
          if(err){
            done(new Error("should not have failed"));
          }
          res.should.eql({})
          done();
      });
    });

    it("should ban a user from room successfully", function(done){
      helper.nock().post("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/ban?access_token=access_token").reply(200);
      helper.createClient("access_token").banFromRoom("test_room_id", "@user_id:localhost", "talks too much", function(err, res){
        if(err){
          done(new Error("Should not have failed"));
        }
        res.should.eql({})
        done();
      })
    })

    it("should set room name successfully", function(done) {
      helper.nock().put("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/state/m.room.name?access_token=access_token").reply(200);

      helper.createClient("access_token").setRoomName("test_room_id", "test name", function(err,res){
        if(err){
          done(new Error("should not have failed"))
        }
        res.should.eql({})
        done();
      })
    });

    it("should get room name successfully", function(done) {
      helper.nock().get("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/state/m.room.name?access_token=access_token").reply(200, {"name": "test room"});

      helper.createClient("access_token").getRoomName("test_room_id", function(err,data){
        if(err){
          done(new Error("should not have failed"))
        }
        data.name.should.eql("test room");
        done();
      })
    });

    it("should set room topic successfully", function(done) {
      helper.nock().put("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/state/m.room.topic?access_token=access_token").reply(200);

      helper.createClient("access_token").setRoomTopic("test_room_id", "test topic", function(err,res){
        if(err){
          done(new Error("should not have failed"))
        }
        res.should.eql({})
        done();
      })
    });

    it("should get room topic successfully", function(done) {
      helper.nock().get("/_matrix/client/api/v1/rooms/" + 
        encodeURIComponent("test_room_id") + "/state/m.room.topic?access_token=access_token").reply(200, {"name": "test topic"});

      helper.createClient("access_token").getRoomTopic("test_room_id", function(err,data){
        if(err){
          done(new Error("should not have failed"))
        }
        data.name.should.eql("test topic");
        done();
      })
    });



  });
});