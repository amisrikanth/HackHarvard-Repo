import mongodb, { ProfilingLevel } from "mongodb";
const ObjectId = mongodb.ObjectId;

let Products;

export default class ProductsDAO {
    static async injectDB(conn) {
        if (Products) {
            return;
        }
        try {
            Products = await conn.db(process.env.SEAL_YOUR_DEAL_NS).collection('products');   
        }
        catch (e) {
            console.error(`unable to connect in ProductsDAO: ${e}`);
        }
    }

    static async getProducts ({
        filters = null,
        page = 1,
        ProductsPerPage = 20,
    } = {}) {
        let query = {status:"active"};
        if(filters) {
            if ("category" in filters) {
                query = { $text: { $search: filters['category']},status:"active"};    
            } 

        }
        let cursor;
        try {
            cursor = await Products.find(query).limit(ProductsPerPage).skip(ProductsPerPage * page);
            const productsList = await cursor.toArray();
            const totalNumProducts = await Products.countDocuments(query);
            return {productsList, totalNumProducts};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { productsList: [], totalNumProducts: 0};
        }
    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await Products.distinct("rated");
            return ratings;
        } catch (e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }
    

    static async getProductByIdList(idList) {
        try {
          var obj_ids = idList.map(function(id) { return ObjectId(id); });
          var ProductsByList=  await Products.find( { _id: { $in: obj_ids } });
          const ProductsList = await ProductsByList.toArray();
          return ProductsList;
        } catch (e) {
          console.error(`Error in getProductByIdList:${e}`);
          throw e;
        }
      }

      static async getProductById(id) {
        let query={
            _id:  ObjectId(id)
        };
        let product;
        try {
            product = await Products.findOne({ _id:  ObjectId(id)})
            const totalNumProducts = await Products.countDocuments(query);
            return {product, totalNumProducts};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { product: {}, totalNumProducts: 0};
        }
      }

      static async deleteProduct(id) {

        try {
          const deleteResponse = await Products.deleteOne({
            _id: ObjectId(id)
          })
    
          return deleteResponse
        } catch (e) {
          console.error(`Unable to delete review: ${e}`)
          return { error: e }
        }
      }


      static async postProduct(product,
        description,category,initial_value,condition,seller,display_img) {
        try {
            console.log("was in post product DAO")
            const reviewDoc = {
             product: product, 
             description: description,
             category: category,
             initial_value: initial_value,
             condition: condition,
             seller: seller,
             display_img: display_img,
             current_bid: '',
             current_bidder: '',
             status: "active"
            }
            return await Products.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e }
        }
    }

    static async updateProduct(productId, new_current_bid,current_bidder,status) {
        try {
            console.log("was here")
          const updateResponse = await Products.updateOne(
            { _id: ObjectId(productId)},
            { $set: { 
                current_bid: new_current_bid,
                current_bidder :current_bidder,
                status:status} }
          )
    
          if (updateResponse.modifiedCount <= 0) {
            return {error:"Unable to update review."};
          }
          return updateResponse
        } catch (e) {
          console.error(`Unable to update review: ${e}`)
          return { error: e }
        }
      }

      static async getProductsByUser ({
        filters = null,
        page = 1,
        ProductsPerPage = 20,
        userId,
    } = {}) {
        let query;
        if(filters) {
            if ("category" in filters) {
                query = { $text: { $search: filters['category']}};    
            } 

        }
        let cursor;
        try {
            cursor = await Products.find(query)
                .limit(ProductsPerPage)
                .skip(ProductsPerPage * page);
            const productsList = await cursor.toArray();
            const totalNumProducts = await Products.countDocuments(query);
            return {productsList, totalNumProducts};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { productsList: [], totalNumProducts: 0};
        }
    }


}


