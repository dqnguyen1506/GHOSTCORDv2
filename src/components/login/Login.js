import React, { Component, useContext } from 'react';
import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import fire from "../../api-config/fire";
import firebase from "firebase/app";
// import {AppString} from '../../Const'
import { css } from "@emotion/react";
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

class LoginForm extends Component{

    constructor() {
		super();
		// authentication providers
		this.provider = new firebase.auth.GoogleAuthProvider();			//Google
		this.provider2 = new firebase.auth.FacebookAuthProvider();		//Facebook
		// make sure Facebook re-authenticate users when re-signing
		this.provider2.setCustomParameters({
			auth_type: 'reauthenticate'
		});
		this.provider3 = new firebase.auth.TwitterAuthProvider();		//Twitter
		this.override = css`
			display: block;
			margin: 0 auto;
			border-color: red;
		`;
		this.state = {
			email: null,
			password: null,
			serverError: false,
			loading: false
		};
    }
    
    render () {
        return(
            <div className="FormCenter">
              <form className="FormFields" onSubmit={e => this.submitLogin(e)}>
				{/* login form */}
                <div className="FormField">
                  <label className="FormField__Label" htmlFor="signup-email-input">Email</label>
                  <input 
                    autoComplete="email"
                    id="login-email-input"
                    className="FormField__Input"
                    onChange={e => {
                      this.userTyping("email", e);
                    }}
                  />
                </div>

                <div className="FormField">
                  <label className="FormField__Label" htmlFor="signup-password-input">Password</label>
                  <input
                    type="password" 
                    autoComplete="password"
                    id="login-password-input"
                    className="FormField__Input"
                    onChange={e => {
                      this.userTyping("password", e);
                    }}
                  />
                </div>
					      {/* login button */}
                <div className="FormField">
                  <button className="FormField__Button">Login</button>
                </div>

              </form>
				      {/* if there is a sign-in error, return error */}
              {this.state.serverError ? (
					      <h5 className="txt_error">
                  Incorrect Information
					      </h5>
					    ) : null}
				      {/* social buttons */}
              <div className="social_button">
					      <GoogleLoginButton
						      onClick={() => this.googleLogin()}
					      >
						    <span></span>
						    </GoogleLoginButton>
                <FacebookLoginButton 
                  onClick={() => this.fbLogin()}
                >
                  <span></span>
                </FacebookLoginButton>
                <TwitterLoginButton 
                  onClick={() => this.twitterLogin()}
                >
                  <span></span>
                </TwitterLoginButton>
				      </div>
            </div>
        )
    }
	  // upon typing, set values for email & password
    userTyping = (type, event) => {
		switch (type) {
			case "email":
				this.setState({ email: event.target.value });
				break;
			case "password":
				this.setState({ password: event.target.value });
				break;
			default:
				break;
		}
	};
	// facebook login method
	fbLogin = () =>{
		fire
			.auth()
			.signInWithPopup(this.provider2)
			// if sign-in successful
			.then(res => {
				const userObj = {
					email: res.user.email,
					name: res.user.displayName
				};
				// save user email & username into firestore
				fire
					.firestore()
					.collection("users")
					.doc(res.user.email)
					.set(userObj)
					.then(
						() => {
							// re-direct to homepage
							return(<Route path="/dashboard"/>)
						},
						dbError => {
							console.log(dbError);
						},
						// data => {
						// 	localStorage.setItem(AppString.PHOTO_URL, res.user.photoURL)
						// }
					);
				this.props.history.push("/dashboard");
			});
	}
	// twitter login method
	twitterLogin = () =>{
		fire
			.auth()
			.signInWithPopup(this.provider3)
			.then(res => {
				const userObj = {
					email: res.user.email,
					name: res.user.displayName
				};
				////if new user
				//save user information acquired from Google to Firebase
				fire
					.firestore()
					.collection("users")
					.doc(res.user.email)
					.set(userObj)
					.then(
						() => {
							//redirect to homepage
							return(<Route path="/dashboard"/>)
						},
						dbError => {
							console.log(dbError);
						}
					);
				this.props.history.push("/dashboard");
			});
	}
	// google login method
	googleLogin = () => {
		fire
			.auth()
			.signInWithPopup(this.provider)
			.then(async res => {
				const userObj = {
					email: res.user.email,
					name: res.user.displayName,
					avatar: res.user.photoURL //get user's google profile picture
				};
				//check if this is a new user in database
				const result = await fire.firestore()
						.collection("users")
						.where("email", "==", res.user.email)
						.get()
				//if new user
				//save user information acquired from Google to Firebase
				if(result.docs.length === 0){
					fire
					.firestore()
					.collection("users")
					.doc(res.user.email)
					.set(userObj)
					.then(
						() => {
							//redirect to homepage
							return(<Route path="/dashboard"/>)
						},
						dbError => {
							console.log(dbError);
						}
					);
				}
				else{
					return(<Route path="/dashboard"/>)
				}
				
			});
	};
	// sign-in by pressing the login button 
	submitLogin = async e => {
		// This is to prevent the automatic refreshing of the page on submit.
		e.preventDefault(); 
		// start loading animation
		await this.props.setLoading(true);
		// authenticate user with enterred email & password
		await fire
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(
				() => {
					//re-direct to homepage if information is correct
					return(<Route path="/dashboard"/>)
				},
				err => {
					// if error, set error message and stop loading animation
					this.props.setLoading(false);
					this.setState({ serverError: true });
					console.log("Error logging in: ", err);
				}
			);

	};
}




export default LoginForm;