module Demo {
    export class Preloader extends Phaser.State {

        loadingBar: Phaser.Graphics;
        loadingGroup: Phaser.Group;

        // Content to load for the game
        preload() {
            // Data
            this.load.audio('bgm', 'game/assets/music/musique.ogg', true);
            this.load.spritesheet('button', 'game/assets/img/button_sprite_sheet.png', 193, 71);
            this.load.image('player', 'game/assets/img/player.jpg');
            this.load.image('planet', 'game/assets/img/planet.jpg');

            // progress Event
            this.load.onFileComplete.add(this.updateBar, this);

            // Draw
            this.loadingGroup = this.add.group();
            this.loadingGroup.x = this.world.centerX - 150;
            this.loadingGroup.y = this.world.centerY;

            this.loadingGroup.scale.x = 0;

            this.loadingBar = this.add.graphics(0, 0, this.loadingGroup);
            this.loadingBar.beginFill(0x333355, 1);
            this.loadingBar.drawRect(0, 0, 300, 20);
            this.loadingBar.endFill();

            var style = { font: "24px Arial", fill: "#ffffff" };
            var loadText = this.add.text(this.world.centerX, this.world.centerY - 40, "Loading...", style);
            loadText.x -= loadText.width / 2;
        }

        updateBar(progress: number, cacheID: string, success: boolean) {
            this.loadingGroup.scale.x = this.load.progressFloat / 100;
            if(!success)
                console.log("Could not load " + cacheID, success);
        }

        create() {
            var tween = this.add.tween(this.loadingGroup).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        }

        update() {
            
        }

        startMainMenu() {
            this.game.state.start('Menu', true);
        }

    }
} 