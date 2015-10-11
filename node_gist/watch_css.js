var fs = require("fs");

var stream = fs.createReadStream("my_file.txt", {encoding: "utf8"};

stream.on("data", function(chunk) {
    console.log(chunk);
});

stream.on("end", function(chunk) {
    console.log("end");
    console.log(chunk);
})

var files = fs.readdirSync(process.cwd());

files.forEach(function(file) {
    //监听".css"后缀的文件
    if(/\.css/.test(file)) {
        fs.watchFile(process.cwd() + "/" + file, function() {
            console.log(" - " + file +" changed!");
        });
    }
})