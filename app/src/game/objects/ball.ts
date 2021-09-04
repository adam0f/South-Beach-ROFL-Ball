import { getGameHeight } from "game/helpers";
import { BALL } from "game/assets";

export class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, BALL, 'frame')
        this.scene.physics.world.enable(this);
        this.setOrigin(0, 0)
        this.displayHeight = getGameHeight(scene) / 8
        this.displayWidth = getGameHeight(scene) / 8

        this.anims.create({
            key: 'roll',
            frameRate: 5,
            frames: this.anims.generateFrameNumbers('frame', { start: 0, end: 5}),
          })
          
    }
    
//add perameter for bounce based on aggression 
    public activate = (dropLocation: number, dropAngle: number, bounce: number) => {


        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setVelocityX(dropAngle);
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1);
        //(this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true, 0.9, 0.9);
        (this.body as Phaser.Physics.Arcade.Body).setBounce(0.5, 0.6 + bounce);
        this.setPosition(dropLocation, 0)
    }

    public update() {
        this.anims.play('roll')
        
    }
}

