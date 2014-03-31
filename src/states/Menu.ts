module Demo {
    export class Menu extends Phaser.State {

        music: Phaser.Sound;
        button: Phaser.Button;

        create() {
            this.music = this.add.audio('bgm', 1, true);
            this.music.play();

            this.button = this.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.onButtonPressed, this, 2, 1, 0);
            this.button.x -= this.button.width / 2;
            this.button.y -= this.button.height / 2;
        }

        onButtonPressed() {
            this.game.state.start('Game', true);
        }

    }
}