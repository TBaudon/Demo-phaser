module Demo {

    export class Preloader extends Phaser.State {

        loadingBar: Phaser.Graphics;
        loadingGroup: Phaser.Group;

        // Content to load for the game
        preload() {

            // Data
            this.load.audio('bgm', 'game/assets/music/musique.ogg', true);
            this.load.spritesheet('button', 'game/assets/img/button_sprite_sheet.png', 193, 71);
            this.load.atlasXML('planets', 'game/assets/img/planets.png', 'game/assets/img/planets.xml');
            this.load.atlasXML('robot_wait', 'game/assets/img/robot_wait.png', 'game/assets/img/robot_wait.xml');
            this.load.atlasXML('robot_jump', 'game/assets/img/robot_jump.png', 'game/assets/img/robot_jump.xml');
            this.load.atlasXML('robot_land', 'game/assets/img/robot_landing.png', 'game/assets/img/robot_landing.xml');
            this.load.atlasXML('beacon', 'game/assets/img/beacon.png', 'game/assets/img/beacon.xml');
            this.load.atlasXML('gui', 'game/assets/img/gui.png', 'game/assets/img/gui.xml');
            this.load.atlasXML('robot_blow', 'game/assets/img/robot_blow.png', 'game/assets/img/robot_blow.xml');

            this.load.image('background', 'game/assets/img/fond.jpg');
            this.load.image('title', 'game/assets/img/titre.png');
            this.load.image('jeux.com', 'game/assets/img/logo2.png');
            this.load.binary('trailer', 'game/assets/trailer.mp4');

            // load dico
            var dicoString: string = (String)(this.game.cache.getText('texts'));
            var dico = JSON.parse(dicoString);
            Game.dico.init(dico);

            // load levels
            var levelListString: string = (String)(this.game.cache.getText('levelList'));
            var list = JSON.parse(levelListString);
            Game.levelList = list;

            for (var i in list) {
                this.load.text('level_' + i, 'game/assets/levels/' + list[i]);
                GameState.max_lvl++;
            }
           
            // Progress Event
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
            var loadText = this.add.text(this.world.centerX, this.world.centerY - 40, Game.dico.getText('LOADING_TEXT'), style);
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
            //this.game.state.start('Trailer', true);
            this.game.state.start('Menu', true);
        }

    }
} 