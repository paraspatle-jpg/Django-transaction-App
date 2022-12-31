import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useModal } from "../customHooks/useModal";
import { Update } from "./Update";
import Offcanvas from "react-bootstrap/Offcanvas";

export const TransactionHistory = ({ user, setChange, change }) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState();
  const handleClose = () => setShow(false);
  const handleShow = (transaction) => {
    setSelected(transaction);
    setShow(true);
  };

  const compareDate = (a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    if (a.date === b.date) {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
    }
    return 0;
  };
  const compareAmount = (a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  };

  const compareReceiver = (a, b) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user, a);
    if (a.reciever === user.username) return -1;
    if (b.reciever === user.username) return 1;
    return 0;
  };
  const compareSender = (a, b) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user, a);
    if (a.sender === user.username) return -1;
    if (b.sender === user.username) return 1;
    return 0;
  };

  const [transactions, setTransactions] = useState([]);
  const fetchTransactionHistory = async (user) => {
    const res = await fetch(`http://localhost:8000/api/transactions/`, {
      headers: { Authorization: "Bearer " + user.access },
    });
    const data = await res.json();
    if (res.status === 200) {
      setTransactions(() => [...data.sent, ...data.recieved]);
    } else {
      toast.error("Something went wrong!!");
    }
  };
  useEffect(() => {
    fetchTransactionHistory(user);
  }, [user, change]);

  const handleDeleteTransaction = async (id, index) => {
    const res = await fetch(`http://localhost:8000/api/transactions/${id}/`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + user.access },
    });
    if (res.status === 200) {
      toast.success("Transaction Deleted Successfully!!");
      var temp = transactions;
      temp.splice(index, 1);
      setChange((prev) => prev + 1);
      setTransactions(() => temp);
    } else {
      toast.error("Failed!! Try Again");
    }
  };


  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = (transaction) =>{
    setSelected(transaction)
    setShow1(true);
  }
  return (
    <div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <h4>Transaction History</h4>
        <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            Sort By
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                setTransactions(transactions.slice(0).sort(compareDate))
              }
            >
              Date
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                setTransactions(transactions.slice(0).sort(compareAmount))
              }
            >
              Amount
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setTransactions(transactions.slice(0).sort(compareReceiver));
              }}
            >
              Received First
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setTransactions(transactions.slice(0).sort(compareSender));
              }}
            >
              Sent First
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Sender</th>
              <th>Reciever</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              return (
                <tr>
                  <td>{transaction.id}</td>
                  <td>{transaction.sender}</td>
                  <td>{transaction.reciever}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
                  <td>
                    <Button
                      onClick={() => handleShow(transaction)}
                      style={{ marginRight: "5px" }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      style={{ marginRight: "5px" }}
                      onClick={() =>
                        handleDeleteTransaction(transaction.id, index)
                      }
                    >
                      Delete
                    </Button>
                    <Button variant="info" onClick={() => handleShow1(transaction)}>More Info</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {useModal(
        <Update
          selected={selected}
          setSelected={setSelected}
          handleClose={handleClose}
          user={user}
          setChange={setChange}
        />,
        show,
        handleClose
      )}

      <Offcanvas show={show1} onHide={handleClose1} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Transaction Info</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>Transaction ID: {selected?.id}</div>
          <div>Sender: {selected?.sender}</div>
          <div>Receiver: {selected?.reciever}</div>
          <div>Description: {selected?.description}</div>
          <div>Transaction Date: {selected?.date}</div>
          <div>Transaction Amount: {selected?.amount} INR</div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
