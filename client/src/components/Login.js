import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Register } from "./Register";
import { toast } from "react-toastify";

export const Login = ({ setToggle, setUser2 }) => {
  const [user, setUser] = useState({});

  const handleChange = (e) => {
    console.log(user);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (success, fail) => {
    const response = await fetch(`http://localhost:8000/token/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const text = await response.json();
    if (response.status === 200) {
      localStorage.setItem("auth", JSON.stringify(text));
      localStorage.setItem("user", JSON.stringify({ username: user.username }));
      setUser2(text);
      toast.success("Logged In Successfully!!");
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
          marginTop: "200px",
          border: "1px solid black",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <div style={{ textAlign: "center" }}>Login</div>
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              setToggle(<Register setToggle={setToggle} setUser2={setUser2} />)
            }
          >
            Register
          </Button>
        </Form>
      </div>
    </>
  );
};
