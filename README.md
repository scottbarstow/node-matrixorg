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
});


```