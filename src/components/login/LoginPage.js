import React, { Component, useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../global-context/State";
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
import "./LoginPage.css";
import SignUpForm from './SignUp';
import LoginForm from './Login';
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

export const LoginPageComponent = () => {
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
    }, [state.display.showAlert]);


	const theme = useTheme();
		return (
				<main>
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
								<img src={require('../../assets/logo/logo.png')} className="homepage_logo"/>
							</div>
						</Slide>
						<div className="App__Form">
							<div className = "PageSwitcher">
							</div>
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



export default LoginPageComponent;
