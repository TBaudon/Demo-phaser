module Demo {

    export class LevelSelect extends Phaser.State {

        blackTransition: Phaser.Graphics;
        lauchingLevel: boolean;

        buttons: Array<Phaser.Sprite>;

        moving: boolean;

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
            var marginY = 175;

            this.lauchingLevel = false;
            this.moving = false;

            this.buttons = new Array<Phaser.Sprite>();

            for (var i in Game.levelList) {

                var index = i - 1;

                bx = index % nbRow;
                by = Math.floor(index / nbRow);
                var page = Math.floor(by / nbLine);

                var btn = new LevelButton(this.game, bx * w + marginX + page*800, (by-page*2) * h + marginY, i, 0);
                this.game.add.existing(btn);
                this.buttons.push(btn);

                // This way of passing callback allow us to keep the context
                btn.callback = (level: number): void => {
                    this.lauchLevel(level);
                }

            }

            var nextBTN = new SuperButton(this.game, 410, 380, this.nextPage, this, Game.dico.getText('NEXT_BTN'));
            var prevBTN = new SuperButton(this.game, -40, 380, this.prevPage, this, Game.dico.getText('PREV_BTN'));

            this.game.add.existing(nextBTN);
            this.game.add.existing(prevBTN);

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
            if(!this.moving)
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN: Phaser.Sprite = this.buttons[i];
                    var destX = currentBTN.x - 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
        }

        prevPage() {
            if (!this.moving)
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN: Phaser.Sprite = this.buttons[i];
                    var destX = currentBTN.x + 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
        }

        stopMove() {
            this.moving = false;
        }

    }

}