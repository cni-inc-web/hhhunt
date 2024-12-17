function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var Webflow = Webflow || [];
Webflow.push(function () {
    var tabName = getParam('tab');
    if (tabName) $('.' + tabName).triggerHandler('click');
});