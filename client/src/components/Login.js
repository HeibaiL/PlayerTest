import React, { useState } from "react";

const Login = props => {
  const [signIngUp, setSigningUp] = useState(false);
  const [loginUser, setLoginUser] = useState({ email: "", password: "" });
  const [signUpUser, setSignUpUser] = useState({
    email: "",
    password: "",
    firstName: "",
    secondName: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { endPoint, setUser } = props;

  function showError(error) {
    if (isLoading) return;
    setError(error);
    return setTimeout(() => {
      setError("");
      setLoading(false);
    }, 2500);
  }
  function showMessage(message) {
    if (isLoading) return;
    setMessage(message);
    return setTimeout(() => {
      showMessage("");
      setLoading(false);
    }, 2000);
  }
  function handleLoginChange(e) {
    const { name, value } = e.target;
    setLoginUser({ ...loginUser, [name]: value });
  }
  function handleSignUpChange(e) {
    const { name, value } = e.target;
    setSignUpUser({ ...signUpUser, [name]: value });
  }

  function logUserIn() {
    setLoading(true);

    const { email, password } = loginUser;
    if (!email || !password) {
      return showError("Please, fill all the fields");
    }
    const requestBody = {
      query: `
      query {
          loginIn(email:"${email}",password:"${password}"
           ){
             token
           }
      }`
    };
    fetch(endPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.errors) return showError(res.errors[0].message);
        localStorage.setItem("auth-token", res.data.loginIn.token);
        return setUser(res.data.loginIn.token);
      });
  }
  function signUser() {
    setLoading(true);

    const { email, password, firstName, secondName } = signUpUser;
    if (!email || !password || !firstName || !secondName) {
      return showError("Please, fill all the fields");
    }
    const requestBody = {
      query: `
      mutation {
          signUp(userInput:{email:"${email}",
           password:"${password}", 
           firstName:"${firstName}", 
           secondName:"${secondName}"}
           ){
             email
           }
      }`
    };
    fetch(endPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.errors) return showError(res.errors[0].message);
        showMessage("Account has been created");
        return setSigningUp(!signIngUp);
      });
  }

  return (
    <div className="login">
      {message ? <div className="message">{message}</div> : null}
      {signIngUp ? (
        <div className="login-window">
          {error ? <div className="error">{error}</div> : null}
          <div className="login-logo">
            <i className="fas fa-ice-cream logo-icon"></i>
            Player
          </div>
          <div className="login-main">
            <input
              onChange={handleSignUpChange}
              id="email"
              name="email"
              placeholder="E-mail"
            />
            <input
              onChange={handleSignUpChange}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <input
              onChange={handleSignUpChange}
              id="firstName"
              name="firstName"
              type="firstName"
              placeholder="First Name"
            />
            <input
              onChange={handleSignUpChange}
              id="secondName"
              name="secondName"
              type="secondName"
              placeholder="Second Name"
            />
            <button className="login-in" onClick={() => signUser()}>
              Sign Up
            </button>
            <div className="sign-up">
              <a href="/#"> Forgot password?</a>
              <a href="/#" onClick={() => setSigningUp(!signIngUp)}>
                Log In
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-window">
          {error ? <div className="error">{error}</div> : null}
          <div className="login-logo">
            <i className="fas fa-ice-cream logo-icon"></i>
            Player
          </div>
          <div className="login-main">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
            </label>
            <input
              onChange={handleLoginChange}
              id="email"
              name="email"
              placeholder="E-mail"
            />
            <label htmlFor="password">
              <i className="fas fa-key"></i>
            </label>
            <input
              onChange={handleLoginChange}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <button className="login-in" onClick={() => logUserIn()}>
              Log In
            </button>
            <div className="sign-up">
              <a href="/#">Forgot password?</a>
              <a href="/#" onClick={() => setSigningUp(!signIngUp)}>
                Sign up
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
