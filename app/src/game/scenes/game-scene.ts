import {
  LEFT_CHEVRON, BG, CLICK, BOTTOM, TREES, BOP, POP, MUSIC, WAVES
} from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player, Ball, Crab } from 'game/objects';
import { Socket } from 'socket.io-client';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private socket?: Socket
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
  private wave?: Phaser.GameObjects.Group  
  private isGameOver = false
  private scoreFlip = true
  private scoreCount = 0 

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private bopSound?: Phaser.Sound.BaseSound;
  private popSound?: Phaser.Sound.BaseSound;
  private music?: Phaser.Sound.BaseSound
 
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
    const bounce = this.selectedGotchi?.withSetsNumericTraits[1] as number * 0.003

    this.dropBall(dropLocation, dropAngle, bounce)
 }

  private dropBall = (dropLocation: number, dropAngle: number, bounce: number): void => {
    const ball: Ball = this.balls?.get()
    ball.activate(dropLocation, dropAngle, bounce)
  }

  private scoreCounter() {
    this.scoreCount++    
    this.scoreFlip = true    
  }

  public create(): void {
    // Add layout
    this.socket = this.game.registry.values.socket
    this.socket?.emit('gameStarted')
    this.music = this.sound.add(MUSIC, { loop: true}) 
    this.music?.play()
    this.toleranceLevel = Math.floor(50 - (this.selectedGotchi?.withSetsNumericTraits[3] as number * 0.4))
    this.add.image(getGameWidth(this) * 0.5, getGameHeight(this) * 0.5, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.add.image(getGameWidth(this) * 0.5, getGameHeight(this) * 0.5, TREES).setDisplaySize(getGameWidth(this), getGameHeight(this)).setDepth(0.75);
    this.back = this.sound.add(CLICK, { loop: false });
    this.bopSound = this.sound.add(BOP, { loop: false});
    this.popSound = this.sound.add(POP, { loop: false});
    this.createBackButton();
    this.gameBoard = this.add.text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.1, 'Balls Remaining   Score   Irritation Tolerance', { color: '#604000' }).setFontSize(getRelative(50, this)).setOrigin(0.5).setDepth(1)
    this.scoreText = this.add.text(getGameWidth(this) * 0.5, getGameHeight(this) * 0.15, this.score.toString(), { color: '#604000' }).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)
    this.ballCountText = this.add.text(getGameWidth(this) * 0.33, getGameHeight(this) * 0.15, this.ballCount.toString(), { color: '#604000'}).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)
    this.tolText = this.add.text(getGameWidth(this) * 0.65, getGameHeight(this) * 0.15, this.toleranceLevel.toString(), { color: '#604000'}).setFontSize(getRelative(70, this)).setOrigin(0.5).setDepth(1)

    const bottom = this.add.sprite(getGameWidth(this) * 0.5 , getGameHeight(this) * 0.75 + getGameHeight(this) * 0.1875, BOTTOM).setDisplaySize(getGameWidth(this), getGameHeight(this) * 0.1875).setVisible(false)
    this.physics.add.existing(bottom, true)

    const floor = this.add.rectangle(0, getGameHeight(this) * 0.9).setDisplaySize(getGameWidth(this), 50).setOrigin(0, 0)
    this.physics.add.existing(floor, true)

    const leftWall = this.add.rectangle(-100, -getGameHeight(this) * 40, 0x000000).setDisplaySize(50, getGameHeight(this) * 50,).setOrigin(0, 0)
    this.physics.add.existing(leftWall, true)

    const rightWall = this.add.rectangle(getGameWidth(this), -getGameHeight(this) * 40, 0x000000).setDisplaySize(50, getGameHeight(this) * 50,).setOrigin(0, 0)
    this.physics.add.existing(rightWall, true)

    const wave = this.add.sprite(getGameWidth(this) * 0.5, getGameHeight(this) * 0.62, WAVES, 0).setDisplaySize(getGameWidth(this), getGameHeight(this) * 0.1875)
    this.physics.add.existing(wave, true)

    this.anims.create({
      key: 'wave',
      frameRate: 3,
      frames: this.anims.generateFrameNumbers(WAVES, { start: 0, end: 5}),
      repeat: -1
    })

    wave.anims.play('wave')    

    this.crabs = this.add.group({
      maxSize: 500,
      classType: Crab,
      })
    
    this.time.addEvent({
      delay: 750 + (this.selectedGotchi?.withSetsNumericTraits[2] as number * 20),
      callback: this.getCrab,
      callbackScope: this, 
      loop: true,
    })

    this.time.addEvent({
      delay: 250, 
      callback: this.scoreCounter,
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
      key: this.selectedGotchi?.spritesheetKey || '',
      traits: this.selectedGotchi?.withSetsNumericTraits
    })
  
    this.physics.add.collider(bottom, this.player);
    this.physics.add.collider(floor, this.balls);
    this.physics.add.collider(leftWall, this.balls);
    this.physics.add.collider(rightWall, this.balls);
    this.physics.add.collider(this.player,this.balls, () => { this.addScore() });      
    this.physics.add.collider(this.balls, this.crabs, () => { this.cycleBall() });
    this.physics.add.collider(this.player, this.crabs, (_, Crab) => { Crab.destroy(), this.toleranceLevel--, this.tolText?.setText(this.toleranceLevel.toString())})
  }
  
  
  private cycleBall() {
    if (this.ballCount > 0) {
     this.popSound?.play();
      this.ballCount--;
      this.balls?.setVisible(false)
       Phaser.Actions.Call((this.balls as Phaser.GameObjects.Group).getChildren(), (ball) => { 
        (ball.body as Phaser.Physics.Arcade.Body).destroy();
        },
      this,)
      this.ballCountText?.setText(this.ballCount.toString())
      this.balldead = true
    }
  }

  private addScore() {
    if( this.scoreFlip === true) {
      this.scoreFlip = false
      this.bopSound?.play() 
      this.score += 1
      this.scoreText?.setText(this.score.toString())
    }
  }

  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setDepth(2)
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
      this.isGameOver = true

      //fix this ...
    } else if (this.ballCount === 0 || this.toleranceLevel === 0) {
      window.history.back();
      this.socket?.emit('gameOver', {score: this.score, scoreCount: this.scoreCount});
    }
  }
}
