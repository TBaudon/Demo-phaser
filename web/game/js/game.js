var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    var Planet = (function (_super) {
        __extends(Planet, _super);
        function Planet(game, x, y, radius, angularVelocity) {
            _super.call(this, game, x, y, 'planets', 'gas_1');

            this.anchor.set(0.5, 0.5);
            this.radius = radius;
            this.angularVelocity = angularVelocity;

            var scale = radius / (this.width / 2);
            this.scale.x = scale;
            this.scale.y = scale;
        }
        Planet.prototype.update = function () {
            this.rotation += this.angularVelocity;
        };
        return Planet;
    })(Phaser.Sprite);
    Demo.Planet = Planet;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'robot_wait');
            this.GRAVITY = 0.5;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('idle');
            this.animations.play('idle', 60, true);

            game.input.onDown.add(this.jump, this);

            this.vitX = 0;
            this.vitY = 0;
            this.landed = false;
            this.opened = false;
        }
        Player.prototype.jump = function () {
            if (this.landed) {
                this.landed = false;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);
                this.vitY = -10;
            }
        };

        Player.prototype.openLegs = function () {
            if (!this.opened) {
                this.opened = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('open', Phaser.Animation.generateFrameNames('robot_anim_finale00', 60, 72));
                this.animations.play('open', 60);
            }
        };

        Player.prototype.land = function () {
            if (!this.landed) {
                this.landed = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
            }
        };

        Player.prototype.update = function () {
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
        };
        return Player;
    })(Phaser.Sprite);
    Demo.Player = Player;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        // Load data needed for preloader screen.
        Boot.prototype.preload = function () {
        };

        Boot.prototype.create = function () {
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
        };

        Boot.prototype.gameResized = function (width, height) {
        };

        Boot.prototype.enterIncorrectOrientation = function () {
            document.getElementById('orientation').style.display = 'block';
        };

        Boot.prototype.leaveIncorrectOriontation = function () {
            document.getElementById('orientation').style.display = 'none';
        };
        return Boot;
    })(Phaser.State);
    Demo.Boot = Boot;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Demo.Boot, false);
            this.state.add('Preload', Demo.Preloader, false);
            this.state.add('Menu', Demo.Menu, false);
            this.state.add('Game', Demo.GameState, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Demo.Game = Game;
})(Demo || (Demo = {}));

window.onload = function () {
    var game = new Demo.Game();
};
var Demo;
(function (Demo) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.apply(this, arguments);
        }
        GameState.prototype.create = function () {
            this.add.sprite(0, 0, 'background');

            this.planets = new Array();
            for (var i = 0; i < 3; ++i) {
                var posX = Math.random() * 800;
                var posY = Math.random() * 480;
                var radius = Math.random() * 200 + 50;
                var speed = Math.random() / 10 - 0.05;
                var planet = new Demo.Planet(this.game, posX, posY, radius, speed);
                this.add.existing(planet);
            }

            this.player = new Demo.Player(this.game, this.game.world.centerX, this.game.world.centerY);
            this.add.existing(this.player);

            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text = this.add.text(0, 0, 'Demo html5...', style);
        };

        GameState.prototype.update = function () {
        };
        return GameState;
    })(Phaser.State);
    Demo.GameState = GameState;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.create = function () {
            this.music = this.add.audio('bgm', 1, true);
            this.music.play();

            this.button = this.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.onButtonPressed, this, 2, 1, 0);
            this.button.x -= this.button.width / 2;
            this.button.y -= this.button.height / 2;
        };

        Menu.prototype.onButtonPressed = function () {
            this.game.state.start('Game', true);
        };
        return Menu;
    })(Phaser.State);
    Demo.Menu = Menu;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        // Content to load for the game
        Preloader.prototype.preload = function () {
            // Data
            this.load.audio('bgm', 'game/assets/music/musique.ogg', true);
            this.load.spritesheet('button', 'game/assets/img/button_sprite_sheet.png', 193, 71);
            this.load.atlasXML('planets', 'game/assets/img/planets.png', 'game/assets/img/planets.xml');
            this.load.atlasXML('robot_wait', 'game/assets/img/robot_wait.png', 'game/assets/img/robot_wait.xml');
            this.load.atlasXML('robot_jump', 'game/assets/img/robot_jump.png', 'game/assets/img/robot_jump.xml');
            this.load.atlasXML('robot_land', 'game/assets/img/robot_landing.png', 'game/assets/img/robot_landing.xml');
            this.load.image('background', 'game/assets/img/fond.jpg');

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
            var loadText = this.add.text(this.world.centerX, this.world.centerY - 40, "Loading...", style);
            loadText.x -= loadText.width / 2;
        };

        Preloader.prototype.updateBar = function (progress, cacheID, success) {
            this.loadingGroup.scale.x = this.load.progressFloat / 100;
            if (!success)
                console.log("Could not load " + cacheID, success);
        };

        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.loadingGroup).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.update = function () {
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('Menu', true);
        };
        return Preloader;
    })(Phaser.State);
    Demo.Preloader = Preloader;
})(Demo || (Demo = {}));
