# matrix.org

[![Build](https://travis-ci.org/scottbarstow/node-matrixorg.png)](https://travis-ci.org/scottbarstow/node-matrixorg)


Node client library for [matrix.org API](http://matrix.org/docs/api/client-server/)

## Install

Run

```
npm install node-matrixorg
```

## Getting Started

```js
var matrix = require('node-matrixorg');

//Use the client

var client = new Matrix.Client("http://yourhomeserver")
```


## Login and registration

```js
var matrix = require('node-matrixorg');
var client = new matrix.Client("http://yourhomeserver")

client.register("m.login.password", {"user":"user", "password":"password"}, function(err, res){
  console.log("user id: " + res.user_id)
})


client.login("m.login.password", {"user":"youruser", "passwword":"password", function(err,res){
	console.log("access token: " + res.access_token)
  client.access_token = res.access_token;
  client.user_id = res.user_id;
  console.log("Client is logged in properly: " + client.isLoggedIn())
});
```

## Room methods

```js
// Create a room
client.createRoom("my room", function(err, room){
  console.log("room id: " + room.room_id);
});

//invite users to a room
var roomId = "foo";
var userId = "bar";
client.inviteToRoom(roomId, userId, callback);

//leave a room
client.leaveRoom(roomId, callback);

//join a room
client.joinRoom(roomId, callback);

//ban user from room
client.banFromRoom(roomId, userId, "Too chatty", callback);
```