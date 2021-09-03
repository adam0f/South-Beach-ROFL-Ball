import {
  LEFT_CHEVRON, BG, CLICK, BOTTOM
} from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player, Ball, Crab } from 'game/objects';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private balls?: Phaser.GameObjects.Group
  private crabs?: Phaser.GameObjects.Group
  private score = 0
  private scoreText?: Phaser.GameObjects.Text;
  private ballCount = 3
  private ballCountText?: Phaser.GameObjects.Text
  private balldead = false
  private toleranceLevel = 75
  private tolText?: Phaser.GameObjects.Text

  // Sounds
  private back?: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  private getCrab = () => {
    const size = Math.floor(Math.random() * 3) + 1 
    const speed = (Math.random() * 2) *  getGameWidth(this)
    const direction = Math.floor(Math.random() * 2) 

    this.crabType(size, speed, direction)
  }

  private crabType = (size: number, speed: number, direction: number): void => {
    const crab: Crab = this.crabs?.get()
    crab.activate(size, speed, direction)

  }

  private ballGenerate = () => {
    const dropLocation = 0
    const dropAngle = 600

    this.dropBall(dropLocation, dropAngle)

  // PLACEMENT NEEDS TO BE STATIC or based on trait - kinship????
  //   const placement = Math.floor(Math.random() * 6) + 1
  //   const dropAngle = Math.floor(Math.random() * (getGameWidth(this) / 5))
  //   for (let i = 0; i < 6; i++) {
  //     if (i == placement ) {
  //       const dropLocation = placement * (getGameWidth(this) / 6)
  //          this.dropBall(dropLocation, dropAngle)
  //     } 
  //  }
 }

  private dropBall = (dropLocation: number, dropAngle: number): void => {
    const ball: Ball = this.balls?.get()
    ball.activate(dropLocation, dropAngle)

  }

  public create(): void {
    // Add layout
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.createBackButton();
    this.scoreText = this.add.text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.15, this.score.toString(), { color: '0x005500'}).setFontSize(getRelative(94, this)).setOrigin(0.5).setDepth(1)
    this.ballCountText = this.add.text(getGameWidth(this) * 0.2, getGameHeight(this) * 0.15, this.ballCount.toString(), { color: '0x000000'}).setFontSize(getRelative(94, this)).setOrigin(0.5).setDepth(1)
    this.tolText = this.add.text(getGameWidth(this) * 0.8, getGameHeight(this) * 0.15, this.toleranceLevel.toString(), { color: '0x000000'}).setFontSize(getRelative(94, this)).setOrigin(0.5).setDepth(1)

    const bottom = this.add.sprite(getGameWidth(this)/2 , getGameHeight(this) * 0.75 + getGameHeight(this) / 5.3333, BOTTOM).setDisplaySize(getGameWidth(this), getGameHeight(this) / 5.3333)  
    this.physics.add.existing(bottom, true)

    const floor = this.add.rectangle(0, getGameHeight(this) * 0.9).setDisplaySize(getGameWidth(this), 50).setOrigin(0, 0)
    this.physics.add.existing(floor, true)

    const leftWall = this.add.rectangle(-100, -getGameHeight(this) * 40, 0x000000).setDisplaySize(50, getGameHeight(this) * 50,).setOrigin(0, 0)
    this.physics.add.existing(leftWall, true)

    const rightWall = this.add.rectangle(getGameWidth(this), -getGameHeight(this) * 40, 0x000000).setDisplaySize(50, getGameHeight(this) * 50,).setOrigin(0, 0)
    this.physics.add.existing(rightWall, true)

    this.crabs = this.add.group({
      maxSize: 500,
      classType: Crab,
    })

    this.getCrab()

    //reduce delay as score increases 
    this.time.addEvent({
      delay: 1000,
      callback: this.getCrab,
      callbackScope: this, 
      loop: true,
    })

    this.balls = this.add.group({
      maxSize: 5,
      classType: Ball,
    })   

    this.ballGenerate()    

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    })
  
    this.physics.add.collider(bottom, this.player);
    this.physics.add.collider(floor, this.balls);
    this.physics.add.collider(leftWall, this.balls);
    this.physics.add.collider(rightWall, this.balls);
    this.physics.add.collider(this.player,this.balls, () => { this.addScore() });
    this.physics.add.collider(this.balls, this.crabs, () => { this.cycleBall() });
    this.physics.add.collider(this.player, this.crabs, (player, Crab) => { Crab.destroy(), this.toleranceLevel--, this.tolText?.setText(this.toleranceLevel.toString())})
  }
  
  private cycleBall() {
    if (this.ballCount > 0) {
      this.ballCount--;
      //add a frame for popped ball
       Phaser.Actions.Call((this.balls as Phaser.GameObjects.Group).getChildren(), (ball) => { 
        (ball.body as Phaser.Physics.Arcade.Body).destroy();
        },
      this,)
      this.ballCountText?.setText(this.ballCount.toString())
      this.balldead = true
    }
  }

  private addScore() {
    this.score += 1
    this.scoreText?.setText(this.score.toString())
  }

  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on('pointerdown', () => {
        this.back?.play();
        window.history.back();
      });
  };

  public update(): void {
    // Every frame, we update the player
    this.player?.update();

    if (this.balldead === true && this.ballCount > 0) {
      this.ballGenerate()
      this.balldead = false 
    } else if (this.ballCount === 0) {
      window.history.back();
    }
  }
}
