import { getGameHeight, getGameWidth } from "game/helpers";
import { CRAB } from "game/assets";

export class Crab extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, -100, -100, CRAB, 0)
        this.setOrigin(0, 0)   
    }

    public activate = (size: number, speed: number, direction: number) => {
        this.scene.physics.world.enable(this);

        if (direction === 0) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed * 0.15 + 200)
            this.setPosition(0, getGameHeight(this.scene) * 0.7)
        } else {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-(speed * 0.15 + 200))
            this.setPosition(getGameWidth(this.scene), getGameHeight(this.scene) * 0.8)
        } 

        this.displayHeight = getGameHeight(this.scene) * 0.1 *(size * 0.5)
        this.displayWidth = getGameHeight(this.scene) * 0.1 *(size * 0.5)       
    }

    public update = () => {
        if (this.x < -1 || this.x > getGameWidth(this.scene) || this.y > getGameHeight(this.scene)) {
            (this.body as Phaser.Physics.Arcade.Body).destroy()
        }
    }
}

