import axios from "axios";

class UserDataService {

    addUser(googleId) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/users`, { data: { googleId: googleId} }) ;
    }

    getById(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/users/${id}`);
    }

    updateBuyUser(req) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/users/buy`, { data: { googleId: req.googleId,buy_item: req.buy_item } }) ;
    }

    updateSellUser(req) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/users/sell`, { data: { googleId: req.googleId,sell_item: req.sell_item} }) ;
    }

    deleteUser(req) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/products/users`, { data: { user_id: req.user_id } }) ;
    }
}

export default new UserDataService();