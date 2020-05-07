const express = require('express');
var bodyParser = require('body-parser');

const app = express()
const port = 3000

function generateSuccessResponce(data,message){
    let responce = {};
    responce.status = "success";
    responce.data = (data)?data:"";
    responce.message = message?message:"data retreived successfully";
    return responce;
}

function generateErrorResponce(message){
    let responce = {};
    responce.status = "error";
    responce.data = "";
    responce.message = message?message:"Fail to execute your request";
    return responce;
}

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/contactapp";

async function createDBandCollactions(){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            throw err;
        }else{
            console.log("--- Database created! ---");
            
            let dbObj = db.db("contactapp");
    
            dbObj.createCollection("users", function(err, res) {
                if (err) throw err;
                console.log("**users** Collection created!");
            });
    
            dbObj.createCollection("contacts", function(err, res) {
                if (err) throw err;
                console.log("**contacts** Collection created!");
            });
            // db.close();
        }
    });
}

async function connectToDB(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
                reject({});
            }else{
                let dbObj = db.db("contactapp");
                resolve(dbObj);
            }
        });
    });
}

async function getUsers(){
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        dbObj.collection("users").find({}).toArray(function(err, result) {
            if (err){
                reject([]);
            }else{
                resolve(result);
            }
        });
    });
}

async function insertUser(userObj){
    return new Promise(async (resolve,reject)=>{
        let allUsers = await getUsers();
        userObj.userid = allUsers.length+1;

        let dbObj = await connectToDB();
        dbObj.collection("users").insertOne(userObj, function(err, res) {
            if (err) {
                reject();
            }else{
                console.log("1 document inserted");
                resolve();
            }
        });
    });
}

async function checkUserExist(userObj){
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        dbObj.collection("users").find(userObj).toArray(function(err, result) {
            if (err){
                reject([]);
            }else{
                resolve(result);
            }
        });
    });
}

async function checkContactPresent(contactObj){
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        dbObj.collection("contacts").find(contactObj).toArray(function(err, result) {
            if (err){
                reject([]);
            }else{
                resolve(result);
            }
        });
    });
}

async function addContact(contactObj){
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        dbObj.collection("contacts").insertOne(contactObj, function(err, res) {
            if (err) {
                reject();
            }else{
                console.log(res);
                resolve();
            }
        });
    });
}

async function updateContact(contactObj){
    console.log(contactObj);
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        console.log(dbObj);
        
        // dbObj.collection("contacts").find(filter).toArray(function(err, result) {
        //     // console.log(result);
        //     if(err){
        //         reject();
        //     }else{
        //         resolve(result);
        //     }
        // });

        let filter = { _id: contactObj._id };
        let newvalues = {name: contactObj.name, email: contactObj.email, mobileno: contactObj.mobileno, picture:contactObj.picture } ;
        
        dbObj.collection("contacts").updateOne(filter, { $set : newvalues },{ upsert : false }, function(err,res){
            console.warn('--- warn ---');
            console.warn(err);
            console.warn('--- result ---');
            console.warn(res);
            // if(res.result.nModified > 0){
            //     resolve();
            // }
            reject();
        });
    });
}

async function getContactList(userID){
    return new Promise(async (resolve,reject)=>{
        let dbObj = await connectToDB();
        dbObj.collection("contacts").find({userid:userID}).toArray(function(err, result) {
            if (err){
                reject([]);
            }else{
                resolve(result);
            }
        });
    });
}

createDBandCollactions();

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/login', function (req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    if(userEmail.trim().length == 0 || userPassword.trim().length ==0)
        res.send(generateErrorResponce("Email or Password must not be empty.."));
    else{
        checkUserExist({email:userEmail,password:userPassword}).then((resp)=>{
            console.log(resp)
            if(resp.length == 0){
                res.send(generateErrorResponce("Invalid email or password"));
            }else{
                res.send(generateSuccessResponce(resp[0]._id,"Login successful"));
            }
        }).catch((error)=>{
            console.log(error);
            res.send(generateErrorResponce("","Something went wrong"));
        })
    }
});

app.post('/signup', function (req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    if(userEmail.trim().length == 0 || userPassword.trim().length ==0)
        res.send(generateErrorResponce("Email or Password must not be empty.."));
    else{
        checkUserExist({email:userEmail}).then((resp)=>{
            console.log(resp)
            if(resp.length == 0){
                insertUser({email:userEmail,password:userPassword}).then((resp)=>{
                    res.send(generateSuccessResponce("","User created successful"));
                }).catch((error)=>{
                    res.send(generateErrorResponce("Fail to create your account"));
                });
            }else{
                res.send(generateErrorResponce("User is already register with this email"));
            }
        }).catch((error)=>{
            console.log(error);
            res.send(generateErrorResponce("Fail to create your account"));
        });
    }
});

app.post('/contacts/add', function (req, res) {
    let contactName = req.body.name;
    let contactEmail = req.body.email;
    let contactMobileNo = req.body.mobileno;
    let contactPic = "";

    let userunkid = req.body.userid;

    if(contactName.trim().length == 0 || contactEmail.trim().length ==0 || contactMobileNo.trim().length ==0)
        res.send(generateErrorResponce("All data must be filled."));
    else{
        checkContactPresent({name:contactName,email:contactEmail,userid:userunkid}).then((resp)=>{
            console.log(resp);
            if(resp.length > 0){
                res.send(generateErrorResponce("This contact detail is already saved"));
            }else{
                addContact({name:contactName,email:contactEmail,mobileno:contactMobileNo,picture:contactPic,userid:userunkid}).then((resp)=>{
                    res.send(generateSuccessResponce("","Contact has been saved"));
                }).catch((error)=>{
                    res.send(generateErrorResponce("Fail to add new contact"));
                });
            }
        }).catch((error)=>{
            res.send(generateErrorResponce("Fail to add new contact"));
        })
    }
});

app.post('/contacts/edit', function (req, res) {
    let contactName = req.body.name;
    let contactEmail = req.body.email;
    let contactMobileNo = req.body.mobileno;
    let contactPic = "";

    let contactId = req.body._id;

    let userunkid = req.body.userid;

    if(contactName.trim().length == 0 || contactEmail.trim().length ==0 || contactMobileNo.trim().length ==0)
        res.send(generateErrorResponce("All data must be filled."));
    else{
        // checkContactPresent({name:contactName,email:contactEmail,userid:userunkid}).then((resp)=>{
        //     console.log(resp);
        //     if(resp.length>1){
        //         res.send(generateErrorResponce("This contact detail is already saved"));
        //     }else{
                updateContact({
                    name:contactName,
                    email:contactEmail,
                    mobileno:contactMobileNo,
                    picture:contactPic,
                    _id:contactId,
                    userid:userunkid
                }).then((answer)=>{
                    console.log(answer);
                    res.send(generateSuccessResponce("","Contact has been updated"));
                }).catch((error)=>{
                    res.send(generateErrorResponce("Fail to update contact"));
                });
            // }
        // }).catch((error)=>{
        //     res.send(generateErrorResponce("Fail to update contact"));
        // })
    }
});

app.post('/contacts/list', function (req, res) {
    let userUnkid = req.body.userid;
   if(userUnkid.trim().length == 0){
    res.send(generateErrorResponce("Bad Request,Missng required parameters."));
   }else{
    getContactList(userUnkid).then((resp)=>{
        res.send(generateSuccessResponce(resp,""));
    }).catch((error)=>{
        res.send(generateErrorResponce("Something went wrong while fetching list..."));
    });
   }
});

app.listen(port, () => console.log(`Api running at http://localhost:${port}`))

// client.close();