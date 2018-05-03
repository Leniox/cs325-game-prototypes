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
    
    var game = new Phaser.Game( 900, 700, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'asd', 'assets/blue_sky.jpg' )  ;
        game.load.image( 'hand', 'assets/hand.png' )  ;
        //blocks
        game.load.image('small_block', 'assets/small_black-square-hi.png')
        game.load.image('med_block', 'assets/med_black-square-hi.png')
        game.load.image('large_block', 'assets/large_black-square-hi.png')
        //circles
        game.load.image('small_circle', 'assets/small_black_ball.png')
        game.load.image('large_circle', 'assets/large_black_ball.png')
        //stars
        game.load.image('small_star', 'assets/small_white_star.png')
        game.load.image('med_star', 'assets/med_white_star.png')
        game.load.image('large_star', 'assets/large_white_star.png')



        game.load.audio('boden', ['assets/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/bodenstaendig_2000_in_rock_4bit.ogg']);




        game.load.spritesheet('balloon', 'assets/sprite_balloon.png', 166 , 250, 5)


    }
    
    var bouncy;
    var background
    var balloon;
    var hand
    var round1Group = null
    var round2Group = null
    var round3Group = null
    var hasStartedRound2 = false
    var hasStartedRound3 = false
    var howManyRoundsOfRound2 = 0
    var objectSpeed = 0.1
    var endGameTextGroup;
    var music;
    var leftEmitter;
    var rightEmitter;
    var round3IsDone = false;
    var round2IsDone = false


    
    function create() {


        background =  game.add.tileSprite(0,0,900,700,'asd')

        // Create a sprite at the center of the screen using the 'logo' image.
        // bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        // bouncy.anchor.setTo( 0.5, 0.5 );


        // music = game.add.audio('boden');

        // music.play();
        // game.physics.arcade.checkCollision.bottom = false;
        // game.physics.arcade.checkCollision.top    = false;

        balloon = game.add.sprite(game.width/2 - 100, game.height/2 + 100 , 'balloon');
        hand = game.add.sprite(game.width/2 - 100, game.height/2 + 100 , 'hand');
        hand.enableBody = true
        game.physics.enable([ hand, balloon ], Phaser.Physics.ARCADE);

        // hand.body.collideWorldBounds = true;


        endGameTextGroup = game.add.group();
        endGameTextGroup.visible = false;
        var text = game.add.text(game.width/2 - 200, game.height/2, "You Died! Please refresh to restart", { fontSize: '32px', fill: '#ffffff' }, endGameTextGroup);


        round1Group = game.add.group();
        round1Group.enableBody = true
        round1Group.physicsBodyType = Phaser.Physics.ARCADE;
        // setUpRound1()
        setUpRound1()

        round1Group.setAll('body.bounce.x', 0);
        round1Group.setAll('body.bounce.y', 0);
        // round1Group.setAll('outOfBoundsKill', true);
        // round1Group.setAll('checkWorldBounds', true);   

        round2Group = game.add.group();
        round2Group.enableBody = true
        round2Group.physicsBodyType = Phaser.Physics.ARCADE;
        round2Group.setAll('body.bounce.x', 0);
        round2Group.setAll('body.bounce.y', 0);
        // round2Group.setAll('outOfBoundsKill', true);
        // round2Group.setAll('checkWorldBounds', true);   

        round3Group = game.add.group();
        round3Group.enableBody = true
        round3Group.physicsBodyType = Phaser.Physics.ARCADE;
        round3Group.setAll('outOfBoundsKill', true);
        round3Group.setAll('checkWorldBounds', true);   

        balloon.animations.add('fly', [0,1,2,3,4,3,2,1]);
        balloon.animations.play('fly', 10, true);


        leftEmitter = game.add.emitter(50, game.world.centerY - 300);
        leftEmitter.bounce.setTo(0.5, 0.5);
        leftEmitter.setXSpeed(50, 100);
        leftEmitter.setYSpeed(-2, 75);
        leftEmitter.makeParticles('small_star', 0, 25, true, false);
    
        rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 300);
        rightEmitter.bounce.setTo(0.5, 0.5);
        rightEmitter.setXSpeed(-50, -100);
        rightEmitter.setYSpeed(-2, 75);
        rightEmitter.makeParticles('small_star', 1, 25, true, false);
  





        // balloon.animations.add('left', [10,9,8,9,10]);

        
        // Turn on the arcade physics engine for this sprite.
        // game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // // Make it bounce off of the world bounds.
        // bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        // text.anchor.setTo( 0.5, 0.0 );
    }

    //what I need to do here is check the block and if its a certain size, set the velocity accordingly 
    function swipe(hand, someBlock) {

        console.log("collision between hand and block")
        someBlock.body.velocity.y = -1500;
        someBlock.body.angularVelocity = 200;


    
    }
    //initial round to train you to the game
    function setUpRound1()
    {
        // friendAndFoe = game.add.group();
        // enemies = game.add.group();
    
        for (var i = 0; i < 18; i++) {
            var xPosition = i*50
            var yPosition = 0
            var someBlock = game.add.sprite(xPosition, yPosition, 'small_block');

            someBlock.physicsBodyType = Phaser.Physics.ARCADE;
            game.physics.arcade.enable(someBlock);
            game.physics.arcade.collide(balloon, someBlock, die)
            someBlock.body.bounce.setTo(1, 1);
            round1Group.add(someBlock)
            // round1Group.create(xPosition, yPosition, 'small_block')

            


        }
       
    }
    //normal rounds that are all random
    //what I want to do is I want to associate a velocity assocaited with each size
    //such that the bigger pieces are harder to move out of the way and the smaller pieces are not that hard
    
    //another thing I want to do is have the objects move toward you if that option is chosen randomly
    function setUpRound2()
    {
        console.log("WTF")

        round2Group = game.add.group();
        var numberOfRows = Math.floor(Math.random() * 3) + 1;
        // var numberOfRows = 2

        console.log("number of rows: " + numberOfRows)
        var justChosen = 0
        for (var i = 0; i < numberOfRows; i++) {
            //need to put each consecutive row above the other so we do that using theYposition

            var whichObject = Math.floor(Math.random() * 3);
            console.log("object: " + whichObject)

            if (whichObject == 0)
            {
                //blocks
                var whichSize = Math.floor(Math.random() * 3);
                console.log("size: " + whichSize)

                //small
                if (whichSize == 0)
                {
                    for (var j = 0; j < 18; j++) {
                        var xPosition = j*50
                        var yPosition = justChosen
                        var someBlock = game.add.sprite(xPosition, yPosition, 'small_block');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-50

                }
                //medium
                else if (whichSize == 1)
                {
                    for (var j = 0; j < 11; j++) {
                        var xPosition = j*80
                        var yPosition =  justChosen 
                        var someBlock = game.add.sprite(xPosition, yPosition, 'med_block');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-80

                }
                //large
                else {
                    for (var j = 0; j < 8; j++) {
                        var xPosition = j*105
                        var yPosition = justChosen 
                        var someBlock = game.add.sprite(xPosition, yPosition, 'large_block');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-105

                }

            }
            else if (whichObject == 1)
            {
                //circles
                var whichSize = Math.floor(Math.random() * 2);
                console.log("size: " + whichSize)

                //small
                if (whichSize == 0)
                {
                    for (var j = 0; j < 22; j++) {
                        var xPosition = j*40
                        var yPosition = justChosen 
                        var someBlock = game.add.sprite(xPosition, yPosition, 'small_circle');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-23

                }
                //large
                else if (whichSize == 1)
                {
                    for (var j = 0; j < 5; j++) {
                        var xPosition = j*177
                        var yPosition = justChosen 
                        var someBlock = game.add.sprite(xPosition, yPosition, 'large_circle');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=100

                }
                // //large
                // else {

                // }
            }
            else
            {
                //stars
                var whichSize = Math.floor(Math.random() * 3);
                console.log("size: " + whichSize)

                //small
                if (whichSize == 0)
                {
                    for (var j = 0; j < 18; j++) {
                        var xPosition = j*50
                        var yPosition = justChosen 
                        var someBlock = game.add.sprite(xPosition, yPosition, 'small_star');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-48

                }
                //medium
                else if (whichSize == 1)
                {
                    for (var j = 0; j < 9; j++) {
                        var xPosition = j*100
                        var yPosition = justChosen
                        var someBlock = game.add.sprite(xPosition, yPosition, 'med_star');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-196

                }
                //large
                else {
                    for (var j = 0; j < 6; j++) {
                        var xPosition = j*140
                        var yPosition =  justChosen

                        var someBlock = game.add.sprite(xPosition, yPosition, 'large_star');
            
                        someBlock.physicsBodyType = Phaser.Physics.ARCADE;
                        game.physics.arcade.enable(someBlock);
                        someBlock.body.bounce.setTo(1, 1);
                        round2Group.add(someBlock)
                    }
                    justChosen+=-134

                }
            }
        }

    }
    //emitter round (boss round or hardest round since it's an emitter.)
    function setUpRound3()
    {
        console.log("inside round3")
        
    // explode, lifespan, frequency, quantity
        leftEmitter.start(false, 0, 250);
        rightEmitter.start(false, 0, 250);

        game.physics.arcade.collide(hand, leftEmitter, swipe)
        game.physics.arcade.collide(hand, rightEmitter, swipe)
    }
    function die(balloon, round)
    {
    
      balloon.kill();
      round1Group.kill();
      round2Group.kill();
      round3Group.kill();
      game.world.bringToTop(endGameTextGroup);
      endGameTextGroup.visible = true;
      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.addOnce(restartGame);
    }
    function restartGame(){
        console.log("DEAD")
        endGameTextGroup.visible = false;
        game.world.remove(endGameTextGroup);
        balloon.revive();
        hasStartedRound2 = false
        round2IsDone = true
        howManyRoundsOfRound2 = 0
        objectSpeed = 0.1
        setUpRound1()
        

    

    } 

    function move (group)
    {
        group.body.y += 10
    }

    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.

        game.physics.arcade.collide(hand, leftEmitter, swipe)
        game.physics.arcade.collide(hand, rightEmitter, swipe)
        
        background.tilePosition.y += 2
        var allPast = 0
        hand.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);
        round1Group.forEachAlive(function(round1Group)    
        {       
            round1Group.body.y += 0.7 + objectSpeed;   
            round1Group.body.velocity.x = 0
            round1Group.body.velocity.y = 0

            // if (round1Group.body.position.y > 0 && round1Group.body.outOfBoundsKill == undefined)
            // {
            //     console.log("setting collision")
            //     round1Group.body.checkWorldBounds=true;
            //     round1Group.body.outOfBoundsKill=true;

            // }
              if (round1Group.body.position.y > 0)
            {
              allPast++

            }

        }, this)

        if (allPast == round1Group.children.length)
        {
            round1Group.setAll('outOfBoundsKill', true);
            round1Group.setAll('checkWorldBounds', true);   

        }
        allPast = 0
        round2Group.forEachAlive(function(round2Group)    
        {       
            round2Group.body.y += 0.7 + objectSpeed;   
            round2Group.body.velocity.x = 0
            round2Group.body.velocity.y = 0

            if (round2Group.body.position.y > 0)
            {
                // round2Group.body.collideWorldBounds=true;
                // round2Group.body.outOfBoundsKill=true;
                allPast++

            }

        }, this)

        if (allPast == round2Group.children.length)
        {
            round2Group.setAll('outOfBoundsKill', true);
            round2Group.setAll('checkWorldBounds', true);   

        }



        if (leftEmitter.countLiving() == 0 && rightEmitter.countLiving() == 0 && hasStartedRound3)
        {
            console.log("going back to round2HELLOASIDNAISHD")
            round3IsDone = true
            hasStartedRound3 = false
            howManyRoundsOfRound2 = 0

        }

        if (round1Group.countLiving() == 0 && !hasStartedRound2 && !hasStartedRound3)
        {
            hasStartedRound2 = true
            objectSpeed+=0.15
            console.log("WTF")
            setUpRound2()
            howManyRoundsOfRound2+=1
            round2IsDone = false
            
        }

        if (round2Group.countLiving() == 0)
        {
            round2IsDone = true
        }

        if (hasStartedRound2 == true && round2IsDone && howManyRoundsOfRound2 < 2 && !hasStartedRound3)
        {
            howManyRoundsOfRound2++
            console.log("WTF")

            console.log("rounds2: " + howManyRoundsOfRound2)
            objectSpeed+=0.15
            setUpRound2()
            
            round2IsDone = false
        }
        if (howManyRoundsOfRound2 == 2 && !hasStartedRound3 && round2IsDone)
        {
            setUpRound3()
            hasStartedRound3 = true
        }
        
        game.physics.arcade.collide(balloon, round1Group, function(){
            console.log("asdaishdjas")
          });


        game.physics.arcade.collide(hand, round1Group, swipe)
        game.physics.arcade.collide(hand, round2Group, swipe)

        game.physics.arcade.collide(balloon, leftEmitter, die)
        game.physics.arcade.collide(balloon, rightEmitter, die)
          

        //why is this code not working?????
        game.physics.arcade.overlap(balloon, round1Group, die, null, this);
        game.physics.arcade.overlap(balloon, round1Group, die)
        game.physics.arcade.overlap(balloon, round2Group, die)







      
    
    }
}
