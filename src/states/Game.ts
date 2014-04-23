module Demo {
    export class GameState extends Phaser.State {

        player: Player;
        planets: Array<Planet>;
        gameWorld: Phaser.Group;
        level: Level;

        worldMinX: number = 1000;
        worldMinY: number = 1000;
        worldMaxX: number = -1000;
        worldMaxY: number = -1000;

        cameraPadding: number = 150;

        static currentLevel: number;

        create() {
            this.add.sprite(0, 0, 'background');

            this.planets = new Array<Planet>();

            // world group for camera movement
            this.gameWorld = this.add.group(this, 'gameWorld', true);

            // parse level
            var levelString: string = (String)(this.game.cache.getText("level_" + GameState.currentLevel));
            this.level = JSON.parse(levelString);

            for (var i in this.level.planets) {
                var planet: Planet = Planet.initFromLvl(this.game, this.level.planets[i]);
                this.planets.push(planet);
                this.gameWorld.add(planet);

                if (planet.x < this.worldMinX) this.worldMinX = planet.x - 1000;
                if (planet.y < this.worldMinY) this.worldMinY = planet.y - 1000;
                if (planet.x > this.worldMaxX) this.worldMaxX = planet.x + 1000;
                if (planet.y > this.worldMaxY) this.worldMaxY = planet.y + 1000;
            }

            // add player
            this.player = new Player(this.game,
                this.level.startPos.x, this.level.startPos.y,
                this.planets,
                this.level.gravity,
                this.level.jumpStrength);
            this.add.existing(this.player);
            this.gameWorld.add(this.player);

            // text
            var style = { font: '10px Lucida Console', fill: '#ffffff' };
            var text: Phaser.Text = this.add.text(0, 0, 'Space Hop Demo Dev', style);
        }

        update() {
            // Move the camera
            if (this.player.state == PlayerState.LANDED) {
                var planet: Planet = this.player.currentPlanet;
                this.gameWorld.x += (planet.cameraX - planet.x - this.gameWorld.x) / 10;
                this.gameWorld.y += (planet.cameraY - planet.y - this.gameWorld.y) / 10;
            }

            // Check if player is out of the level
            if (this.player.x < this.worldMinX ||
                this.player.x > this.worldMaxX ||
                this.player.y < this.worldMinY ||
                this.player.y > this.worldMaxY) {

                this.player.x = this.level.startPos.x;
                this.player.y = this.level.startPos.y;
                this.player.vitX = 0;
                this.player.vitY = 0;
            }

            // Camera follow
            var globalPlayerX = this.gameWorld.x + this.player.x;
            var globalPlayerY = this.gameWorld.y + this.player.y;

            var maxCamX = this.game.width - this.cameraPadding;
            var maxCamY = this.game.height - this.cameraPadding;
            var minCamX = 0 + this.cameraPadding;
            var minCamY = 0 + this.cameraPadding;

            if (this.player.state == PlayerState.FLYING) {
                if (globalPlayerX > maxCamX) this.gameWorld.x -= globalPlayerX - maxCamX;
                else if (globalPlayerX < minCamX) this.gameWorld.x += minCamX - globalPlayerX;

                if (globalPlayerY > maxCamY) this.gameWorld.y -= globalPlayerY - maxCamY;
                else if (globalPlayerY < minCamY) this.gameWorld.y += minCamY - globalPlayerY;
            }
        }
    }
} 