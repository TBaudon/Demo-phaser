module Demo {

    export enum PlayerState {
        FLYING,
        LANDED,
        DEAD
    }

    export class Player extends Phaser.Sprite {

        gravity: Vector2D;
        jumpStrength: number;

        vitX: number;
        vitY: number;

        landed: boolean;
        opened: boolean;
        landingAngle: number;
        planets: Array<Planet>;
        canJump: boolean;

        currentPlanet: Planet;

        state: PlayerState;

        constructor(game: Phaser.Game,
            planets: Array<Planet>,
            gravity: Vector2D,
            jumpStrength: number) {
            super(game, 0, 0, 'robot_wait');

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
            this.state = PlayerState.FLYING;
            this.canJump = true;
        }

        jump() {
            if (this.state == PlayerState.LANDED && this.canJump) {
                this.state = PlayerState.FLYING;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);

                var rot : number = this.rotation - Math.PI / 2;

                this.vitX = Math.cos(rot) * this.jumpStrength;
                this.vitY = Math.sin(rot) * this.jumpStrength;
            }
        }

        openLegs() {
            if (!this.opened && this.state == PlayerState.FLYING) {
                this.opened = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('open', Phaser.Animation.generateFrameNames('robot_anim_finale00', 60, 72));
                this.animations.play('open', 60);
            }
        }

        land(planet: Planet) {
            if (this.state == PlayerState.FLYING) {
                this.currentPlanet = planet;
                this.rotation = Math.atan2(this.y - planet.y, this.x - planet.x) + Math.PI/2;
                this.state = PlayerState.LANDED;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
            }
        }

        fly() {
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
                var planet: Planet = this.planets[i];
                var diffX: number = nextX - planet.x;
                var diffY: number = nextY - planet.y;
                var diff: number = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diff <= planet.radius)
                    this.land(planet);

            }
        }

        updateOnPlanet() {
            this.rotation += this.currentPlanet.rotSpeed;  
            var radius: number = this.currentPlanet.radius + (this.height/2);
            this.x = this.currentPlanet.x + Math.cos(this.rotation - Math.PI/2) * radius;
            this.y = this.currentPlanet.y + Math.sin(this.rotation - Math.PI / 2) * radius;
        }

        update() {
            switch (this.state) {
                case PlayerState.FLYING:
                    this.fly();
                    break;
                case PlayerState.LANDED:
                    this.updateOnPlanet();
                    break;
            }
        }
    }
} 