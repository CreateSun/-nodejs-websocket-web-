let $ = function (item) {
    let signal = item.substr(0, 1);
    let newItem = item.substring(1);
    if (signal === "#") {
        return document.getElementById(newItem)
    } else if (signal === ".") {
        return document.getElementsByClassName(newItem);
    }
}