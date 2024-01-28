

let player_num = 0;

let player1;
let player2;


//const socket = new WebSocket("ws://10.40.2.186:8080"); //Classe
const socket = new WebSocket("ws://192.168.1.149:8080"); //Casa


socket.addEventListener("open", function(event){
});

socket.addEventListener("message",function(event){
    console.log("Server: ", event.data);

    let data = JSON.parse(event.data);

    if(data.player_num != undefined){
        player_num = data.player_num;
        console.log("Jugador numero: ", player_num);
    }
    else if (data.x != undefined){
        if(player_num == 1){
            player2.x = data.x;
            player2.y = data.y;
            player2.rotation = data.r;
            
            bullet2.x = data.bx;
            bullet2.y = data.by;
            bullet2.rotation = data.br;
        }
        if(player_num == 2){
            player1.x = data.x;
            player1.y = data.y;
            player1.rotation = data.r;

            bullet1.x = data.bx;
            bullet1.y = data.by;
            bullet1.rotation = data.br;
        }
        
    }
});

const config = {
    type: Phaser.AUTO,
	width: 800,
	height: 600,
    scene:{
        preload: preload,
        create: create,
        update: update
    }
	
}

const game = new Phaser.Game(config);


//Variables
let player1_angle = 0;

let player2_angle = 0;

let player_speed = 3;
let player_rotation_speed = 3;

let bullet1;
let bullet1_speed = 10;
let bullet1_angle = 0; 
let bullet1_isShooted = false;

let bullet2;
let bullet2_speed = 10;
let bullet2_angle = 0;
let bullet2_isShooted = false;



function preload(){
    this.load.image("Player1-img", "assets/PNG/Cars/car_red_small_1.png");
    this.load.image("Player2-img","assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("Background-img","assets/Background.png");
    this.load.image("Bullet-img","assets/bullet.png");
}

function create(){
    let bg = this.add.image(1000, 1000, "Background-img");

    player1 = this.add.image(1000, 1000,"Player1-img");

    player2 = this.add.image((config.width/3) * 2,config.height/2,"Player2-img");

    bullet1 = this.add.image(config.width/2, config.height/2, "Bullet-img");
    bullet2 = this.add.image(config.width/2, config.height/2, "Bullet-img");


    //KEYS
    cursors = this.input.keyboard.createCursorKeys();

    //COLIDERS

    //this.physics.add.collider(player1, player2);
}

function update(){
    //bullet stuff

    bullet1.y -= bullet1_speed*Math.cos(bullet1_angle*Math.PI/180);
    bullet1.x += bullet1_speed*Math.sin(bullet1_angle*Math.PI/180);

    bullet2.y -= bullet2_speed*Math.cos(bullet2_angle*Math.PI/180);
    bullet2.x += bullet2_speed*Math.sin(bullet2_angle*Math.PI/180);

    if(player_num == 0){
        return;
    }
    else if(player_num == 1){
        //Player1 Movement
        if(cursors.left.isDown){
            player1_angle -=  player_rotation_speed;
        }
        else if (cursors.right.isDown){
            player1_angle +=  player_rotation_speed;
            
        }

        if(cursors.up.isDown){
            player1.y -= player_speed*Math.cos(player1_angle*Math.PI/180);
            player1.x += player_speed*Math.sin(player1_angle*Math.PI/180);
        }
        player1.rotation = player1_angle*Math.PI/180;

        //bullet stuff
        if(cursors.space.isDown && !bullet1_isShooted){
            bullet1.x = player1.x;
            bullet1.y = player1.y;
            bullet1_angle = player1_angle;
            bullet1.rotation = player1.rotation;
            
            bullet1_isShooted = true;
        }

        var player_data = {
            x: player1.x,
            y: player1.y,
            r: player1.rotation,

            bx: bullet1.x,
            by: bullet1.y,
            br: bullet1.rotation
        };
    }
    else if(player_num == 2){
        //Player2 Movement
        if(cursors.left.isDown){
            player2_angle -=  player_rotation_speed;
        }
        else if (cursors.right.isDown){
            player2_angle +=  player_rotation_speed;
        }

        if(cursors.up.isDown){
            player2.y -= player_speed*Math.cos(player2_angle*Math.PI/180);
            player2.x += player_speed*Math.sin(player2_angle*Math.PI/180);
        }
        player2.rotation = player2_angle*Math.PI/180;

        //bullet stuff
        if(cursors.space.isDown && !bullet2_isShooted){
            bullet2.x = player2.x;
            bullet2.y = player2.y;
            bullet2_angle = player2_angle;
            bullet2.rotation = player2.rotation;
            
            bullet2_isShooted = true;
        }

        var player_data = {
            x: player2.x,
            y: player2.y,
            r: player2.rotation,

            bx: bullet2.x,
            by: bullet2.y,
            br: bullet2.rotation
        };
    }

    

    

    socket.send(JSON.stringify(player_data));

}