import express from "express";
import { createCategorycontroller,  deleteController,  getAllcategory, singleCategory, updateCategoryController } from "../controllers/categoryController.js";

import { requiresSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
//create category
router.post("/create-category",requiresSignIn,isAdmin,createCategorycontroller);
//get all category
router.get("/get-category",getAllcategory)

//get-single-category
router.get("/single-category/:slug",singleCategory)


//update categiory
router.put("/update-category/:id",requiresSignIn,isAdmin,updateCategoryController)



//delete-category
router.delete("/delete-category/:id",requiresSignIn,isAdmin,deleteController)

export default router;
