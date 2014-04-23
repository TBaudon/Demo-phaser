module Demo {
    export class Planet extends Phaser.Sprite {

        radius: number;
        rotSpeed: number;
        cameraX: number;
        cameraY: number;
        element: string;

        BASE_RADIUS: number = 180;

        static initFromLvl(game: Phaser.Game, planet: Planet): Planet {

            var camX: number = 400;
            var camY: number = 240;
            var elem: string = "planet_earth";

            if (planet.cameraX != undefined) camX = planet.cameraX;
            if (planet.cameraY != undefined) camY = planet.cameraY;
            if (planet.element != undefined) elem = planet.element;

            var nPlanet: Planet = new Planet(game,
                planet.x, planet.y,
                elem,
                planet.radius, planet.rotSpeed,
                camX, camY);

            return nPlanet;
        }

        constructor(game: Phaser.Game,
            x: number, y: number,
            element: string,
            radius: number, rotSpeed: number,
            cameraX: number, cameraY: number) {

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
        }

        update() {
            this.rotation += this.rotSpeed;
        }
    }
}