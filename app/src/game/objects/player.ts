import { getGameHeight, getGameWidth } from 'game/helpers'

interface Props {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame?: number;
}

export class Player extends Phaser.GameObjects.Sprite {
  private leftKey: Phaser.Input.Keyboard.Key
  private rightKey: Phaser.Input.Keyboard.Key
  private jumpKey: Phaser.Input.Keyboard.Key
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private isJumping = false
  //public speed = 200;

  constructor({ scene, x, y, key }: Props) {
    super(scene, x, y, key);

    // sprite
    this.setOrigin(0, 0);

    // Add animations
    // this.anims.create({
    //   key: 'idle',
    //   frames: this.anims.generateFrameNumbers(key || '', { start: 0, end: 1 }),
    //   frameRate: 2,
    //   repeat: -1,
    // });

    // physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 2);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true)
    
    

    // input
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.scene.add.existing(this);
  }

  update(): void {

    if (this.leftKey.isDown) 
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-getGameWidth(this.scene) /4)
    }
    else if (this.rightKey.isDown)
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(getGameWidth(this.scene) / 4)
    }
    else 
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0)
    }

    if (this.jumpKey.isDown && (this.body as Phaser.Physics.Arcade.Body).touching.down)
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-getGameHeight(this.scene) * 0.9)
    }
  }
  //   if ((this.jumpKey.isDown || this.cursorKeys?.up.isDown) && !this.isJumping) {
  //     this.isJumping = true;

  //     (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-getGameHeight(this.scene))

  //   } else if (this.jumpKey.isUp && !this.cursorKeys?.up.isDown && this.isJumping) {
  //     this.isJumping = false
  //   }
  // }
  // update(): void {
  //   // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
  //   const velocity = new Phaser.Math.Vector2(0, 0);
  //   // Horizontal movement
  //   switch (true) {
  //     case this.leftKey.isDown || this.cursorKeys?.left.isDown:
  //       velocity.x -= 1;
  //       this.anims.play('idle', false);
  //       break;
  //     case this.cursorKeys?.right.isDown || this.rightKey.isDown:
  //       velocity.x += 1;
  //       this.anims.play('idle', false);
  //       break;
  //     default:
  //       this.anims.play('idle', true);
  //   }

  //   // Vertical movement
  //   switch (true) {
  //     case this.cursorKeys?.down.isDown:
  //       velocity.y += 1;
  //       this.anims.play('idle', false);
  //       break;
  //     case this.cursorKeys?.up.isDown:
  //       velocity.y -= 1;
  //       this.anims.play('idle', false);
  //       break;
  //     default:
  //       this.anims.play('idle', true);
  //   }

  //   // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
  //   const normalizedVelocity = velocity.normalize();
  //   (this.body as Phaser.Physics.Arcade.Body).setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
  // }
}
