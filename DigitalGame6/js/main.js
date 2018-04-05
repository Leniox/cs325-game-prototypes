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
        game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'background', 'assets/spaceTheme.jpg' );
        game.load.image( 'tether', 'assets/tetherBall.png' );
        game.load.image( 'badGuy', 'assets/badGuy.png' );




    }
    var doOnce = false
    var sprite;
    var bouncy;
    var backgroundTheme;
    var cursors;
    var endBoundary = 1000
    var tetherGroup;
    var spriteCloest;
    var lowestDistance = 10000;
    var xDirection;
    var yDirection;
    var onNegative = false
    var badGuyGroup;
    var deathCounter = 19;
    var endGameTextGroup



    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        
        backgroundTheme = game.add.tileSprite(0,0,1000,563,'background')
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // bouncy.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );

        bouncy.body.collideWorldBounds = true;
        bouncy.body.bounce.setTo(1);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        bouncy.body.onWorldBounds = new Phaser.Signal();
        bouncy.body.velocity.x = 200;
        bouncy.body.velocity.y = 200;


        endGameTextGroup = game.add.group();

        endGameTextGroup.visible = false;
        var text = game.add.text(game.width/2 - 200, game.height/2, "You Won! Press Space Bar to replay.", { fontSize: '32px', fill: '#ffffff' }, endGameTextGroup);
        //  And then listen for it
        // bouncy.body.onWorldBounds.add(hitWorldBounds, this);

        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        
        // Turn on the arcade physics engine for this sprite.
        // game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        cursors = game.input.keyboard.createCursorKeys();
        tetherGroup = game.add.group();
        badGuyGroup = game.add.group();
        badGuyGroup.enableBody = true
        badGuyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        for (var i = 0; i < 10; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            var yIndex = Math.floor((Math.random() * 6) + 1) * 70;
            var xIndex = i*95;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }
            badGuyGroup.create(xIndex, yIndex, 'badGuy');

            var yIndex = Math.floor((Math.random() * 6) + 1) * 100;
            var xIndex = i*95;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }
            badGuyGroup.create(xIndex, yIndex, 'badGuy');
        }

        

        for (var i = 0; i < 10; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            var yIndex = Math.floor((Math.random() * 6) + 1) * 100;
            var xIndex = i*90;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }


            tetherGroup.create(xIndex, yIndex, 'tether');
        }
    


        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Click to Tether to the balls. Kill enemies.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function latch()
    {

     bouncy.position.rotate(spriteCloest.x, spriteCloest.y, 4, true, distance(bouncy.x , bouncy.y , spriteCloest.x , spriteCloest.y));



    }
    function distance (x1, y1, x2, y2) {

        var dx = Math.abs(x1 - x2);
        var dy = Math.abs(y1 - y2);

        // console.log(Math.sqrt(dx * dx + dy * dy))
        return Math.sqrt(dx * dx + dy * dy);

    }

    function hitWorldBounds (sprite) {

        //  Play the flash animation.
        //  
        //  Sometimes you'll notice it doesn't always start, i.e. if the sprite
        //  collides with the world bounds quickly before the previous 'flash'
        //  has completed. This is just because the animation needs to complete
        //  before playing again, the event did actually occur twice.

        if (!onNegative) 
        {
            xDirection =  -5  * Math.cos(120);
            yDirection =  -5 * Math.sin(60);
            onNegative = true
        }
        else{
            xDirection =  5  * Math.cos(120);
            yDirection =  5 * Math.sin(60);
            onNegative = false;
        }
        
    
        
        
    }
    function charEnemeyCollide (badGuy, bouncy)
    {
        bouncy.kill()
        deathCounter-=1
        console.log(deathCounter)
    }

    function endGame()
    {
      bouncy.kill();
      tetherGroup.kill();
      game.world.bringToTop(endGameTextGroup);
      endGameTextGroup.visible = true;
      var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.addOnce(restartGame);
    }

    function restartGame(){
        console.log("DEAD")
        endGameTextGroup.visible = false;
        game.world.remove(endGameTextGroup);
        deathCounter = 20
        bouncy.revive();
        tetherGroup.revive();


        for (var i = 0; i < 10; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            var yIndex = Math.floor((Math.random() * 6) + 1) * 100;
            var xIndex = i*100;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }
            badGuyGroup.create(xIndex, yIndex, 'badGuy');

            var yIndex = Math.floor((Math.random() * 6) + 1) * 100;
            var xIndex = i*100;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }
            badGuyGroup.create(xIndex, yIndex, 'badGuy');
        }

        

        for (var i = 0; i < 10; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            var yIndex = Math.floor((Math.random() * 6) + 1) * 100;
            var xIndex = i*90;
            if (i == 0)
            {
                xIndex = xIndex + 20;
            }


            tetherGroup.create(xIndex, yIndex, 'tether');
        }



    } 
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        // bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        
        //find nearset distance
        
        // console.log(spriteCloest)
        if (deathCounter <= 1)
        {
            endGame();
        }
        

    game.physics.arcade.overlap(badGuyGroup, bouncy, charEnemeyCollide, null, this);


    if (game.input.activePointer.isDown)
    {
        latch()
        //relative
        // console.log(((bouncy.x - spriteCloest.x) + (bouncy.y - spriteCloest.y)) / 2) 
        // console.log(((bouncy.y - spriteCloest.y))) 
        // console.log("distance: " + distance(bouncy.x , bouncy.y , spriteCloest.x , spriteCloest.y))



    }
    // if (bouncy.angle > -1.5 && bouncy.angle < 1.5)
    // {
       
    // }
    // else{
    //     bouncy.x = bouncy.x - 1 * Math.cos(bouncy.rotation);
    //     bouncy.y = bouncy.y - 1 * Math.sin(bouncy.rotation);
    // }
   
    
    if (game.input.activePointer.isUp)
    {
        // console.log("is up")
        lowestDistance = 10000
        for (var i = 0; i < tetherGroup.children.length; i++)
        {

            if (distance(bouncy.x, bouncy.y,tetherGroup.children[i].x , tetherGroup.children[i].y) < lowestDistance)
            {
                
                lowestDistance = distance(bouncy.x, bouncy.y,tetherGroup.children[i].x , tetherGroup.children[i].y)
                // console.log("asd")
                // console.log(lowestDistance)

                spriteCloest = tetherGroup.children[i];
            }
        }
    }
    
    // bouncy.x = bouncy.x + xDirection
    // bouncy.y = bouncy.y + yDirection


        // bouncy.body.velocity.x = 0;
        // if (bouncy.x > endBoundary - 200)
        // {
        //     console.log("in here")
        //     backgroundTheme.tilePosition.x += 1000
        //     endBoundary+=1000
        // }

        // if (cursors.left.isDown)
        // {
        //     bouncy.body.velocity.x = -500;

        // }
        // if (cursors.up.isDown)
        // {
        // }
        // if (cursors.right.isDown)
        // {
        //     bouncy.body.velocity.x = 500;

        // }
        // if (cursors.down.isDown)
        // {
        // }


    }
};
