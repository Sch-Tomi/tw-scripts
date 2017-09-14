Linker.import()

var url = new UrlManipulator();
var isLogged = url.getPath() == "/game.php"

if (isLogged) {
    var config = new Config();
    var options = new Options(config);


    switch (url.getParam('screen')) {
        case 'info_player':
            new playerStats()
            break;

    }

    // Always run!!
    new LinkBar(config.getLinks())
    new Footer(options.open)
}
