module Demo {

    export class RobotPart extends Phaser.Sprite {

        vitX: number;
        vitY: number;
        vitRot: number;

        constructor(game: Phaser.Game, x: number, y: number, name:string) {
            super(game, x, y, 'robot_blow', name);

            this.anchor.set(0.5, 0.5);
            this.scale.x = 0.2;
            this.scale.y = 0.2;

            this.vitX = Math.random() * 20 - 10;
            this.vitY = Math.random() * 20 - 10;

            this.vitRot = Math.random() * 1 - 0.5;

            this.game.add.tween(this).to({ alpha: 0 }, 1000, null, true).onComplete.add(this.destroy, this);
        }

        update() {
            super.update();
            this.x += this.vitX;
            this.y += this.vitY;
            this.rotation += this.vitRot;
        }
    }

}