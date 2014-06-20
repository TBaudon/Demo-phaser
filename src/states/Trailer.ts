module Demo {

    export class Trailer extends Phaser.State {

        videoElem: HTMLElement;
        container: HTMLElement;

        create() {


            this.videoElem = document.createElement("video");
            //this.videoElem.setAttribute('src', 'game/assets/trailer.mp4');
            this.videoElem.setAttribute('autoplay', 'true');
            this.videoElem.setAttribute('style', 'position:fixed; top:50%; left:50%; width:800px; height:480px; margin-left:-400px; margin-top:-240px; cursor: pointer; cursor: hand;');
            var mp4Src = document.createElement('source');
            mp4Src.setAttribute('src', 'game/assets/trailer.mp4');
            mp4Src.setAttribute('type', 'video/mp4');

            this.videoElem.appendChild(mp4Src);

            this.container = document.getElementById('content');
            this.container.appendChild(this.videoElem);

            this.videoElem.onended = () => {
                this.gotoMenu();
            };

            this.videoElem.onclick = () => {
                Game.navigate.gotoJDC('Trailer', 'Traier');
            };
        }

        gotoMenu() {
            this.container.removeChild(this.videoElem);
            this.game.state.start('Menu', true);
        }

    }

} 