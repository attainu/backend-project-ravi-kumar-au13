require('dotenv').config({
    path:'/config/.env'
})
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserSignup = require('../models/userSignup')
const {sendEmail , generate_otp} = require("../utils/nodemail");
const customerSchema = require('../models/customer')

var controller = {

//Signup Controller
signing : (req, res) => {

    let hashedPassword = bcrypt.hashSync(req.body.password,10)
    let sign_up = new UserSignup({
        name: req.body.name,
        firm_name:req.body.firm_name,
        email: req.body.email,
        password: hashedPassword
    })
    
    try {
        sendEmail({
            email: sign_up.email,
            message: "Welcome to Phone_Khata Family"
        })
    }catch (error) {
        res.status(500).json({
            message: "Couldn't send the email",
            errors: error
        })
    }
    sign_up.save()
    .then((val) => {
        res.status(201).json({
            message: `Please verify the otp which is sent to the given email address ${sign_up.email}`
        })
    })
    .catch((err) => {
        //If user enter the email which is existing while signing up, it will say email must be unique
        if(JSON.stringify(err).indexOf("email must be unique")>-1){
            res.status(400).json({
                error:"Email already exists!!!"
            })
        }
        else{
            console.log("Error while signing up the user ",JSON.stringify(err))
                res.status(500).json({
                message:"Error in creating user",
                error:err
            })
        }
    })
},

/*Verify the otp sent through mail. 
If verified, will redirect to login page else redirect to signup page*/

verify_otp: (req,res) => {
    let otp = req.body.otp
    if(otp === generate_otp){
        res.status(200).json({
            message: "Email successfully verified....please login to continue"
        })
    }else{
        res.status(404).json({
            message: "Invalid OTP"
        })
    }
},

//Login controller.
/**
 * Once the user hit wrong email or password, it will throw the error.
 * Else if everything is correct, will redirect to dashboard.
 */
login : (req,res)=>{
    UserSignup.findOne({
        where:{
            email:req.body.email
        },
    })
    .then((data)=>{
        if(data === null){
            res.status(401).json({                                 
                message:"Please check your email/password"
            })
        }
        else{
            let boolean = bcrypt.compareSync(req.body.password , data.password)
            if(boolean == true){
                const token = jwt.sign({
                    email: data.email,
                    user_id: data.uuid
                },"secret", {
                    expiresIn: "1h"
                })
                res.status(200).json({
                    message:"Successfully logged in!!!",
                    token: token
                })
            }else{
                res.status(401).json({
                    message:"Invalid Password!!"
                })
            }
        }
    })
    .catch((err)=>{
            console.log("Error while login done by user ",JSON.stringify(err))
            res.status(500).json({
                message:"Cannot log in",
                error:err.message
            })
        })
    },


//Dashboard
//Here, the user can see all its customers when he/she is successfully logged in.
 
home : (req, res) => {
    customerSchema.findAll({
        where:{
            user_id:req.app.get("data1").user_id
        }
    })
    .then((data) => {
        if(data.length > 0){
        res.status(200).json({
            message:"Found",
            data:data
        })
        }else{
            res.status(404).json({
                message: "No customer's info found"
            })
        }
    })
    .catch((err) => {
        console.log("Error while showing dashboard to user ",JSON.stringify(err))
        res.status(500).json({
            message: "Couldn't find your request",
            error: err.message
        })
    })
},

//Update user info
update: (req, res) => {
    UserSignup.findOne({
        where:{
            uuid: req.params.uuid
        }
    })
    .then(data => {
        if(!data){
            res.status(400).json({
                message: `No user exists with uuid ${req.params.uuid}`
            })
        }
        else{
            data.name = req.body.name,
            data.firm_name = req.body.firm_name,
            data.email = req.body.email,
            data.password = req.body.password
            if(data.password){
               let UpdatedhashedPassword = bcrypt.hashSync(req.body.password, 10)
               data.password = UpdatedhashedPassword
            }
            return data.save()
        }
    })
    .then((data) => {
        if(data){
            res.status(200).json({
                message: `Updated user's information`
            })
        }
    })
    .catch((err) => {
        console.log("Error while updating user ",JSON.stringify(err))
        res.status(500).json({
            message: `Error in updating user's info with uuid ${req.params.uuid}`,
            error: err.message
            
        })
    })
},

//For User Logout
logout:(req, res) => {
    res.status(200).json({
        message: "Successfully logged Out"
    })
},

//For getting all the User's List
userList: (req, res, next) => {
    UserSignup.findAll({})
    .then(response => {
        res.json({response})
    })
    .catch(error => {
        res.json({message: 'An error occured!'})
    })
}

}

module.exports = { controller }
