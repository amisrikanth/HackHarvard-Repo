import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick/lib/slider";
import Slick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../components/user.css";
import Avatar from "react-avatar";

const User = ({ user, sell_items, buy_items }) => {
  let Settings = {
    lazyLoad: "ondemand",
    accessibility: false,
    draggable: false,
    slidesToShow: 3,
    slidesToScroll: 2,
    infinite: false,
  };

  //   console.log(user);

  return (
    <div>
      <Container>
        {user && (
          <Row>
            <Col>
              <div></div>
            </Col>
            <Col>
              <Row>
                <div className="poster">
                  {/* <Image
                    className="profile"
                    referrerPolicy="no-referrer"
                    src={user.picture}
                    fluid
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/images/NoImageAvailable.jpeg";
                    }}
                  /> */}
                  <Avatar
                    googleId={user.googleId}
                    size="100"
                    src={user.picture}
                    round={true}
                  />
                </div>
              </Row>
              <Row>
                <Card>
                  <Card.Header as="h5">Name :</Card.Header>
                  <Card.Body>
                    <Card.Text>{user.name}</Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header as="h5">Email Id :</Card.Header>
                  <Card.Body>
                    <Card.Text>{user.email}</Card.Text>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header as="h5">Products Bought :</Card.Header>
                  <Card.Body className="productsButton">
                    <Slick {...Settings}>
                      {buy_items.map((item, index) => {
                        return (
                          <Link to={"/products/" + item.product_id}>
                            <Image
                              key={item.product_id}
                              className="bigPicture"
                              src={item.product_img}
                            />
                          </Link>
                        );
                      })}
                    </Slick>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header as="h5">Products Sold :</Card.Header>
                  <Card.Body className="productsButton">
                    <Slick {...Settings}>
                      {sell_items.map((item, index) => {
                        return (
                          <Link to={"/products/" + item.product_id}>
                            <Image
                              key={item.product_id}
                              className="bigPicture"
                              src={item.product_img}
                            />
                          </Link>
                        );
                      })}
                    </Slick>
                  </Card.Body>
                </Card>
              </Row>
            </Col>
            <Col>
              <div></div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};
export default User;
