var fs = require('fs')
fs.readFile('heatmap-6.json', 'utf8', function (err, data) {
    if (err) console.log(err);
    var test1 = JSON.parse(data); //读取的值
});