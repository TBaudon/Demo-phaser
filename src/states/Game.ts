module Demo {
    export class GameState extends Phaser.State {

        player: Player;
        previousPlayerState: PlayerState;
        planets: Array<Planet>;
        asteroids: Array<Asteroid>;
        gameWorld: Phaser.Group;
        ui: Phaser.Group;
        level: Level;
        arrows: Array<DestArrow>;
        checks: Array<CheckPoint>;
        orbits: Array<Orbit>;

        nbcheckPoint: number;
        nbcheckPointChecked: number;
        mustCheckAll: boolean;

        worldMargin: number = 2500;

        worldMinX: number =   this.worldMargin;
        worldMinY: number =   this.worldMargin;
        worldMaxX: number = - this.worldMargin;
        worldMaxY: number = - this.worldMargin;

        lastCheckpoint: Planet;

        static currentLevel: number;
        static max_lvl: number = 0;

        create() {

            this.add.sprite(0, 0, 'background');

            this.planets = new Array<Planet>();
            this.asteroids = new Array<Asteroid>();
            this.arrows = new Array<DestArrow>();
            this.checks = new Array<CheckPoint>();
            this.orbits = new Array<Orbit>();

            this.nbcheckPoint = 0;
            this.nbcheckPointChecked = 0;

            // world group for camera movement
            this.gameWorld = this.add.group(this, 'gameWorld', true);

            // ui
            this.ui = this.add.group(this, 'ui', true);

            // parse level
            var levelString: string = (String)(this.game.cache.getText("level_" + GameState.currentLevel));
            this.level = JSON.parse(levelString);

            // add player
            this.player = new Player(this,
                this.planets,
                this.level.gravity,
                this.level.jumpStrength);
            this.gameWorld.add(this.player);

            this.mustCheckAll = this.level.mustCheckAll;

            // add planets
            for (var i in this.level.planets) {
                var planet: Planet = Planet.initFromLvl(this.game, this.level.planets[i]);
                planet.name = i;
                //console.log(planet.name);
                this.planets.push(planet);
                this.gameWorld.add(planet);

                // set first checkpoint
                if (planet.start) {
                    this.player.land(planet);
                    this.lastCheckpoint = planet;
                }

                // add checkpoint
                if (planet.checkPoint) {
                    this.nbcheckPoint++;
                    if (this.mustCheckAll) this.addArrow(planet);
                }

                // add beacon
                if (planet.end) {
                    var beacon: Beacon = new Beacon(this.game, planet);
                    this.gameWorld.add(beacon);
                    planet.beacon = beacon;
                    this.addArrow(planet);
                }

                // add orbit if any
                if (planet.orbit != null)
                    this.orbits.push(planet.orbit);
            }

            // add asteroids
            for (var i in this.level.asteroids) {
                var asteroid: Asteroid = Asteroid.initFromLvl(this.game, this.level.asteroids[i]);
                this.asteroids.push(asteroid);
                this.gameWorld.add(asteroid);

                // add orbit if any
                if (asteroid.orbit != null)
                    this.orbits.push(asteroid.orbit);
            }

            // init orbit
            for (var a = 0; a < this.orbits.length; ++a) {
                var current: Orbit = this.orbits[a];
                for (var b = 0; b < this.planets.length; ++b) {
                    var p: Planet = this.planets[b];
                    if (p.name == current.target) {
                        console.log(p.name);
                        current.planet = p;
                        break;
                    }
                }
            }

            // text
            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text: Phaser.Text = new Phaser.Text(this.game, 5, 5, this.level.description, style);
            this.ui.add(text);

            // Reset
            var resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            resetKey.onDown.add(this.restart, this);
            
        }

        restart() {
            this.game.state.restart();
        }

        addArrow(planet: Planet) {
            var arrow = new DestArrow(this.game, planet);
            this.game.add.existing(arrow);
            this.arrows.push(arrow);
        }

        update() {
            // Check if player is out of the level
            this.checkBounds();

            // Check colisions with asteroids
            this.checkAsteroids();

            // When landing
            if (this.player.state == PlayerState.LANDED && this.previousPlayerState == PlayerState.FLYING)
                this.onLanding();

            // While landed
            if (this.player.state == PlayerState.LANDED) this.whileLanded();

            // Camera follow
            this.updateCamera();

            this.previousPlayerState = this.player.state;
        }

        whileLanded() {
            // Move the camera
            var planet: Planet = this.player.currentPlanet;

            this.gameWorld.x += (planet.cameraX - planet.x * this.gameWorld.scale.x - this.gameWorld.x) / 10;
            this.gameWorld.y += (planet.cameraY - planet.y * this.gameWorld.scale.y - this.gameWorld.y) / 10;

            this.gameWorld.scale.x += (planet.cameraZ - this.gameWorld.scale.x) / 25;
            this.gameWorld.scale.y += (planet.cameraZ - this.gameWorld.scale.y) / 25;
        }

        onLanding() {
            var planet = this.player.currentPlanet;

            // set checkPoint if any
            if (planet.checkPoint) {
                this.lastCheckpoint = planet;

                if(planet != this.player.previousPlanet)
                    this.showCheckPoint(planet);

                if (!planet.checked)
                    this.nbcheckPointChecked++;
               
                planet.checked = true;
            }

            // Check if we reached the end
            if (planet.end && ((this.nbcheckPointChecked == this.nbcheckPoint && this.mustCheckAll) || !this.mustCheckAll)) {
                planet.beacon.open();
                planet.cameraX = this.game.width / 2;
                planet.cameraY = this.game.height / 2;
                this.player.canJump = false;

                this.game.time.events.add(Phaser.Timer.SECOND * 3, this.gotoNextLevel, this);
            }
        }

        showCheckPoint(planet: Planet) {
            var check: CheckPoint = new CheckPoint(this.game, planet, planet.radius);
            this.game.add.existing(check);
            this.gameWorld.add(check);
            this.game.add.tween(check.scale).to({ x:2, y:2 }, 500, Phaser.Easing.Cubic.Out, true);
            var tween = this.game.add.tween(check).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.add(this.removeCheck, this);
            this.checks.push(check);
        }

        removeCheck() {
            var check = this.checks.shift();
            check.destroy();
        }

        checkAsteroids() {
            for (var i in this.asteroids) {
                var current: Asteroid = this.asteroids[i];

                var diffX : number = this.player.x - current.x;
                var diffY : number = this.player.y - current.y;
                var diff: number = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diff <= current.radius + this.player.height / 4) {
                    this.player.explode();
                }
            }
        }

        checkBounds() {
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

            if (this.player.x < this.worldMinX ||
                this.player.x > this.worldMaxX ||
                this.player.y < this.worldMinY ||
                this.player.y > this.worldMaxY) {
                this.player.explode();
            }
        }

        gotoNextLevel() {
            GameState.currentLevel++;
            if (GameState.currentLevel > GameState.max_lvl)
                GameState.currentLevel = 1;
            this.game.state.restart();
        }

        // Destroy screen when left
        shutdown() {
            this.gameWorld.destroy(true);
            this.ui.destroy(true);
            for (var i in this.arrows)
                this.arrows[i].destroy();
        }

        updateCamera() {
            var globalPlayerX = (this.gameWorld.x + this.player.x * this.gameWorld.scale.x) ;
            var globalPlayerY = (this.gameWorld.y + this.player.y * this.gameWorld.scale.y) ;

            var cameraPadding: number = 175 ;
            var followCoef: number = 2 ; 

            var maxCamX = (this.game.width - cameraPadding);
            var maxCamY = (this.game.height - cameraPadding);
            var minCamX = (0 + cameraPadding);
            var minCamY = (0 + cameraPadding);

            if (this.player.state == PlayerState.FLYING) {
                if (globalPlayerX > maxCamX) this.gameWorld.x -= (globalPlayerX - maxCamX) / followCoef;
                else if (globalPlayerX < minCamX) this.gameWorld.x += (minCamX - globalPlayerX) / followCoef;

                if (globalPlayerY > maxCamY) this.gameWorld.y -= (globalPlayerY - maxCamY) / followCoef;
                else if (globalPlayerY < minCamY) this.gameWorld.y += (minCamY - globalPlayerY) / followCoef;
            }
        }

    }
} 