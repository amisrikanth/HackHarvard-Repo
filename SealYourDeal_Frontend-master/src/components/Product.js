import React, { useState, useEffect } from "react";
import ProductDataService from "../services/products";
import UserDataService from "../services/user";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import "./Product.css";

const Product = (props) => {
  let params = useParams();
  const [input, setInput] = useState(props?.value ?? "");
  const [product, setProduct] = useState({
    id: null,
    product: "",
    description: "",
    images: [],
    display_img: "",
    state: "",
    initial_value: 0,
    current_bid: 0,
    current_bidder: "",
    category: "",
    condition: "",
  });

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const getProduct = (id) => {
      ProductDataService.findById(id).then((response) => {
        setProduct(response.data["product"]);
        setUserInfo();
        if (props.user) {
          UserDataService.getById(props.user.googleId).then((response) => {
            setUserInfo(response.data);
          });
        }
      });
    };
    getProduct(params.id);
  }, [params.id, props.user]);

  useEffect(() => {
    const getProduct = (id) => {
      ProductDataService.findById(id).then((response) => {
        setProduct(response.data["product"]);
      });
    };
    getProduct(params.id);
  }, [product.current_bid]);

  const setBid = () => {
    var new_bid = parseFloat(document.getElementById("bid").value);

    if (new_bid >= product.initial_value && product.current_bid < new_bid) {
      ProductDataService.updateProduct({
        product_id: product._id,
        new_bid: new_bid,
        current_bidder: props.user.googleId,
        status: "active",
      }).then(() => {
        product.current_bid = new_bid;
        product.current_bidder = props.user.googleId;
        product.status = "active";
        setProduct({ ...product });
      });
      UserDataService.addUser(props.user.googleId);
    }
  };

  const sellProduct = () => {
    var sell = document.getElementById("sell").value;

    const item = {
      product_id: product._id,
      product_img: product.display_img,
    };

    UserDataService.updateBuyUser({
      googleId: product.current_bidder,
      buy_item: item,
    });
    UserDataService.updateSellUser({
      googleId: props.user.googleId,
      sell_item: item,
    });
    ProductDataService.updateProduct({
      product_id: product._id,
      new_bid: product.current_bid,
      current_bidder: product.current_bidder,
      status: "sold",
    }).then(() => {
      product.status = "sold";
      setProduct({ ...product });
    });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="poster">
              <Image
                className="bigProductPicture"
                src={product.display_img}
                fluid
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "/images/NoImageAvailable.jpeg";
                }}
              />
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">Product :</Card.Header>
              <Card.Body>
                <Card.Text>{product.product}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Description :</Card.Header>
              <Card.Body>
                <Card.Text>{product.description}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Condition :</Card.Header>
              <Card.Body>
                <Card.Text>{product.condition}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Initial Bid :</Card.Header>
              <Card.Body>
                <Card.Text>{product.initial_value}</Card.Text>
              </Card.Body>
            </Card>
            {product.current_bid && (
              <Card>
                <Card.Header as="h5">Current Bid :</Card.Header>
                <Card.Body>
                  <Card.Text>{product.current_bid}</Card.Text>
                </Card.Body>
              </Card>
            )}

            {props.user &&
            product.status !== "sold" &&
            product.seller !== props.user.googleId ? (
              <div>
                <input
                  style={{ margin: "15px", marginLeft: "0px" }}
                  id={"bid"}
                  value={input}
                  onInput={(e) => setInput(e.target.value)}
                />

                <Button className="bidNowButton" onClick={setBid}>
                  Bid Now!
                </Button>
              </div>
            ) : (
              <div></div>
            )}

            {props.user &&
            product.current_bid !== "" &&
            product.status !== "sold" &&
            product.seller === props.user.googleId ? (
              <Button
                style={{ margin: "15px", marginLeft: "0px" }}
                id={"sell"}
                onClick={sellProduct}
              >
                Sell Now!
              </Button>
            ) : (
              <div></div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Product;
