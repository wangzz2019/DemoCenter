function remotecall(){
    var hv=document.getElementById("home-view");
    var p=ajax('GET','http://52.196.214.170:3000/test');
    p.then(function (text){
        hv.innerHTML=text;
    }).catch(function(status){
        hv.innerHTML="ERROR: " + status;
    });
};

function ajax(method,url,data){
    var request=new XMLHttpRequest();
    return new Promise(function(resolve,reject){
        request.onreadystatechange=function(){
            if (request.readyState === 4){
                if (request.status === 200){
                    resolve(request.responseText);
                }else{
                    reject(request.status);
                }
            }
        }
        request.open(method,url);
        request.send(data);
    })
}


