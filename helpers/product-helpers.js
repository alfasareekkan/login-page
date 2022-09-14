var db=require('../config/connection')
const collections = require('../config/collections');
var bcrypt=require('bcrypt')
// const { Promise } = require('mongodb');
var ObjectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            console.log(data.insertedId)

            callback(data.insertedId)

        })
        


    },
    getAllProduct:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(productId)}).then(()=>{
                resolve()
            })
        })
    },
    getEditProduct:(productId)=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)})
            resolve(product)

        })
    },
    updateProduct:(productId,products)=>{
        return new Promise((resolve,reject)=>{
            console.log(productId);
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)},{$set:{
               
                name:products.name,
                category:products.category,
                descripton:products.descripton

            }}).then(()=>{
                resolve()
            })
        })
    },
    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
           let users= await db.get().collection(collections.USER_COLLECTIONS).find().toArray()
           resolve(users)
            
        })
    },
    addUsers:(userData)=>{
        return new Promise( async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                resolve()
    
            })

        })
    },
    delteUser:(userId)=>{
        
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collections.USER_COLLECTIONS).deleteOne({_id:ObjectId(userId)})
            resolve()

        })
    },
    editUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).findOne({_id:ObjectId(userId)}).then((userData)=>{
                resolve(userData)
            })
        })
    },
    updateUser:(userData,userId)=>{
        return  new  Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collections.USER_COLLECTIONS).updateOne({_id:ObjectId(userId)},{$set:{
                Name:userData.Name,
                Email:userData.Email,
                Password:userData.Password
            }}).then(()=>{
                resolve()
            })
        })
    },
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let admin=await db.get().collection(collections.ADMINN_COLLECTION).findOne({$and:[{Email:adminData.Email},{Password:adminData.Password}]})
            let response={}
            if(admin){
                response.status=true
                response.admin=admin
                resolve(response)
            }
            else{
                response.status=false
                console.log("login failed");
                resolve(response)
            }
        })
    }
}