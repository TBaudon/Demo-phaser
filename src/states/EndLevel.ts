module Demo {

    export class EndLevel {

        gameState: GameState;
        game: Phaser.Game;

        scoreBG: Phaser.Graphics;
        scoreBgGroup: Phaser.Group;

        stars: Array<Phaser.Sprite>;

        starsToLight: number;
        starsLit: number;

        constructor(gameState: GameState, score: number, nbJump:number, bestJump:number) {

            this.gameState = gameState;
            this.game = gameState.game;

            this.starsToLight = score;

            this.scoreBG = this.game.add.graphics(0, 0);
            this.scoreBG.beginFill(0x000000, 0.5);
            this.scoreBG.drawRect((800 - 300) / 2, 0, 300, 480);
            this.scoreBG.endFill();

            this.scoreBgGroup = new Phaser.Group(this.game, this.gameState.ui);
            this.scoreBgGroup.add(this.scoreBG);
            this.scoreBgGroup.alpha = 0;

            this.starsLit = 0;

            // stars
            this.stars = new Array<Phaser.Sprite>();

            for (var i = 0; i < 3; ++i) {
                var star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_large');
                star.anchor.set(0.5, 0.5);
                this.stars[i] = star;
                this.scoreBgGroup.add(star);
                //star.scale.x = 3;
                //star.scale.y = 3;

                star.alpha = 0.5;

                star.x = (800 - 2 * (star.width + 10)) / 2 + (star.width + 10) * i;
                star.y = (480 - star.height) / 2;

                if (i == 1) {
                    star.scale.x = 1.2;
                    star.scale.y = 1.2;
                    star.y += 30;
                    star.x = 400;
                }
            }

            // text complete
            var style = { font: 'italic bold 32px arial', fill: '#ffffff', align: 'center' };
            var text = Game.dico.getText('LEVEL_COMPLETED');
            var levelText: Phaser.Text = new Phaser.Text(this.game, 0, 15, text, style);
            this.scoreBgGroup.add(levelText);
            levelText.x = (800 - levelText.width) / 2;

            // text jumps
            var style2 = { font: 'italic bold 24px arial', fill: '#ffffff', align: 'center' };
            var jumpWord = Game.dico.getText('JUMP');
            var leftWord = Game.dico.getText('LEFT');
            var jumpLefts = (bestJump + 4) - nbJump;
            if (jumpLefts < 0)
                jumpLefts = 0;
            var jumStr = nbJump + " " + jumpWord;
            var jumpText = new Phaser.Text(this.game, 0, 0, jumStr, style2);
            this.scoreBgGroup.add(jumpText);
            jumpText.x = (800 - jumpText.width) / 2;
            jumpText.y = (480 - jumpText.height) / 3 - 50;

            // buttons

            var levelBTN = new Phaser.Button(this.game, 0, 0, 'gui', this.gotoLevelSelect, this, 'icon_list', 'icon_list', 'icon_list', 'icon_list');
            levelBTN.input.useHandCursor = true;
            var restartBTN = new Phaser.Button(this.game, 0, 0, 'gui', this.restart, this, 'icon_restart', 'icon_restart', 'icon_restart', 'icon_restart');
            restartBTN.input.useHandCursor = true;
            var nextBTN = new Phaser.Button(this.game, 0, 0, 'gui', this.gotoNext, this, 'icon_arrow', 'icon_arrow', 'icon_arrow', 'icon_arrow');
            nextBTN.input.useHandCursor = true;

            levelBTN.x = (800 - (levelBTN.width + restartBTN.width + nextBTN.width + 60)) / 2;
            levelBTN.y = 310;

            restartBTN.x = levelBTN.x + levelBTN.width + 30;
            restartBTN.y = levelBTN.y;

            nextBTN.x = restartBTN.x + restartBTN.width + 30;
            nextBTN.y = restartBTN.y;

            this.scoreBgGroup.add(levelBTN);
            this.scoreBgGroup.add(restartBTN);
            this.scoreBgGroup.add(nextBTN);

            for(var i = 0; i < score; ++i){
                var timer = this.game.time.create(true);
                timer.add(2000 + i * 750, this.addStar, this);
                timer.start();
            }

            // more game
            var moreGameBtn = new SuperButton(this.game, 0, 380, this.onMoreGame, this, Game.dico.getText('MORE_GAME'));
            moreGameBtn.x = (800 - moreGameBtn.width) / 2;

            this.scoreBgGroup.add(moreGameBtn);

            // fade in
            this.game.add.tween(gameState.blackTransition).to({ alpha: 0.3 }, 250, null, true, 1000);
            this.game.add.tween(this.scoreBgGroup).to({ alpha: 1 }, 250, null, true, 1000);
        }

        addStar() {
            if (this.starsLit < this.starsToLight) {

                this.stars[this.starsLit].alpha = 1;
                this.starsLit++;

                if (this.starsLit > 2)
                    this.starsLit = 2;
            }

        }

        gotoLevelSelect() {
            this.game.state.start('LevelSelect', true);
        }

        restart() {
            this.game.state.restart();
        }

        gotoNext() {
            this.gameState.gotoNextLevel();
        }

        onMoreGame() {
            Game.navigate.gotoMoreGame('Interlevel', 'Moregames');
        }
    }

} 