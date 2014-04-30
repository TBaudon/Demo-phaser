module Demo {
    export class Asteroid extends Phaser.Sprite{

        BASE_RADIUS: number = 50;

        radius: number;
        rotSpeed: number;
        graph: string;
        orbit: Orbit;

        orbitPos: number;

        test: number;

        static initFromLvl(game: Phaser.Game, asteroid: Asteroid): Asteroid {

            var graph: string = asteroid.graph;
            var x = asteroid.x;
            var y = asteroid.y;
            var radius = asteroid.radius;
            var rotSpeed = asteroid.rotSpeed;
            var orbit = asteroid.orbit;

            return new Asteroid(game, graph, x, y, radius, rotSpeed, orbit);
        }

        constructor(game: Phaser.Game, frame: string,
            x: number, y: number,
            radius: number, rotSpeed: number, orbit: Orbit = null) {
            super(game, x, y, 'planets', frame);

            this.radius = radius;
            this.rotSpeed = rotSpeed;
            this.orbit = orbit;

            this.anchor.set(0.5, 0.5);

            var scale: number = radius / this.BASE_RADIUS;
            this.scale.x = scale;
            this.scale.y = scale;

            this.orbitPos = 0;
        }

        update() {
            this.rotation += this.rotSpeed;
            this.updateOrbit();
        }

        updateOrbit() {
            if (this.orbit != null) {
                this.orbitPos += this.orbit.speed;
                var orbitOffset = (Math.PI * this.orbit.startAngle) / 180;

                var angle = (Math.PI * this.orbit.angle) / 180;
                
                var offsetX = this.orbit.planet.x + this.orbit.x;
                var offsetY = this.orbit.planet.y + this.orbit.y;

                var orbitX = Math.cos(this.orbitPos + orbitOffset) * this.orbit.width ;
                var orbitY = Math.sin(this.orbitPos + orbitOffset) * this.orbit.height ;

                this.x = orbitX * Math.cos(angle) - orbitY * Math.sin(angle) + offsetX;
                this.y = orbitY * Math.cos(angle) + orbitX * Math.sin(angle) + offsetY;
            }
        }
    }
}