
    function sendlogs(){
        if (var1=Math.random()<0.3){
            window.DD_LOGS && DD_LOGS.logger.error('error occured', { name: 'btn-sendlog', id: 121 });
            console.log("error occured");
            document.getElementById("home-view").innerHTML = "error occured";
        }
        else{
            document.getElementById("home-view").innerHTML = "send log OK!";
        }
        window.DD_LOGS && DD_LOGS.logger.info('log send button click', { name: 'btn-sendlog', id: 123 });
        console.log("button clicked");
    };