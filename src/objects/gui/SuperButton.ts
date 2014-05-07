﻿module Demo {
    export class SuperButton extends Phaser.Button {

        nbFrame: number;
        animating: boolean;
        txt: Phaser.Text;

        constructor(game : Phaser.Game,x:number, y:number, callback:Function, ctx:Object, text: string = "button") {
            super(game, x, y, 'gui', callback, ctx, 2, 1, 2);

            this.onInputDown.addOnce(this.animate, this);
            this.nbFrame = 12;

            var style = {font: 'italic bold 24px arial', fill: '#ffffff', align: 'center'};
            this.txt = new Phaser.Text(game, 0, 0, text, style);
            this.addChild(this.txt);
            this.txt.x = (this.width - this.txt.width) / 2;
            this.txt.y = (this.height - this.txt.height) / 2;
        }

        animate() {
            this.game.add.tween(this.txt).to({ alpha: 0 }, 300, null, true);
            this.animating = true;
        }

        update() {
            super.update();

            if (this.animating)
                if (this.frame < this.nbFrame)
                    this.frame++;
                else
                    this.kill();

        }

    }
}