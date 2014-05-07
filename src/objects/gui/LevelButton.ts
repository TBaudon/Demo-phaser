module Demo {

    export class LevelButton extends Phaser.Sprite {

        circles: Array<Phaser.Sprite>;
        stars: Array<Phaser.Sprite>;

        callback: Function;

        level: number;

        constructor(game: Phaser.Game, x: number, y: number, level: number, nbStars: number) {
            super(game, x, y);

            this.circles = new Array<Phaser.Sprite>();
            this.stars = new Array<Phaser.Sprite>();
            this.level = level;

            for (var i = 1; i < 6; ++i) {
                var circle = new Phaser.Sprite(this.game, 0, 0, 'gui', 'load' + i);
                this.addChild(circle);
                circle.anchor.set(0.5, 0.5);
                circle.scale.set(0.5, 0.5);
                circle.rotation = Math.random() * 360;
                this.circles.push(circle);
            }

            var style = { font: 'italic bold 24px arial', fill: '#ffffff', align: 'center' };
            var text = new Phaser.Text(this.game, 0, 5, level.toString(), style);
            text.anchor.set(0.5, 0.5);
            this.addChild(text);

            for (var j = 0; j < 3; ++j) {
                var star: Phaser.Sprite;
                if (j < nbStars)
                    star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_on');
                else
                    star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_off');
                this.addChild(star);

                star.anchor.set(0.5, 0.5);
                star.x = Math.cos(j * Math.PI / 6 + Math.PI + 2 * Math.PI / 6) * 50 - 2;
                star.y = -Math.sin(j * Math.PI / 6 + Math.PI + 2 * Math.PI / 6) * 50;
            }

            this.buttonMode = true;
            this.inputEnabled = true;
            this.input.useHandCursor = true;

            this.events.onInputDown.add(this.pressed, this);
        }

        update() {
            var rotationSpeed = 0.005;

            for (var i = 0; i <= 4; i += 2)
                this.circles[i].rotation -= rotationSpeed * (i + 1);

            for (var i = 1; i <= 4; i += 2)
                this.circles[i].rotation += rotationSpeed * (i + 1);
        }

        pressed() {
            this.callback(this.level);
        }

    }

} 