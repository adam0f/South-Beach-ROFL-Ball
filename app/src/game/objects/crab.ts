import { getGameHeight, getGameWidth } from "game/helpers";
import { CRAB } from "game/assets";

export class Crab extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, CRAB, 0)
        this.setOrigin(0, 0)
        this.displayHeight = getGameHeight(scene) / 12
        this.displayWidth = getGameHeight(scene) / 12
    }

    public activate = (size: number, speed: number, direction: number) => {
        this.scene.physics.world.enable(this);

        if (direction === 0) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed)
            this.setPosition(0, getGameHeight(this.scene) * 0.7)
        } else {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-speed)
            this.setPosition(getGameWidth(this.scene), getGameHeight(this.scene) * 0.8)
        } 

        this.displayHeight = getGameHeight(this.scene) * 0.1 *(size / 2)
        this.displayWidth = getGameHeight(this.scene) * 0.1 *(size / 2)
        this.setPosition        
    }
}

