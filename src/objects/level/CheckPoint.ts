module Demo {

    export class CheckPoint extends Phaser.Sprite {

        circles: Array<Phaser.Sprite>;
        planet: Planet;

        BASE_RADIUS: number = 70;

        constructor(game: Phaser.Game, planet: Planet, radius: number) {
            super(game, 0, 0);

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            var scale: number = radius / this.BASE_RADIUS;

            this.x = planet.x;
            this.y = planet.y;

            this.planet = planet;

            this.circles = new Array<Phaser.Sprite>();

            for (var i = 0; i < 5; ++i) {
                var circle: Phaser.Sprite = new Phaser.Sprite(game, 0, 0, 'gui', 'load' + (i + 1));
                circle.anchor.x = 0.5;
                circle.anchor.y = 0.5;
                this.addChild(circle);
                this.circles.push(circle);
                circle.scale.x = scale;
                circle.scale.y = scale;
            }
        }

        update() {

            var rotationSpeed = 0.03;

            this.x = this.planet.x;
            this.y = this.planet.y;

            for (var i = 0; i <= 4; i += 2)
                this.circles[i].rotation -= rotationSpeed * (i+1);

            for (var i = 1; i <= 4; i += 2)
                this.circles[i].rotation += rotationSpeed * (i+1);


        }

    }

} 