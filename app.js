var express = require('express');
var querystring= require('querystring');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./settings');
var session = require('express-session');


const MongoClient = require('mongodb').MongoClient

var app = express();
var db;




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(express.static(path.join(__dirname, 'public')));



// Shopify Authentication





MongoClient.connect("mongodb://"+config.mlab_username + ":"+config.mlab_password + config.mongodb_url, (err, database) => {
  if (err) return console.log(err)
  db = database
/*
    db.createCollection("customerscart", function(err, res) {
    if (err) throw err;
    console.log("database made");
  });
*/
    //**********************************************************************************initiate cart

    //***************************************************************************


});




// This function initializes the Shopify OAuth Process
// The template in views/embedded_app_redirect.ejs is rendered 
app.get('/shopify_auth', function(req, res) {

    if (req.query.shop) {
        req.session.shop = req.query.shop;
        res.render('embedded_app_redirect', {
            shop: req.query.shop,
            api_key: config.oauth.api_key,
            scope: config.oauth.scope,
            redirect_uri: config.oauth.redirect_uri
        });
    }
})

app.get('/obtainRows',function(req,res){


    /*
    var jsonArray=[]

    var testjson= {
    title: "JSON TEST",
    goal: 200,
    activation: "Activated"
    }

    var testjson1= {
    title: "JSON TEST1",
    goal: 200,
    activation: "Activated"
    }


    jsonArray.push(testjson);
    jsonArray.push(testjson1);



    var data ={
        rowsList: jsonArray
    }
*/


    var query= {shop:req.session.shop};
    db.collection("customerscart").findOne( query, function(err, result){
        if(err) return console.log(err);
        
        res.jsonp(result)      
    });




 //   res.jsonp(data);
})




/*
var myquery = { address: "Valley 345" };
  var newvalues = { name: "Mickey", address: "Canyon 123" };
  db.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });



*/



app.get('/addBar',function(req,res){


  
    var newbarList;
    var query= {shop:req.session.shop};

    db.collection("customerscart").findOne( query, function(err, result){
        if(err) return console.log(err);
        updateBar(result,req);     
        res.json(200);   
    });
   

})

app.post('/deleteBar',function(req,res){



    var query= {shop:req.session.shop};
    console.log(req.session.shop);


    db.collection("customerscart").findOne(query,function(err,result){
        if(err) return console.log(err);
        removeBar(result,req);
        res.json(200);


    })
})

function removeBar(result,req){
    var query= {shop:req.session.shop};


    console.log(req.body.name);
    var newBarList = result.barList;
    var deleteBarName= req.body.name;
    

    for(i=0;i<newBarList.length;i++){
        console.log(newBarList[i].title);

        if(newBarList[i].title===deleteBarName){
            console.log('founddeletion');
            newBarList.splice(i,1);
            break;
        }
    }

    var newvalues = { $set: { barList: newBarList } };    
    db.collection("customerscart").updateOne(query,newvalues, function(err,res){
        if(err) return console.log(err);
    });


}

function updateBar(result,req){
    var query= {shop:req.session.shop};

    var newbarList=result.barList;

    //var newBar =JSON.parse(JSON.stringify(req.query));
    var newBar = req.query;
    delete newBar['_'];
    delete newBar['callback'];

    newbarList.push(newBar);


    var newvalues = { $set: { barList: newbarList } };
    console.log('newvalues');
    console.log(newvalues);


    db.collection("customerscart").updateOne(query,newvalues, function(err,res){
        if(err) return console.log(err);
        console.log("success with adding")
    });


}


// After the users clicks 'Install' on the Shopify website, they are redirected here
// Shopify provides the app the is authorization_code, which is exchanged for an access token
app.get('/access_token', verifyRequest, function(req, res) {
    if (req.query.shop) {
        var params = { 
            client_id: config.oauth.api_key,
            client_secret: config.oauth.client_secret,
            code: req.query.code
        }
        var req_body = querystring.stringify(params);

        console.log("stringifiedreq_body:")
        console.log(req_body)

        request({
            url: 'https://' + req.query.shop + '/admin/oauth/access_token', 
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(req_body)
            },
            body: req_body
        }, 
        function(err,resp,body) {
            console.log("body response:")
            console.log(body);
            body = JSON.parse(body);
            req.session.access_token = body.access_token;
            console.log("req session:")
            console.log(req.session);
            res.redirect('/');
        })
    }
})

// Renders the install/login form
app.get('/install', function(req, res) {
    res.render('app_install', {
        title: 'Shopify Embedded App'
    });
})

// Renders content for a modal
app.get('/modal_content', function(req, res) {
    res.render('modal_content', {
        title: 'Embedded App Modal'
    });
})

