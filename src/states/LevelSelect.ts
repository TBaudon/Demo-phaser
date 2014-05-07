module Demo {

    export class LevelSelect extends Phaser.State {

        blackTransition: Phaser.Graphics;

        create() {
            // draw background
            this.game.add.image(0, 0, 'background');

            var bx = 0;
            var by = 0;
            var nbRow = 5;
            var marginX = 100;
            var marginY = 100;
            var w = 150;
            var h = 150;

            for (var i in Game.levelList) {

                var index = i - 1;

                bx = index % nbRow;
                by = Math.floor(index / nbRow);

                var btn = new LevelButton(this.game, bx * w + marginX, by * h + marginY, i, 0);
                this.game.add.existing(btn);
            }

            this.blackTransition = this.game.add.graphics(0, 0),
            this.blackTransition.beginFill(0x000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 },300,null,true);
        }

    }

}