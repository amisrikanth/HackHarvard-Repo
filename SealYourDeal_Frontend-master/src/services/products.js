import axios from "axios";

class ProductDataService {

    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products?page=${page}`);
    }

    find(query, by="category", page=0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products?${by}=${query}&page=${page}`);
    }

    findById(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/${id}`);
    }

    uploadProduct(formData) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/upload`, formData, {
            'Content-Type': 'multipart/form-data'
        });
    }


    updateProduct(req) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products`, { data: { product_id: req.product_id, 
            current_bid: req.new_bid, current_bidder: req.current_bidder, status: req.status } }) ;
    }
}

export default new ProductDataService();