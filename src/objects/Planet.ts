module Demo {
    export class Planet extends Phaser.Sprite {

        radius: number;
        rotSpeed: number;
        cameraX: number;
        cameraY: number;
        element: string;
        start: boolean;
        checkPoint: boolean;
        checked: boolean;
        end: boolean;
        beacon: Beacon;

        // radius of the assets
        BASE_RADIUS: number = 180;
        
        // load a planet from json
        static initFromLvl(game: Phaser.Game, planet: Planet): Planet {

            var camX: number = 400;
            var camY: number = 240;
            var elem: string = "planet_earth";
            var start: boolean = false;
            var checkPoint: boolean = false;
            var end: boolean = false;

            if (planet.cameraX != undefined) camX = planet.cameraX;
            if (planet.cameraY != undefined) camY = planet.cameraY;
            if (planet.element != undefined) elem = planet.element;
            if (planet.start) start = planet.start;
            if (planet.checkPoint) checkPoint = planet.checkPoint;
            if (planet.end) end = planet.end;

            var nPlanet: Planet = new Planet(game,
                planet.x, planet.y,
                elem,
                planet.radius, planet.rotSpeed,
                camX, camY,
                start, checkPoint, end);

            return nPlanet;
        }

        constructor(game: Phaser.Game,
            x: number, y: number,
            element: string,
            radius: number, rotSpeed: number,
            cameraX: number, cameraY: number,
            start: boolean, checkPoint: boolean, end: boolean) {

            super(game, x, y, 'planets', element);

            if (radius == 0)
                radius = this.BASE_RADIUS;

            this.cameraX = cameraX;
            this.cameraY = cameraY;
            
            this.anchor.set(0.5, 0.5);
            this.radius = this.BASE_RADIUS * (radius / this.BASE_RADIUS);
            this.rotSpeed = rotSpeed;

            var scale: number = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.start = start;
            this.checkPoint = checkPoint;
            this.end = end;
            this.checked = false;
        }

        update() {
            this.rotation += this.rotSpeed;
        }
    }
}