module Demo {
    export class Navigate {

        static instance: Navigate;

        domain: string;
        campaign: string;
        categorie: string;
        jdc: string;

        constructor(campaign: string, categorie: string) {
            Navigate.instance = this;
            this.domain = window.location.host;
            this.campaign = campaign;
            this.categorie = categorie;
            this.jdc = 'http://www.jeux.com/';
        }

        gotoJDC(content: string, medium: string) {
            this.navigate(this.makeUrl(content, medium));
        }

        gotoMoreGame(content: string, medium: string) {
            this.navigate(this.makeUrl(content, medium, true));
        }

        makeUrl(content: string, medium: string, cat: boolean = false): string {
            var url = this.jdc;
            if (cat) url += this.categorie + '/';
            url += '?utm_source=' + this.domain;
            url += '&utm_medium=' + medium;
            url += '&utm_content=' + content;
            url += '&utm_campaign=' + this.campaign;
            return url;
        }

        navigate(url) {
            window.open(url, '_blank');
        }

    }
} 