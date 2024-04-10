import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import ProductModel from "../models/ProductModel.js";
import fs from "fs";
//create product----------------------------------------
export const createProductController = async (req, res) => {
try {
    const {name,description,price, ProUrl,category} = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
            return res.status(500).send({ error: "Price is required" });
      case ! ProUrl:
            return res.status(500).send({ error: "Url is required" });
       case !category:
            return res.status(500).send({ error: "category is required" });
       case  photo && photo.size>10000000:
            return res.status(500).send({ error: "Photo is required" });
   }
    const Products = new ProductModel({...req.fields,slug:slugify(name)})
    //photocheck 
    if(photo){
        Products.photo.data = fs.readFileSync(photo.path)
        Products.photo.contentType = photo.type
    } 
     //save 
      await Products.save();
      //send the data
      res.status(201).send({
        message:"Product created succesfully",
        Products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error
    });
  }
};



//get Product---------------------------------------
export const getProductController = async(req,res)=>{
  try{
  const Products= await ProductModel
  .find({})
  .populate("category")
  .select("-photo")
  .limit(12)
  .sort({createdAt:-1})
   res.status(200).send({
    success:true,
    total:Products.length,
    message:"ALLproducts",
    Products
   })
  }
  catch(error){
    console.log(error)
    res.status(500).send({success:"Error in getting the product"})
  }
}

//single product-------------------------------
export const SingleProductController = async(req,res)=>{
   try{
   const product = await ProductModel
   .findOne({slug:req.params.slug})
   .select("-photo")
   .populate("category")
    res.status(200).send({
    success:true,
    message:"Single Product fetched",
    product
  })
   }catch(error){
   console.log(error)
    res.status(500).send({
    success:true,
    message:"Error in geting product"
   })
}
} 

//get photo controller------------------------------

export const productphotoController = async(req,res)=>{
  try{ 
    const product = await ProductModel.findById(req.params.pid).select("photo")

  if(product.photo.data){
    res.set("Content-Type",product.photo.contentType);
    return res.status(200).send(product.photo.data)
  }
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error in geting photo"
     })

  }
}

//delete product--------------------------------------------------------
export const deleteproduct=async(req,res)=>{
try{
  await ProductModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
    success:true,
    message:"product deleted successfully"

  })
}
catch(error){
  res.status(500).send({
    success:false,
    message:"Error in Deleting"
   })
}

}

//updateProduct---------------------------------------------------------------
export const UpdateProductController=async(req,res)=>{
  try{
    const { name, slug, description, price, ProUrl, category} = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
            return res.status(500).send({ error: "Price is required" });
      case ! ProUrl:
            return res.status(500).send({ error: "Quantity is required" });
       case !category:
            return res.status(500).send({ error: "category is required" });
       case  photo && photo.size>10000000:
            return res.status(500).send({ error: "Photo is required" });
   }
   const Products =await ProductModel.findByIdAndUpdate
   (req.params.pid,{...req.fields,slug:slugify(name)},{new:true})

   if(photo){
       Products.photo.data = fs.readFileSync(photo.path)
       Products.photo.contentType = photo.type
   }  await Products.save();
       res.status(200).send({
       message:"Product updated succesfully",
       Products
   })


  }
  catch(error){
    res.status(500).send({
      success:false,
      message:"Error in updating"
     })

  }

}

//filter--------------------------------------------------

export const productfilterController = async(req,res)=>{
  try{
  const {checked,radio} = req.body
  let args={}
  if(checked.length>0) args.category = checked
  if(radio.length) args.price={$gte:radio[0] ,$lte:radio[1]};

  const products = await ProductModel.find(args);
  res.status(200).send({
    success:false,
    products
  });

  }
  catch(error){
   console.log(error)
   res.status(400).send({
    success:false,
    message:"Error while filtering"
   })
  }
}

//pagination---------------------------------------------

export const productCountControl=async(req,res)=>{
 try{
  const total =await ProductModel.find({}).estimatedDocumentCount();
  res.status(200).send({
    success:true,
    total
  })
 }catch(error){
  console.log(error)
  res.status(400).send({
    success:false,
    message:"Erorr in product count",
    error
  })
 }
}
//----------------------------------
export  const productListControl =async(req,res)=>{
  try{
  const PerPage = 8
  const page = req.params.page ? req.params.page : 1
  const products = await ProductModel
  .find({})
  .select("-photo")
  .skip((page - 1)*PerPage) 
  .limit(PerPage)
  .sort({createdAt:-1})
  res.status(200).send({
    success:true,
    products
  })
}catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Erorr in product count",
      error
  })
}
}
//-------------------search product--------------------------------

export const SearchProductController = async(req,res)=>{
  try{ 
    const {keyword}  = req.params
    const results =await ProductModel.find({
      $or:[
        {name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:"i"} }] }).select("-photo")
         res.json(results)
   }catch(error){
   console.log(error)
   res.status(404).send({
    success:false,
    message:"Error in search product API",
    error
   })


 

  }
}
//--------------------------simliar-------------------------------------------
export const relatedProductController = async(req,res) => {
  try{
    const{pid,cid} = req.params
    const products =await ProductModel.find({
      category:cid,
      _id:{$ne:pid}   
    })  
    .select("-photo")
    .limit(3)
    .populate("category")
    res.status(200).send({
      success:true,
      products
    })


 }
 catch(error){
  console.log(error)
  res.status(400).send({
    success:false,
    message:"Error while getting the similar product ",
    error
  })
 }
}


//------------------------------category wise controller------------------
export const productCategoryController=async(req,res)=>{
try{
   const category = await categoryModel.findOne({slug:req.params.slug})
   const products  = await ProductModel.find({category}).populate('category') 
   res.status(200).send({
    success:true,
    message:"product and category find succesfully",
    category,
    products
   })
}
catch(error){
  console.log(error)
  res.status(200).send({
    success:true,
    message:"error in Getting the product category",
    error
  })
}
}
//-----------------------------payemnet-----------------------------------------------