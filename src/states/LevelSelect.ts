module Demo {

    export class LevelSelect extends Phaser.State {

        blackTransition: Phaser.Graphics;
        lauchingLevel: boolean;

        buttons: Array<LevelButton>;

        moving: boolean;

        currentPage: number;
        maxPage: number;

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

            var nextBTN = new SuperButton(this.game, 430, 380, this.nextPage, this, Game.dico.getText('NEXT_BTN'));
            var prevBTN = new SuperButton(this.game, -60, 380, this.prevPage, this, Game.dico.getText('PREV_BTN'));
            var clearBTN = new SuperButton(this.game, 0, 380, this.clearData, this, Game.dico.getText('CLEAR'));
            clearBTN.x = (800 - clearBTN.width) / 2;

            this.game.add.existing(nextBTN);
            this.game.add.existing(prevBTN);
            this.game.add.existing(clearBTN);

            var SelectText = new Phaser.Text(this.game, 0, 40, Game.dico.getText("LEVEL_SELECT_TXT"), { font: 'italic bold 32px arial', fill:'#ffffff' });
            this.game.add.existing(SelectText);
            SelectText.x = this.game.world.centerX - SelectText.width / 2;

            this.blackTransition = this.game.add.graphics(0, 0),
            this.blackTransition.beginFill(0x000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);
        }

        lauchLevel(level: number) {
            if (!this.lauchingLevel) {
                GameState.currentLevel = level;
                this.lauchingLevel = true;
                this.game.add.tween(this.blackTransition).to({ alpha: 1 }, 300, null, true).onComplete.add(this.gotoGame, this);
            }
        }

        gotoGame() {
            this.game.state.start('Game', true);
        }

        nextPage() {
            if (!this.moving && this.currentPage < this.maxPage) {
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
            if (!this.moving && this.currentPage > 0) {
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

    }

}