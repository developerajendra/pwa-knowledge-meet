(function(){
    if(!('serviceWorker' in navigator)){
        return 'sorry, no service worker';
    }
    // console.log('service worker available');

    navigator.serviceWorker.register('/serviceworker.js',{scope:'/'}).then((reg)=>{
        console.log('yea register',reg);
    }).catch((err)=>{
        console.log("ohh didn't registered!",err);
    })

    
     
}())