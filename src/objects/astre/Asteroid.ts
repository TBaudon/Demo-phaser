module Demo {
    export class Asteroid extends Phaser.Sprite{

        BASE_RADIUS: number = 50;

        radius: number;
        rotSpeed: number;
        graph: string;
        orbit: Orbit;

        orbitPos: number;

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

                this.x = Math.cos(this.orbitPos) * this.orbit.width + this.orbit.planet.x + this.orbit.x;
                this.y = Math.sin(this.orbitPos) * this.orbit.height + this.orbit.planet.y + this.orbit.y;
            }
        }
    }
}