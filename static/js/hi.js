/* ajax start */
function ajax(options) {
    var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft,XMLHTTP");
    var str = "";
    for (var key in options.data) {
        str += "&" + key + "=" + options.data[key];
    }
    str = str.slice(1)
    if (options.type == "get") {
        var url = options.url + "?" + str;
        xhr.open("get", url);
        xhr.send();
    } else if (options.type == "post") {
        xhr.open("post", options.url);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(str)
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var d = xhr.responseText;
            options.success && options.success(d)
        } else if (xhr.status != 200) {
            options.error && options.error(xhr.status);
        }
    }
}
/* ajax end */

function hi(tag) {
    regId = /^#.*/
    regClass = /^\..*/
    if (regId.test(tag))
        return document.getElementById(tag.substr(1))
    else if (regClass.test(tag))
        return document.getElementsByClassName(tag.substr(1))
}