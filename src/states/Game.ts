module Demo {
    export class GameState extends Phaser.State {

        player: Player;
        planets: Array<Planet>;

        create() {
            this.add.sprite(0, 0, 'background');

            this.planets = new Array<Planet>();
            for (var i = 0; i < 3; ++i) {
                var posX: number = Math.random() * 800;
                var posY: number = Math.random() * 480;
                var radius: number = Math.random() * 200 + 50;
                var speed: number = Math.random() / 10 - 0.05;
                var planet: Planet = new Planet(this.game, posX, posY, radius, speed);
                this.add.existing(planet);
            }

            this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);
            this.add.existing(this.player);

            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text: Phaser.Text = this.add.text(0, 0, 'Demo html5...', style);
        }

        update() {

        }

    }
} 