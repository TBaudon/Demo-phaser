module Demo {

    export class LevelSelect extends Phaser.State {

        blackTransition: Phaser.Graphics;
        lauchingLevel: boolean;

        buttons: Array<LevelButton>;

        moving: boolean;

        currentPage: number;
        maxPage: number;

        popupDelete: boolean;

        logo: Phaser.Sprite;

        muteBtn: Phaser.Button;

        create() {
            // draw background
            this.game.add.image(0, 0, 'background');

            var bx = 0;
            var by = 0;
            var nbRow = 4;
            var nbLine = 2;
            var w = 150;
            var h = 120;
            var marginX = 175;
            var marginY = 160;

            this.currentPage = 0;
            this.maxPage = 0;

            this.lauchingLevel = false;
            this.moving = false;

            this.buttons = new Array<LevelButton>();

            for (var i in Game.levelList) {

                var index = i - 1;
                var save = Game.gameSave.getScore(i);
                var score: number = 0;
                var enabled: boolean = false;
                if (save && save['score']) score = save['score'];

                bx = index % nbRow;
                by = Math.floor(index / nbRow);
                var page = Math.floor(by / nbLine);
                if (page > this.maxPage) this.maxPage = page;
            
                var btn = new LevelButton(this.game, bx * w + marginX + page * 800, (by - page * 2) * h + marginY, i, score);
                this.game.add.existing(btn);
                this.buttons.push(btn);

                // This way of passing callback allows us to keep the context
                btn.callback = (level: number): void => {
                    this.lauchLevel(level);
                }

                if(index > 0 && this.buttons[index - 1].score > 0)
                    enabled = true;

                if (!enabled && index > 0) {
                    btn.inputEnabled = false;
                    btn.alpha = 0.5;
                }
            }

            this.popupDelete = false;

            var nextBTN = new SuperButton(this.game, 430, 380, this.nextPage, this, Game.dico.getText('NEXT_BTN'));
            var prevBTN = new SuperButton(this.game, -60, 380, this.prevPage, this, Game.dico.getText('PREV_BTN'));
            var moreBTN = new SuperButton(this.game, 0, 380, this.onMorePressed, this, Game.dico.getText('MORE_GAME'));
            moreBTN.x = (800 - moreBTN.width) / 2;

            // mute
            this.muteBtn = this.game.add.button(10, 10, 'gui', this.mute, this, 'icon_sound_on', 'icon_sound_on', 'icon_sound_on', 'icon_sound_on');
            if (Game.music.mute)
                this.muteBtn.setFrames('icon_sound_off', 'icon_sound_off', 'icon_sound_off', 'icon_sound_off');
            this.muteBtn.scale.set(0.75, 0.75);
            this.muteBtn.input.useHandCursor = true;

            // clear
            var clearBTN = new Phaser.Button(this.game, this.muteBtn.x + this.muteBtn.width + 10, 10, 'gui', this.confirmDelete, this, 'icon_trash', 'icon_trash', 'icon_trash', 'icon_trash');
            clearBTN.scale.set(0.75, 0.75);
            clearBTN.input.useHandCursor = true;

            this.game.add.existing(nextBTN);
            this.game.add.existing(prevBTN);
            this.game.add.existing(moreBTN);
            this.game.add.existing(clearBTN);

            var SelectText = new Phaser.Text(this.game, 0, 40, Game.dico.getText("LEVEL_SELECT_TXT"), { font: 'italic bold 32px arial', fill:'#ffffff' });
            this.game.add.existing(SelectText);
            SelectText.x = this.game.world.centerX - SelectText.width / 2;

            this.blackTransition = this.game.add.graphics(0, 0),
            this.blackTransition.beginFill(0x000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);

            this.logo = this.game.add.sprite(0, 0, 'jeux.com');
            this.logo.inputEnabled = true;
            this.logo.input.useHandCursor = true;
            this.logo.events.onInputDown.add(this.gotoJDC, this);
            this.logo.scale.set(0.8, 0.8);
            this.logo.x = 800 - this.logo.width - 10;
            this.logo.y = 10;

            
        }

        mute() {
            Game.music.mute = !Game.music.mute;
            if (Game.music.mute)
                this.muteBtn.setFrames('icon_sound_off', 'icon_sound_off', 'icon_sound_off', 'icon_sound_off');
            else
                this.muteBtn.setFrames('icon_sound_on', 'icon_sound_on', 'icon_sound_on', 'icon_sound_on');
        }

        lauchLevel(level: number) {
            if (!this.lauchingLevel && !this.popupDelete) {
                GameState.currentLevel = level;
                this.lauchingLevel = true;
                this.game.add.tween(this.blackTransition).to({ alpha: 1 }, 300, null, true).onComplete.add(this.gotoGame, this);
            }
        }

        gotoGame() {
            this.game.state.start('Game', true);
        }

        nextPage() {
            if (!this.moving && this.currentPage < this.maxPage && !this.popupDelete) {
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN: Phaser.Sprite = this.buttons[i];
                    var destX = currentBTN.x - 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
                this.currentPage++;
            }
        }

        prevPage() {
            if (!this.moving && this.currentPage > 0 && !this.popupDelete) {
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN: Phaser.Sprite = this.buttons[i];
                    var destX = currentBTN.x + 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
                this.currentPage--;
            }
        }

        clearData() {
            Game.gameSave.deleteData();
            this.game.state.restart();
        }

        stopMove() {
            this.moving = false;
        }

        onMorePressed() {
            Game.navigate.gotoMoreGame('Levels', 'Moregames');
        }

        gotoJDC() {
            Game.navigate.gotoJDC('Levels', 'Logo');
        }

        confirmDelete() {
            if (!this.popupDelete) {
                this.popupDelete = true;
                var style = { font: 'italic bold 24px arial', fill: '#ffffff' };
                var text = new Phaser.Text(this.game, this.game.world.centerX, 100, Game.dico.getText('CONFIRM_DELETE'), style);

                var popup = this.game.add.graphics((800 - text.width * 1.2) / 2, (480 - 120) / 2);

                popup.beginFill(0x000000, 0.5);
                popup.drawRect(0, 0, text.width * 1.2, 140);
                popup.endFill();

                this.game.add.existing(text);
                text.x = (800 - text.width) / 2;
                text.y = (480 - 120) / 2 + 10;

                var yesBTN = new SuperButton(this.game, 0, 0, this.clearData, this, Game.dico.getText('YES'));
                var noBTN = new SuperButton(this.game, 0, 0, this.cancelClear, this, Game.dico.getText('NO'));
                this.game.add.existing(yesBTN);
                this.game.add.existing(noBTN);

                noBTN.x = text.x - noBTN.width / 2 + 80;
                noBTN.y = text.y + 50;
                yesBTN.x = text.x + text.width - yesBTN.width / 2 - 80;
                yesBTN.y = text.y + 50;
            }

        }

        cancelClear() {
            this.game.state.restart();
        }

    }

}