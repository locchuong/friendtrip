import React, { Component } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import friendtripLogo from "../../Media/friendtripLogo.svg";
import loginImage from "../../Media/loginImage.svg";
import Fade from "react-reveal/Fade";
import "../../Stylesheets/SignIn.css";

class SignIn extends Component {
  signIn = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    const data = {
      email: email.value,
      password: password.value,
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === "Success") {
          localStorage.setItem("id", res.id);
          this.props.history.push("/home");
        } else if (res.code === "EmailNotVerified") {
          alert("Please verify your account.");
        } else {
          alert("Incorrect email or password.");
        }
      });
  };
  // signInWithGoogle = () => {
  //   // Some fetch call to /loginWithGoogle
  //   fetch("/loginWithGoogle", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       alert("TEST");
  //       // if(res.code === "Success") {
  //       //   localStorage.setItem("id", res.id);
  //       //   this.props.history.push("/home");
  //       // }
  //       // else {
  //       //   alert("Oops! Something went wrong.");
  //       // }
  //     });
  // }

  redirectOnLogin = () => {
    if (localStorage.getItem("id")) this.props.history.push("/home");
  };

  render() {
    return (
      <div className="landing-root vh-100">
        {this.redirectOnLogin()}
        <Fade delay={250}>
        <Container className="landing-login">
          <Row noGutters className="h-100 w-100">
            <Col className="landing-login-left h-100 d-none d-sm-block">
              <img
                src={friendtripLogo}
                className="align-top landing-logo-left"
                alt="friendtripLogo logo"
                id="friendtripLogo"
              />
              <img
                src={loginImage}
                className="align-top landing-image-left"
                alt="loginImage"
                id="loginImage"
              />
            </Col>
            <Col className="landing-login-right h-100">
              <img
                src={friendtripLogo}
                className="align-top landing-logo-right"
                alt="accountIcon logo"
                id="accountIcon"
              />
              <div className="landing-image-right"></div>
              <div className="landing-login-form">
                <h1>Login</h1>
                <h5>
                  To keep connected, please login with your personal information
                  by email address and password.
                </h5>
                <br></br>
                <Form onSubmit={this.signIn}>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      className="p-0 m-1"
                      controlId="formGridUsername"
                    >
                      <Form.Label className="pl-1 m-0">
                        <h5>Email Address</h5>
                      </Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        className="landing-email-input pl-1"
                      />
                      <span className="email-icon"></span>

                      <span className="landing-input-border"></span>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
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
                        className="landing-email-input landing-password-input-image pl-1"
                      />
                      <span className="landing-input-border"></span>
                    </Form.Group>
                  </Form.Row>
                  <div className="btn-group">
                    <Button className="landing-login-btn rounded-pill" type="submit">
                      <h3>Login</h3>
                    </Button>
                    <Link to="/signup">
                      <Button
                        className="landing-register-btn rounded-pill"
                      >
                        <h3>Register</h3>
                      </Button>
                    </Link>
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

export default SignIn;