// The home page, checks if we have the access token, if not we are redirected to the install page
// This check should probably be done on every page, and should be handled by a middleware
app.get('/', function(req, res) {
/*
    var onequery = {: 2017}
    console.log(db.collection("customerscart").count(onequery,function(err,res){
        console.log(res);
    }));
    var zeroquery= {_id:0}
    console.log(db.collection("customerscart").count(zeroquery,function(err,res){
        console.log(res);
    }));

*/

    var shopquery={shop: req.session.shop}

    db.collection("customerscart").count(shopquery,function(err,res){
        if(res==0){
            db.collection("customerscart").insert({shop: req.session.shop, barList: []})
        }

    })

    
    if (req.session.access_token) {
        
       postScriptTag(req,res);
        
        res.render('index', {
            title: 'Home',
            api_key: config.oauth.api_key,
            shop: req.session.shop
        });
        
        
    } else {
        res.redirect('/install');
    }
})

app.get('/add_product', function(req, res) {
    res.render('add_product', {
        title: 'Add A Product', 
        api_key: config.oauth.api_key,
        shop: req.session.shop,
    });
})


function deleteScriptTag(req,res){

    

    var oldurl="";
    var idlist=[];
    request({
        method: "GET",
        url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',
        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        },
        json: true
    },function(error,response,body){
        console.log(response.body.script_tags);
        var j =response.body.script_tags;
        for (var i=0;i<j.length;i++){

            console.log(j[i].src);
            if(j[i].src === oldurl){
                idlist.push(j[i].id)

            }}
        console.log(idlist);
            
           
        for (var i=0;i<idlist.length;i++){

            request({
                method:"DELETE",
                url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags/' + idlist[i]+'.json',
                headers: {
                    'X-Shopify-Access-Token': req.session.access_token
                }
            },function(error,response,body){

            })
        } 

    })

    

}



app.get('/scriptTagCode', function(req, res) {
    


    var query= {shop: req.session.shop};
    db.collection("customerscart").findOne(query,function(err,result){
        if(err) return console.log(err);
        findFirstActivated(result,res);
     
    })

    /*
    data= {
        "userPrice": 100,
        "beforeProgressMessageField":" Only $",
        "afterProgressMessageField":" until free Shipping!",
        "color":"blue"
    }*/
    
})

function findFirstActivated(result,res){


    var newBarList = result.barList;
    var foundBar=false;

    for(i=0;i<newBarList.length;i++){
        console.log(newBarList[i])

        if(newBarList[i].activation==="Activated"){
            foundBar=true;
            res.jsonp(newBarList[i]);
            break;
        }
    }

    if(!foundBar){
    var emptyData={};
    res.jsonp(emptyData);
}
}


app.get('/products', function(req, res) {
    var next, previous, page;
    page = req.query.page ? ~~req.query.page:1;

    next = page + 1;
    previous = page == 1 ? page : page - 1;

    request.get({
        url: 'https://' + req.session.shop + '.myshopify.com/admin/products.json?limit=5&page=' + page,
        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        }

    }, function(error, response, body){
        if(error)
            return next(error);
        body = JSON.parse(body);
        res.render('products', {
            title: 'Products', 
            api_key: config.oauth.api_key,
            shop: req.session.shop,
            next: next,
            previous: previous,
            products: body.products
        });
    })  
})

app.post('/activateFreeShipping', function(req,res){



})


app.post('/products', function(req, res) {
    data = {
     product: {
            title: req.body.title,
            body_html: req.body.body_html,
            images: [
                {
                    src: req.body.image_src
                }
            ],
            vendor: "Vendor",
            product_type: "Type"
        }
    }
    req_body = JSON.stringify(data);
    console.log(data);
    console.log(req_body);
    request({
        method: "POST",
        url: 'http://' + req.session.shop + '.myshopify.com/admin/products.json',
        headers: {
            'X-Shopify-Access-Token': req.session.access_token,
            'Content-type': 'application/json; charset=utf-8'
        },
        body: req_body
    }, function(error, response, body){
        if(error)
            return next(error);
        console.log(body);
        body = JSON.parse(body);
        if (body.errors) {
            return res.json(500);
        } 
        res.json(201);
    })  
})

app.put('/deactivateBar',function(req,res){
    console.log("deactivating")
    var query= {shop:req.session.shop};
    db.collection("customerscart").findOne(query,function(err,result){
        if(err) return console.log(err);
        deactivateBar(result,req);
        res.json(200)
    })
})

app.put('/activateBar',function(req,res){
    console.log("activating")
    var query= {shop:req.session.shop};
    db.collection("customerscart").findOne(query,function(err,result){
        if(err) return console.log(err);
        activateBar(result,req);
        res.json(200);

    })
})






