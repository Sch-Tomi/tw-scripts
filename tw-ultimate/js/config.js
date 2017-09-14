class Config {
    constructor() {
        this.config = {};

        if (!this._checkIsInstalled()) {
            this._install();
        } else {
            this._loadConfig();
        }
    }

    getLinks() {
        return this.config.links;
    }

    setLinks(newLinks) {
        this.config.links = newLinks
    }

    // True = Installed | False = not...
    _checkIsInstalled() {
        return getValue('config') !== null;
    }

    _install() {
        this.config.version = GM_info.script.version

        this.config.links = [{
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/main.png",
                text: "Fõhadiszállás",
                link: "main"

            },
            {
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/barracks.png",
                text: "Kiképzés",
                link: "train"
            },
            {
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/snob.png",
                text: "Akadémia",
                link: "snob"
            },
            {
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/smith.png",
                text: "Kovácsműhely",
                link: "smith"
            },
            {
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/place.png",
                text: "Gyülekező hely",
                link: "place"
            },
            {
                icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/market.png",
                text: "Piac",
                link: "market"
            },
            {
                icon: "",
                text: "",
                link: ""
            },
            {
                icon: "",
                text: "",
                link: ""
            }
        ];

        this.save()
    }

    _loadConfig() {
        this.config = getValue('config');
    }

    save() {
        console.log("Saving Config...")
        console.log(this.config)
        setValue('config', this.config)
    }
}
