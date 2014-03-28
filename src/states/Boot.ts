module Demo {
    export class Boot extends Phaser.State {

        preload() {
            this.load.image('planets', 'game/assets/test.png');
        }

        create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = false;

            this.scale.minWidth = 800;
            this.scale.minHeight = 480;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);

            this.scale.scaleMode = 2;//Phaser.ScaleManager.SHOW_ALL;

            this.scale.hasResized.add(this.gameResized, this);

            if (this.game.device.desktop) {
                this.scale.maxWidth = 800;
                this.scale.maxHeight = 480;
            }
            else {
                this.scale.maxWidth = 2400;
                this.scale.maxHeight = 1440;
                this.scale.forceOrientation(true, false);
                this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOriontation, this);
            }
        }

        gameResized(width: number, height: number) {
        }

        enterIncorrectOrientation() {
            alert("please hold you device in landscape mode");
        }

        leaveIncorrectOriontation() {
        }
    }
} 