function activateBar(result,req){

    var query= {shop:req.session.shop};

    newBarList = result.barList;
    deactivateBarName= req.body.name;
    console.log(deactivateBarName);
    for(i=0;i<newBarList.length;i++){
        if(newBarList[i].title===deactivateBarName){
            newBarList[i].activation ="Activated"
            break;
        }
    }
    console.log(newBarList);
    var newvalues = { $set: { barList: newBarList } };    
    db.collection("customerscart").updateOne(query,newvalues, function(err,res){
        if(err) return console.log(err);
    });


}

function deactivateBar(result,req){


    var query= {shop:req.session.shop};

    newBarList = result.barList;
    deactivateBarName= req.body.name;
    console.log(deactivateBarName);
    for(i=0;i<newBarList.length;i++){
        if(newBarList[i].title===deactivateBarName){
            console.log("detecteddeactivation");
            newBarList[i].activation ="Deactivated"
            break;
        }
    }
    console.log(newBarList);
    var newvalues = { $set: { barList: newBarList } };    
    db.collection("customerscart").updateOne(query,newvalues, function(err,res){
        if(err) return console.log(err);
    });

  

}

function createWebhook(req,res){


    var map = JSON.parse(JSON.stringify(req.query));
    delete map['signature'];
    delete map['hmac'];

    var message = querystring.stringify(map);
    var generated_hash = crypto.createHmac('sha256', config.oauth.client_secret).update(message).digest('hex');

   data ={
    "webhook": {
        "topic": "carts\/update",
        "address": "\/cartchange",
        "format": "json"
        }
    }

    request({
        method: "POST",
        url: 'https://' + req.session.shop + '.myshopify.com/admin/webhooks.json',

        headers: {
            'X-Shopify-Topic': "carts\/update",
            'X-Shopify-Shop-Domain': req.session.shop,
            'X-Shopify-Access-Token': req.session.access_token,
            'X-Shopify-Hmac-SHA256' : generated_hash
        },
  
        form: data
        
    }, function(error, response, body){
        if(error)
            return error;
        console.log(body);
    })


    
}

function postScriptTag(req,res){

    var url="http://108.167.175.187\/scripts\/scripttag.js"


    data = {
        "script_tag":{
            "event": "onload",
            "src": url
        }
    }


    scriptTagAlreadyExists=false;

    request({
        method: "GET",
        url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',
        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        },
        json: true
    }, function(error,response){
        if(error)
            return error;
        scriptTagAlreadyExists=findExisting(response,url);

        console.log("Existing: " + scriptTagAlreadyExists);

        if(!scriptTagAlreadyExists){
    request({
        method: "POST",
        url: 'https://' + req.session.shop + '.myshopify.com/admin/script_tags.json',

        headers: {
            'X-Shopify-Access-Token': req.session.access_token
        },
  
        form: data
        
    }, function(error, response, body){
        if(error)
            return next(error);
        console.log(body);
    })
    }


    })




   
    }

function findExisting(response,url){
 
    var scriptTagList=response.body.script_tags;

    for(i=0;i<scriptTagList.length;i++){

        if(scriptTagList[i].src ===url ){
            return true;
        }
    }
    return false;
}


function verifyRequest(req, res, next) {
    var map = JSON.parse(JSON.stringify(req.query));
    delete map['signature'];
    delete map['hmac'];

    var message = querystring.stringify(map);
    var generated_hash = crypto.createHmac('sha256', config.oauth.client_secret).update(message).digest('hex');
    console.log("hash");
    console.log(generated_hash);
    console.log("req.query");
    console.log(req.query.hmac);
    if (generated_hash === req.query.hmac) {
        next();
    } else {
        return res.json(400);
    }

}



app.post('/editBar',function(req,res){

    var query= {shop:req.session.shop};
    db.collection("customerscart").findOne(query,function(err,result){
        if(err) return console.log(err);
        console.log("ASASSSS")
        editBar(result,req);
                console.log("ASASSSS34")
        res.json(200);
    }

)
})

function editBar(result,req){



    var query= {shop:req.session.shop};
    var oldname =req.body.oldBarName;
    
    var newBarList = result.barList;
    
 
    for(i=0;i<newBarList.length;i++){
        if(newBarList[i].title===oldname){
            var editedBar = newBarList[i];
            editedBar.title =req.body.newBarTitle;
            editedBar.goal=req.body.newBarGoal;
            editedBar.initialMessage=req.body.newBarInitialMessage;
            editedBar.beforeProgressMessageField=req.body.newBarAfterProgressMessageField;
            editedBar.afterProgressMessageField=req.body.newBarAfterProgressMessageField;
            editedBar.goalMessageField=req.body.newBarGoalMessageField;
            editedBar.color=req.body.newBarColor;
            break;
        }
    }

    var newvalues = { $set: { barList: newBarList } };    
    db.collection("customerscart").updateOne(query,newvalues, function(err,res){
        if(err) return console.log(err);
    });

}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





var server_ip_address = '108.167.175.187';

app.set('port', process.env.PORT || 1337);

var server = app.listen(app.get('port'), server_ip_address, function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;


