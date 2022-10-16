import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv"; 
import ProductsDAO from './dao/productsDAO.js';
import UsersDAO from './dao/usersDAO.js';

async function main() {
  dotenv.config();

  const client = new mongodb.MongoClient( 
    process.env.SEAL_YOUR_DEAL_DB_URI
  )
  const port = process.env.PORT || 8000;
  try {
// Connect to MongoDB server
    await client.connect();
    await UsersDAO.injectDB(client);
    await ProductsDAO.injectDB(client);
    app.listen(port, () => {
      console.log('Server is running on port: ' + port);
    })
} catch (e) {
    console.error(e);
    process.exit(1);
}
}
main().catch(console.error);
