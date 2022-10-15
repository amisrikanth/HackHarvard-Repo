import React, { useState, useEffect, useCallback } from "react";
import ProductDataService from "../services/products";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import "./ProductsList.css";

const ProductsList = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");

  const retrieveProducts = useCallback(
    (O) => {
      setCurrentSearchMode("");
      ProductDataService.getAll(currentPage)
        .then((response) => {
          setProducts(response.data.products);
          setCurrentPage(response.data.page);
          setEntriesPerPage(response.data.entries_per_page);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [currentPage]
  );

  const find = useCallback(
    (query, by) => {
      ProductDataService.find(query, by, currentPage)
        .then((response) => {
          setProducts(response.data.products);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [currentPage]
  );

  const findByCategory = useCallback(() => {
    setCurrentSearchMode("findByCategory");
    find(searchCategory, "category");
  }, [find, searchCategory]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByCategory") {
      findByCategory();
    } else {
      retrieveProducts();
    }
  }, [currentSearchMode, findByCategory, retrieveProducts]);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);

  const onChangeSearchCategory = (e) => {
    const searchCategory = e.target.value;
    setSearchCategory(searchCategory);
  };

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row className="middle_search">
            {/* <Col>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by category"
                  value={searchCategory}
                  onChange={onChangeSearchCategory}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="info" type="button" onClick={findByCategory}>
                Search
              </Button>
            </Col> */}

            <Col className="search-flex">
              <Form.Control
                type="text"
                placeholder="Search by category"
                value={searchCategory}
                onChange={onChangeSearchCategory}
              />
              <Button variant="info" type="button" onClick={findByCategory}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="productRow">
          {products.map((product) => {
            return (
              <Col key={product._id}>
                <Card className="productsListCard">
                  <Card.Img
                    className="smallPoster"
                    src={product.display_img}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "./images/NoImageAvailable.jpeg";
                    }}
                  />
                  <Card.Body className="cardBody">
                    <h2> {product.product}</h2>
                    <Card.Text className="cardPara">
                      {product.description}
                    </Card.Text>
                    <Card.Text className="cardPara">
                      Condition : {product.condition}
                    </Card.Text>
                    {product.current_bid && (
                      <Card.Text>Current bid : {product.current_bid}</Card.Text>
                    )}
                    {user && (
                      <div className="cardButton-margin">
                        <Link to={"/products/" + product._id}>
                          {product.seller !== user.googleId ? (
                            <button
                              variant="success"
                              type="button"
                              className="cardButton"
                            >
                              Bid
                            </button>
                          ) : (
                            <Button
                              variant="success"
                              type="button"
                              className="cardButton"
                            >
                              Sell
                            </Button>
                          )}
                        </Link>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <br />
        Showing page: {currentPage + 1}.
        <Button
          variant="link"
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          Get next results
        </Button>
      </Container>
    </div>
  );
};

export default ProductsList;
