import React, { useState, useEffect } from "react";
import "./signup.css";
import checkInputValidity from "../inputValidityChecker";
import bcrypt from "bcryptjs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../loading";
import baseUrl from "../baseUrl";

function Signup() {
  const navigate = useNavigate();
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("nxtechUser")) {
      navigate("/userhome");
    }
  }, [])


  function handleUser(event) {
    setSignupUsername(event.target.value);
  }
  function handlePass(event) {
    setSignupPassword(event.target.value);
  }


  function handleSignup() {
    if (checkInputValidity()) {
      setLoading(true);
      bcrypt.hash(signupPassword, 8, function (err, hash) {
        if (err) {
          alert(err.message);
          setLoading(false);
        }
        else {
          axios.post(baseUrl + "signupServer", {
            userName: signupUsername,
            userPassword: hash
          })
            .then((response) => {
              //console.log(response);
              if (response.data.status) {
                localStorage.setItem("nxtechUser", response.data.id);
                //alert(response.data.message);
                navigate("/userhome");
              }
              else {
                alert(response.data.message);
              }
              setLoading(false);
            }).catch(function (error) {
              console.log(error);
              setLoading(false);
            });
        }
      })
    }
  }

  return (
    <div className="signup">
      <h1 className="big-heading">Sign Up</h1>

      {loading ? <Loading text="Signing In" /> :
        <form className="">
          <label className="required">
            <i className="fas fa-user mb-2"></i> Username
          </label>
          <input
            onChange={handleUser}
            type="text"
            className="form-control username"
            name="username"
            placeholder="Enter Username"
            value={signupUsername}
            autoComplete="off"
            required
          ></input>
          <div className="form-text checkUsernameAvailability"></div>

          <label className="required">
            <i className="fas fa-lock mb-2"></i> Password
          </label>
          <input
            onChange={handlePass}
            type="password"
            className="form-control password"
            name="password"
            placeholder="Enter Password"
            value={signupPassword}
            autoComplete="off"
            required
          ></input>

          <button
            onClick={handleSignup}
            type="button"
            className="btn btn-primary button"
            name="button"
            value="signup"
          >
            CREATE ACCOUNT
          </button>

          <div className="extra">
            <strong>Already have an account? </strong> <Link to="/login">Login</Link>
          </div>
        </form>
      }
    </div>
  );
}

export default Signup;