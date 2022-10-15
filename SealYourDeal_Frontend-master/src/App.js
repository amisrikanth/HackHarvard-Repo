import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect, useCallback } from "react";

import Login from "./components/login";
import Logout from "./components/logout";
import ProductsList from "./components/ProductsList";
import Product from "./components/Product";
import Upload from "./components/upload.js";
import User from "./components/User.js";
import UserDataService from "./services/user";
import "./App.css";
import Avatar from "react-avatar";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const [sell_items, set_sell_items] = useState([]);
  const [buy_items, set_buy_items] = useState([]);

  const retrieveSells = useCallback(() => {
    UserDataService.getById(user.googleId)
      .then((response) => {
        set_sell_items(response.data.sell_items);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  const retrieveBuys = useCallback(() => {
    UserDataService.getById(user.googleId)
      .then((response) => {
        set_buy_items(response.data.buy_items);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [user]);

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      console.log("was logged in");
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        console.log("was logged out");
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      retrieveSells();
      retrieveBuys();
    }
  }, [user, retrieveSells, retrieveBuys]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Navbar
          bg="info"
          expand="lg"
          sticky="top"
          variant="dark"
          className="main_nav_bar"
        >
          <Container className="container-fluid">
            <Navbar.Brand className="brand" href="/">
              {/* <img
                src="/images/products-logo.png"
                alt="products logo"
                className="productsLogo"
              /> */}
              <Avatar name="Seal Your Deal" size="50" round={true} />
              <span className="company_name">SEAL YOUR DEAL</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link as={Link} to={"/products"}>
                  Products
                </Nav.Link>
                {user && (
                  <Nav.Link as={Link} to={"/listProduct"}>
                    Sell Product
                  </Nav.Link>
                )}
                {user && (
                  <Nav.Link as={Link} to={"/user"}>
                    Profile
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
            {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} />}
          </Container>
        </Navbar>

        <Routes>
          <Route exact path={"/"} element={<ProductsList user={user} />} />
          <Route
            exact
            path={"/products"}
            element={<ProductsList user={user} />}
          />
          <Route path={"/products/:id/"} element={<Product user={user} />} />
          <Route exact path={"/listProduct"} element={<Upload user={user} />} />
          <Route
            exact
            path={"/user"}
            element={
              <User user={user} sell_items={sell_items} buy_items={buy_items} />
            }
          />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
