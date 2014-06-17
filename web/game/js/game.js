var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Demo;
(function (Demo) {
    var Asteroid = (function (_super) {
        __extends(Asteroid, _super);
        function Asteroid(game, frame, x, y, radius, rotSpeed, orbit) {
            if (typeof orbit === "undefined") { orbit = null; }
            _super.call(this, game, x, y, 'planets', frame);
            this.BASE_RADIUS = 50;

            this.radius = radius;
            this.rotSpeed = rotSpeed;
            this.orbit = orbit;

            this.anchor.set(0.5, 0.5);

            var scale = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.orbitPos = 0;
        }
        Asteroid.initFromLvl = function (game, asteroid) {
            var graph = asteroid.graph;
            var x = asteroid.x;
            var y = asteroid.y;
            var radius = asteroid.radius;
            var rotSpeed = asteroid.rotSpeed;
            var orbit = asteroid.orbit;

            return new Asteroid(game, graph, x, y, radius, rotSpeed, orbit);
        };

        Asteroid.prototype.update = function () {
            this.rotation += this.rotSpeed;
            this.updateOrbit();
        };

        Asteroid.prototype.updateOrbit = function () {
            if (this.orbit != null) {
                this.orbitPos += this.orbit.speed;
                var orbitOffset = (Math.PI * this.orbit.startAngle) / 180;

                var angle = (Math.PI * this.orbit.angle) / 180;

                var offsetX = this.orbit.planet.x + this.orbit.x;
                var offsetY = this.orbit.planet.y + this.orbit.y;

                var orbitX = Math.cos(this.orbitPos + orbitOffset) * this.orbit.width;
                var orbitY = Math.sin(this.orbitPos + orbitOffset) * this.orbit.height;

                this.x = orbitX * Math.cos(angle) - orbitY * Math.sin(angle) + offsetX;
                this.y = orbitY * Math.cos(angle) + orbitX * Math.sin(angle) + offsetY;
            }
        };
        return Asteroid;
    })(Phaser.Sprite);
    Demo.Asteroid = Asteroid;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Dust = (function (_super) {
        __extends(Dust, _super);
        function Dust(game, x, y) {
            _super.call(this, game, x, y, 'planets', 'particle_smoke');

            this.anchor.set(0.5, 0.5);
            this.scale.set(0.4, 0.4);

            var speedx = Math.random() * 3 - 1.5;
            var speedy = Math.random() * 3 - 1.5;

            this.vit = new Demo.Vector2D(speedx, speedy);
            this.rotSpeed = Math.random() * 0.2 - 0.1;

            game.add.tween(this).to({ alpha: 0 }, 1000, null, true).onComplete.add(this.end, this);
        }
        Dust.prototype.update = function () {
            this.x += this.vit.x;
            this.y += this.vit.y;
            this.rotation += this.rotSpeed;
        };

        Dust.prototype.end = function () {
            this.destroy();
        };
        return Dust;
    })(Phaser.Sprite);
    Demo.Dust = Dust;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Orbit = (function () {
        function Orbit() {
        }
        return Orbit;
    })();
    Demo.Orbit = Orbit;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var LevelButton = (function (_super) {
        __extends(LevelButton, _super);
        function LevelButton(game, x, y, level, nbStars) {
            _super.call(this, game, x, y);

            this.circles = new Array();
            this.stars = new Array();
            this.level = level;
            this.score = nbStars;

            for (var i = 1; i < 6; ++i) {
                var circle = new Phaser.Sprite(this.game, 0, 0, 'gui', 'load' + i);
                this.addChild(circle);
                circle.anchor.set(0.5, 0.5);
                circle.scale.set(0.5, 0.5);
                circle.rotation = Math.random() * 360;
                this.circles.push(circle);
            }

            var style = { font: 'italic bold 24px arial', fill: '#ffffff', align: 'center' };
            var text = new Phaser.Text(this.game, 0, 5, level.toString(), style);
            text.anchor.set(0.5, 0.5);
            this.addChild(text);

            for (var j = 0; j < 3; ++j) {
                var star;
                if (j < nbStars)
                    star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_on');
                else
                    star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_off');
                this.addChild(star);

                star.anchor.set(0.5, 0.5);
                star.x = Math.cos(j * Math.PI / 6 + Math.PI + 2 * Math.PI / 6) * 50 - 2;
                star.y = -Math.sin(j * Math.PI / 6 + Math.PI + 2 * Math.PI / 6) * 50;
            }

            this.buttonMode = true;
            this.inputEnabled = true;
            this.input.useHandCursor = true;

            this.events.onInputDown.add(this.pressed, this);
        }
        LevelButton.prototype.update = function () {
            var rotationSpeed = 0.005;

            for (var i = 0; i <= 4; i += 2)
                this.circles[i].rotation -= rotationSpeed * (i + 1);

            for (var i = 1; i <= 4; i += 2)
                this.circles[i].rotation += rotationSpeed * (i + 1);
        };

        LevelButton.prototype.pressed = function () {
            this.callback(this.level);
        };
        return LevelButton;
    })(Phaser.Sprite);
    Demo.LevelButton = LevelButton;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var SuperButton = (function (_super) {
        __extends(SuperButton, _super);
        function SuperButton(game, x, y, callback, ctx, text) {
            if (typeof text === "undefined") { text = "button"; }
            _super.call(this, game, x, y, 'gui', callback, ctx, 2, 1, 2);

            this.onInputDown.add(this.animate, this);
            this.nbFrame = 12;

            var style = { font: 'italic bold 24px arial', fill: '#ffffff', align: 'center' };
            this.txt = new Phaser.Text(game, 0, 0, text, style);
            this.addChild(this.txt);
            this.txt.x = (this.width - this.txt.width) / 2;
            this.txt.y = (this.height - this.txt.height) / 2;

            this.input.useHandCursor = true;
        }
        SuperButton.prototype.animate = function () {
            if (!this.animating) {
                this.animating = true;
                this.txt.alpha = 0;
            }
        };

        SuperButton.prototype.update = function () {
            _super.prototype.update.call(this);

            if (this.animating)
                if (this.frame < this.nbFrame)
                    this.frame++;
                else {
                    this.animating = false;
                    this.frame = 1;
                    this.txt.alpha = 1;
                }
        };
        return SuperButton;
    })(Phaser.Button);
    Demo.SuperButton = SuperButton;
})(Demo || (Demo = {}));
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
    var CheckPoint = (function (_super) {
        __extends(CheckPoint, _super);
        function CheckPoint(game, planet, radius) {
            _super.call(this, game, 0, 0);
            this.BASE_RADIUS = 70;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            var scale = radius / this.BASE_RADIUS;

            this.x = planet.x;
            this.y = planet.y;

            this.planet = planet;

            this.circles = new Array();

            for (var i = 0; i < 5; ++i) {
                var circle = new Phaser.Sprite(game, 0, 0, 'gui', 'load' + (i + 1));
                circle.anchor.x = 0.5;
                circle.anchor.y = 0.5;
                this.addChild(circle);
                this.circles.push(circle);
                circle.scale.x = scale;
                circle.scale.y = scale;
            }
        }
        CheckPoint.prototype.update = function () {
            var rotationSpeed = 0.03;

            this.x = this.planet.x;
            this.y = this.planet.y;

            for (var i = 0; i <= 4; i += 2)
                this.circles[i].rotation -= rotationSpeed * (i + 1);

            for (var i = 1; i <= 4; i += 2)
                this.circles[i].rotation += rotationSpeed * (i + 1);
        };
        return CheckPoint;
    })(Phaser.Sprite);
    Demo.CheckPoint = CheckPoint;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var DestArrow = (function (_super) {
        __extends(DestArrow, _super);
        function DestArrow(game, target, player) {
            _super.call(this, game, 0, 0, 'gui', 'arrow');

            this.target = target;
            this.player = player;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }
        DestArrow.prototype.update = function () {
            if (this.target.checked)
                this.visible = false;

            var relativTargetX = (this.target.parent.x + this.target.x);
            var relativTargetY = (this.target.parent.y + this.target.y);

            var margin = 20;

            var targetVisible = true;

            var vectorPT = new Demo.Vector2D(this.player.x - this.target.x, this.player.y - this.target.y);
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
        };
        return DestArrow;
    })(Phaser.Sprite);
    Demo.DestArrow = DestArrow;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Planet = (function (_super) {
        __extends(Planet, _super);
        function Planet(game, x, y, element, radius, rotSpeed, cameraX, cameraY, cameraZ, start, checkPoint, end, orbit, bounce) {
            if (typeof orbit === "undefined") { orbit = null; }
            if (typeof bounce === "undefined") { bounce = false; }
            _super.call(this, game, x, y, 'planets', element);
            this.BASE_RADIUS = 180;

            if (element == 'gas_1' || element == 'gas_2' || element == 'gas_3') {
                var elementID = element.charAt(element.length - 1);
                this.gas = new Phaser.Sprite(game, x, y, 'planets', 'gas_bg' + elementID);
                this.gas2 = new Phaser.Sprite(game, x, y, 'planets', 'gas_bg' + elementID);
                var p = new Phaser.Sprite(game, x, y, 'planets', element);

                this.gas.anchor.set(0.5, 0.5);
                this.gas2.anchor.set(0.5, 0.5);
                p.anchor.set(0.5, 0.5);

                this.gas.x = -0.5;
                this.gas.y = -0.5;

                this.gas2.x = -0.5;
                this.gas2.y = -0.5;

                p.x = -0.5;
                p.y = -0.5;

                this.addChild(this.gas);
                this.addChild(this.gas2);
                this.addChild(p);
            }

            if (radius == 0)
                radius = this.BASE_RADIUS;

            this.anchor.set(0.5, 0.5);
            this.cameraX = cameraX;
            this.cameraY = cameraY;
            this.cameraZ = cameraZ;
            this.orbit = orbit;
            this.bounce = bounce;

            this.radius = radius;
            this.rotSpeed = rotSpeed;

            var scale = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.start = start;
            this.checkPoint = checkPoint;
            this.end = end;
            this.checked = false;
            this.orbitPos = 0;
        }
        Planet.initFromLvl = function (game, planet) {
            var camX = 400;
            var camY = 240;
            var camZ = 1;
            var elem = "planet_earth";
            var start = false;
            var checkPoint = false;
            var end = false;
            var bounce = false;

            if (planet.cameraX != undefined)
                camX = planet.cameraX;
            if (planet.cameraY != undefined)
                camY = planet.cameraY;
            if (planet.cameraZ != undefined)
                camZ = planet.cameraZ;
            if (planet.element != undefined)
                elem = planet.element;
            if (planet.start)
                start = planet.start;
            if (planet.checkPoint)
                checkPoint = planet.checkPoint;
            if (planet.end)
                end = planet.end;
            if (planet.bounce)
                bounce = planet.bounce;

            var nPlanet = new Planet(game, planet.x, planet.y, elem, planet.radius, planet.rotSpeed, camX, camY, camZ, start, checkPoint, end, planet.orbit, bounce);

            return nPlanet;
        };

        Planet.prototype.update = function () {
            this.rotation += this.rotSpeed;

            if (this.gas)
                this.gas.rotation += this.rotSpeed;
            if (this.gas2)
                this.gas2.rotation -= 2 * this.rotSpeed;

            this.updateOrbit();
        };

        Planet.prototype.updateOrbit = function () {
            if (this.orbit != null) {
                this.orbitPos += this.orbit.speed;
                var orbitOffset = (Math.PI * this.orbit.startAngle) / 180;

                var angle = (Math.PI * this.orbit.angle) / 180;

                var offsetX = this.orbit.planet.x + this.orbit.x;
                var offsetY = this.orbit.planet.y + this.orbit.y;

                var orbitX = Math.cos(this.orbitPos + orbitOffset) * this.orbit.width;
                var orbitY = Math.sin(this.orbitPos + orbitOffset) * this.orbit.height;

                this.x = orbitX * Math.cos(angle) - orbitY * Math.sin(angle) + offsetX;
                this.y = orbitY * Math.cos(angle) + orbitX * Math.sin(angle) + offsetY;
            }
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
            _super.call(this, game.game, 0, 0, 'robot_wait');

            this.gameState = game;

            this.jumpStrength = jumpStrength;
            this.gravity = gravity;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('idle');
            this.animations.play('idle', 60, true);

            game.game.input.onDown.add(this.jump, this);

            this.planets = planets;
            this.vitX = 0;
            this.vitY = 0;
            this.landed = false;
            this.opened = false;
            this.currentPlanet = null;
            this.previousPlanet = null;
            this.state = 0 /* FLYING */;
            this.canJump = true;
            this.nbJump = 0;
        }
        Player.prototype.spawn = function () {
            this.x = this.currentPlanet.x;
            this.y = this.currentPlanet.y;
            this.land(this.gameState.lastCheckpoint);
            this.visible = true;
            this.alpha = 0;
            this.game.add.tween(this).to({ alpha: 1 }, 1000, null, true).onComplete.add(this.allowJump, this);
            this.canJump = false;
        };

        Player.prototype.allowJump = function () {
            this.canJump = true;
        };

        Player.prototype.jump = function () {
            if (this.state == 1 /* LANDED */ && this.canJump) {
                this.state = 0 /* FLYING */;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);

                this.nbJump++;

                var rot = this.rotation - Math.PI / 2;

                this.vitX = Math.cos(rot) * this.jumpStrength;
                this.vitY = Math.sin(rot) * this.jumpStrength;

                this.previousPlanet = this.currentPlanet;
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
            if (this.state != 1 /* LANDED */) {
                this.currentPlanet = planet;
                this.rotation = Math.atan2(this.y - planet.y, this.x - planet.x) + Math.PI / 2;
                this.state = 1 /* LANDED */;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
                this.events.onAnimationComplete.add(this.onAnimationLandedEnd, this);
            }
        };

        Player.prototype.onAnimationLandedEnd = function () {
            this.events.onAnimationComplete.remove(this.onAnimationLandedEnd, this);
            this.animations.play('idle', 30);
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

                if (diff <= planet.radius + this.height / 4) {
                    if (!planet.bounce)
                        this.land(planet);
                    else if (diff <= planet.radius - 30 + this.height / 4)
                        this.bounce(planet);
                }
            }
        };

        Player.prototype.explode = function () {
            if (this.state != 2 /* DEAD */) {
                this.visible = false;
                new Demo.RobotExplosion(this.gameState, this.x, this.y);
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.spawn, this);
                this.state = 2 /* DEAD */;
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
                case 2 /* DEAD */:
                    break;
            }
        };

        Player.prototype.bounce = function (planet) {
            var axe = new Demo.Vector2D(this.x - planet.x, this.y - planet.y);
            var vit = new Demo.Vector2D(this.vitX, this.vitY);
            var bounceVec = vit.reflect(axe);
            this.vitX = bounceVec.x;
            this.vitY = bounceVec.y;

            for (var i = 0; i < 10; i++) {
                var dust = new Demo.Dust(this.game, this.x, this.y);
                this.gameState.gameWorld.add(dust);
            }
        };
        return Player;
    })(Phaser.Sprite);
    Demo.Player = Player;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Vector2D = (function () {
        function Vector2D(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2D.prototype.normalize = function () {
            return new Vector2D(this.x / this.getNorm(), this.y / this.getNorm());
        };

        Vector2D.prototype.getNorm = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Vector2D.prototype.scal = function (vector) {
            return vector.x * this.x + vector.y * this.y;
        };

        Vector2D.prototype.reflect = function (vector) {
            var n = vector.normalize();
            var scal = this.scal(n);
            var repX = this.x - 2 * scal * n.x;
            var repY = this.y - 2 * scal * n.y;

            return new Vector2D(repX, repY);
        };

        Vector2D.prototype.mult = function (coef) {
            return new Vector2D(this.x * coef, this.y * coef);
        };
        return Vector2D;
    })();
    Demo.Vector2D = Vector2D;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var RobotExplosion = (function () {
        function RobotExplosion(game, x, y) {
            this.game = game;

            this.explosion = new Phaser.Sprite(game.game, x, y, 'robot_blow', 'explosion0001');
            this.explosion.anchor.set(0.5, 0.5);
            this.explosion.animations.add('explosion', Phaser.Animation.generateFrameNames('explosion00', 1, 22));
            this.game.gameWorld.add(this.explosion);
            this.explosion.animations.play('explosion', 60, false, true);

            var robot_antenna = new Demo.RobotPart(game.game, x, y, 'robot_antenna');
            this.game.gameWorld.add(robot_antenna);

            var robot_foot = new Demo.RobotPart(game.game, x, y, 'robot_foot');
            this.game.gameWorld.add(robot_foot);

            var robot_head = new Demo.RobotPart(game.game, x, y, 'robot_head');
            this.game.gameWorld.add(robot_head);

            var robot_leg = new Demo.RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_leg);

            var robot_legB = new Demo.RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_legB);

            var robot_legC = new Demo.RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_legC);
        }
        return RobotExplosion;
    })();
    Demo.RobotExplosion = RobotExplosion;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var RobotPart = (function (_super) {
        __extends(RobotPart, _super);
        function RobotPart(game, x, y, name) {
            _super.call(this, game, x, y, 'robot_blow', name);

            this.anchor.set(0.5, 0.5);
            this.scale.x = 0.2;
            this.scale.y = 0.2;

            this.vitX = Math.random() * 20 - 10;
            this.vitY = Math.random() * 20 - 10;

            this.vitRot = Math.random() * 1 - 0.5;

            this.game.add.tween(this).to({ alpha: 0 }, 1000, null, true).onComplete.add(this.destroy, this);
        }
        RobotPart.prototype.update = function () {
            _super.prototype.update.call(this);
            this.x += this.vitX;
            this.y += this.vitY;
            this.rotation += this.vitRot;
        };
        return RobotPart;
    })(Phaser.Sprite);
    Demo.RobotPart = RobotPart;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.text('levelList', 'game/assets/levels/list.json');
            this.load.text('texts', 'game/assets/texts/texts.json');
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
            this.state.add('LevelSelect', Demo.LevelSelect, false);
            this.state.add('Game', Demo.GameState, false);

            Game.dico = new Demo.TextManager();
            Game.gameSave = new Demo.GameSave();

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
    var EndLevel = (function () {
        function EndLevel(gameState, score, nbJump, bestJump) {
            this.gameState = gameState;
            this.game = gameState.game;

            this.starsToLight = score;

            this.scoreBG = this.game.add.graphics(0, 0);
            this.scoreBG.beginFill(0x000000, 0.5);
            this.scoreBG.drawRect((800 - 300) / 2, 0, 300, 480);
            this.scoreBG.endFill();

            this.scoreBgGroup = new Phaser.Group(this.game, this.gameState.ui);
            this.scoreBgGroup.add(this.scoreBG);
            this.scoreBgGroup.alpha = 0;

            this.starsLit = 0;

            this.stars = new Array();

            for (var i = 0; i < 3; ++i) {
                var star = new Phaser.Sprite(this.game, 0, 0, 'gui', 'star_off');
                star.anchor.set(0.65, 0.5);
                this.stars[i] = star;
                this.scoreBgGroup.add(star);
                star.scale.x = 3;
                star.scale.y = 3;

                star.x = (800 - 2 * (star.width + 10)) / 2 + (star.width + 10) * i;
                star.y = (480 - star.height) / 2 + 30;

                if (i == 1) {
                    star.scale.x = 4;
                    star.scale.y = 4;
                    star.y += 30;
                    star.x = 400;
                }
            }

            var style = { font: 'italic bold 32px arial', fill: '#ffffff', align: 'center' };
            var text = Demo.Game.dico.getText('LEVEL_COMPLETED');
            var levelText = new Phaser.Text(this.game, 0, 15, text, style);
            this.scoreBgGroup.add(levelText);
            levelText.x = (800 - levelText.width) / 2;

            var style2 = { font: 'italic bold 24px arial', fill: '#ffffff', align: 'center' };
            var jumpWord = Demo.Game.dico.getText('JUMP');
            var leftWord = Demo.Game.dico.getText('LEFT');
            var jumpLefts = (bestJump + 4) - nbJump;
            if (jumpLefts < 0)
                jumpLefts = 0;
            var jumStr = jumpLefts + " " + jumpWord + " " + leftWord;
            var jumpText = new Phaser.Text(this.game, 0, 0, jumStr, style2);
            this.scoreBgGroup.add(jumpText);
            jumpText.x = (800 - jumpText.width) / 2;
            jumpText.y = (480 - jumpText.height) / 3 - 25;

            var levelBTN = new Demo.SuperButton(this.game, 0, 380, this.gotoLevelSelect, this, "TMPLevels");
            levelBTN.x = -60;
            var restartBTN = new Demo.SuperButton(this.game, 0, 380, this.restart, this, "TMPRestart");
            restartBTN.x = (800 - restartBTN.width) / 2;
            var nextBTN = new Demo.SuperButton(this.game, 0, 380, this.gotoNext, this, 'TMPNextlevel');
            nextBTN.x = 430;

            this.scoreBgGroup.add(levelBTN);
            this.scoreBgGroup.add(restartBTN);

            if (score > 0) {
                this.scoreBgGroup.add(nextBTN);
            }

            for (var i = 0; i < score; ++i) {
                var timer = this.game.time.create(true);
                timer.add(2000 + i * 750, this.addStar, this);
                timer.start();
            }

            this.game.add.tween(gameState.blackTransition).to({ alpha: 0.3 }, 250, null, true, 1000);
            this.game.add.tween(this.scoreBgGroup).to({ alpha: 1 }, 250, null, true, 1000);
        }
        EndLevel.prototype.addStar = function () {
            console.log("hey");
            if (this.starsLit < this.starsToLight) {
                this.stars[this.starsLit].loadTexture('gui', 'star_on');
                this.starsLit++;

                if (this.starsLit > 2)
                    this.starsLit = 2;
            }
        };

        EndLevel.prototype.gotoLevelSelect = function () {
            this.game.state.start('LevelSelect', true);
        };

        EndLevel.prototype.restart = function () {
            this.game.state.restart();
        };

        EndLevel.prototype.gotoNext = function () {
            this.gameState.gotoNextLevel();
        };
        return EndLevel;
    })();
    Demo.EndLevel = EndLevel;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.apply(this, arguments);
            this.worldMargin = 2500;
            this.worldMinX = this.worldMargin;
            this.worldMinY = this.worldMargin;
            this.worldMaxX = -this.worldMargin;
            this.worldMaxY = -this.worldMargin;
        }
        GameState.prototype.create = function () {
            this.add.sprite(0, 0, 'background');

            this.planets = new Array();
            this.asteroids = new Array();
            this.arrows = new Array();
            this.checks = new Array();
            this.orbits = new Array();

            this.nbcheckPoint = 0;
            this.nbcheckPointChecked = 0;

            this.gameWorld = this.add.group(this, 'gameWorld', true);

            this.ui = this.add.group(this, 'ui', true);

            var levelString = (String)(this.game.cache.getText("level_" + GameState.currentLevel));
            this.level = JSON.parse(levelString);

            this.player = new Demo.Player(this, this.planets, this.level.gravity, this.level.jumpStrength);
            this.gameWorld.add(this.player);

            this.mustCheckAll = this.level.mustCheckAll;

            for (var i in this.level.planets) {
                var planet = Demo.Planet.initFromLvl(this.game, this.level.planets[i]);
                planet.name = i;

                this.planets.push(planet);
                this.gameWorld.add(planet);

                if (planet.start) {
                    this.player.land(planet);
                    this.lastCheckpoint = planet;
                }

                if (planet.checkPoint) {
                    this.nbcheckPoint++;
                    if (this.mustCheckAll)
                        this.addArrow(planet);
                }

                if (planet.end) {
                    var beacon = new Demo.Beacon(this.game, planet);
                    this.gameWorld.add(beacon);
                    planet.beacon = beacon;
                    this.addArrow(planet);
                }

                if (planet.orbit != null)
                    this.orbits.push(planet.orbit);
            }

            for (var i in this.level.asteroids) {
                var asteroid = Demo.Asteroid.initFromLvl(this.game, this.level.asteroids[i]);
                this.asteroids.push(asteroid);
                this.gameWorld.add(asteroid);

                if (asteroid.orbit != null)
                    this.orbits.push(asteroid.orbit);
            }

            for (var a = 0; a < this.orbits.length; ++a) {
                var current = this.orbits[a];
                for (var b = 0; b < this.planets.length; ++b) {
                    var p = this.planets[b];
                    if (p.name == current.target) {
                        console.log(p.name);
                        current.planet = p;
                        break;
                    }
                }
            }

            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text = new Phaser.Text(this.game, 5, 5, this.level.description, style);
            this.ui.add(text);

            var resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            resetKey.onDown.add(this.restart, this);

            this.blackTransition = this.game.add.graphics(0, 0);
            this.blackTransition.beginFill(0x00000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.ui.add(this.blackTransition);

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);
        };

        GameState.prototype.restart = function () {
            this.game.state.restart();
        };

        GameState.prototype.addArrow = function (planet) {
            var arrow = new Demo.DestArrow(this.game, planet, this.player);
            this.game.add.existing(arrow);
            this.gameWorld.add(arrow);
            this.arrows.push(arrow);
        };

        GameState.prototype.update = function () {
            this.checkBounds();

            this.checkAsteroids();

            if (this.player.state == 1 /* LANDED */ && this.previousPlayerState == 0 /* FLYING */)
                this.onLanding();

            if (this.player.state == 1 /* LANDED */)
                this.whileLanded();

            this.updateCamera();

            this.previousPlayerState = this.player.state;
        };

        GameState.prototype.whileLanded = function () {
            var planet = this.player.currentPlanet;

            this.gameWorld.x += (planet.cameraX - planet.x * this.gameWorld.scale.x - this.gameWorld.x) / 10;
            this.gameWorld.y += (planet.cameraY - planet.y * this.gameWorld.scale.y - this.gameWorld.y) / 10;

            this.gameWorld.scale.x += (planet.cameraZ - this.gameWorld.scale.x) / 25;
            this.gameWorld.scale.y += (planet.cameraZ - this.gameWorld.scale.y) / 25;
        };

        GameState.prototype.onLanding = function () {
            var planet = this.player.currentPlanet;

            if (planet.checkPoint) {
                this.lastCheckpoint = planet;

                if (planet != this.player.previousPlanet)
                    this.showCheckPoint(planet);

                if (!planet.checked)
                    this.nbcheckPointChecked++;

                planet.checked = true;
            }

            if (planet.end && ((this.nbcheckPointChecked == this.nbcheckPoint && this.mustCheckAll) || !this.mustCheckAll)) {
                planet.beacon.open();
                planet.cameraX = this.game.width / 2;
                planet.cameraY = this.game.height / 2;
                this.player.canJump = false;

                var score = 0;
                var nbJump = this.player.nbJump;
                var bestJump = this.level.bestJumpNb;

                if (nbJump <= bestJump)
                    score = 3;
                else if (nbJump > bestJump && nbJump < bestJump + 2)
                    score = 2;
                else if (nbJump > bestJump + 2 && nbJump < bestJump + 4)
                    score = 1;
                else
                    score = 0;

                Demo.Game.gameSave.saveScore(GameState.currentLevel, score);

                new Demo.EndLevel(this, score, nbJump, bestJump);
            }
        };

        GameState.prototype.showCheckPoint = function (planet) {
            var check = new Demo.CheckPoint(this.game, planet, planet.radius);
            this.game.add.existing(check);
            this.gameWorld.add(check);
            this.game.add.tween(check.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Cubic.Out, true);
            var tween = this.game.add.tween(check).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.add(this.removeCheck, this);
            this.checks.push(check);
        };

        GameState.prototype.removeCheck = function () {
            var check = this.checks.shift();
            check.destroy();
        };

        GameState.prototype.checkAsteroids = function () {
            for (var i in this.asteroids) {
                var current = this.asteroids[i];

                var diffX = this.player.x - current.x;
                var diffY = this.player.y - current.y;
                var diff = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diff <= current.radius + this.player.height / 4) {
                    this.player.explode();
                }
            }
        };

        GameState.prototype.checkBounds = function () {
            for (var i in this.planets) {
                var planet = this.planets[i];
                if (planet.x < this.worldMinX + this.worldMargin)
                    this.worldMinX = planet.x - this.worldMargin;
                if (planet.y < this.worldMinY + this.worldMargin)
                    this.worldMinY = planet.y - this.worldMargin;
                if (planet.x > this.worldMaxX - this.worldMargin)
                    this.worldMaxX = planet.x + this.worldMargin;
                if (planet.y > this.worldMaxY - this.worldMargin)
                    this.worldMaxY = planet.y + this.worldMargin;
            }

            if (this.player.x < this.worldMinX || this.player.x > this.worldMaxX || this.player.y < this.worldMinY || this.player.y > this.worldMaxY) {
                this.player.explode();
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
            this.ui.destroy(true);
            for (var i in this.arrows)
                this.arrows[i].destroy();
        };

        GameState.prototype.updateCamera = function () {
            var globalPlayerX = (this.gameWorld.x + this.player.x * this.gameWorld.scale.x);
            var globalPlayerY = (this.gameWorld.y + this.player.y * this.gameWorld.scale.y);

            var cameraPadding = 175;
            var followCoef = 2;

            var maxCamX = (this.game.width - cameraPadding);
            var maxCamY = (this.game.height - cameraPadding);
            var minCamX = (0 + cameraPadding);
            var minCamY = (0 + cameraPadding);

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
    var LevelSelect = (function (_super) {
        __extends(LevelSelect, _super);
        function LevelSelect() {
            _super.apply(this, arguments);
        }
        LevelSelect.prototype.create = function () {
            var _this = this;
            this.game.add.image(0, 0, 'background');

            var bx = 0;
            var by = 0;
            var nbRow = 4;
            var nbLine = 2;
            var w = 150;
            var h = 120;
            var marginX = 175;
            var marginY = 160;

            this.currentPage = 0;
            this.maxPage = 0;

            this.lauchingLevel = false;
            this.moving = false;

            this.buttons = new Array();

            for (var i in Demo.Game.levelList) {
                var index = i - 1;
                var save = Demo.Game.gameSave.getScore(i);
                var score = 0;
                var enabled = false;
                if (save && save['score'])
                    score = save['score'];

                bx = index % nbRow;
                by = Math.floor(index / nbRow);
                var page = Math.floor(by / nbLine);
                if (page > this.maxPage)
                    this.maxPage = page;

                var btn = new Demo.LevelButton(this.game, bx * w + marginX + page * 800, (by - page * 2) * h + marginY, i, score);
                this.game.add.existing(btn);
                this.buttons.push(btn);

                btn.callback = function (level) {
                    _this.lauchLevel(level);
                };

                if (index > 0 && this.buttons[index - 1].score > 0)
                    enabled = true;

                if (!enabled && index > 0) {
                    btn.inputEnabled = false;
                    btn.alpha = 0.5;
                }
            }

            var nextBTN = new Demo.SuperButton(this.game, 430, 380, this.nextPage, this, Demo.Game.dico.getText('NEXT_BTN'));
            var prevBTN = new Demo.SuperButton(this.game, -60, 380, this.prevPage, this, Demo.Game.dico.getText('PREV_BTN'));
            var clearBTN = new Demo.SuperButton(this.game, 0, 380, this.clearData, this, Demo.Game.dico.getText('CLEAR'));
            clearBTN.x = (800 - clearBTN.width) / 2;

            this.game.add.existing(nextBTN);
            this.game.add.existing(prevBTN);
            this.game.add.existing(clearBTN);

            var SelectText = new Phaser.Text(this.game, 0, 40, Demo.Game.dico.getText("LEVEL_SELECT_TXT"), { font: 'italic bold 32px arial', fill: '#ffffff' });
            this.game.add.existing(SelectText);
            SelectText.x = this.game.world.centerX - SelectText.width / 2;

            this.blackTransition = this.game.add.graphics(0, 0), this.blackTransition.beginFill(0x000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);
        };

        LevelSelect.prototype.lauchLevel = function (level) {
            if (!this.lauchingLevel) {
                Demo.GameState.currentLevel = level;
                this.lauchingLevel = true;
                this.game.add.tween(this.blackTransition).to({ alpha: 1 }, 300, null, true).onComplete.add(this.gotoGame, this);
            }
        };

        LevelSelect.prototype.gotoGame = function () {
            this.game.state.start('Game', true);
        };

        LevelSelect.prototype.nextPage = function () {
            if (!this.moving && this.currentPage < this.maxPage) {
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN = this.buttons[i];
                    var destX = currentBTN.x - 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
                this.currentPage++;
            }
        };

        LevelSelect.prototype.prevPage = function () {
            if (!this.moving && this.currentPage > 0) {
                for (var i = 0; i < this.buttons.length; ++i) {
                    this.moving = true;
                    var currentBTN = this.buttons[i];
                    var destX = currentBTN.x + 800;
                    this.game.add.tween(currentBTN).to({ x: destX }, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(this.stopMove, this);
                }
                this.currentPage--;
            }
        };

        LevelSelect.prototype.clearData = function () {
            Demo.Game.gameSave.deleteData();
            this.game.state.restart();
        };

        LevelSelect.prototype.stopMove = function () {
            this.moving = false;
        };
        return LevelSelect;
    })(Phaser.State);
    Demo.LevelSelect = LevelSelect;
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

            var background = this.game.add.image(0, 0, 'background');
            var title = this.game.add.image(0, 100, 'title');

            title.x = (800 - title.width) / 2;
            var btnText = Demo.Game.dico.getText('PLAY_BTN');
            this.button = new Demo.SuperButton(this.game, this.game.world.centerX, this.game.world.centerY, this.onButtonPressed, this, btnText);
            this.game.add.existing(this.button);
            this.button.x -= this.button.width / 2;
            this.button.y += 50;

            this.blackTransition = this.game.add.graphics(0, 0);
            this.blackTransition.beginFill(0x00000000, 1);
            this.blackTransition.drawRect(0, 0, 800, 480);
            this.blackTransition.endFill();

            this.game.add.tween(this.blackTransition).to({ alpha: 0 }, 300, null, true);
        };

        Menu.prototype.onButtonPressed = function () {
            this.game.add.tween(this.blackTransition).to({ alpha: 1 }, 300, null, true).onComplete.add(this.go, this);
        };

        Menu.prototype.go = function () {
            Demo.GameState.currentLevel = 1;
            this.game.state.start('LevelSelect', true);
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
        Preloader.prototype.preload = function () {
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

            var dicoString = (String)(this.game.cache.getText('texts'));
            var dico = JSON.parse(dicoString);
            Demo.Game.dico.init(dico);

            var levelListString = (String)(this.game.cache.getText('levelList'));
            var list = JSON.parse(levelListString);
            Demo.Game.levelList = list;

            for (var i in list) {
                this.load.text('level_' + i, 'game/assets/levels/' + list[i]);
                Demo.GameState.max_lvl++;
            }

            this.load.onFileComplete.add(this.updateBar, this);

            this.loadingGroup = this.add.group();
            this.loadingGroup.x = this.world.centerX - 150;
            this.loadingGroup.y = this.world.centerY;

            this.loadingGroup.scale.x = 0;

            this.loadingBar = this.add.graphics(0, 0, this.loadingGroup);
            this.loadingBar.beginFill(0x333355, 1);
            this.loadingBar.drawRect(0, 0, 300, 20);
            this.loadingBar.endFill();

            var style = { font: "24px Arial", fill: "#ffffff" };
            var loadText = this.add.text(this.world.centerX, this.world.centerY - 40, Demo.Game.dico.getText('LOADING_TEXT'), style);
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
var Demo;
(function (Demo) {
    var GameSave = (function () {
        function GameSave() {
            this.key = "saveData";
            this.loadData();
        }
        GameSave.prototype.loadData = function () {
            var savedData = localStorage.getItem(this.key);
            if (savedData == null) {
                console.log("no save data found, creating save file...");
                this.save = new Object();
                localStorage.setItem(this.key, JSON.stringify(this.save));
            } else {
                this.save = JSON.parse(savedData);
            }
        };

        GameSave.prototype.saveScore = function (level, score) {
            if (this.save[level] != null) {
                if (score > this.save[level].score)
                    this.save[level] = { "score": score };
            } else {
                this.save[level] = { "score": score };
            }
            localStorage.setItem(this.key, JSON.stringify(this.save));
        };

        GameSave.prototype.getScore = function (level) {
            return this.save[level];
        };

        GameSave.prototype.deleteData = function () {
            localStorage.clear();
            this.loadData();
        };
        return GameSave;
    })();
    Demo.GameSave = GameSave;
})(Demo || (Demo = {}));
var Demo;
(function (Demo) {
    var TextManager = (function () {
        function TextManager() {
            var lang = window.navigator.userLanguage || window.navigator.language;
            this.currentLang = lang;
        }
        TextManager.prototype.init = function (json) {
            this.dico = json;
            this.currentIndex = this.dico['langs'].indexOf(this.currentLang);
            if (this.currentIndex == -1)
                this.currentIndex = 0;
        };

        TextManager.prototype.getText = function (key) {
            return this.dico[key][this.currentIndex];
        };
        return TextManager;
    })();
    Demo.TextManager = TextManager;
})(Demo || (Demo = {}));
