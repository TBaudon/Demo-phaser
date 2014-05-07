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
        bounce: boolean;
        beacon: Beacon;
        name: string;
        orbit: Orbit;
        orbitPos: number;
        gas: Phaser.Sprite;
        gas2: Phaser.Sprite;

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
            var bounce: boolean = false;

            if (planet.cameraX != undefined) camX = planet.cameraX;
            if (planet.cameraY != undefined) camY = planet.cameraY;
            if (planet.cameraZ != undefined) camZ = planet.cameraZ;
            if (planet.element != undefined) elem = planet.element;
            if (planet.start) start = planet.start;
            if (planet.checkPoint) checkPoint = planet.checkPoint;
            if (planet.end) end = planet.end;
            if (planet.bounce) bounce = planet.bounce; 

            var nPlanet: Planet = new Planet(game,
                planet.x, planet.y,
                elem,
                planet.radius, planet.rotSpeed,
                camX, camY, camZ,
                start, checkPoint, end, planet.orbit, bounce);

            return nPlanet;
        }

        constructor(game: Phaser.Game,
            x: number, y: number,
            element: string,
            radius: number, rotSpeed: number,
            cameraX: number, cameraY: number, cameraZ: number,
            start: boolean, checkPoint: boolean, end: boolean,
            orbit: Orbit = null, bounce: boolean = false) {

            super(game, x, y, 'planets', element);

            if (element == 'gas_1' ||
                element == 'gas_2' ||
                element == 'gas_3') {

                var elementID: string = element.charAt(element.length - 1);
                this.gas = new Phaser.Sprite(game, x, y, 'planets', 'gas_bg' + elementID);
                this.gas2 = new Phaser.Sprite(game, x, y, 'planets', 'gas_bg' + elementID);
                var p: Phaser.Sprite = new Phaser.Sprite(game, x, y, 'planets', element);

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

            var scale: number = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.start = start;
            this.checkPoint = checkPoint;
            this.end = end;
            this.checked = false;
            this.orbitPos = 0;
        }

        update(){
            this.rotation += this.rotSpeed;

            if (this.gas)
                this.gas.rotation += this.rotSpeed;
            if (this.gas2)
                this.gas2.rotation -= 2 * this.rotSpeed;

            this.updateOrbit();
        }

        updateOrbit() {
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
        }
    }
}