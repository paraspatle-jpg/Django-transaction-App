import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useModal } from "../customHooks/useModal";
import { SendMoneyForm } from "./SendMoneyForm";

export const Friends = ({ user,change,setChange }) => {
  const [friends, setFriends] = useState([]);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState();
  const handleClose = () => setShow(false);
  const handleShow = (username) => {
    setSelected(username);
    setShow(true);
  };

  const fetchFriends = async (user) => {
    const res = await fetch(`http://localhost:8000/api/friend/1/`, {
      headers: {
        Authorization: "Bearer " + user.access,
      },
    });
    const data = await res.json();
    if (res.status === 200) {
      setFriends(() => [data.friends]);
    } else {
    }
  };
  useEffect(() => {
    fetchFriends(user);
  }, [user,change]);

  console.log(friends);

  return (
    <div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <h4>Friends</h4>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Name</th>
              <th>Money to Send</th>
              <th>Money to Recieve</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {friends[0]?.map((friend) => {
              return (
                <tr>
                  <td>{friend.id}</td>
                  <td>{friend.username}</td>
                  <td>{friend.name}</td>
                  <td>{friend.money <= 0 ? -1*friend.money : 0}</td>
                  <td>{friend.money <= 0 ? 0 : friend.money}</td>
                  <td>
                    <Button onClick={() => handleShow(friend.username)}>
                      Send Money
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {useModal(
        <SendMoneyForm
          selected={selected}
          handleClose={handleClose}
          user={user}
          setChange={setChange}
        />,
        show,
        handleClose
      )}
    </div>
  );
};
