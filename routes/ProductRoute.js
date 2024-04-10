import  express  from "express";
import {  requiresSignIn ,isAdmin } from "../middleware/authMiddleware.js";
import { SearchProductController,
         SingleProductController,
        UpdateProductController,
        createProductController,
        deleteproduct, 
        getProductController,
        productCategoryController,
        productCountControl,
        productListControl,
        productfilterController, 
        productphotoController, 
        relatedProductController

      } from "../controllers/ProductController.js";
import formidable from "express-formidable";


const router = express.Router();
//1-get Product (crud operation start)
router.get("/get-product",getProductController)
//2-createProduct
router.post("/create-product",requiresSignIn,isAdmin,formidable(),createProductController)
//3-get single Product
router.get('/get-single-pro/:slug',SingleProductController)

//4-getproductphoto
router.get('/product-photo/:pid',productphotoController)

//5-delete product
router.delete('/del-product/:pid',deleteproduct)

//6-update product
router.put('/Update-product/:pid',requiresSignIn,isAdmin,formidable(),UpdateProductController)

// crud end

//7-filter
router.post('/product-filters',productfilterController)
 
//8-product-count
router.get('/product-count',productCountControl)

//9-product per page
router.get('/product-list/:page',productListControl)  

//10-search product
router.get('/search/:keyword',SearchProductController)

//11- similar Product
router.get('/related-product/:pid/:cid',relatedProductController)


//12-category wise product
router.get('/product-category/:slug',productCategoryController)




export default router;