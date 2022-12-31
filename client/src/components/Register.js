import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Login } from "./Login";
import { toast } from "react-toastify";

export const Register = ({ setToggle, setUser2 }) => {
  const [user, setUser] = useState({});

  const handleChange = (e) => {
    console.log(user);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch(`http://localhost:8000/register/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const text = await response.text();
    if (response.status === 201) {
      console.log(text);
      toast.success("Logged In Successfully!!");
      setToggle(<Login setToggle={setToggle} setUser2={setUser2} />);
    } else {
      toast.error("Log In Failed!!");
    }
  };

  return (
    <>
      <div
        style={{
          width: "500px",
          margin: "auto",
          marginTop: "100px",
          border: "3px solid grey",
          padding: "30px",
          borderRadius: "5px",
        }}
      >
        <h4 style={{ textAlign: "center" }}>Register</h4>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Enter Username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              onChange={handleChange}
              placeholder="Enter First Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              onChange={handleChange}
              placeholder="Enter Last Name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="info"
            style={{float: 'right'}}
            onClick={() =>
              setToggle(<Login setToggle={setToggle} setUser2={setUser2} />)
            }
          >
            Already registered ? Login
          </Button>
        </Form>
      </div>
    </>
  );
};
