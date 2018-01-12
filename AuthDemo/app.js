const   bodyParser     = require('body-parser'),
express                = require('express'),
mongoose               = require('mongoose'),
app                    = express(),
session                = require('express-session'),
passport               = require('passport'),
LocalStrategy          = require('passport-local'),
passportLocalMongoose  = require('passport-local-mongoose'),
port                   = process.env.PORT,
ip                     = process.env.IP,
User                   = require('./models/user'),
Schema                 = mongoose.Schema;
           

//let mongoose use native promises library    
mongoose.Promises = global.Promises;  

//set the template view engine
app.set("view engine", "ejs")

//use  the public folder
app.set(express.static(__dirname +"/public"));

//set up the DB connection
 var db = "mongodb://localhost/auth_db";
mongoose.connect(db);

//add bodyParser
app.use(bodyParser.urlencoded({extended:true}));

//set express-session 
  app.use(session({
  secret: 'callback hell',
  resave: false,
  saveUninitialized: false,
}))

//initialize passport
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

//serialize and deserialize using passport-local-mongoose methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**********************
*****CREATE ROUTES*****
**********************/

//CREATE THE MIDDLEWARE TO HANDLE SESSION AUTH
const isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect('/login');
}

//main home page
app.get('/',(req,res)=>{
    res.render("home");
})

//secret page route
app.get('/secret',isLoggedIn, (req,res)=>{
res.render("secret");
});

//================
//AUTH ROUTES
//=================

app.get('/register',(req,res) =>{
    res.render("register");
});


app.post('/register',(req,res) =>{
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username : username}),password,(err,user)=>{
     if(err){
         console.log(err);
         return res.render('register');
     } 
         passport.authenticate("local")(req,res,()=>{
             res.redirect('/secret');
         })
      
    });
});

//LOGIN ROUTES
app.get('/login',(req,res)=>{
    res.render("login");
});


app.post('/login',passport.authenticate("local",{
    successRedirect:'/secret',
    failureRedirect:'/login'
}),(req,res)=>{}
);

//LOGOUT ROUTES
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})


           
app.listen(port,ip,()=> console.log(`Server started on port ${port}`));          