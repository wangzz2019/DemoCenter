var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var df = require('dateformat');
const {exec}=require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('pizza42', { title: 'Pizza 42' });
  res.render('index',{title:'Home Page'});
});
router.get('/promise',function(req,res,next){
  res.render('promise',{title:"promise test page"});
});

router.get('/pizzaorder',function(req,res,next){
  res.render('pizzaorder',{});
});

router.post('/reboot',function(req,res,next){
  //run a local shell command for test
  command="ls -al";
  exec(command,(err,stdout,stderr)=>{
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })
});

router.post('/webhook',function(req,res,next){
  msg="Hi, this is a return page of POST test";
  eventtitle=req.body.title;
  title=eventtitle.split(' ').pop();
  if (title=="host1") {
    //start host2
    command='ssh -i /root/AlibabaTokyo.pem root@192.168.1.134 "reboot"';
    exec(command,(err,stdout,stderr)=>{
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })
  }
  eventmsg=req.body.body;
  orgid=req.body.org.id;
  orgname=req.body.org.name;
  var d=new Date();
  var dt=d.toLocaleString();
  console.log(dt + "  event_title is " + eventtitle);
  returnmsg={"body":eventmsg,"title":eventtitle,"orgid":orgid,"orgname":orgname};
  console.log(returnmsg);
  res.send(JSON.stringify(returnmsg));
});

router.post('/test',function(req,res,next){
  msg="Hi, this is a return page of POST test";
  eventtitle=req.body.event_title;
  var d=new Date();
  var dt=d.toLocaleString();
  console.log(dt + "  event_title is " + eventtitle);
  res.send(msg + " and the event title is " + eventtitle);
});

router.post('/bodytest',function(req,res,next){
  var1=req.body.customerOccurDate;
  var2=req.body.customerOccurTime;
  var3=req.body.orderInfos[0].orderNumber;
  //msg="hi, this is page for testing request body";
  console.log(var1);
  console.log(var2);
  console.log(var3);
  response={"result":"0010","result1":"0000"};
  res.send(JSON.stringify(response));
});

router.get('/showip',function(req,res,next) {
  var serverIP=getIPAdress();
  //var clientIP=req.ip
  msg="Server IP is: " + serverIP;
  msg+="<br />Client IP is: " + req.ip.match(/\d+\.\d+\.\d+\.\d+/);
  res.send(msg);
});

router.get('/spantag',function(req,res,next){
  //scope.activate(() => {
    const tracer = require('dd-trace').init();
    const span = tracer.startSpan('web.request');
    
    span.setTag('http.url', '/spantag');
    span.setTag('ip','192.168.1.1');
    
    
    msg="This is a page for span tag test, please check the tag info on Datadog"
    span.finish();
    res.send(msg);
    
  //});
});

function epoctotime(epoctime){
  var epoct=parseFloat(epoctime);
  var UTCDate=df(new Date(epoct),'yyyymmddHH:MM:ss',false);
  //var day=df()
  return UTCDate;
}

router.get('/epoc',function(req,res,next){
  retVal=epoctotime(1580986533000);
  //res.send(retVal.toLocaleTimeString('en-US', {timeZone: 'Asia/Tokyo'}));
  res.send(retVal);
});

router.post('/epoc',function(req,res,next){
  /*{
    "body": "$EVENT_MSG",
    "last_updated": "$LAST_UPDATED",
    "event_type": "$EVENT_TYPE",
    "title": "$EVENT_TITLE",
    "date": "$DATE",
    "org": {
        "id": "$ORG_ID",
        "name": "$ORG_NAME"
    },
    "id": "$ID"
}*/

  last_updated=req.body.last_updated;
  epoc="last_updated in EPOC is " + last_updated;
  console.log(epoc);
  readableTime="last_update in YYYYDDMMHHSSmm is " + epoctotime(last_updated);
  console.log(readableTime);
  res.send(epoc + '<br>' + readableTime);
});

router.post('/docomotest',function(req,res,next){
  testdata=req.body.testdata;
  console.log(testdata);
  res.setHeader('content-type',"application/json");
  msg={"id":1,"msg":testdata};
  res.send(JSON.stringify(msg));
});

router.get('/test',function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:3000');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.setHeader('content-type',"application/json");
    s="Hi are you ok";
    // sp=s.split(' ');
    // console.log(s.split(' ').pop());
    //var args=URL.parse(req.url,true).query;
    response={"id":1,"name":"wangzz"}
    res.send(JSON.stringify(response));
});                                       

router.get('/imagesearch/addpic', function (req, res, next) {
  var Client = require("@alicloud/imagesearch-2018-01-20");
  var client = new Client({
    accessKeyId: "***********",  // 获取地址: https://ak-console.aliyun.com
    accessKeySecret: "***************",
    endpoint: "http://***.com", // 获取地址: https://help.aliyun.com/document_detail/66616.html
    apiVersion: "2018-01-20"

  });
  var instanceName = "tesuto"; // 购买的图像搜索实例名称，如: imagesearchtest
  var catId = "0"; // 类目ID，参考: https://help.aliyun.com/document_detail/66623.html
  var itemId = "1234"; // 商品/图片ID
  var custContent = "{\"key\":\"value\"}"; // 商品/图片的Meta信息，搜索结果中会透传
  var picList = {}; // 图片列表
  // 下面以当前目录下的1.jpg 和 2.jpg 为例
  picList[new Buffer("1.jpg").toString("base64")] = fs.readFileSync(path.resolve(__dirname, "../public/images/bag01.jpg")).toString("base64");
  picList[new Buffer("2.jpg").toString("base64")] = fs.readFileSync(path.resolve(__dirname, "../public/images/bag02.jpg")).toString("base64");
  var buildAddContent = function () {
    if (!itemId || !catId || Object.keys(picList).length <= 0) {
      return;
    }
    if (custContent == null) {
      custContent = "";
    }
    var params = {};
    params.item_id = itemId;
    params.cat_id = catId + "";
    params.cust_content = custContent;
    var picListStr = "";
    Object.keys(picList).forEach(function (picName) {
      if (picList[picName].length <= 0) {
        return;
      }
      picListStr += picName + ",";
      params[picName] = picList[picName];
    });
    params.pic_list = picListStr.substr(0, picListStr.length - 1);
    return buildContent(params);
  }
  var buildContent = function (params) {
    var meta = "";
    var body = "";
    var start = 0;
    Object.keys(params).forEach(function (key) {
      if (meta.length > 0) {
        meta += "#";
      }
      meta += key + "," + start + "," + (start + params[key].toString().length);
      body += params[key];
      start += params[key].length;
    })
    return meta + "^" + body;
  }
  client.addItem({
    instanceName: instanceName,
  }, buildAddContent()).then(function (value) {
    console.log("Result", JSON.stringify(value));
  }).catch(function (err) {
    console.log("Error Message: ", err);
  });
});

function getIPAdress() {
  var interfaces = require('os').networkInterfaces();　　
  for (var devName in interfaces) {　　　　
      var iface = interfaces[devName];　　　　　　
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }　　
  }
}

module.exports = router;
