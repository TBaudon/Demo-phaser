module Demo {
    export class Menu extends Phaser.State {

        music: Phaser.Sound;
        button: SuperButton;
        moreGame: SuperButton;
        logo: Phaser.Sprite;
        muteBtn: Phaser.Button;

        blackTransition: Phaser.Graphics;

        create() {
            this.music = this.add.audio('bgm', 1, true);
            this.music.play();
            Game.music = this.music;

            var background = this.game.add.image(0, 0, 'background');
            var title = this.game.add.image(0, 100, 'title');

            title.x = (800 - title.width) / 2;
            var btnText: string = Game.dico.getText('PLAY_BTN');
            this.button = new SuperButton(this.game, this.game.world.centerX - 150 , this.game.world.centerY, this.onButtonPressed, this, btnText);
            this.game.add.existing(this.button);
            this.button.x -= this.button.width / 2;
            this.button.y += 75;

            var moreText: string = Game.dico.getText('MORE_GAME');
            this.moreGame = new SuperButton(this.game, this.game.world.centerX + 150 , this.game.world.centerY, this.onMorePressed, this, moreText);
            this.game.add.existing(this.moreGame);
            this.moreGame.y += 75;
            this.moreGame.x -= this.moreGame.width / 2;

            this.logo = this.game.add.sprite(0, 0, 'jeux.com');
            this.logo.inputEnabled = true;
            this.logo.input.useHandCursor = true;
            this.logo.events.onInputDown.add(this.gotoJDC, this);
            this.logo.scale.set(0.8, 0.8);
            this.logo.x = 800 - this.logo.width - 10;
            this.logo.y = 10;

            // Transition
            this.blackTransition = this.game.add.graphics(0, 0);
            this.blackTransition.beginFill(0x00000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);

            // mute
            this.muteBtn = this.game.add.button(10, 10, 'gui', this.mute, this, 'icon_sound_on', 'icon_sound_on', 'icon_sound_on', 'icon_sound_on');
            this.muteBtn.scale.set(0.75, 0.75);
            this.muteBtn.input.useHandCursor = true;
        }

        mute() {
            this.music.mute = !this.music.mute;
            if (this.music.mute)
                this.muteBtn.setFrames('icon_sound_off', 'icon_sound_off', 'icon_sound_off', 'icon_sound_off');
            else
                this.muteBtn.setFrames('icon_sound_on', 'icon_sound_on', 'icon_sound_on', 'icon_sound_on');    
        }

        onButtonPressed() {
            this.game.add.tween(this.blackTransition).to({ alpha: 1 }, 300, null, true).onComplete.add(this.go, this);
        }

        onMorePressed() {
            Game.navigate.gotoMoreGame('Menu', 'Moregames');
        }

        gotoJDC() {
            Game.navigate.gotoJDC('Menu', 'Logo');
        }

        go() {
            GameState.currentLevel = 1;
            this.game.state.start('LevelSelect', true);
        }
    }
}