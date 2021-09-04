import {
  LEFT_CHEVRON, BG, CLICK, BOTTOM, TREES,
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
  private toleranceLevel = 0
  private tolText?: Phaser.GameObjects.Text
  private gameBoard?: Phaser.GameObjects.Text

  // Sounds
  private back?: Phaser.Sound.BaseSound;
 // private bopSound?: Phaser.Sound.BaseSound;
  // private popSound?: Phaser.Sound.BaseSound;
  //private boopSound?: Phaser.Sound.BaseSound;

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
    const bounce = this.selectedGotchi?.withSetsNumericTraits[1] as number * 0.005

    this.dropBall(dropLocation, dropAngle, bounce)

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

  private dropBall = (dropLocation: number, dropAngle: number, bounce: number): void => {
    const ball: Ball = this.balls?.get()
    ball.activate(dropLocation, dropAngle, bounce)

  }

  public create(): void {
    // Add layout
    this.toleranceLevel = (25 + (this.selectedGotchi?.withSetsNumericTraits[3] as number * 0.5))
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, TREES).setDisplaySize(getGameWidth(this), getGameHeight(this)).setDepth(0.75);
    this.back = this.sound.add(CLICK, { loop: false });
    //this.bopSound = this.sound.add(BOP, { loop: false});
    //this.popSound = this.sound.add(POP, { loop: false});
    //this.boopSound = this.sound.add(BOOP, {loop: false})
    this.createBackButton();
    this.gameBoard = this.add.text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.1, 'Balls Remaining   Score   Irritation level', { color: '#604000' }).setFontSize(getRelative(50, this)).setOrigin(0.5).setDepth(1)
    this.scoreText = this.add.text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.15, this.score.toString(), { color: '#604000' }).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)
    this.ballCountText = this.add.text(getGameWidth(this) * 0.33, getGameHeight(this) * 0.15, this.ballCount.toString(), { color: '#604000'}).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)
    this.tolText = this.add.text(getGameWidth(this) * 0.65, getGameHeight(this) * 0.15, this.toleranceLevel.toString(), { color: '#604000'}).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)

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

    this.time.addEvent({
      delay: 750 + (this.selectedGotchi?.withSetsNumericTraits[2] as number * 20),
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
    //this.physics.overlap(this.player,this.balls, (_, Ball) => { this.Ball.handleoverlap(); this.addScore() });
    this.physics.add.collider(this.player,this.balls, () => { this.addScore();/*this.bopSound?.play()*/ });
    this.physics.add.collider(this.balls, this.crabs, () => { this.cycleBall() });
    this.physics.add.collider(this.player, this.crabs, (_, Crab) => { Crab.destroy(), this.toleranceLevel--, this.tolText?.setText(this.toleranceLevel.toString())})
  }
  
  private cycleBall() {
    if (this.ballCount > 0) {
    // this.popSound?.play();
      this.ballCount--;
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
