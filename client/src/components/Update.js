import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";

export const Update = ({ selected,setSelected, handleClose, user, setChange }) => {
  const [transaction, setTransaction] = useState();
  const sendMoney = async () => {
    const response = await fetch(
      `http://localhost:8000/api/transactions/${selected.id}/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.access,
        },
        body: JSON.stringify(selected),
      }
    );
    if (response.status === 200) {
      toast.success("Updated Transaction");
      setChange((prev) => prev + 1);
      handleClose();
    } else {
      toast.error("Failed!! Try Again");
    }
  };
  const handleClick = async () => {
    sendMoney();
  };
  const handleChange = (e) => {
    setSelected((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Update Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              onChange={handleChange}
              value={selected.amount}
              type="number"
              placeholder="Enter Amount"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              onChange={handleChange}
              value={selected.description}
              type="text"
              placeholder="Enter Description"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClick}>
          Update
        </Button>
      </Modal.Footer>
    </div>
  );
};
