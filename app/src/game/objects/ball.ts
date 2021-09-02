import { getGameHeight } from "game/helpers";
import { BALL } from "game/assets";

export class Ball extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, BALL, 0)
        this.setOrigin(0, 0)
        this.displayHeight = getGameHeight(scene) / 8
        this.displayWidth = getGameHeight(scene) / 8
    }
//add perameter for bounce based on aggression 
    public activate = (dropLocation: number, dropAngle: number) => {

        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setVelocityX(dropAngle);
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1);
        //(this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true, 0.9, 0.9);
        (this.body as Phaser.Physics.Arcade.Body).setBounce(0.5, 1);
        this.setPosition(dropLocation, 0)
    }
}