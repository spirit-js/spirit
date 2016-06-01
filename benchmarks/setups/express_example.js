// NOTE: this doesn't test a router
// like it does with the leaf & other express benchmark

var express = require('express');
var app = express();

var body = new Buffer('Hello World');
app.use(function(req, res, next){
  res.send(body);
});

app.listen(3009);
