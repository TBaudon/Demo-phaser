module Demo {

    export class TextManager {

        currentLang: string;
        currentIndex: number;
        dico: Object;

        constructor() {
            var lang = window.navigator.userLanguage || window.navigator.language;
            this.currentLang = lang;
        }

        init(json: Object) {
            this.dico = json;
            this.currentIndex = this.dico['langs'].indexOf(this.currentLang);
            if (this.currentIndex == -1)
                this.currentIndex = 0;
        }

        getText(key: string): string {
            return this.dico[key][this.currentIndex];
        }

    }

} 