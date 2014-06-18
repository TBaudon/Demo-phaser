module Demo {

    export class Game extends Phaser.Game {

        static dico: TextManager;
        static gameSave: GameSave;
        static levelList: Object;
        static navigate: Navigate;

        constructor() {
            super(800, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preload', Preloader, false);
            this.state.add('Menu', Menu, false);
            this.state.add('LevelSelect', LevelSelect, false);
            this.state.add('Game', GameState, false);
            this.state.add('Trailer', Trailer, false);

            Game.dico = new TextManager();
            Game.gameSave = new GameSave();
            Game.navigate = new Navigate('Space-Hop', '18-agilite');

            this.state.start('Boot');
        }
    }
}

window.onload = () => {
    var game = new Demo.Game();
};
