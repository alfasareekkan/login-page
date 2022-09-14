
var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')
var admin=false
var verifyLog=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function(req, res, next) { 
  let user=req.session.user
  // console.log(user)
  if (user) {
     userHelpers.userValidate(user).then(() => {
       req.session.destroy()
       res.redirect('/')
    })
    // productHelper.getAllProduct().then((products)=>{
    //   res.render('user/display-products', {admin,products,user});
    // })
  }
  // else {
    productHelper.getAllProduct().then((products)=>{
      res.render('user/display-products', {admin,products,user});
  
    })
  // }
 
 
  
});
router.get('/login', (req, res) => {
  
  if(req.session.loggedIn){
   res.redirect('/')
  }
  else{

    res.render('user/login',{loginError:req.session.loginError})
    req.session.loginError=false
  }
 
})
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/signup')
  }
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    // console.log(response);
      req.session.user = response.user
    req.session.loggedIn = true
      res.redirect('/')
   
  })
  
})

router.post('/login',(req,res,next)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true
      console.log(response);
      req.session.user = response.user
      console.log(req.session);
      res.redirect('/')
    }
    // else if(response){
    //   req.session.loginError="invalid email or password"
    //   res.redirect('/login')

    // }
    else{
      req.session.loginError="invalid email or password"
      res.redirect('/login')
    }
  })

})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLog,(req,res)=>{
  res.render('user/cart')
})
router.get('/add-cart/:id', verifyLog, (req, res) => {

  userHelpers.addCart(req.params.id, req.session.user._id).then(() => {
    res.redirect('/')
  })
})
module.exports = router;
