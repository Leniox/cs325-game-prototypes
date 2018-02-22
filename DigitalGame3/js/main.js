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
        game.load.spritesheet('thief', 'assets/thief_sprite_nobackgronud.png', 67 , 190, 55);
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
        myChar = game.add.sprite(game.width/2, game.height/2, 'thief', 8);
        myChar.animations.add('right', [8,9,10,9,8]);
        myChar.animations.add('left', [10,9,8,9,10]);

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


    function setUpArrows(){
        leftArrows = game.add.group();
        leftArrows.createMultiple(10, 'left_Arrow')
        leftArrows.enableBody = true;
        leftArrows.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.arcade.enable(leftArrows);

        leftArrows.setAll('outOfBoundsKill', true);
        leftArrows.setAll('checkWorldBounds', true);
        leftArrows.visibility = false


        rightArrows = game.add.group();
        rightArrows.createMultiple(10, 'right_Arrow')
        rightArrows.enableBody = true;
        rightArrows.physicsBodyType = Phaser.Physics.ARCADE;
        rightArrows.setAll('outOfBoundsKill', true);
        rightArrows.setAll('checkWorldBounds', true);
        rightArrows.visibility = false
        game.physics.arcade.enable(rightArrows);


        upArrows = game.add.group();
        upArrows.createMultiple(10, 'up_Arrow')
        upArrows.enableBody = true;
        upArrows.physicsBodyType = Phaser.Physics.ARCADE;
    
        upArrows.setAll('outOfBoundsKill', true);
        upArrows.setAll('checkWorldBounds', true);
        upArrows.visibility = false
        game.physics.arcade.enable(upArrows);

        downArrows = game.add.group();
        downArrows.createMultiple(10, 'down_Arrow')
        
        downArrows.enableBody = true;
        downArrows.physicsBodyType = Phaser.Physics.ARCADE;
        downArrows.setAll('outOfBoundsKill', true);
        downArrows.setAll('checkWorldBounds', true);
        downArrows.visibility = true
        game.physics.arcade.enable(downArrows);


        arrows.push(upArrows)
        arrows.push(leftArrows)
        arrows.push(downArrows)
        arrows.push(rightArrows)

    
        

 

    
        
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

    function generateArrow()
    {
        var arrowIndex = Math.floor(Math.random() * 4);
            var position = Math.floor(Math.random() * 5) + 1;
            var xPosition = position * 200 - 100;
            if (arrowIndex === 0)
            {
                  someArrow = game.add.sprite(xPosition, 0, 'left_Arrow',0);
                  someArrow.direction = "left"
                  arrowGroup.add(someArrow)
               
    
                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = 200
           


            }
            else if (arrowIndex === 1)
            {
                 someArrow = game.add.sprite(xPosition, 0, 'right_Arrow',0);
                someArrow.enableBody = true;
                someArrow.direction = "right"

                 someArrow.physicsBodyType = Phaser.Physics.ARCADE;
                 game.physics.arcade.enable(someArrow);
                 arrowGroup.add(someArrow)

                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = 200
         

            }
            else if (arrowIndex === 2)
            {
                 someArrow = game.add.sprite(xPosition, 0, 'up_Arrow',0);
                someArrow.enableBody = true;
                someArrow.direction = "up"

                 someArrow.physicsBodyType = Phaser.Physics.ARCADE;
                 game.physics.arcade.enable(someArrow);
                 arrowGroup.add(someArrow)

                 someArrow.outOfBoundsKill = true
                 someArrow.checkWorldBounds = true
                 someArrow.body.velocity.y = 200
                 game.physics.arcade.overlap(someArrow, floor, killArrow, null, this);

         

            }
            else{
                 someArrow = game.add.sprite(xPosition, 0, 'down_Arrow');
                 someArrow.direction = "down"

                 game.physics.enable(someArrow, Phaser.Physics.ARCADE);
                 someArrow.body.velocity.y = 200
                 arrowGroup.add(someArrow)

                 console.log(someArrow)

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
        console.log(lives)
        var actualScore = "Lives:"
        
        updateLives();
        updateScore();

        if (game.time.now % 20000 === 0)
        {
            spawnSpeed = spawnSpeed + 200
        }
        





        if (game.time.now > spawnTime)
        {
            spawnTime = game.time.now + spawnSpeed
            numSpawned = numSpawned + 1;
            generateArrow();
      
        }


        game.physics.arcade.overlap(arrowGroup, charLeftGroup, interactLeft, null, this);
        game.physics.arcade.overlap(arrowGroup, charRightGroup, interactRight, null, this);
        game.physics.arcade.overlap(arrowGroup, charDownGroup, interactDown, null, this);
        game.physics.arcade.overlap(arrowGroup, charUpGroup, interactUp, null, this);




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
          myChar.body.velocity.x = -500;
          myChar.animations.play('left', 30);
          facing = "left"
    
    
        }

        if (this.wasd.right.isDown)
        {
          myChar.body.velocity.x = 500;
          myChar.animations.play('right', 30);
          facing = "right"
    
    
        }
        if (this.wasd.up.isDown && game.time.now > jumpTimer)
        {
            myChar.body.velocity.y = -250;
            jumpTimer = game.time.now + 1250
        }
    
    
    }


};
