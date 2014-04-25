module Demo {
    export class Planet extends Phaser.Sprite {

        radius: number;
        rotSpeed: number;
        cameraX: number;
        cameraY: number;
        cameraZ: number;
        element: string;
        start: boolean;
        checkPoint: boolean;
        checked: boolean;
        end: boolean;
        beacon: Beacon;
        name: string;
        orbit: Orbit;
        orbitPos: number;

        // radius of the assets
        BASE_RADIUS: number = 180;
        
        // load a planet from json
        static initFromLvl(game: Phaser.Game, planet: Planet): Planet {

            var camX: number = 400;
            var camY: number = 240;
            var camZ: number = 1;
            var elem: string = "planet_earth";
            var start: boolean = false;
            var checkPoint: boolean = false;
            var end: boolean = false;

            if (planet.cameraX != undefined) camX = planet.cameraX;
            if (planet.cameraY != undefined) camY = planet.cameraY;
            if (planet.cameraZ != undefined) camZ = planet.cameraZ;
            if (planet.element != undefined) elem = planet.element;
            if (planet.start) start = planet.start;
            if (planet.checkPoint) checkPoint = planet.checkPoint;
            if (planet.end) end = planet.end;

            var nPlanet: Planet = new Planet(game,
                planet.x, planet.y,
                elem,
                planet.radius, planet.rotSpeed,
                camX, camY, camZ,
                start, checkPoint, end, planet.orbit);

            return nPlanet;
        }

        constructor(game: Phaser.Game,
            x: number, y: number,
            element: string,
            radius: number, rotSpeed: number,
            cameraX: number, cameraY: number, cameraZ: number,
            start: boolean, checkPoint: boolean, end: boolean,
            orbit: Orbit = null) {

            super(game, x, y, 'planets', element);

            if (radius == 0)
                radius = this.BASE_RADIUS;

            this.cameraX = cameraX;
            this.cameraY = cameraY;
            this.cameraZ = cameraZ;
            this.orbit = orbit;
            
            this.anchor.set(0.5, 0.5);
            this.radius = radius;
            this.rotSpeed = rotSpeed;

            var scale: number = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.start = start;
            this.checkPoint = checkPoint;
            this.end = end;
            this.checked = false;
            this.orbitPos = 0;
        }

        update() {
            this.rotation += this.rotSpeed;
            this.updateOrbit();
        }

        updateOrbit() {
            if (this.orbit != null) {
                this.orbitPos += this.orbit.speed;

                this.x = Math.cos(this.orbitPos) * this.orbit.width + this.orbit.planet.x + this.orbit.x;
                this.y = Math.sin(this.orbitPos) * this.orbit.height + this.orbit.planet.y + this.orbit.y;
            }
        }
    }
}