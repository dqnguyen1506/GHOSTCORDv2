import React, { Component, useState, useContext, useEffect } from "react";
import { GlobalContext } from "../state/State";
import { Link } from "react-router-dom";
// import styles from "./styles";
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import Input from "@material-ui/core/Input";
// import Paper from "@material-ui/core/Paper";
// import withStyles from "@material-ui/core/styles/withStyles";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import "./homepage.css";
import firebase from "firebase/app";
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import SignUpForm from '../signup/SignUpForm';
import LoginForm from '../login/login';
import { 
	Tabs,
	Tab,
	AppBar,
	Box,
	Typography,
	useTheme,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {
    Slide,
} from "@material-ui/core";
import AlertComponent from '../groupchat/Alert';
import FriendsListComponent from "../friends/FriendsList";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			<Typography>{children}</Typography>
		  </Box>
		)}
	  </div>
	);
  }

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export const HomePageComponent = () => {
	// constructor() {
	// 	super();
	// 	this.provider = new firebase.auth.GoogleAuthProvider();
	// 	this.provider2 = new firebase.auth.FacebookAuthProvider();
	// 	this.state = {
	// 		email: null,
	// 		password: null,
	// 		serverError: false
	// 	};
	// }
	const { state, dispatch } = useContext(GlobalContext);
	const delay = ms => new Promise(res => setTimeout(res, ms));
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
    const handleChange = async (event, newValue) => {
		setValue(newValue);
    };
	// auto close alert
    useEffect(() => {
        if(state.display.showAlert === true){
            async function autoClose(){
                try{
                    await delay(4000);
                    await dispatch({
                        type: "SET_SHOW_ALERT",
                        payload: false,
                    });
                }catch(e){
                    console.error(e);
                }
            }
            autoClose();
        }
		// else{
		// 	if(state.alert.message === 'Log out success.'){
		// 		async function delayLogoutAlert(){
		// 			try{
		// 				await delay(1000);
		// 				await dispatch({
		// 					type: "SET_SHOW_ALERT",
		// 					payload: true,
		// 				});
		// 			}catch(e){
		// 				console.error(e);
		// 			}
		// 		}
		// 		delayLogoutAlert();
		// 	}
			
		// }
    }, [state.display.showAlert]);


	const theme = useTheme();
		return (
				<main>
				{/* <CssBaseline />
				<Paper className={classes.paper}>
					<Typography component="h1" variant="h5">
						Ghostcord
					</Typography>
					<form className={classes.form} onSubmit={e => this.submitLogin(e)}>
						<FormControl required fullWidth margin="normal">
							<InputLabel htmlFor="login-email-input">
								Email
							</InputLabel>
							<Input
								autoComplete="email"
								autoFocus
								onChange={e => this.userTyping("email", e)}
								id="login-email-input"
							></Input>
						</FormControl>
						<FormControl required fullWidth margin="normal">
							<InputLabel htmlFor="login-password-input">
								Password
							</InputLabel>
							<Input
								autoComplete="current-password"
								type="password"
								onChange={e => this.userTyping("password", e)}
								id="login-password-input"
							></Input>
						</FormControl>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Log In
						</Button>
					</form>
					{this.state.serverError ? (
						<Typography
							className={classes.errorText}
							component="h5"
							variant="h6"
						>
							Incorrect Login Information
						</Typography>
					) : null}
					<h5 className={classes.noAccountHeader}>Don't Have An Account?</h5>
					<Link className={classes.signUpLink} to="/signup">
						Sign Up!
					</Link>
					<Link className={classes.signUpLink} to="/videoroom">
						Video
					</Link>
				</Paper> */}

					<AlertComponent 
						type='logged out'
						message='Successfully logged out .'
					/>
					<div 
						style={{
							position: 'fixed',
							zIndex: 1,
							top: '47vh',
							left: '50vw',
							transform: 'translate(-50%, -50%)'
                		}}
            		>
                		<BeatLoader color='#184A46' loading={loading} css={override} size={15} />
            		</div>
					<div className="App">
						<Slide timeout={{enter: '1000ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
							<div className="App__Aside">
								<img src={require('../logo/logo.png')} className="homepage_logo"/>
							</div>
						</Slide>
						<div className="App__Form">
							<div className = "PageSwitcher">
							</div>

							{/* <div className="FormTitle">
								<NavLink to="/login" 
									activeClassName="FormTitle__Link--Active" 
									className="FormTitle__Link">Sign In</NavLink>
								<NavLink to="/signup" 
									activeClassName="FormTitle__Link--Active" 
									className="FormTitle__Link">Sign Up</NavLink>
							</div>

							<Route path="/signup" component={SignUpForm}>
							</Route>

							<Route path="/login" component={LoginForm}>
							</Route> */}
							<Slide timeout={{enter: '1000ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
							
							<div>
								<AppBar 
									position='relative'
									// className='App__Form'
									style={{width: '320px', left: '23px', background: "white", boxShadow: 'none'}}
								>
									<Tabs  TabIndicatorProps={{style: {height: '5px',backgroundColor:'#184A46'}}} 
										centered 
										value={value} 
										onChange={handleChange} 
										aria-label="simple tabs example"
									>
										<Tab 
											style={{
												color: 'black', 
												fontSize:20, 
											}} 
											label='Sign in' 
											/>
										<Tab 
											style={{
												color: 'black', 
												fontSize: 20,
											}} 
											label='Sign up' 
										/>
								</Tabs>
								</AppBar>

								<SwipeableViews
									axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
									index={value}
									onChangeIndex={handleChange}
								>
									<TabPanel value={value} index={0} dir={theme.direction} >
										<LoginForm 
											setLoading={setLoading}
										/>
									</TabPanel>
									<TabPanel value={value} index={1} dir={theme.direction}>
										<SignUpForm
											setLoading={setLoading}
										/>
									</TabPanel>
								</SwipeableViews>

							</div>
							</Slide>

						</div>

					</div>
					
			</main>
			
		);
	}



export default HomePageComponent;
