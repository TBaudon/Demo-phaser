module Demo {

    export class Dust extends Phaser.Sprite {

        vit: Vector2D;
        rotSpeed: number;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'planets', 'particle_smoke');

            this.anchor.set(0.5, 0.5);
            this.scale.set(0.5, 0.5);

            var speedx: number = Math.random() * 4 - 2;
            var speedy: number = Math.random() * 4 - 2;

            this.vit = new Vector2D(speedx, speedy);
            this.rotSpeed = Math.random() * 0.2 - 0.1;

            game.add.tween(this).to({ alpha: 0}, 1000, null, true).onComplete.add(this.end, this);
        }

        update() {
            this.x += this.vit.x;
            this.y += this.vit.y;
            this.rotation += this.rotSpeed;
        }

        end() {
            this.destroy();
        }

    }

} 