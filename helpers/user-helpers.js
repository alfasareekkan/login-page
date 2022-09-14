const db=require('../config/connection')
const collections = require('../config/collections');
const bcrypt=require('bcrypt');
const { use } = require('../routes/user');
const ObjectId = require('mongodb').ObjectId
module.exports={
    doSignup:(userData)=>{
        return new Promise(async (resolve, reject) => {
            userData.status=true
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data) => {
                let response = {}
                // console.log(ObjectId(data.insertedId));
                db.get().collection(collections.USER_COLLECTIONS).findOne({ _id: data.insertedId }).then((user) => {
                    response.user = user
                    response.status = true
                    console.log(user);
                    resolve(response)
                })
              
            })

        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collections.USER_COLLECTIONS).findOne({ Email: userData.Email })
            let response={}
            if(user){
                let loginStatus=false
                
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        // console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login faild inside");
                        response.status=false
                        resolve({response})
                    }
                })
            }else{
                console.log("login faild outly");
                response.status=false
                resolve({response})
                // resolve({status:true})
            }

        })
    },
    userValidate: (userData) => {
        return new Promise(async(resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTIONS).findOne({ Email: userData.Email })
            if (!user) {
                resolve()
            } 
             
        })
    },
    addCart: (productId,userId) => {
        return new Promise(async(resolve, reject)=> {
            let userCart = await db.get().collection(collections.CART_COLLECTION).findOne({user: ObjectId(userId) })
            if (userCart) {
                
                db.get().collection(collections.CART_COLLECTION)
                    .updateOne(
                        { user: ObjectId(userId) },
                        {
                    $push:{products:ObjectId(productId)}
                        }).then((response) => {
                    resolve()
                })
                
            }
            else {
                let cartObj = {
                    user: ObjectId(userId),
                    products:[ObjectId(productId)]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    }
}