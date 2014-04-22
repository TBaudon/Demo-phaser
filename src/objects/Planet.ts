module Demo {
    export class Planet extends Phaser.Sprite {

        radius: number;
        angularVelocity: number;

        constructor(game: Phaser.Game, x: number, y: number, radius:number, angularVelocity: number) {
            super(game, x, y, 'planets', 'gas_1');
            
            this.anchor.set(0.5, 0.5);
            this.radius = radius;
            this.angularVelocity = angularVelocity;

            var scale: number = radius / (this.width / 2);
            this.scale.x = scale;
            this.scale.y = scale;
        }

        update() {
            this.rotation += this.angularVelocity;
        }
    }
}