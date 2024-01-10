let player_num = 0;

const socket = new WebSocket("ws://10.40.2.186:8080");

socket.addEventListener("open", function(event){
});

socket.addEventListener("message",function(event){
    console.log("Server: ", event.data);

    let data = JSON.parse(event.data);

    if(data.player_num != undefined){
        player_num = data.player_num;
        console.log("Jugador numero: ", player_num);
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
let player1;
let player1_angle = 0;

let player2;
let player2_angle = 0;

let player_speed = 2;
let player_rotation_speed = 2;


function preload(){
    this.load.image("Player1-img", "assets/PNG/Cars/car_red_small_1.png");
    this.load.image("Player2-img","assets/PNG/Cars/car_blue_small_1.png");
}

function create(){
    player1 = this.add.image(config.width/3, config.height/2,"Player1-img");
    player2 = this.add.image((config.width/3) * 2,config.height/2,"Player2-img");


    //KEYS
    cursors = this.input.keyboard.createCursorKeys();
}

function update(){

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

    var player_data = {
        x: player1.x,
        y: player1.y,
        r: player1.rotation
    };
    socket.send(JSON.stringify(player_data));

}