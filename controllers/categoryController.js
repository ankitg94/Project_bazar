import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"


//create category------------------------------------
export const createCategorycontroller = async(req,res)=>{
    try{
     const {name} = req.body
     if(!name){
        return res.status(400).send({
            success:false,
            Message:"Name is required"
        })
     }
     const existcategory = await categoryModel.findOne({name})
     if(existcategory){
        return res.status(400).send({
            success:false,
            Message:"Category already exist"
        }) 
     }  
     const category =await categoryModel({name, slug:slugify(name)}).save()
        res.status(200).send({
        success:true,
        Message:"category created succesfully",
        category
     })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            Message:"error in creating category"
        })

    }
} 
//---------------update category---------------------------------------
export const updateCategoryController = async(req,res)=>{
try{
    const {name}=req.body
    const {id} =req.params
    const Category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
     res.status(200).send({
        success:true,
        Message:"category updated succesfully",
        Category
    })
}
catch(error){
    console.log(error)
    res.status(500).send({
        success:true,
        Message:"error in updating product"
    })
}
}
//------------get-- all--- category-----------------------------
export const getAllcategory =async(req,res)=>{
try{
    const category = await  categoryModel.find({})
        res.status(200).send({
            success:true,
            Message:"Get your category here",
            category
        })
}
catch(error){
  console.log(error)
  res.status(500).send({
    Message:"Error in geting the product"
  })
}
}

//get one category
export const singleCategory = async(req,res)=>{
try{
    const category =await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
        success:true,
        Message:"get the single category",
        category,
    })
} 
catch(error){
    console.log(error)
        res.status(500).send({
        Message:"Error in geting the single product"
      })
}
}
 

//-------------------delete---------------------
export const deleteController = async(req,res)=>{
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        
        res.status(200).send({
            success:true,
            Message:"category Deleted succesfully"
        })
    }catch(error){
         console.log(error)
         res.status(500).send({
         Message:"Error in geting the single product",
         error,
  })
}
}