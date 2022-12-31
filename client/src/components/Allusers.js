import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

export const AllUsers = ({ user }) => {
  const [allUsers, setAllUsers] = useState([]);
  const fetchAllUsers = async (user) => {
    const res = await fetch(`http://localhost:8000/api/user/all/`, {
      headers: {
        Authorization: "Bearer " + user.access,
      },
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    const data = await res.json();
    if (res.status === 200) {
      setAllUsers(() => [data.allUsers]);
    } else {
      toast.error("Something went wrong!!");
    }
  };
  useEffect(() => {
    fetchAllUsers(user);
  }, [user]);

  const handleAddFriend = async (user_id) => {
    const res = await fetch(`http://localhost:8000/api/friend/${user_id}/`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.access,
      },
    });

    if (res.status === 201) {
      toast.success("Friend added successfully!!");
    } else if(res.status===409) {
      toast.info("Already Friends!!");
    }
    else{
      toast.error("Failed!! Try Again");
    }
  };

  return (
    <div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <h4>All Users</h4>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Name</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {allUsers[0]?.map((user) => {
              return (
                <tr>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>
                    <Button onClick={() => handleAddFriend(user.id)}>
                      Add Friend
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
