var static = require('node-static');
let http = require('http');
let ws = require('ws');

var file = new static.Server('./public');
 
let http_server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});


let ws_server = new ws.WebSocketServer({ server: http_server });

http_server.listen(8080);

let p1_conn;
let p2_conn;

let go = 0;

let spectators = [];
let spectators_num = 3;

ws_server.on('connection', function (conn){
   
    console.log('EVENT: Conexion');

    if(p1_conn == undefined){
        p1_conn = conn;
        
        p1_conn.send('{"player_num":1}');

        p1_conn.on('message', function(data){
            if(p2_conn == undefined){
                return;
            }

            let parsed_data = JSON.parse(data.toString());
            if(parsed_data.gh == true){

                p1_conn.send('{"gameOver": 1}');
				p2_conn.send('{"gameOver": 1}');

                spectators.forEach(spectator =>{
                    spectator.send('{"gameOver": 2}');
                });
            }
            
            p2_conn.send(data.toString());
            
            spectators.forEach(spectator =>{
                spectator.send(data.toString());
            });
        });
    }
    else if(p2_conn == undefined){
        p2_conn = conn;

        p2_conn.send('{"player_num":2}');

        p2_conn.on('message', function(data){
            if(p1_conn == undefined){
                return;
            }

            let parsed_data = JSON.parse(data.toString());
            if(parsed_data.gh == true){

                p1_conn.send('{"gameOver": 2}');
				p2_conn.send('{"gameOver": 2}');

                spectators.forEach(spectator =>{
                    spectator.send('{"gameOver": 2}');
                });

                console.log("hit");

            }

            p1_conn.send(data.toString());
            
            spectators.forEach(spectator =>{
                spectator.send(data.toString());
            });
        });

    }
    else{
        spectators.push(conn);
        spectators[spectators.length - 1].send(`{"player_num": ${spectators_num}}`);
        spectators_num++;
    }
   
});