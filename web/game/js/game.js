var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    var Beacon = (function (_super) {
        __extends(Beacon, _super);
        function Beacon(game, planet) {
            _super.call(this, game, planet.x, planet.y, 'beacon', [0]);

            this.planet = planet;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.opened = false;
            this.fullyOpened = false;

            this.animations.add('open', Phaser.Animation.generateFrameNames('beacon', 1, 34));
        }
        Beacon.prototype.open = function () {
            if (!this.opened)
                this.animations.play('open', 60, false);
            this.opened = true;
        };

        Beacon.prototype.update = function () {
            this.rotation = this.planet.rotation;

            this.x = this.planet.x + Math.cos(this.rotation - Math.PI / 2) * (this.planet.radius + this.height / 2 - 200 / this.planet.radius);
            this.y = this.planet.y + Math.sin(this.rotation - Math.PI / 2) * (this.planet.radius + this.height / 2 - 200 / this.planet.radius);

            if (this.animations.currentFrame.index == 33)
                this.fullyOpened = true;
        };
        return Beacon;
    })(Phaser.Sprite);
    Demo.Beacon = Beacon;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var CheckPointArrow = (function (_super) {
        __extends(CheckPointArrow, _super);
        function CheckPointArrow(game, target) {
            _super.call(this, game, 0, 0, 'gui', 'arrow');

            this.target = target;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }
        CheckPointArrow.prototype.update = function () {
            this.visible = false;

            if (this.target.checked)
                return;

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
            }

            if (relativTargetX <= 0) {
                this.visible = true;
                this.y = relativTargetY;
                this.x = margin;
                if (this.y <= margin)
                    this.y = margin;
            }

            if (relativTargetY >= this.game.height) {
                this.visible = true;
                this.x = relativTargetX;
                this.y = this.game.height - margin;
                if (this.x >= this.game.width - margin)
                    this.x = this.game.width - margin;
            }

            if (relativTargetY <= 0) {
                this.visible = true;
                this.x = relativTargetX;
                this.y = margin;
                if (this.x <= margin)
                    this.x = margin;
            }
        };
        return CheckPointArrow;
    })(Phaser.Sprite);
    Demo.CheckPointArrow = CheckPointArrow;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Planet = (function (_super) {
        __extends(Planet, _super);
        function Planet(game, x, y, element, radius, rotSpeed, cameraX, cameraY, start, checkPoint, end) {
            _super.call(this, game, x, y, 'planets', element);
            // radius of the assets
            this.BASE_RADIUS = 180;

            if (radius == 0)
                radius = this.BASE_RADIUS;

            this.cameraX = cameraX;
            this.cameraY = cameraY;

            this.anchor.set(0.5, 0.5);
            this.radius = this.BASE_RADIUS * (radius / this.BASE_RADIUS);
            this.rotSpeed = rotSpeed;

            var scale = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.start = start;
            this.checkPoint = checkPoint;
            this.end = end;
            this.checked = false;
        }
        // load a planet from json
        Planet.initFromLvl = function (game, planet) {
            var camX = 400;
            var camY = 240;
            var elem = "planet_earth";
            var start = false;
            var checkPoint = false;
            var end = false;

            if (planet.cameraX != undefined)
                camX = planet.cameraX;
            if (planet.cameraY != undefined)
                camY = planet.cameraY;
            if (planet.element != undefined)
                elem = planet.element;
            if (planet.start)
                start = planet.start;
            if (planet.checkPoint)
                checkPoint = planet.checkPoint;
            if (planet.end)
                end = planet.end;

            var nPlanet = new Planet(game, planet.x, planet.y, elem, planet.radius, planet.rotSpeed, camX, camY, start, checkPoint, end);

            return nPlanet;
        };

        Planet.prototype.update = function () {
            this.rotation += this.rotSpeed;
        };
        return Planet;
    })(Phaser.Sprite);
    Demo.Planet = Planet;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    (function (PlayerState) {
        PlayerState[PlayerState["FLYING"] = 0] = "FLYING";
        PlayerState[PlayerState["LANDED"] = 1] = "LANDED";
        PlayerState[PlayerState["DEAD"] = 2] = "DEAD";
    })(Demo.PlayerState || (Demo.PlayerState = {}));
    var PlayerState = Demo.PlayerState;

    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, planets, gravity, jumpStrength) {
            _super.call(this, game, 0, 0, 'robot_wait');

            this.jumpStrength = jumpStrength;
            this.gravity = gravity;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('idle');
            this.animations.play('idle', 60, true);

            game.input.onDown.add(this.jump, this);

            this.planets = planets;
            this.vitX = 0;
            this.vitY = 0;
            this.landed = false;
            this.opened = false;
            this.currentPlanet = null;
            this.state = 0 /* FLYING */;
            this.canJump = true;
        }
        Player.prototype.jump = function () {
            if (this.state == 1 /* LANDED */ && this.canJump) {
                this.state = 0 /* FLYING */;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);

                var rot = this.rotation - Math.PI / 2;

                this.vitX = Math.cos(rot) * this.jumpStrength;
                this.vitY = Math.sin(rot) * this.jumpStrength;
            }
        };

        Player.prototype.openLegs = function () {
            if (!this.opened && this.state == 0 /* FLYING */) {
                this.opened = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('open', Phaser.Animation.generateFrameNames('robot_anim_finale00', 60, 72));
                this.animations.play('open', 60);
            }
        };

        Player.prototype.land = function (planet) {
            if (this.state == 0 /* FLYING */) {
                this.currentPlanet = planet;
                this.rotation = Math.atan2(this.y - planet.y, this.x - planet.x) + Math.PI / 2;
                this.state = 1 /* LANDED */;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
            }
        };

        Player.prototype.fly = function () {
            this.vitX += this.gravity.x;
            this.vitY += this.gravity.y;

            this.x += this.vitX;
            this.y += this.vitY;

            var nextX = this.x + this.vitX;
            var nextY = this.y + this.vitY;

            if (this.vitY >= 0)
                this.openLegs();

            this.rotation = Math.atan2(this.vitY, this.vitX) + Math.PI / 2;

            for (var i = 0; i < this.planets.length; ++i) {
                var planet = this.planets[i];
                var diffX = nextX - planet.x;
                var diffY = nextY - planet.y;
                var diff = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diff <= planet.radius)
                    this.land(planet);
            }
        };

        Player.prototype.updateOnPlanet = function () {
            this.rotation += this.currentPlanet.rotSpeed;
            var radius = this.currentPlanet.radius + (this.height / 2);
            this.x = this.currentPlanet.x + Math.cos(this.rotation - Math.PI / 2) * radius;
            this.y = this.currentPlanet.y + Math.sin(this.rotation - Math.PI / 2) * radius;
        };

        Player.prototype.update = function () {
            switch (this.state) {
                case 0 /* FLYING */:
                    this.fly();
                    break;
                case 1 /* LANDED */:
                    this.updateOnPlanet();
                    break;
            }
        };
        return Player;
    })(Phaser.Sprite);
    Demo.Player = Player;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Vector2D = (function () {
        function Vector2D() {
        }
        return Vector2D;
    })();
    Demo.Vector2D = Vector2D;
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
            this.load.text('levelList', 'game/assets/levels/list.json');
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
            this.worldMinX = 1000;
            this.worldMinY = 1000;
            this.worldMaxX = -1000;
            this.worldMaxY = -1000;
        }
        GameState.prototype.create = function () {
            this.add.sprite(0, 0, 'background');

            this.planets = new Array();
            this.arrows = new Array();

            this.nbcheckPoint = 0;
            this.nbcheckPointChecked = 0;

            // world group for camera movement
            this.gameWorld = this.add.group(this, 'gameWorld', true);

            // parse level
            var levelString = (String)(this.game.cache.getText("level_" + GameState.currentLevel));
            this.level = JSON.parse(levelString);

            // add player
            this.player = new Demo.Player(this.game, this.planets, this.level.gravity, this.level.jumpStrength);
            this.gameWorld.add(this.player);

            for (var i in this.level.planets) {
                var planet = Demo.Planet.initFromLvl(this.game, this.level.planets[i]);
                this.planets.push(planet);
                this.gameWorld.add(planet);

                // set first checkpoint
                if (planet.start) {
                    this.player.land(planet);
                    this.lastCheckpoint = planet;
                }

                // add checkpoint
                if (planet.checkPoint) {
                    var arrow = new Demo.CheckPointArrow(this.game, planet);
                    this.add.existing(arrow);
                    this.arrows.push(arrow);
                    this.nbcheckPoint++;
                }

                // add beacon
                if (planet.end) {
                    var beacon = new Demo.Beacon(this.game, planet);
                    this.gameWorld.add(beacon);
                    planet.beacon = beacon;
                }

                if (planet.x < this.worldMinX)
                    this.worldMinX = planet.x - 1000;
                if (planet.y < this.worldMinY)
                    this.worldMinY = planet.y - 1000;
                if (planet.x > this.worldMaxX)
                    this.worldMaxX = planet.x + 1000;
                if (planet.y > this.worldMaxY)
                    this.worldMaxY = planet.y + 1000;
            }

            // text
            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text = this.add.text(0, 0, 'Space Hop Demo Dev', style);
        };

        GameState.prototype.update = function () {
            // Check if player is out of the level
            this.checkBounds();

            // When landing
            if (this.player.state == 1 /* LANDED */)
                this.onLanding();

            // Camera follow
            this.updateCamera();
        };

        GameState.prototype.onLanding = function () {
            // Move the camera
            var planet = this.player.currentPlanet;
            this.gameWorld.x += (planet.cameraX - planet.x - this.gameWorld.x) / 10;
            this.gameWorld.y += (planet.cameraY - planet.y - this.gameWorld.y) / 10;

            // set checkPoint if any
            if (planet.checkPoint) {
                this.lastCheckpoint = planet;
                if (!planet.checked)
                    this.nbcheckPointChecked++;
                planet.checked = true;
            }

            // Check if we reached the end
            if (planet.end && this.nbcheckPointChecked == this.nbcheckPoint) {
                planet.beacon.open();
                planet.cameraX = this.game.width / 2;
                planet.cameraY = this.game.height / 2;
                this.player.canJump = false;
                if (planet.beacon.fullyOpened)
                    this.gotoNextLevel();
            }
        };

        GameState.prototype.checkBounds = function () {
            if (this.player.x < this.worldMinX || this.player.x > this.worldMaxX || this.player.y < this.worldMinY || this.player.y > this.worldMaxY) {
                this.player.land(this.lastCheckpoint);
            }
        };

        GameState.prototype.gotoNextLevel = function () {
            GameState.currentLevel++;
            if (GameState.currentLevel > GameState.max_lvl)
                GameState.currentLevel = 1;
            this.game.state.restart();
        };

        GameState.prototype.shutdown = function () {
            this.gameWorld.destroy(true);

            for (var i in this.arrows)
                this.arrows[i].destroy();
        };

        GameState.prototype.updateCamera = function () {
            var globalPlayerX = this.gameWorld.x + this.player.x;
            var globalPlayerY = this.gameWorld.y + this.player.y;

            var cameraPadding = 150;
            var followCoef = 3;

            var maxCamX = this.game.width - cameraPadding;
            var maxCamY = this.game.height - cameraPadding;
            var minCamX = 0 + cameraPadding;
            var minCamY = 0 + cameraPadding;

            if (this.player.state == 0 /* FLYING */) {
                if (globalPlayerX > maxCamX)
                    this.gameWorld.x -= (globalPlayerX - maxCamX) / followCoef;
                else if (globalPlayerX < minCamX)
                    this.gameWorld.x += (minCamX - globalPlayerX) / followCoef;

                if (globalPlayerY > maxCamY)
                    this.gameWorld.y -= (globalPlayerY - maxCamY) / followCoef;
                else if (globalPlayerY < minCamY)
                    this.gameWorld.y += (minCamY - globalPlayerY) / followCoef;
            }
        };
        GameState.max_lvl = 0;
        return GameState;
    })(Phaser.State);
    Demo.GameState = GameState;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Level = (function () {
        function Level() {
        }
        return Level;
    })();
    Demo.Level = Level;
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
            Demo.GameState.currentLevel = 1;
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
            this.load.atlasXML('beacon', 'game/assets/img/beacon.png', 'game/assets/img/beacon.xml');
            this.load.atlasXML('gui', 'game/assets/img/gui.png', 'game/assets/img/gui.xml');

            this.load.image('background', 'game/assets/img/fond.jpg');

            // load levels
            var levelListString = (String)(this.game.cache.getText('levelList'));
            var list = JSON.parse(levelListString);

            for (var i in list) {
                this.load.text('level_' + i, 'game/assets/levels/' + list[i]);
                Demo.GameState.max_lvl++;
            }

            console.log(Demo.GameState.max_lvl);

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
