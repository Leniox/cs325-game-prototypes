"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'myChar', 'assets/phaser.png' );
        game.load.image('background', 'assets/curtains_1500.jpg')
        game.load.image('floor', 'assets/stage_no_backgrond.png')
        game.load.image('speedPower', 'assets/powerup-2.png')
        game.load.image('jumpPower', 'assets/jumpImage.png')
        game.load.image('slowPower', 'assets/frozen_clock.png')


        game.load.spritesheet('pirate', 'assets/pirate_sprite_nobackground.png', 110 , 110, 3);
        game.load.spritesheet('thief', 'assets/thief_sprite_nobackgronud.png', 67 , 198, 55);
        game.load.spritesheet('thiefSpeed', 'assets/testingspeed.png', 80 , 130,4);
        game.load.spritesheet('thiefJump', 'assets/thiefJump.png', 80 , 160,3);
        game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);


        game.load.image( 'right_Arrow', 'assets/right_Arrow.png' );
        game.load.image( 'left_Arrow', 'assets/left_Arrow.png' );
        game.load.image( 'down_Arrow', 'assets/down_Arrow.png' );
        game.load.image( 'up_Arrow', 'assets/up_Arrow.png' );

        game.load.image( 'char_up', 'assets/char_arrow_single_up.png' );
        game.load.image( 'char_down', 'assets/char_arrow_single_down.png' );
        game.load.image( 'char_left', 'assets/char_arrow_single_left.png' );
        game.load.image( 'char_right', 'assets/char_arrow_single_right.png' );








    }
    
    var bouncy;
    var floor;
    var cursors;
    var facing;
    var myChar;
    var mySpeedChar;
    var hitPlatform = false;
    var jumpTimer = 0;
    var score = 0;
    var scoreText;
    var spawnTime = 0;
    var spawnSpeed = 1000;
    var numSpawned = 0;
    var leftArrows;
    var rightArrows;
    var upArrows;
    var downArrows;
    var arrows = []
    var arrowSpeed = 100;
    var lives = 4;
    var livesText;
    var arrowGroup;
    var someArrow;
    var charLeftGroup;
    var charRightGroup;
    var charUpGroup;
    var charDownGroup;
    var wasd;
    var fireTime = 0;
    var endGameTextGroup;
    var speedTimer = 0;
    var powerUpGroup;
    var power;
    var jumpPower;
    var powerTimer;
    var timerEvent;
    var explosions;
    var slowPower;
    var pirateGroup;
    var pirateTimer = 0


    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        game.add.tileSprite(0, 0, 1000, 600, 'background');
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });
        floor = game.add.tileSprite(-50, 480, 1100, 200, 'floor');
        arrowGroup = game.add.group();
        arrowGroup.enableBody = true
        arrowGroup.physicsBodyType = Phaser.Physics.ARCADE;
        arrowGroup.setAll('outOfBoundsKill', true);
        arrowGroup.setAll('checkWorldBounds', true);   
        pirateGroup = game.add.group();
        pirateGroup.enableBody = true
        pirateGroup.physicsBodyType = Phaser.Physics.ARCADE;
        pirateGroup.setAll('outOfBoundsKill', true);
        pirateGroup.setAll('checkWorldBounds', true);   
        powerTimer = game.time.create();

             
        powerUpGroup = game.add.group();
        powerUpGroup.enableBody = true
        powerUpGroup.physicsBodyType = Phaser.Physics.ARCADE;
        powerUpGroup.setAll('outOfBoundsKill', true);
        powerUpGroup.setAll('checkWorldBounds', true);     
        myChar = game.add.sprite(game.width/2, game.height/2, 'thief', 8);
        myChar.animations.add('right', [8,9,10,9,8]);
        myChar.animations.add('left', [10,9,8,9,10]);
        // myChar.animations.add('right', [1,2,3]);
        // myChar.animations.add('left', [1,2,3]);
        

        // mySpeedChar = game.add.sprite(game.width/2, game.height/2, 'thiefSpeed', 0);
        // mySpeedChar.animations.add('speed' , [0])

        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');


        endGameTextGroup = game.add.group();

        endGameTextGroup.visible = false;
        var text = game.add.text(game.width/2 - 200, game.height/2, "You Died! Press Space Bar to replay.", { fontSize: '32px', fill: '#ffffff' }, endGameTextGroup);


        // setUpArrows();
        setUpCharacterArrows();
        cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
          };

        // myChar.animations.add('left', [12,13,14]);
        // myChar.animations.add('right', [24,25,26,25]);
        // myChar.animations.add('down', [0,1,2,1]);

        // bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        // bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable([ myChar, floor ], Phaser.Physics.ARCADE);
        // floor.body.collideWorldBounds = true;
        floor.body.immovable = true;
        floor.body.allowGravity = false;        // Make it bounce off of the world bounds.
        // game.physics.arcade.checkCollision.bottom = false;
        // game.physics.arcade.checkCollision.top    = false;
        
        myChar.body.gravity.y = 400;
        floor.body.setSize(1100, 60, 0 ,140);
        myChar.body.collideWorldBounds = true;

        // var sim = game.physics.p2;
        // var Custombottom = new p2.Body({ mass: 0, position: [ sim.pxmi(0), sim.pxmi(-1000)] });
        // game.physics.p2.addBody(Custombottom)




        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Welcome to the school talent show!", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    function setUpCharacterArrows()
    {
        charLeftGroup = game.add.group();
        charLeftGroup.enableBody = true
        charLeftGroup.physicsBodyType = Phaser.Physics.ARCADE;
        charLeftGroup.createMultiple(10, 'char_left')
        charLeftGroup.setAll('outOfBoundsKill', true);
        charLeftGroup.setAll('checkWorldBounds', true); 

        charRightGroup = game.add.group();
        charRightGroup.enableBody = true
        charRightGroup.physicsBodyType = Phaser.Physics.ARCADE;
        charRightGroup.createMultiple(10, 'char_right')
        charRightGroup.setAll('outOfBoundsKill', true);
        charRightGroup.setAll('collideWorldBounds', true);
 
        charUpGroup = game.add.group();
        charUpGroup.enableBody = true
        charUpGroup.physicsBodyType = Phaser.Physics.ARCADE;
        charUpGroup.createMultiple(10, 'char_up')
        charUpGroup.setAll('outOfBoundsKill', true);
        charUpGroup.setAll('checkWorldBounds', true); 

        charDownGroup = game.add.group();
        charDownGroup.enableBody = true
        charDownGroup.physicsBodyType = Phaser.Physics.ARCADE;
        charDownGroup.createMultiple(10, 'char_down')
        charDownGroup.setAll('outOfBoundsKill', true);
        charDownGroup.setAll('checkWorldBounds', true); 


    

    }


    
    function checkArrow(arrowGroup){
        var arrow = arrowGroup.getFirstDead();
        if(!arrow){
            return
          }
        arrow.reset();

        arrow.checkWorldBounds = true;
        arrow.outOfBoundsKill = true;

          
    }

    //this kills the array actually. not sure why floor
    function killArrow(arrow, floor){
        console.log("collision with something")

            floor.kill();
            lives = lives - 1;
            
      }

      function endGame()
      {
        myChar.kill();
        arrowGroup.kill();
        game.world.bringToTop(endGameTextGroup);
        endGameTextGroup.visible = true;
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.addOnce(restartGame);
      }
      function restartGame(){
          console.log("DEAD")
          endGameTextGroup.visible = false;
          game.world.remove(endGameTextGroup);
          arrowGroup.revive();
          myChar.revive();
          score = 0;
          lives = 4;
          myChar.body.gravity.y = 400;

      } 

    function collisionHandler(arrow) {
          arrow.kill();
          lives = lives - 1;
  

      }
      //alternate game mode idea: Try to push the arrows off screen
      //by shooting at them.

    function generatePirate()
    {
        var position = Math.floor(Math.random() * 5) + 1;
        var xPosition = position * 200;
        var pirate = game.add.sprite(xPosition, 0, 'pirate',0);
        pirate.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enable(pirate);
        pirate.outOfBoundsKill = true
        pirate.checkWorldBounds = true
        pirate.body.velocity.y = 75
        pirate.events.onOutOfBounds.add(addScore, this);

        pirateGroup.add(pirate)
    






    }  
    function addScore()
    {
        console.log("running")
        score = score + 20
    }

    function generateArrow()
    {
            var arrowIndex = Math.floor(Math.random() * 4);
            var position = Math.floor(Math.random() * 5) + 1;
            var arrowSpeed = Math.floor(Math.random() * 4) + 1;
            arrowSpeed = arrowSpeed * 75
            if (myChar.form == "slowy")
            {
                arrowSpeed = arrowSpeed/2
            }

            var xPosition = position * 200 - 100;
            if (arrowIndex === 0)
            {
                  someArrow = game.add.sprite(xPosition, 0, 'left_Arrow',0);
                  someArrow.direction = "left"
                  someArrow.physicsBodyType = Phaser.Physics.ARCADE;
                  game.physics.arcade.enable(someArrow);
                    arrowGroup.add(someArrow)
                  someArrow.animations.add('kaboom');

                //   if (myChar.form == "jumpy")
                //   {
                //     game.physics.enable([someArrow,myChar], Phaser.Physics.ARCADE);
                //     game.physics.arcade.collide(myChar, someArrow);
                //     someArrow.body.bounce.setTo(1, 1);
                //   }
               
    
                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = arrowSpeed
           


            }
            else if (arrowIndex === 1)
            {
                 someArrow = game.add.sprite(xPosition, 0, 'right_Arrow',0);
                someArrow.enableBody = true;
                someArrow.direction = "right"

                 someArrow.physicsBodyType = Phaser.Physics.ARCADE;
                 game.physics.arcade.enable(someArrow);
                 arrowGroup.add(someArrow)
                 someArrow.animations.add('kaboom');

                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = arrowSpeed

                //  if (myChar.form == "jumpy")
                //   {
                //           game.physics.enable([someArrow,myChar], Phaser.Physics.ARCADE);

                //     game.physics.arcade.collide(myChar, someArrow);
                //     someArrow.body.bounce.setTo(1, 1);
                //   }
         

            }
            else if (arrowIndex === 2)
            {
                 someArrow = game.add.sprite(xPosition, 0, 'up_Arrow',0);
                someArrow.enableBody = true;
                someArrow.direction = "up"

                 someArrow.physicsBodyType = Phaser.Physics.ARCADE;
                 game.physics.arcade.enable(someArrow);
                 arrowGroup.add(someArrow)
                 someArrow.animations.add('kaboom');

                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = arrowSpeed
                 game.physics.arcade.overlap(someArrow, floor, killArrow, null, this);

                //  if (myChar.form == "jumpy")
                //   {
                //     game.physics.enable([someArrow,myChar], Phaser.Physics.ARCADE);

                //     game.physics.arcade.collide(myChar, someArrow);
                //     someArrow.body.bounce.setTo(1, 1);
                //   }

         

            }
            else{
                 someArrow = game.add.sprite(xPosition, 0, 'down_Arrow');
                 someArrow.direction = "down"

                 game.physics.enable(someArrow, Phaser.Physics.ARCADE);
                 someArrow.body.velocity.y = arrowSpeed
                 arrowGroup.add(someArrow)

                //  if (myChar.form == "jumpy")
                //   {
                //     game.physics.enable([someArrow,myChar], Phaser.Physics.ARCADE);

                //     game.physics.arcade.collide(myChar, someArrow);
                //     someArrow.body.bounce.setTo(1, 1);
                //   }
            }
    }

    function updateLives(){
        game.world.remove(livesText)
        if (lives === 4)
        {
        livesText = game.add.text(800, 16, "Lives: * * * *", { fontSize: '32px', fill: '#ffffff' });
        }
        if (lives === 3)
        {
            livesText = game.add.text(800, 16, "Lives: * * * ", { fontSize: '32px', fill: '#ffffff' });

        }
        if (lives === 2)
        {
            livesText = game.add.text(800, 16, "Lives: * * ", { fontSize: '32px', fill: '#ffffff' });

        }
        if (lives === 1)
        {
            livesText = game.add.text(800, 16, "Lives: * ", { fontSize: '32px', fill: '#ffffff' });

        }
        if (lives === 0)
        {
            arrowGroup.kill()
            endGame();
            
        }
    }

    function fireLeftArrow()
    {
        if (game.time.now > fireTime)
        {
            //  Grab the first bullet we can from the pool
            var leftArrow = charLeftGroup.getFirstExists(false);
            fireTime = 200 + game.time.now
    
            if (leftArrow)
            {
                leftArrow.reset(myChar.x, myChar.y - 8);
                leftArrow.body.velocity.y= -400;
            }
        }
    }
    function fireRightArrow()
    {
        if (game.time.now > fireTime)
        {
            //  Grab the first bullet we can from the pool
            var rightArrow = charRightGroup.getFirstExists(false);
            fireTime = 200 + game.time.now
    
            if (rightArrow)
            {
                rightArrow.reset(myChar.x, myChar.y - 8);
                rightArrow.body.velocity.y= -400;
            }
        }
    }
    function fireDownArrow()
    {
        if (game.time.now > fireTime)
        {
            //  Grab the first bullet we can from the pool
            var downArrow = charDownGroup.getFirstExists(false);
            fireTime = 200 + game.time.now
    
            if (downArrow)
            {
                downArrow.reset(myChar.x, myChar.y - 8);
                downArrow.body.velocity.y= -400;
            }
        }
    }
    function fireUpArrow()
    {
        if (game.time.now > fireTime)
        {
            //  Grab the first bullet we can from the pool
            var upArrow = charUpGroup.getFirstExists(false);
            fireTime = 200 + game.time.now
    
            if (upArrow)
            {
                upArrow.reset(myChar.x, myChar.y - 8);
                upArrow.body.velocity.y= -400;
            }
        }
    }

    function updateScore()
    {
        game.world.remove(scoreText)
        scoreText = game.add.text(16, 16, 'score: ' + score, { fontSize: '32px', fill: '#ffffff' });

    }

    function interactDown(someArrow, downArr)
    {
        if (someArrow.direction === "down")
        {
            score = score + 10;
        }
        else{
            lives = lives - 1;
        }
        someArrow.kill();
        downArr.kill(); 
    }
    function interactLeft(someArrow, leftArr)
    {
        if (someArrow.direction === "left")
        {
            score = score + 10;
        }
        else{
            lives = lives - 1;
        }
        someArrow.kill();
        leftArr.kill(); 
    }
    function interactUp(someArrow, upArr)
    {
        if (someArrow.direction === "up")
        {
            score = score + 10;
        }
        else{
            lives = lives - 1;
        }
        someArrow.kill();
        upArr.kill(); 
    }
    function interactRight(someArrow, rightArr)
    {

        if (someArrow.direction === "right")
        {
            score = score + 10;
        }
        else{
            lives = lives - 1;
        }
        someArrow.kill();
        rightArr.kill();    
    }
    //make myChar equal to speed Char for 15 seconds and then turn it back
    function powerCharCollision(myChar, power)
    {
        console.log("COLLISION WITH power and char")

        if (power.power == "speed")
        {
            console.log("COLLISION WITH SPEED AND CHAR")
       
            myChar.loadTexture('thiefSpeed' , 0)
            myChar.animations.add('initialSpeed' , [0,1,2,3])
            myChar.animations.play('initialSpeed', 30);

            myChar.form = "speedy"
            power.kill();
            // Create a custom timer
        
            // Create a delayed event 1m and 30s from now
            powerTimer = game.time.create();
            timerEvent = powerTimer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 7, endTimer, this);
            
            // Start the timer
            powerTimer.start();

            
        }
        //if we collide with arrow during a jump, it rotates in in a angle and speeds off in that direction
        //and knocks other arrows out of the air.
        else if (power.power == "jump")
        {
            console.log("COLLISION WITH JUMP AND CHAR")

            myChar.loadTexture('thiefJump' , 0)
            myChar.animations.add('jump' , [0,1,2])
            myChar.form = "jumpy"
            power.kill();


            // Create a custom timer
        
            // Create a delayed event 1m and 30s from now
            powerTimer = game.time.create();
            timerEvent = powerTimer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 10, endTimer, this);
            
            // Start the timer
            powerTimer.start();
        }
        else if (power.power == "slow")
        {
            myChar.form = "slowy"
            power.kill();
            powerTimer = game.time.create();
            timerEvent = powerTimer.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 10, endTimer, this);
            
            // Start the timer
            powerTimer.start();
        }
    }

    function endTimer () {
        // Stop the timer when the delayed event triggers
        //bug if you pick up two powers at once. Instead add powers to a stack and pop from stack.
       
        powerTimer.stop();
        myChar.loadTexture('thief' , 8)
        explosions.killAll()

        myChar.form = "normal"



    }

    function formatTime (s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }


    function charArrowCollide(myChar, someArrow)
    {
        if (myChar.form == "jumpy")
        {
            console.log("CHARACTER AND ARROW COLLISION")
            var explosion = explosions.getFirstExists(false);
            console.log(explosion)
            explosion.reset(someArrow.body.x, someArrow.body.y);
            
            explosion.play('testExplosion', 30, false, false);
            someArrow.kill()
            score = score + 15;

            


            // var angle = game.physics.arcade.angleBetween(someArrow, myChar);
            // angle+=180
            // console.log("angle: " + angle)
            // someArrow.angle = angle;
            // someArrow.body.velocity.x =   Math.cos(someArrow.rotation);
            // someArrow.body.velocity.y = Math.sin(someArrow.rotation);
            

        }
    }
    function bothArrowCollide(someArrow1, someArrow2)
    {
        if (myChar.form == "jumpy")
        {
           
            score = score + 10;
            someArrow2.kill();
        }
    }

    function interactPirate(somePirate, someArrow)
    {
        console.log("pirate collision with arrow")
        somePirate.body.y -= 200
        someArrow.kill()

    }
      
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        // checkArrow(leftArrows)
        // checkArrow(rightArrows)
        // checkArrow(upArrows)
        // checkArrow(downArrows)

        if (powerTimer.running) {
            game.debug.text("Power-up: "  + formatTime(Math.round((timerEvent.delay - powerTimer.ms) / 1000)), 2, 14, "#ff0");
        }
        else {
            game.debug.text("No Power-up Active!", 2, 14, "#0f0");
        }

        console.log(lives)
        var actualScore = "Lives:"
        
        updateLives();
        updateScore();

        if (game.time.now % 20000 === 0)
        {
            spawnSpeed = spawnSpeed - 100
        }
      

        if (game.time.now > speedTimer && lives > 0)
        {

            //number between 15 and 25 seconds?
            var time = Math.floor(Math.random() * 10) + 10;
            speedTimer = game.time.now + time*1000;
            // speedTimer = game.time.now + 5000
            var position = Math.floor(Math.random() * 5) + 1;
            var xPosition = position * 150
            var whichPower = Math.floor(Math.random() * 3) + 1;
            if (whichPower == 1)
            {
                power = game.add.sprite(xPosition, 0, 'speedPower',0);
                game.physics.arcade.enable(power);
                power.body.setSize(20, 20, 1, 1);
                power.outOfBoundsKill = true
                power.checkWorldBounds = true
                power.body.velocity.y = 150
                power.power = "speed"
                powerUpGroup.add(power)
    
    
            }
            else if (whichPower == 2)
            {
                jumpPower = game.add.sprite(xPosition, 0, 'jumpPower',0);
                game.physics.arcade.enable(jumpPower);
                jumpPower.outOfBoundsKill = true
                jumpPower.checkWorldBounds = true
                jumpPower.body.velocity.y = 150
                jumpPower.power = "jump"
                powerUpGroup.add(jumpPower)
    
    
            }
            else if (whichPower == 3)
            {
                slowPower = game.add.sprite(xPosition, 0, 'slowPower',0);
                game.physics.arcade.enable(slowPower);
                slowPower.outOfBoundsKill = true
                slowPower.checkWorldBounds = true
                slowPower.body.velocity.y = 150
                slowPower.power = "slow"
                powerUpGroup.add(slowPower)
            }
           

        }
        game.physics.arcade.overlap(powerUpGroup, myChar, powerCharCollision, null, this);

     
  

        //spawn speed
        if (game.time.now > spawnTime && lives > 0)
        {

            spawnTime = game.time.now + spawnSpeed
            numSpawned = numSpawned + 1;
            generateArrow();
        }

        //generate pirate every 15 seconds
        if (game.time.now > pirateTimer && lives > 0)
        {
            pirateTimer = game.time.now + 10000
            generatePirate()
        }

        //interact pirate and arrow
        game.physics.arcade.overlap(pirateGroup, charLeftGroup, interactPirate, null, this);
        game.physics.arcade.overlap(pirateGroup, charRightGroup, interactPirate, null, this);
        game.physics.arcade.overlap(pirateGroup, charDownGroup, interactPirate, null, this);
        game.physics.arcade.overlap(pirateGroup, charUpGroup, interactPirate, null, this);


        //interact personal arrowGroup and charArrowGroup
        game.physics.arcade.overlap(arrowGroup, charLeftGroup, interactLeft, null, this);
        game.physics.arcade.overlap(arrowGroup, charRightGroup, interactRight, null, this);
        game.physics.arcade.overlap(arrowGroup, charDownGroup, interactDown, null, this);
        game.physics.arcade.overlap(arrowGroup, charUpGroup, interactUp, null, this);



        //character arrrow
        game.physics.arcade.overlap(arrowGroup, myChar, charArrowCollide, null, this);

        //two arrows collide
        game.physics.arcade.overlap(arrowGroup, arrowGroup, bothArrowCollide, null, this);


        game.physics.arcade.overlap(arrowGroup, floor, killArrow, null, this);


        game.physics.arcade.collide(floor, myChar, function(){
            myChar.body.velocity.y = 0;
          }); 

          game.physics.arcade.collide(floor, someArrow, function(){
            console.log("asdaishdjas")
          }); 


          if (cursors.left.isDown)
          {
                fireLeftArrow();
          }
          if (cursors.up.isDown)
          {
                fireUpArrow();
          }
          if (cursors.right.isDown)
          {
                fireRightArrow();
          }
          if (cursors.down.isDown)
          {
                fireDownArrow();
          }


       
      
      

        myChar.body.velocity.x = 0;
        if (this.wasd.left.isDown)
        {
          if (myChar.form == "speedy")
          {
            myChar.body.velocity.x = -1000;

            myChar.animations.play('speed', 30);

          }
          else if (myChar.form == "jumpy")
          {
              myChar.animations.play('jump', 30);
              myChar.body.velocity.x = -500;

  
          }
          else
          {
            myChar.body.velocity.x = -500;

            myChar.animations.play('left', 10);

          }         
        facing = "left"
    
    
        }

        if (this.wasd.right.isDown)
        {
          if (myChar.form == "speedy")
          {
            myChar.body.velocity.x = 1000;

            myChar.animations.play('speed', 30);

          }
        else if (myChar.form == "jumpy")
        {
            myChar.animations.play('jump', 30);
            myChar.body.velocity.x = 500;


        }
          else{
            myChar.body.velocity.x = 500;

            myChar.animations.play('right', 10);

          }
          facing = "right"
    
    
        }
        if (myChar.form == "jumpy")
        {
            myChar.body.gravity.y = 800;

        }
        else
        {
            myChar.body.gravity.y = 400;

        }
        if (this.wasd.down.isDown && game.time.now)
        {
            myChar.body.velocity.y = 250;
        }
        if (this.wasd.down.isDown &&  myChar.form == "jumpy")
        {
            myChar.body.velocity.y = 500;
        }
        
        if (this.wasd.up.isDown && game.time.now > jumpTimer && myChar.form != "jumpy")
        {
            myChar.body.velocity.y = -250;
            jumpTimer = game.time.now + 1250
        }
        else if (this.wasd.up.isDown && game.time.now > jumpTimer && myChar.form == "jumpy"){
            myChar.body.velocity.y = -500;
            jumpTimer = game.time.now + 750
        }
    
    
    }


};
