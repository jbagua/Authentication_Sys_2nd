const express = require('express')
const cookieParser = require("cookie-parser")
const {v4: uuidv4} = require("uuid");
const matchCredentials = require('./utils.js');
const alert = require('alert');
const { User } = require('./user_db.js');
const { Sessions } = require('./session_db.js');
const app = express()

app.use ("/Images",express.static(__dirname + "/Images"))

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))



//show home with forms
app.get('/', function(req, res){
    res.render('pages/home')
})

//create a user account 
app.post('/create', async function(req, res){
    let body = req.body
    const user = await User.create({
        username: body.username,
        password: body.password
    })

    User.username=user
    User.passwordencrypt=user
    console.log( user.toJSON())

    if (user.username || user.password !== ''){
        alert("Account Created");
        res.render('pages/account')

    }else if (user.username || user.password ===''){
        alert ("You need to create an account")
        res.render('pages/error1')
        
    }  
}) 

//login
app.post('/login', async function(req, res){

    if (await matchCredentials(req.body)){
        let user = await User.findOne({
            where: {username: req.body.username}
        })
    
       let id = uuidv4()

    await Sessions.create({
        user:user.id,
        timeOfLogin: Date.now(),
        sessionsId: id
    })

      //create cookie that holds the UUID (the sesson ID)
      res.cookie('SID', id, {
          expires: new Date(Date.now() + 900000),
          httpOnly:true
      })
        //console.log( user.toJSON())
        if(req.body.username===''){
            alert("You are NOT logged in. Enter username & Password")
            res.render('pages/login_error')

        }else if(req.body.username===req.body.username){
            alert("You are logged in")
            res.render('pages/login')
        }   

    }else{
        alert("Check username and password, either you dont have an account or crendentials are incorrect")
        res.render('pages/error2')
    }
})

//Logout route
app.post('/logout', async function(req, res){

        let id=uuidv4()
    
        //Remove cookies and make ID value empty
        res.clearCookie('SID=',id,{
            expires: new Date(Date.now()+900000),
            httpOnly:true
        })
        //Delete sessons model when user logs out
        await delete Sessions[id]

        res.render('pages/logout')
        alert("You have logged out")
    })

    //This is the protected route 
    app.get('/supercoolmembersonlypage', function (req, res){
        let id= req.cookies.SID

        let session =id

        if(session){
            res.render('pages/members')

        }else{
            res.render('pages/error')
        }

    })
    //if something went wrong you get sent here
    app.get('/error', function(req, res){
        res.render('pages/error')
    })
    //404 handling
    app.all('*', function(req, res){
        res.render('pages/error')
    })
    app.listen(1612)
    console.log("Server running on port 1612")
