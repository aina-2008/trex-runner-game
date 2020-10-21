var PLAY = 1;
var END = 0;
var gameState = PLAY;
var die,jump,checkpoint;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var sunimage 
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var crowimage,crowGroup;
var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");

  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  crowimage=loadImage("crow.png");
   restartImg = loadImage("restart-1.png")
  gameOverImg = loadImage("gameOver-1.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  sunimage=loadImage("sun.png");
}

function setup() {
  createCanvas(600,400);
  
  
  
  ground = createSprite(200,430,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  sun = createSprite(80,50,20,20);
  sun.addImage(sunimage);
  sun.scale = 0.2;
  
  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  crowGroup = createGroup();
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,60,trex.height-100);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(score>0&&score%100===0) 
    checkPointSound.play();
  
if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
      jumpSound.play();
        
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //spawn crows
    spawnCrows();
  
  if(crowGroup.isTouching(trex)|| obstaclesGroup.isTouching(trex)){
        gameState = END;
       dieSound.play();
       
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      if(mousePressedOver(restart)) {
         reset();
         
       }
       
     
     
     //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    crowGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     crowGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset() {
gameState=PLAY;  
gameOver.visible=false;  
restart.visible=false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
crowGroup.destroyEach();
trex.y=180;
trex.changeAnimation("running",trex_running);
score=0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,350,10,40);
   obstacle.velocityX = -(6+3*score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.5
             obstacle.setCollider("rectangle",0,-20,60,150);       obstacle.debug = false;
        break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.5
             obstacle.setCollider("rectangle",0,-20,60,150);       obstacle.debug = false;
        break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.y=280;
        obstacle.scale=0.3
            obstacle.setCollider("rectangle",0,60,150,150);       obstacle.debug = false;
        break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.y=280;
        obstacle.scale=0.3
        obstacle.setCollider("rectangle",0,60,150,150);       obstacle.debug = false;
        break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
  
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
 
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 150;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function spawnCrows() {
  //write code here to spawn the clouds
  if (frameCount % 180 === 0) {
     crow= createSprite(600,100,40,10);
     crow.y = Math.round(random(10,60));
    crow.addImage(crowimage);
    crow.scale = 0.15;
    crow.velocityX = -3;
    
     //assign lifetime to the variable
    crow.lifetime = 200;
    
    //adjust the depth
    crow.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   crowGroup.add(crow);
    }
}

