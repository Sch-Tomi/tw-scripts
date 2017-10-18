javascript: 
function setMS() { 
    var element = document.querySelector("#date_arrival .relative_time");
    var time = element.innerHTML.match(/\d+\:\d+\:\d+/); 
    var date = new Date(); 
    var ms = (date.getMilliseconds()).toString(); 
    while (ms.length < 3) { ms = "0" + ms; }; 
    element.innerHTML = time + ":" + ms; } 
(function main() { window.setInterval(setMS, 1); })(); 
