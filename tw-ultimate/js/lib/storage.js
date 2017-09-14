// getValue as GM_getValue of GM functions
function getValue(name) {
    name = preparePreName() + name;
    var value = localStorage.getItem(name);
    if (!value || (value === undefined)) {
        return (null);
    }
    return (JSON.parse(value));
}

// setValue as GM_setValue of GM functions
function setValue(name, value) {
    name = preparePreName() + name;
    localStorage.setItem(name, JSON.stringify(value));
}

function preparePreName() {
    return getServer() + ":" + getUserName() + ":";
}

function getServer() {
    return new UrlManipulator().getServer()
}
