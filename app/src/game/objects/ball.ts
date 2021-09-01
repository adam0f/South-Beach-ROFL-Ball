import { getGameHeight, getGameWidth } from "game/helpers";
import { BALL } from "game/assets";

export class Ball extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, BALL, 0)
        this.setOrigin(0, 0)
        this.displayHeight = getGameHeight(scene) / 8
        this.displayWidth = getGameHeight(scene) / 8
    }

    public activate = (dropLocation: number, dropAngle: number) => {

        this.scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setVelocityX(dropAngle);
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1.25);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true, 0, 0.9);
        this.setPosition(dropLocation, 0)
    }



}