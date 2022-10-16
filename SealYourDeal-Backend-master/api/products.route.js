import express from "express";
import ProductsController from "./products.controller.js"
import UsersController from "./users.controller.js";

const router = express.Router();

import multer, { memoryStorage } from 'multer' 
import AWS from 'aws-sdk'                

const storage = memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: filefilter });

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    subregion: process.env.S3_BUCKET_REGION, 
  });

router.post('/upload', upload.single('image'), ProductsController.apiPostProduct)

router.route("/").get(ProductsController.apiGetProducts);
router.route("/:id").get(ProductsController.apiGetProductById)
router.route("/idList/:idList").get(ProductsController.apiGetProductByIdList);
router.route("/:id").delete(ProductsController.apiDeleteProduct);
router.route("/").put(ProductsController.apiUpdateProduct);
router.route("/users/:id").get(UsersController.apiGetUserById)
router.route("/users").post(UsersController.apiPostUser)
router.route("/users/sell").put(UsersController.apiUpdateSellUser)
router.route("/users/buy").put(UsersController.apiUpdateBuyUser)

export default router;