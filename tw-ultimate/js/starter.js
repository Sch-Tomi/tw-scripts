Linker.import()

var url = new UrlManipulator();
var isLogged = url.getPath() == "/game.php"

if (isLogged) {
    var config = new Config();
    var options = new Options(config);
    var villageDB = new VillageDB(config);


    switch (url.getParam('screen')) {
        case 'info_player':
            new playerStats()
            break;
        case 'map':
            new PremiumMap(config.getPremiumMapConfig())
            break;
        case 'overview_villages':
            villageDB.getVillages()

            //new OverView(config)
            break;
        case 'place':
            if (url.getParam('try') == "confirm") {
                new TroopStarter();
            }
    }

    // Always run!!
    new LinkBar(config.getLinks())
    new Footer(options.open)

    villageDB.includeNavigator()


    //Finally removes Ads
    new AdRemover()
}
