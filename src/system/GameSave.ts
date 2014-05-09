module Demo {
    export class GameSave {

        save: Object;
        key: string = "saveData";

        constructor() {
            var savedData = localStorage.getItem(this.key);
            if (savedData == null) {
                console.log("no save data found, creating save file...");
                this.save = new Object();
                localStorage.setItem(this.key, JSON.stringify(this.save));
            } else {
                this.save = JSON.parse(savedData);
            }
        }

        saveScore(level: number, score: number) {
            this.save[level] = { "score": score };
            localStorage.setItem(this.key, JSON.stringify(this.save));
        }

        getScore(level: number): Object {
            return this.save[level];
        }

    }
} 