module Demo {
    export class DestArrow extends Phaser.Sprite{

        target: Planet;
        
        constructor(game: Phaser.Game, target: Planet) {
            super(game, 0, 0, 'gui', 'arrow');

            this.target = target;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }

        update() {
            this.visible = false;

            if (this.target.checked) return;

            var relativTargetX = this.target.parent.x + this.target.x;
            var relativTargetY = this.target.parent.y + this.target.y;

            var diffX = relativTargetX - this.x;
            var diffY = relativTargetY - this.y;

            this.rotation = Math.atan2(diffY, diffX) + Math.PI / 2;

            var margin = 20;

            if (relativTargetX >= this.game.width) {
                this.visible = true;
                this.y = relativTargetY;
                this.x = this.game.width - margin;
                if (this.y >= this.game.height - margin)
                    this.y = this.game.height - margin;
                if (this.y <= margin)
                    this.y = margin;
            }

            if (relativTargetX <= 0) {
                this.visible = true;
                this.y = relativTargetY;
                this.x = margin;
                if (this.y <= margin)
                    this.y = margin;
                if (this.y >= this.game.height - margin)
                    this.y = this.game.height - margin;
            }

            if (relativTargetY >= this.game.height) {
                this.visible = true;
                this.x = relativTargetX;
                this.y = this.game.height - margin;
                if (this.x >= this.game.width - margin)
                    this.x = this.game.width - margin;
                if (this.x <= margin)
                    this.x = margin;
            }

            if (relativTargetY <= 0) {
                this.visible = true;
                this.x = relativTargetX;
                this.y = margin;
                if (this.x <= margin)
                    this.x = margin;
                if (this.x >= this.game.width - margin)
                    this.x = this.game.width - margin;
            }

        }
    }
} 