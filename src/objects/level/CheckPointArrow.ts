module Demo {
    export class DestArrow extends Phaser.Sprite{

        target: Planet;
        player: Player;
        
        constructor(game: Phaser.Game, target: Planet, player: Player) {
            super(game, 0, 0, 'gui', 'arrow');

            this.target = target;
            this.player = player;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }

        update() {

            if (this.target.checked) this.visible = false;

            var relativTargetX = (this.target.parent.x + this.target.x) ;
            var relativTargetY = (this.target.parent.y + this.target.y) ;
           
            var margin = 20;

            var targetVisible = true;

            /*
            if (relativTargetX >= this.game.width) {
                targetVisible = false;
                this.y = relativTargetY;
                this.x = this.game.width - margin;
                if (this.y >= this.game.height - margin)
                    this.y = this.game.height - margin;
                if (this.y <= margin)
                    this.y = margin;
            }

            if (relativTargetX <= 0) {
                targetVisible = false;
                this.y = relativTargetY;
                this.x = margin;
                if (this.y <= margin)
                    this.y = margin;
                if (this.y >= this.game.height - margin)
                    this.y = this.game.height - margin;
            }

            if (relativTargetY >= this.game.height) {
                targetVisible = false;
                this.x = relativTargetX;
                this.y = this.game.height - margin;
                if (this.x >= this.game.width - margin)
                    this.x = this.game.width - margin;
                if (this.x <= margin)
                    this.x = margin;
            }

            if (relativTargetY <= 0) {
                targetVisible = false;
                this.x = relativTargetX;
                this.y = margin;
                if (this.x <= margin)
                    this.x = margin;
                if (this.x >= this.game.width - margin)
                    this.x = this.game.width - margin;
            }*/

            var vectorPT = new Vector2D(this.player.x - this.target.x, this.player.y - this.target.y);
            vectorPT = vectorPT.normalize();
            vectorPT = vectorPT.mult(50 / this.player.parent.scale.x);

            this.x = this.player.x - vectorPT.x;
            this.y = this.player.y - vectorPT.y;
            this.scale.x = 0.5 / this.player.parent.scale.x;
            this.scale.y = 0.5 / this.player.parent.scale.y;

            this.bringToTop();

            var diffX = this.target.x - this.x;
            var diffY = this.target.y - this.y;

            this.rotation = Math.atan2(diffY, diffX) + Math.PI / 2;

        }
    }
} 