const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Path = require('path');
const firebase = require("firebase");

// Required for side-effects
require("firebase/firestore");

//setting FireStore
firebase.initializeApp({
    apiKey: "AIzaSyDnS7yA0SoW_JzTmmnnqPApdUoPthP5OFc",
    authDomain: "sample-4b085.firebaseapp.com",
    projectId: "sample-4b085"
  });

var db = firebase.firestore();
var cricketers = db.collection("cricketers");

//setting Middleware BodyParser
var urlencodedParser  = express.urlencoded({extended: false});

//setting view engine ejs
//app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setting static folder
app.use('/public',express.static('public'));

app.get('/',(req,res) => {
    res.render('home');
})

app.post('/', urlencodedParser, (req,res) => {
   // console.log(req.body.name)
    if(req.body.name != null)
    {
        cricketers.doc(req.body.name).set({
            name: req.body.name, 
            age: req.body.age, 
            type: req.body.type,
            economy: req.body.economy, 
            odiCareer: req.body.odiCareer,
            strikeRate: req.body.sr })
            .then(function(docRef) {
                console.log("Document written with ID");
                res.render('playerAdded')
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        /*
        array = [{name:"Shashank",age:"20"},{name:"Seethu",age:"21"}]
        db.collection('cricketers').get().then(snap => {
            //console.log(snap.size) 
            res.render('success', { data: snap.size })
        })
        
        db.collection("cricketers").get().then(function(querySnapshot) {
            var arr = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                arr.push(doc.id)
                //console.log(doc.id, " => ", doc.data());
                console.log(arr)
            });
            res.render('success',{data: arr})
        });
        */
    }
})

app.get('/login',(req,res) => {
    res.render('login')
})

app.post('/login',urlencodedParser, (req,res) => {
    //console.log(req.body)
    db.collection("cricketers").get().then(function(querySnapshot) {
        /*
        if(querySnapshot.size != 0)
        {
            console.log(querySnapshot.size)
        }
        */
        querySnapshot.forEach((doc) => {
            if(req.body.name == doc.data().name)
            {
                if(doc.id == 'captain')
                {
                    res.render('home', {data: doc.id})
                }
                else
                {
                    db.collection("cricketers").get().then(function(querySnapshot) {
                        var arr = []
                        var size = querySnapshot.size
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            arr.push(doc.data())
                            //console.log(doc.id, " => ", doc.data());
                            //console.log(arr)
                        });
                        res.render('display',{data: arr,size: size})
                    })  
                }
            }
            //console.log(doc.id, doc.data().name);
            //console.log(req.body.name)
            /*
            if(doc.id == req.body.name == 'seethu')
            {
                res.render('home', {data: req.body.name})
            }
            else
            {
                console.log('No cricketer')
            }
            */
        });
    });  
})


const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

/*
db.collection("cricketers").add({
    age: "20",
    name: "Shashank",
    type: "All-Rounder"
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

db.collection('cricketers').doc('SVDiTof6CXxINTNDW292').get()
.then(doc => {
    if(!doc.exists)
    {
        console.log('No')
    }
    else
    {
        console.log('Yes')
        console.log(doc.data())
    }
})
.catch(err => {
    console.log('Error getting document',err)
    process.exit();
})


//For displaying all records
db.collection("cricketers").get().then(function(querySnapshot) {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
});


//For Size
var val = db.collection('cricketers').get().then(snap => {
    //console.log(snap.size) 
    return {value: snap.size}
 });
*/

exports.app = functions.https.onRequest(app);
