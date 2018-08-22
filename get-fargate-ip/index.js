var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.get('/',function(request, response){
    response.end(JSON.stringify(process.env));
});
server.listen(80,'0.0.0.0',function(){
    console.log('server started');
    console.log(process.env);
});
