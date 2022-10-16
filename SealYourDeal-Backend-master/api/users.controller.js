import UsersDAO from "../dao/usersDAO.js";
export default class UsersController {
    static async apiPostUser(req, res, next) {
        try {
            const googleId = req.body.data.googleId
            const userResponse = await UsersDAO.addUser(googleId)

            var {error} = userResponse;
            console.log(error);
            if (error) {
                res.status(500).json({error:"Unable to post user."});
            } else {
                res.json({status:"Success"});
            } 
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiUpdateBuyUser(req, res, next) {
        try {
            const googleId = req.body.data.googleId;
            const buy_item = req.body.data.buy_item;

            const userResponse = await UsersDAO.updateBuyItemUser(
                googleId,
                buy_item
            );
            var {error} = userResponse;
            console.log(error);
            if (error) {
                res.status(500).json({error:"Unable to update user."});
            } else {
                res.json({status:"Success"});
            } 
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiUpdateSellUser(req, res, next) {
        try {console.log("****************************************")
            console.log(req.body.data.sell_item)
            console.log("****************************************")
            const googleId = req.body.data.googleId;
            const sell_item = req.body.data.sell_item;

            const userResponse = await UsersDAO.updateSellItemUser(
                googleId,
                sell_item
            );
            var {error} = userResponse;
            console.log(error);
            if (error) {
                res.status(500).json({error:"Unable to update user."});
            } else {
                res.json({status:"Success"});
            } 
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    
    static async apiGetUserById(req, res, next) {
        try {
            console.log(req.params.id)
            let id = req.params.id || {}
            let user = await UsersDAO.getUserById(id);
            if (!user) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(user);
        } catch(e){
            console.log(`API, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}