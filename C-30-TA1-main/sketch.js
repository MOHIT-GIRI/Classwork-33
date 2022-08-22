const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit,rope;
var fruit_con;
var backgroundsound,cutsound,sadsound,eatingsound,airsound;
var blower;
var mutebutton;
var rope2,rope3;

function preload(){
  bgImg=loadImage('background.png')
  food=loadImage('melon.png')
  rabbit=loadImage('Rabbit-01.png')
  blink=loadAnimation('blink_1.png','blink_2.png','blink_3.png')
  eat=loadAnimation('eat_0.png','eat_1.png','eat_2.png','eat_3.png','eat_4.png')
  sad=loadAnimation('sad_1.png','sad_2.png','sad_3.png')

  blink.playing=true
  eat.playing=true
  eat.looping=false
  sad.playing=true
  sad.looping=false
  
  backgroundsound=loadSound('sound1.mp3')
  sadsound=loadSound('sad.wav')
  cutsound=loadSound('rope_cut.mp3')
  eatingsound=loadSound('eating_sound.mp3')
  airsound=loadSound('air.wav')
}

function setup() 
{
  var ismobile=/iPhone | iPad | Android/i.test(navigator.userAgent)
  if(ismobile){
    canW=displayWidth
    canH=displayHeight
    createCanvas(displayWidth+80,displayHeight)
  }
  else{
    canW=windowWidth
    canH=windowHeight
    createCanvas(windowWidth,windowHeight)
  }
  //createCanvas(500,700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  backgroundsound.play()
  backgroundsound.setVolume(1)
  blink.frameDelay=20

  eat.frameDelay=20

  sad.frameDelay=20

  ground = new Ground(200,canH,600,20);

  rope = new Rope(8,{x:40,y:30});
  rope2= new Rope(7,{x:370,y:40});
  rope3= new Rope(4,{x:400,y:225})
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  bunny=createSprite(300,canH-80,100,100)
  bunny.addImage(rabbit)
  bunny.scale=0.2
  bunny.addAnimation('blinking',blink)
  bunny.addAnimation('eating',eat)
  bunny.addAnimation('crying',sad)
  bunny.changeAnimation('blinking')

  button=createImg('cut_button.png')
  button.position(20,30)
  button.size(50,50)
  button.mouseClicked(drop)

  button2=createImg('cut_button.png')
  button2.position(330,35)
  button2.size(50,50)
  button2.mouseClicked(drop2) 

  button3=createImg('cut_button.png')
  button3.position(360,200)
  button3.size(50,50)
  button3.mouseClicked(drop3)

  blower=createImg('balloon.png')
  blower.position(10,250)
  blower.size(150,100)
  blower.mouseClicked(airblow)

  mutebutton=createImg('mute.png')
  mutebutton.position(450,20)
  mutebutton.size(50,50)
  mutebutton.mouseClicked(mute)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER)

}

function draw() 
{
  background(51);
  image(bgImg,0,0,displayWidth+80,displayHeight)
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,60,60)
  } 
  rope.show();
  rope2.show()
  rope3.show()
  if(fruit!=null && fruit.position.y>=650){
    bunny.changeAnimation('crying')
    backgroundsound.stop()
    sadsound.play()
    fruit=null
  }
  //ellipse(fruit.position.x,fruit.position.y,30,30);
  Engine.update(engine);
  ground.show();
  if(collide(fruit,bunny)==true){
    bunny.changeAnimation('eating')
    eatingsound.play()
  }
  if(collide(fruit,ground.body)==true){
    bunny.changeAnimation('crying')
  }
  drawSprites()
 
   
}
function drop(){
  cutsound.play()
  rope.break()
  fruit_con.detach()
  fruit_con=null
}

function drop2(){
  cutsound.play()
  rope2.break()
  fruit_con2.detach()
  fruit_con2=null
}

function drop3(){
  cutsound.play()
  rope3.break()
  fruit_con3.detach()
  fruit_con3=null
}
function collide(body,sprite){
  if(body != null){
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    if(d<=80){
      World.remove(engine.world,fruit)
      fruit=null
      return true
    }
    else{
      return false
    }
  }
}

function airblow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  airsound.play()
}

function mute(){
  if(backgroundsound.isPlaying()){
    backgroundsound.stop()
  }
  else{
    backgroundsound.play()
  }
}