import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";

export const SendMoneyForm = ({ selected, handleClose, user, setChange }) => {
  const [transaction, setTransaction] = useState([]);
  const sendMoney = async () => {
    const response = await fetch(`http://localhost:8000/api/transactions/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.access,
      },
      body: JSON.stringify(transaction),
    });
    if (response.status === 201) {
      toast.success("Sent Money");
      setChange((prev) => prev + 1);
      handleClose();
    } else {
      toast.error("Failed!! Try again");
    }
  };

  useEffect(() => {
    setTransaction(() => ({
      ...transaction,
      reciever: selected,
    }));
  }, [selected]);
  const handleClick = async () => {
    sendMoney();
  };
  const handleChange = (e) => {
    setTransaction((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Send Money</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              onChange={handleChange}
              type="number"
              placeholder="Enter Amount"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              onChange={handleChange}
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
          Send Money
        </Button>
      </Modal.Footer>
    </div>
  );
};
