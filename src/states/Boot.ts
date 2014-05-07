module Demo {

    export class Boot extends Phaser.State {

        // Load data needed for preloader screen.
        preload() {
            this.load.text('levelList', 'game/assets/levels/list.json');
            this.load.text('texts', 'game/assets/texts/texts.json');
        }

        create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = false;

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.minWidth = 400;
            this.scale.minHeight = 240;
            this.scale.maxWidth = 800;
            this.scale.maxHeight = 480;

            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);

            this.scale.hasResized.add(this.gameResized, this);

            if (!this.game.device.desktop) {
                this.scale.forceLandscape = true;
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOriontation, this);
            }
            
            this.game.state.start('Preload', true, false);
        }

        gameResized(width: number, height: number) {
        }

        enterIncorrectOrientation() {
            document.getElementById('orientation').style.display = 'block';
        }

        leaveIncorrectOriontation() {
            document.getElementById('orientation').style.display = 'none';
        }
    }
} 