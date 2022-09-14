var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
var admin=true
var adminLoged=true
var fs = require('fs');
var verifyLog=(req,res,next)=>{
  if(req.session.logedIn){
    next()
  }
  else{
    res.redirect('/admin/login')
  }
}


router.get('/', function(req, res, next) {
  if(req.session.logedIn){
    productHelper.getAllProduct().then((products)=>{
      res.render('admin/view-products',{admin,products,adminLoged});
    })
  }else{
    res.redirect('/admin/login')
  }
  
});
router.get('/add-products',verifyLog, function(req, res, next) {
  res.render('admin/add-products')
});
router.post('/add-products', function(req,res) {
  console.log(req.body);
  console.log(req.files.Image);
  productHelper.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-image/'+id+'.jpg',(err,done)=>{
      if(!err){
         res.render('admin/add-products',adminLoged,admin)
      }
    })
  })
});
router.get('/delete-product/:id',verifyLog,(req,res)=>{
  let productId=req.params.id
  productHelper.deleteProduct(productId).then(()=>{
    res.redirect('/admin/')
    fs.unlinkSync('./public/product-image/'+productId+'.jpg');
  })

})
router.get('/edit-product/:id',verifyLog,(req,res)=>{
  let productId=req.params.id
  console.log(productId);
  productHelper.getEditProduct(productId).then((response)=>{
    res.render('admin/edit-product',{admin,response,adminLoged})
  }) 
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
 
 productHelper.updateProduct(req.params.id,req.body).then(()=>{
  res.redirect('/admin/')
  if(req.files.Image){
    let image=req.files.Image
    image.mv('./public/product-image/'+id+'.jpg')
  }
 })
 
})
router.get('/users',verifyLog,(req,res)=>{
  productHelper.getUsers().then((users)=>{
    res.render('admin/view-users',{admin,users,adminLoged})

  })
  
})
router.get('/add-user',verifyLog,(req,res)=>{
  res.render('admin/add-user',{admin,adminLoged})
})
router.post('/add-user',(req,res)=>{
  productHelper.addUsers(req.body).then(()=>{
    res.redirect('/admin/users')
  })
})
router.get('/delete-users/:id',verifyLog,(req,res)=>{
  let userId=req.params.id
  productHelper.delteUser(userId).then(()=>{
    res.redirect('/admin/users')

  })

})
router.get('/edit-user/:id',verifyLog,(req,res)=>{
  productHelper.editUser(req.params.id).then((userData)=>{
    res.render('admin/edit-user',{admin,userData,adminLoged})
  })
})
router.post('/edit-user/:id',(req,res)=>{
  productHelper.updateUser(req.body,req.params.id).then(()=>{
    res.redirect('/admin/users')
  })
})
router.get('/login',(req,res)=>{
  if(req.session.logedIn){
    res.redirect('/admin/')
  }else{
    adminLoged=false
    res.render('admin/login',{admin,loginValue:req.session.loginValue,adminLoged})
    adminLoged=true
    
    req.session.loginValue=false
  }
})
router.post('/login',(req,res)=>{
  productHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.logedIn=true
      req.session.admin=response.admin
      res.redirect('/admin/')
    }else{
      req.session.loginValue=true
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin/login')
  adminLoged=false
})
module.exports = router;
