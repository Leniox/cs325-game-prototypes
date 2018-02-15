"use strict";

window.onload = function() {
  // // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
  // // You will need to change the fourth parameter to "new Phaser.Game()" from
  // // 'phaser-example' to 'game', which is the id of the HTML element where we
  // // want the game to go.
  // // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
  // // You will need to change the paths you pass to "game.load.image()" or any other
  // // loading functions to reflect where you are putting the assets.
  // // All loading functions will typically all be found inside "preload()".

  var game = new Phaser.Game(640, 640, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
  });


  function preload() {
    // Load an image and call it 'logo'.
		game.load.tilemap('level', 'assets/ChickenCrossingFinal_json.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('myChar', 'assets/kirito_by_vali233.png');
    game.load.image('bullet', 'assets/bullet11.png');
    game.load.image('tiles', 'assets/roguelikeCity_magenta.png');
    game.load.spritesheet('chicken', 'assets/chicken_sprite_transp.png', 48 , 48);
    game.load.image('car1', 'assets/car1.png');
    game.load.image('car2', 'assets/car2.png');
    game.load.image('truck', 'assets/truck.png');
    game.load.image('truckF', 'assets/truckF.png');

    game.load.image('car1F', 'assets/car1F.png');
    game.load.image('car2F', 'assets/car2F.png');


    var string = "this is string"
    
 
  }

  var myChar;
  var cursors;
  var walk;
  var bulletTime = 0;
  var bullet;
  var bullets;
  var fireButton;
  var layer1;
  var layer2;
  var layer3;
  var layer3;
  var layer4;

  var map;
  var carSpeed = 70;
  var rows = []
  var tileSize = 16
  var rowNum = 0;
  var cars;
  var textGroup;
var facing;
  var winTextGroup;


  
  function create() {
    // Create a sprite at the center of the screen using the 'logo' image.
    map = game.add.tilemap('level');
    map.addTilesetImage('roguelikeCity_magenta', 'tiles');
    layer1 = map.createLayer('Tile Layer 1');
    game.physics.arcade.enable(layer1)
    layer2 = map.createLayer('Street_Layer');
    game.physics.arcade.enable(layer2)
    layer3 = map.createLayer('Obstacle_Layer');
    game.physics.arcade.enable(layer3)
    layer4 = map.createLayer('Obstacle_Layer');
    game.physics.arcade.enable(layer4)
    

    
    // map.setCollision([636, 637, 940, 939,938,941], true, layer1);
    // map.setCollision([636, 637, 940, 939,938,941], true, layer2);
    map.setCollision([636, 637, 596,597,598, 634, 671, 680, 604, 533,594,593, 631,630, 668,667], true, layer3);
    map.setCollision([989], true, layer4);

    // self.layer = map.createLayer('Tile Layer 1');
    myChar = game.add.sprite(game.width/2, game.height, 'chicken', 37);
    myChar.animations.add('forward', [36,37,38,37]);
    myChar.animations.add('left', [12,13,14]);
    myChar.animations.add('right', [24,25,26,25]);
    myChar.animations.add('down', [0,1,2,1]);
    walk = myChar.animations.add('walk');
    // Anchor the sprite at its center, as opposed to its top-left corner.
    // so it will be truly centered.
    myChar.anchor.setTo(0.5, 0.5);


    // Turn on the arcade physics engine for this sprite.
    game.physics.enable(myChar, Phaser.Physics.ARCADE);
    // Make it bounce off of the world bounds.
    myChar.body.collideWorldBounds = true;

    // Add some text using a CSS style.
    // Center it in X, and position its top 15 pixels from the top of the world.
    var style = {
      font: "40px Verdana",
      fill: "#9999ff",
    };
    // text.anchor.setTo(0.5, 0.0);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // game.camera.follow(bouncy);
    textGroup = game.add.group();
    winTextGroup = game.add.group();
    var text = game.add.text(game.width/2, game.height/2, "You Died! Press Space Bar to replay.", style, textGroup);
    var wonText = game.add.text(game.width/2, game.height/2, "You won! Press spacebar to replay.", style, winTextGroup);
    textGroup.visible = false;
    winTextGroup.visible = false;
    cursors = game.input.keyboard.createCursorKeys();
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    rowNum = game.height/tileSize;
    console.log("rownum:" + rowNum);
    for(var i = 0;i<rowNum;i++){
      rows.push(tileSize*i);
    };
    console.log(rows)
    //set up cars 
    setUpCars();




  }

  function resetChar(){
    myChar.x = game.width/2
    myChar.y = game.height
  }
  function charDie(){
    resetChar();
    myChar.kill();
    game.world.bringToTop(textGroup);
    textGroup.visible = true;
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(restartGame);



  }
  function restartGame() {
      resetChar()
      textGroup.visible = false;
      winTextGroup.visible = false;
      myChar.reset(game.width/2, game.height)



  }

  function update() {
 
    checkCars();
    game.physics.arcade.overlap(myChar, cars, charDie, null, this);
    game.physics.arcade.overlap(bullets, cars, killCar, null, this);



    myChar.body.velocity.x = 0;
    myChar.body.velocity.y = 0;
    
    game.physics.arcade.collide(layer3, myChar, function(){
      console.log("collision detected")
    }); 
    game.physics.arcade.collide(layer4, myChar, function(){
      console.log("You won!")
      myChar.kill();
      winTextGroup.visible = true;
      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.addOnce(restartGame);


    }); 

    function killCar(bullet, car){
      bullet.kill();
      car.kill();
    }
    
   

    if (cursors.up.isDown)
    {
      myChar.body.velocity.y = -200;
      myChar.animations.play('forward', 30);
      facing = "up"

        
    }
    
    if (cursors.down.isDown)
    {
      myChar.body.velocity.y = 200;
      myChar.animations.play('down', 30);
      facing = "down"

        
    }
    if (fireButton.isDown)
    {
      fireBullet();
    }

    if (cursors.left.isDown)
    {
      myChar.body.velocity.x = -150;
      myChar.animations.play('left', 30);
      facing = "left"


    }
    else if (cursors.right.isDown)
    {
      myChar.body.velocity.x = 150;
      myChar.animations.play('right', 30);
      facing = "right"


    }
   
    

    // bouncy.rotation = game.physics.arcade.accelerateToPointer(bouncy, game.input.activePointer, 500, 500, 500);
  }

    function setUpCars(){
    cars = game.add.group();
    cars.enableBody = true;
    console.log(rows[rows.length-2])
    game.add.sprite(game.width,)
    //top to bottom: first
    game.add.sprite(90, rows[2], 'car1F', 0, cars);
    game.add.sprite(270, rows[2], 'car1F', 0, cars);
    game.add.sprite(420, rows[2], 'truck', 0, cars);
    game.add.sprite(540, rows[2], 'truck', 0, cars);
    game.add.sprite(50, rows[4], 'car2F', 0, cars);
    game.add.sprite(200, rows[4], 'car2F', 0, cars);
    game.add.sprite(400, rows[4], 'car2F', 0, cars);
    game.add.sprite(120, rows[6], 'car1', 0, cars);
    game.add.sprite(270, rows[6], 'car1', 0, cars);
    //second
    game.add.sprite(20, rows[12], 'truckF', 0, cars);
    game.add.sprite(200, rows[12], 'truckF', 0, cars);
    game.add.sprite(50, rows[14], 'car2', 0, cars);
    game.add.sprite(320, rows[14], 'car2', 0, cars);

    //third
    game.add.sprite(20, rows[18], 'truckF', 0, cars);
    game.add.sprite(300, rows[18], 'truckF', 0, cars);
    game.add.sprite(150, rows[18], 'car2', 0, cars);
    game.add.sprite(500, rows[18], 'car2', 0, cars);
    //fourth
    game.add.sprite(90, rows[24], 'car1F', 0, cars);
    game.add.sprite(270, rows[24], 'car1F', 0, cars);
    game.add.sprite(420, rows[24], 'truck', 0, cars);
    game.add.sprite(540, rows[24], 'truck', 0, cars);
    game.add.sprite(50, rows[26], 'car2F', 0, cars);
    game.add.sprite(240, rows[26], 'car2F', 0, cars);
    game.add.sprite(500, rows[26], 'car2F', 0, cars);
    game.add.sprite(150, rows[26], 'car1', 0, cars);
    game.add.sprite(350, rows[26], 'car1', 0, cars);

    //fifth
    var sprite1 = game.add.sprite(50, rows[29], 'car2F', 0, cars);
    var sprite2 = game.add.sprite(240, rows[29], 'car2F', 0, cars);
    var sprite3 = game.add.sprite(500, rows[29], 'car2F', 0, cars);
    var sprite4 = game.add.sprite(150, rows[29], 'car1', 0, cars);
    var sprite5 = game.add.sprite(350, rows[29], 'car1', 0, cars);
    sprite1.body.setSize(20, 20, 15, 15)
    sprite2.body.setSize(20, 20, 15, 15)
    sprite3.body.setSize(20, 20, 15, 15)
    sprite4.body.setSize(20, 20, 15, 15)
    sprite5.body.setSize(20, 20, 15, 15)

    //6th
    var sprite1 = game.add.sprite(50, rows[34], 'car2F', 0, cars);
    var sprite2 = game.add.sprite(240, rows[34], 'car2F', 0, cars);
    var sprite3 = game.add.sprite(500, rows[34], 'car2F', 0, cars);
    var sprite4 = game.add.sprite(150, rows[34], 'car1', 0, cars);
    var sprite5 = game.add.sprite(350, rows[34], 'car1', 0, cars);
    sprite1.body.setSize(20, 20, 15, 15)
    sprite2.body.setSize(20, 20, 15, 15)
    sprite3.body.setSize(20, 20, 15, 15)
    sprite4.body.setSize(20, 20, 15, 15)
    sprite5.body.setSize(20, 20, 15, 15)



    for(var i = 0; i < cars.children.length; i++) {
      if((cars.children[i].y/16)%2 === 0 ){
        cars.children[i].body.velocity.x = -carSpeed;
      } else {
        cars.children[i].body.velocity.x = carSpeed;
      }
      cars.children[i].checkWorldBounds = true;
      cars.children[i].outOfBoundsKill = true;
    }
  }
    function checkCars(){
    var car = cars.getFirstDead();
    if(!car){
      return
    }
    var y = car.y
    var width = car.width
    if((y/16)%2 === 0 ){
      car.reset(game.world.width, y);
      car.body.velocity.x = -carSpeed;
    } else {
      car.reset(0-width, y);
      car.body.velocity.x = carSpeed;
    }
    car.checkWorldBounds = true;
    car.outOfBoundsKill = true;
  }



      //  Our bullet group
     
  function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
          if (facing == "down")
          {
            bullet.reset(myChar.x, myChar.y + 8);
            bullet.body.velocity.y= 400;
            bulletTime = game.time.now + 200;
          }
          else if (facing == "up")
          {
            bullet.reset(myChar.x, myChar.y + 8);
            bullet.body.velocity.y= -400;
            bulletTime = game.time.now + 200;
          }
          else if (facing == "left")
          {
            bullet.reset(myChar.x, myChar.y + 8);
            bullet.body.velocity.x= -400;
            bulletTime = game.time.now + 200;
          }
          else if (facing == "right")
          {
            bullet.reset(myChar.x, myChar.y + 8);
            bullet.body.velocity.x= 400;
            bulletTime = game.time.now + 200;
          }
            //  And fire it
           
        }
    }

}
};

