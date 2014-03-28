module Demo {
    export class Game extends Phaser.Game {
        constructor() {
            super(800, 480, Phaser.AUTO, 'content', null);

            var hero: Hero = new Hero();
        }
    }
}


window.onload = () => {
    var game = new Demo.Game();
};