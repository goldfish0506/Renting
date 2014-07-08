var cheerio = require("cheerio");
var http = require("http");

var url = "http://www.douban.com/group/beijingzufang/discussion"


// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
    var option = {
    host: "www.douban.com",
    path: "/group/beijingzufang/discussion",
    // url : url,
    headers:{
        // "Accept":"image/webp,*/*;q=0.8",
        // "Accept-Encoding":"gzip,deflate,sdch",
        // "Accept-Language":"en-US,en;q=0.8,zh-CN;q=0.6,zh-TW;q=0.4",
        // "Proxy-Connection":"keep-alive",
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36",
    }
  };

  http.get(option, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

download(url, function(data) {
  if (data) {
    console.log(data);

    var $ = cheerio.load(data);
    $("div.artSplitter > img.blkBorder").each(function(i, e) {
        console.log($(e).attr("src"));
      });

    console.log("done");
  }
  else console.log("error");
});