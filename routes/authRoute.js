import express from 'express'
import {forgetPasswordControllers,  getAllUser,  loginController, registerController, sendController, updateProfileController} from "../controllers/authControllers.js"
import { isAdmin, requiresSignIn } from '../middleware/authMiddleware.js';

//router object 
const router = express.Router()

//Routing

//Register||method post
router.post('/register',registerController);
//login ||post
router.post('/login',loginController);
// forget Password
router.post('/forget-password',forgetPasswordControllers)
//Protected user Route auth
router.get('/user-auth',requiresSignIn,(req,res)=>{
    res.status(200).send({ok:true})

})
//admin Route path
router.get('/admin-auth',requiresSignIn, isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})


//update Profile
router.put('/update-profile',requiresSignIn,updateProfileController)
//nodemailer
router.post('/sendemail',sendController)
//alluser
router.get('/All-user',requiresSignIn,isAdmin,getAllUser)

export default router;




