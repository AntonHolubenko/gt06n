var util			= require('util');
var EventEmitter	= require('events').EventEmitter;
var net				= require('net');
var extend			= require('node.extend');
var mysql      = require('mysql');
var env = require('node-env-file');
var gt06 = require('./gt06n.js').gt06;
env(__dirname + '/.env');

var conn = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

conn.connect();

var server = net.createServer(function (connection) {
    connection.setEncoding('hex');
    connection.on('data', function (data) {
        var result = gt06.parse(data);

        var parsed_json_string = JSON.stringify(result.parsed);
        var query = {
            'data_packet': result.data_packet,
            'event': result.event,
            'parsed': parsed_json_string == null ? '' : parsed_json_string
        };
        conn.query('INSERT INTO log SET ?', query , function (error, results, fields) {
            if (error) throw error;
            //console.log('The solution is: ', results[0].solution);
        });


    });
}).listen(8090);
//connection.end();

