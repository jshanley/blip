var express = require('express');
var path = require('path');

var app = express();

app.get('/system.js', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../jspm_packages/system.js'));
})
app.get('/config.js', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../config.js'))
})

app.use('/lib', express.static(path.resolve(__dirname, '../lib')))
app.use('/util', express.static(path.resolve(__dirname, '../util')))
app.use('/jspm_packages', express.static(path.resolve(__dirname, '../jspm_packages')))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

var port = process.env.PORT || 4000;

app.listen(port, function() {
  console.log('listening on port', port + '...');
})
