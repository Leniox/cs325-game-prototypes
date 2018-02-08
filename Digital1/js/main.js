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

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
  });


  function preload() {
    // Load an image and call it 'logo'.
    game.load.image('myChar', 'assets/kirito_by_vali233.png');
    game.load.image()
    game.load.image('bullet', 'assets/bullet11.png');

    var string = "this is string"
    
 
  }

  var myChar;
  var cursors;
  var walk;
  var bulletTime = 0;
  var bullet;
  var bullets;
  var fireButton;
  function create() {
    // Create a sprite at the center of the screen using the 'logo' image.
    myChar = game.add.sprite(game.world.centerX, game.world.centerY, 'myChar');
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
      font: "25px Verdana",
      fill: "#9999ff",
      align: "center"
    };
    var text = game.add.text(game.world.centerX, 15, "Press Space Bar.", style);
    text.anchor.setTo(0.5, 0.0);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // game.camera.follow(bouncy);

    cursors = game.input.keyboard.createCursorKeys();
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

  }

  function update() {
    // Accelerate the 'logo' sprite towards the cursor,
    // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
    // in X or Y.
    // This function returns the rotation angle that makes it visually match its
    // new trajectory.

    myChar.body.velocity.x = 0;
    myChar.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
      myChar.body.velocity.y = -200;
      myChar.animations.play('walk', 30, true);

        
    }
    
    if (cursors.down.isDown)
    {
      myChar.body.velocity.y = 200;
      myChar.animations.play('walk', 30, true);

        
    }
    if (fireButton.isDown)
    {
      fireBullet();
    }

    if (cursors.left.isDown)
    {
      myChar.body.velocity.x = -150;
      myChar.animations.play('walk', 30, true);

    }
    else if (cursors.right.isDown)
    {
      myChar.body.velocity.x = 150;
      myChar.animations.play('walk', 30, true);

    }

    // bouncy.rotation = game.physics.arcade.accelerateToPointer(bouncy, game.input.activePointer, 500, 500, 500);
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
            //  And fire it
            bullet.reset(myChar.x, myChar.y + 8);
            bullet.body.velocity.x= 400;
            bulletTime = game.time.now + 200;
        }
    }

}
};

