module Demo {
    export class Player extends Phaser.Sprite {

        GRAVITY: number = 0.5;

        vitX: number;
        vitY: number;
        landed: boolean;
        opened: boolean;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'robot_wait');

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('idle');
            this.animations.play('idle', 60, true);

            game.input.onDown.add(this.jump, this);

            this.vitX = 0;
            this.vitY = 0;
            this.landed = false;
            this.opened = false;
        }

        jump() {
            if (this.landed) {
                this.landed = false;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);
                this.vitY = -10;
            }
        }

        openLegs() {
            if (!this.opened) {
                this.opened = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('open', Phaser.Animation.generateFrameNames('robot_anim_finale00', 60, 72));
                this.animations.play('open', 60);
            }
        }

        land() {
            if (!this.landed) {
                this.landed = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
            }
        }

        update() {
            this.vitY += this.GRAVITY;

            this.x += this.vitX;
            this.y += this.vitY;

            if (this.vitY >= 0)
                this.openLegs();

            if (this.y + this.height / 2 + this.vitY >= this.game.height) {
                this.y = this.game.height - this.height / 2;
                this.vitY = 0;
                this.land();
            }
        }

    }
} 