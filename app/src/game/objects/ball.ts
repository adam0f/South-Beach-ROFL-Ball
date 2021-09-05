import { getGameHeight } from "game/helpers";
import { BALL } from "game/assets";

export class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, BALL, 0)
        this.scene.physics.world.enable(this);
        this.setOrigin(0, 0)
        this.displayHeight = getGameHeight(scene) * 0.125
        this.displayWidth = getGameHeight(scene) * 0.125

        this.anims.create({
            key: 'roll',
            frameRate: 7,
            frames: this.anims.generateFrameNumbers(BALL, { start: 0, end: 5}),
            repeat: -1
          })       
    }

    public activate = (dropLocation: number, dropAngle: number, bounce: number) => {
        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setVelocityX(dropAngle);
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1);
        (this.body as Phaser.Physics.Arcade.Body).setBounce(0.5, 0.65 + bounce);
        this.setPosition(dropLocation, 0);
        this.anims.play('roll', true)
    }

}

