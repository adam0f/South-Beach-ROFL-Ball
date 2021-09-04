import { getGameHeight, getGameWidth } from 'game/helpers'
import { AavegotchiGameObject } from 'types';

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
  private selectedGotchi?:  AavegotchiGameObject; 
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor({ scene, x, y, key }: Props) {
    super(scene, x, y, key);

    // init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    //   this.selectedGotchi = data.selectedGotchi;
    // };

    

    // sprite
    this.setOrigin(0, 0);
    this.displayWidth = getGameWidth(this.scene) * 0.09
    this.displayHeight = getGameWidth(this.scene) * 0.09

    //Add animations
    this.anims.create({
      key: 'Jump',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 1, 0 ]}),
      frameRate: 2,
    });

    // physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 2);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setSize(getGameWidth(this.scene) * 0.09, getGameWidth(this.scene) * 0.09)    

    // input
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    
    this.scene.add.existing(this);
  }

  update(): void {

    if (this.leftKey.isDown || this.cursorKeys?.left.isDown) 
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-getGameWidth(this.scene) * 0.4)
    }
    else if (this.rightKey.isDown || this.cursorKeys?.right.isDown)
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(getGameWidth(this.scene) * 0.4)
    }
    else 
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0)
    }

    if ((this.jumpKey.isDown || this.cursorKeys?.up.isDown || this.cursorKeys?.space.isDown) && (this.body as Phaser.Physics.Arcade.Body).touching.down)
    {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-getGameHeight(this.scene) * 1)
      this.anims.play('Jump')
    }
  }
}