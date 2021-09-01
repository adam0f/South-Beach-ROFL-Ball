import {
  LEFT_CHEVRON, BG, CLICK, BOTTOM
} from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player, Ball } from 'game/objects';

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

  // Sounds
  private back?: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  private ballGenerate = () => {
  //  const dropLocation = 800
  //  const dropAngle = 0

    const placement = Math.floor(Math.random() * 6) + 1
    const dropAngle = Math.floor(Math.random() * (getGameWidth(this) / 5))

    for (let i = 0; i < 6; i++) {
      if (i == placement ) {
        const dropLocation = placement * (getGameWidth(this) / 6)
        this.dropBall(dropLocation, dropAngle)
      } 
   }
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

    const bottom = this.add.sprite(getGameWidth(this)/2 , getGameHeight(this) *.8125 + getGameHeight(this) / 5.3333, BOTTOM).setDisplaySize(getGameWidth(this), getGameHeight(this) / 5.3333)  
    this.physics.add.existing(bottom, true)

    this.balls = this.add.group({
      maxSize: 100,
      classType: Ball,
    })

    this.ballGenerate()

    this.time.addEvent({
      delay: 2000,
      callback: this.ballGenerate, 
      callbackScope: this,
      loop: true,
    })
   

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || ''
    })
  

    this.physics.add.collider(bottom, this.player)
    this.physics.add.collider(this.balls,this.player)

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
  }
}
