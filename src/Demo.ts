module Demo {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preload', Preloader, false);
            this.state.add('Menu', Menu, false);
            this.state.add('Game', GameState, false);

            this.state.start('Boot');
        }
    }
}

window.onload = () => {
    var game = new Demo.Game();
};
