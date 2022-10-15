import { useState, useRef } from "react";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import "./upload.css";

import ProductDataService from "../services/products";
import UserDataService from "../services/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";

const Upload = ({ user }) => {
  const [product, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [initial_value, setInitialValue] = useState("");
  const [condition, setCondition] = useState("");
  const fileInput = useRef(null);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", fileInput.current.files[0]);
    formData.append("description", description);
    formData.append("product", product);
    formData.append("initial_value", initial_value);
    formData.append("condition", condition);
    formData.append("seller", user.googleId);

    try {
      ProductDataService.uploadProduct(formData);
      UserDataService.addUser(user.googleId);
      setOpen(true);
    } catch (error) {
      console.error("Failed to list product.");
    }
  };

  return (
    <form>
      <Container>
        <Row>
          <Col>
            <div className="Upload">
              <div className="inner">
                {/* <label className="form-input col-12 p-1"> */}
                {/* Include Image:  */}
                {/* <input
                    type="file"
                    ref={fileInput}
                    className="form-input p-2 my-3 bg"
                  /> */}
                {/* </label> */}
                <div className="icon_flexbox">
                  <FontAwesomeIcon icon={faCloudUpload} size="6x" />
                </div>
                <div className="upload_flexbox">
                  <label className="custom-file-upload" htmlFor="upload">
                    Upload
                  </label>
                  <input type="file" id="upload" ref={fileInput} />
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">Product :</Card.Header>
              <Card.Body>
                <input
                  id="name"
                  type="text"
                  value={product}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Description :</Card.Header>
              <Card.Body>
                <Card.Text>
                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Condition :</Card.Header>
              <Card.Body>
                <Card.Text>
                  <input
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Initial Bid :</Card.Header>
              <Card.Body>
                <Card.Text>
                  <input
                    id="initial_value"
                    value={initial_value}
                    onChange={(e) => setInitialValue(e.target.value)}
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <button
        id="submit"
        type="button"
        onClick={handleSubmit}
        className="btn btn-primary"
      >
        Submit
      </button>
      <Snackbar open={open} autoHideDuration={3100} onClose={handleClose}>
        <MuiAlert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          This Product has been listed!
        </MuiAlert>
      </Snackbar>
    </form>
  );
};

export default Upload;
