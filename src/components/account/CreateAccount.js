import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../Stylesheets/CreateAccount.css";
import Fade from "react-reveal/Fade";
import friendtripLogo from "../../Media/friendtripLogo.svg";
import signupImage from "../../Media/signupImage.svg";

class CreateAccount extends Component {
  createAccount = (event) => {
    event.preventDefault();

    const { username, email, first, last, password } = event.target.elements;
    const data = {
      username: username.value,
      email: email.value,
      first: first.value,
      last: last.value,
      password: password.value,
    };

    fetch("/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === "auth/email-already-in-use") {
          alert("This email is already in use.");
        } else if (res.code === "auth/weak-password") {
          alert("Your password is too weak.");
        } else {
          this.props.history.push("/");
          alert(`A verification link has been sent to ${data.email}`);
        }
      });
  };

  redirectOnLogin = () => {
    if (localStorage.getItem("id")) this.props.history.push("/home");
  };

  render() {
    return (
      <div className="signup-root vh-100">
        {this.redirectOnLogin()}
        <Fade delay={250}>
          <Container className="signup-content">
            <Row noGutters className="h-100 w-100">
              <Col className="signup-content-left h-100 d-none d-lg-block">
                <img
                  src={friendtripLogo}
                  className="align-top signup-logo-left"
                  alt="friendtripLogo logo"
                  id="friendtripLogo"
                />
                <img
                  src={signupImage}
                  className="align-top signup-image-left"
                  alt="signupImage"
                  id="signupImage"
                />
              </Col>
              <Col className="signup-content-right h-100">
                <img
                  src={friendtripLogo}
                  className="align-top signup-logo-right"
                  alt="accountIcon logo"
                  id="accountIcon"
                />
                <div className="signup-image-right"></div>
                <div className="signup-register-form">
                  <h1>Create An Account</h1>
                  <h5>
                    To get started, please register with your personal
                    information by username, email address, name, and password.
                  </h5>
                  <br></br>
                  <Form onSubmit={this.createAccount}>
                    <Form.Row>
                      {/* USERNAME */}
                      <Form.Group
                        as={Col}
                        className="p-0 m-1"
                        controlId="formGridUsername"
                      >
                        <Form.Label className="pl-1 m-0">
                          <h5>Username</h5>
                        </Form.Label>
                        <Form.Control
                          name="username"
                          type="username"
                          placeholder="Enter Username"
                          className="signup-input pl-1"
                        />
                        <span className="signup-input-border"></span>
                      </Form.Group>
                      {/* EMAIL ADDRESS */}
                      <Form.Group
                        as={Col}
                        className="p-0 m-1"
                        controlId="formGridEmail"
                      >
                        <Form.Label className="pl-1 m-0">
                          <h5>Email Address</h5>
                        </Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                          className="signup-input pl-1"
                        />
                        <span className="signup-input-border"></span>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      {/* FIRST NAME */}
                      <Form.Group
                        as={Col}
                        className="p-0 m-1"
                        controlId="formGridFirst"
                      >
                        <Form.Label className="pl-1 m-0">
                          <h5>First Name</h5>
                        </Form.Label>
                        <Form.Control
                          name="first"
                          type="first"
                          placeholder="Enter First name"
                          className="signup-input pl-1"
                        />
                        <span className="signup-input-border"></span>
                      </Form.Group>
                      {/* LAST NAME */}
                      <Form.Group
                        as={Col}
                        className="p-0 m-1"
                        controlId="formGridLast"
                      >
                        <Form.Label className="pl-1 m-0">
                          <h5>Last Name</h5>
                        </Form.Label>
                        <Form.Control
                          name="last"
                          type="last"
                          placeholder="Enter Last name"
                          className="signup-input pl-1"
                        />
                        <span className="signup-input-border"></span>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      {/* PASSWORD */}
                      <Form.Group
                        as={Col}
                        className="p-0 m-1"
                        controlId="formGridPassword"
                      >
                        <Form.Label className="pl-1 m-0">
                          <h5>Password</h5>
                        </Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          className="signup-input pl-1"
                        />
                        <span className="signup-input-border"></span>
                      </Form.Group>
                    </Form.Row>
                    <div className="btn-group">
                      <Link to="/">
                        <Button
                          className="signup-login-btn rounded-pill"
                          type="submit"
                        >
                          <h3>Login</h3>
                        </Button>
                      </Link>
                      <Button
                        className="signup-register-btn rounded-pill ml-1"
                        type="submit"
                      >
                        <h3>Register</h3>
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </Fade>
      </div>
    );
  }
}

export default CreateAccount;
