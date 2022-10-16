import ProductsDAO from "../dao/productsDAO.js";
import AWS from 'aws-sdk'              

export default class ProductsController {
    
    static async apiGetProducts(req, res, next) {
        const productsPerPage= req.query.productsPerPage ? 
        parseInt(req.query.productsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page): 0;
        
        
        let filters = {}
        if (req.query.category) {
            filters.category = req.query.category;
        }
        const { productsList, totalNumProducts } = await ProductsDAO.getProducts({ filters, page, productsPerPage });
        let response = {
            products: productsList,
            page: page,
            filters: filters,
            entries_per_page: totalNumProducts,
        };
        total_results: totalNumProducts,
        res.json(response);
    }

    static async apiGetProductByIdList(req, res, next) {
        try {
          let idList = JSON.parse(req.params.idList) || []
          let product = await ProductsDAO.getProductByIdList(idList);
          if (!product) {
            res.status(404).json({ error: "not found" });
            return;
          }
          res.json(product);
        } catch (e) {
          console.log(`API,${e}`);
          res.status(500).json({ error: e });
        }
      }

    static async apiGetRatings (req, res, next) {
        try {
            let propertyTypes = await ProductsDAO.getRatings();
            res.json(propertyTypes);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }



    static async apiDeleteProduct(req, res, next) {
        try {
            let id = req.params.id || {}
            let product = await ProductsDAO.deleteProduct(id);
            if (!product) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(product);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }


    static async apiGetProductById(req, res, next) {
        try {
            let id = req.params.id || {}
            console.log(id)
            let product = await ProductsDAO.getProductById(id);
            if (!product) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(product);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiPostProduct(req, res, next) {
        try {
            console.log("was in post product")
            const s3 = new AWS.S3({
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                subregion: process.env.S3_BUCKET_REGION,    
            })
            const params = {
                Bucket:process.env.S3_BUCKET_NAME,      
                Key: performance.now().toString(36) + req.file.originalname,               
                Body:req.file.buffer,
                ACL:"public-read-write",
                ContentType:"image/jpeg"
            };
        
            const product = req.body.product;
            const description = req.body.description;
            const category = req.body.category;
            const initial_value=req.body.initial_value;
            const condition = req.body.condition;
            const seller = req.body.seller;
            let display_img = ''
            
            s3.upload(params,(error,data)=>{
                if(error){
                    console.log(error)
                    res.status(500).send({"err":error}) 
                }
                console.log(data.Location)
                display_img = data.Location
                const reviewResponse =  ProductsDAO.postProduct(product,
                    description,category,initial_value,condition,seller,display_img);
        
                var {error} = reviewResponse;
                console.log(error);
                if (error) {
                    res.status(500).json({error:"Unable to post review."});
                } else {
                    res.json({status:"Success"});
                } 
        
            })
        }
         catch(e) {
             console.log(e)
            res.status(500).json({error: e.message});
        }
    }


    static async apiUpdateProduct(req, res, next) {
        try {
            const productId = req.body.data.product_id;
            const current_bid = req.body.data.current_bid;
            const current_bidder = req.body.data.current_bidder;
            const status = req.body.data.status;
            const reviewResponse = await ProductsDAO.updateProduct(
                productId,
                current_bid,
                current_bidder,
                status
            );

            var {error} = reviewResponse;
            console.log(error);
            if (error) {
                res.status(500).json({error:"Unable to update review."});
            } else {
                res.json({status:"Success"});
            } 
        }   catch(e) {
                res.status(500).json({error: e.message});
            }
    }


}