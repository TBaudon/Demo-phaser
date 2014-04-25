module Demo {
    export class Beacon extends Phaser.Sprite{

        planet: Planet;
        opened: boolean;
        fullyOpened: boolean;

        constructor(game: Phaser.Game, planet: Planet) {
            super(game, planet.x, planet.y, 'beacon', [0]);

            this.planet = planet;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.opened = false;
            this.fullyOpened = false;

            this.animations.add('open', Phaser.Animation.generateFrameNames('beacon', 1, 34));
        }

        open() {
            if(!this.opened)
                this.animations.play('open',60, false);
            this.opened = true;
        }

        update() {
            this.rotation = this.planet.rotation;

            this.x = this.planet.x + Math.cos(this.rotation - Math.PI / 2) * (this.planet.radius + this.height / 2 - 200 / this.planet.radius);
            this.y = this.planet.y + Math.sin(this.rotation - Math.PI / 2) * (this.planet.radius + this.height / 2 - 200 / this.planet.radius);

            if (this.animations.currentFrame.index == 33)
                this.fullyOpened = true;
        }

    }
} 