import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO {

    static async injectDB(conn) {
        if (users) {
            return;
        }

        try {
            users = await conn.db(process.env.SEAL_YOUR_DEAL_NS).collection('users');
        } catch (e) {
            console.error(`Unable to establish connection handle in usersDAO: ${e}`);
        }
    }

    static async addUser(googleId) {
        try {
            const userDoc = {
                googleId: googleId,
                sell_items: [],
                buy_items:[]
            }
            let response =""
            const totalUsers =await users.countDocuments( {googleId : {$regex : googleId}});
            console.log(totalUsers)
                if(totalUsers==0){
                    response = await users.insertOne(userDoc)
                }
            return response
                
        } catch (e) {
            console.error(`Unable to post user: ${e}`);
            return { error: e }
        }
    }

    static async updateSellItemUser(userId, sell_item) {
    try { 
        console.log("------------------------------")
        console.log(sell_item)
        console.log("------------------------------")
      let updateResponse = null;
       updateResponse = await users.updateOne(
        { googleId:  userId},
        { $push: { sell_items: sell_item } }
      )
      return updateResponse
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }

  static async updateBuyItemUser(userId, buy_item) {
    try { 
        console.log(buy_item)
      let updateResponse = null;
       updateResponse = await users.updateOne(
        { googleId:  userId},
        { $push: { buy_items: buy_item } }
      )
      return updateResponse
    } catch (e) {
      console.error(`Unable to update user: ${e}`)
      return { error: e }
    }
  }


  static async getUserById(id){
    let query={
        googleId:id
    };
    let cursor;
    try {
        cursor = await users.findOne({ googleId:  {$regex : id}})
        console.log(cursor+"userrrr")
        return cursor;
    } catch(e) {
        console.error(`Unable to issue find command, ${e}`);
        return { usersList: [], totalNumUsers: 0};
    }
}


}
