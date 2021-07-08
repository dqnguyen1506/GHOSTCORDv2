import React, { Component, useEffect, useContext, useState } from "react";
import { firestore, db } from "../config/fire";
import { Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import styles from './styles';
import "./profile.css";
import NavBarComponent from "../navBar/navBar";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Avatar,
	Slide,
	Zoom,
	makeStyles,
	ListItem,
	ListItemIcon,
	ListItemText,
	Grid,
	ListItemAvatar,
	Box,
	IconButton,
	List,
	Badge,
	withStyles,
	Paper
  } from "@material-ui/core";
import { GlobalContext } from "../state/State";
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import EditIcon from '@material-ui/icons/Edit';
import {UploadInfoComponent} from '../groupchat/uploadInfo'
import SaveIcon from '@material-ui/icons/Save';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import { BrowserRouter as Route} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	  	'& > *': {
			// margin:theme.spacing(1),
			width: theme.spacing(50),
			height: theme.spacing(50),
		},
		position: 'fixed',
    	zIndex: 1,
        top: '50vh',
        left: '50vw',
        transform: 'translate(-50%, -50%)'
	},
	infoSection: {
        margin:'3% 10% 5% 10%',
      },
    margin: {
        width:'80%',
		marginLeft:'12%'
		// float:'right'
    },
    avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        alignSelf: "center",
        // marginLeft:'200%',
        // // marginTop:'25%'
    },
    closeButton: {
        float:'right',
        marginBottom:50
    },
    editButton: {
        fill:'#184A46',
    },
    checkedIcon: {
        fill:'green',
        // marginLeft: '50%'
    },
    input: {
        color:'black'
    }
  }));

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'black',
        },
        '&:hover fieldset': {
          borderColor: 'green',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
  })(TextField);

export const ProfileComponent = ({history}) => {
	const { state, dispatch } = useContext(GlobalContext);
	const [ progress, setProgress ] = useState(0);
    const [ fileName, setFileName ] = useState(10);
    const [showLogo, setShowLogo] = useState(true);
    const [showComplete, setShowComplete] = useState(false);
    const [showNameTextfield, setShowNameTextfield] = useState(false);	//name input
	const [newUsername, setNewUsername] = useState("");
	const [ displaySaveButton1, setDisplaySaveButton1 ] = useState(false);
    const [ displaySavedMessage1, setDisplaySavedMessage1 ] = useState(false);
	const [showEmailTextfield, setShowEmailTextfield] = useState(false);	//email input
    const [newUserEmail, setNewUserEmail] = useState("");
	const [ displaySaveButton2, setDisplaySaveButton2 ] = useState(false);
    const [ displaySavedMessage2, setDisplaySavedMessage2 ] = useState(false);
	const [ task, setTask ] = useState(0);
    /* create delay to ensure dialog sliding animation */
    const delay = ms => new Promise(res => setTimeout(res, ms));
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		image: null,
	// 		url: "",
	// 		user: "",
	// 		slide: false
	// 	};
	// }
	// const onChooseCh = async () => {
    //     if(newChatName.length > 0 || newChatName !== chat.name){
    //         await firestore
    //             .collection("chats")
    //             .doc(state.home.chats.id)
    //             .update({
    //                 // update the chat by adding a message object to the messages array in firestore
    //                 name: newChatName
    //             })
    //             .then(() => {});
    //         await setDisplaySaveButton(false);
    //         await delay(200);
    //         setDisplaySavedMessage(true);

    //     }
    // };
	const onChooseAvatar = async event => {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0]
            if (image) {
                const uploadTask = db.ref(`images/${image.name}`).put(image);
                await setTask(uploadTask);
                await setFileName(image.name);
                await dispatch({
                    type: "SET_SHOW_UPLOAD_INFO",
                    payload: true,
                });
                console.log("updating picture");
                uploadTask.on(
                    "state_changed",
                    async snapshot => {
                        const prog = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                          );
                        if(prog === 100){
                            await setShowLogo(false);
                            await delay(500);
                            await setShowComplete(true);
                        }
                        setProgress(prog);
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        db
                            .ref("images")
                            .child(image.name)
                            .getDownloadURL()
                            .then(url => {
                                // sendMessage(url, chat, email, username,2,image.name)
                                firestore
                                    .collection("users")
                                    .doc(state.user.email)
                                    .update({
                                        //update avatar
                                        avatar: url
                                    })
                                    .then(() => {});
								state.home.loadedAvatars[state.user.email] = url;
                            });
                    }
                );

        
                // alert("photo sent!");
            }
        }
    };
	const handleNameInput = async (input) => {
        await setNewUsername(input);
        if(displaySavedMessage1 !== false){
            await setDisplaySavedMessage1(false);
            await delay(200);
        }
        if(input.length > 0 && displaySaveButton1 !== true){
            setDisplaySaveButton1(true);
        }
        else if(input.length === 0 && displaySaveButton1 !== false){
            setDisplaySaveButton1(false);
        }
    };
	const onChooseUsername = async () => {
        if(newUsername.length > 0 && newUsername !== state.user.username){
            await firestore
                .collection("users")
                .doc(state.user.email)
                .update({
                    // update the chat by adding a message object to the messages array in firestore
                    name: newUsername
                })
                .then(() => {});
			await dispatch({
				type: "SET_USERNAME",
				payload: newUsername,
			});
			await setDisplaySaveButton1(false);
			await delay(200);
			setDisplaySavedMessage1(true);

        }
    };
	const handleEmailInput = async (input) => {
        await setNewUserEmail(input);
        if(displaySavedMessage2 !== false){
            await setDisplaySavedMessage2(false);
            await delay(200);
        }
        if(input.length > 0 && displaySaveButton2 !== true){
            setDisplaySaveButton2(true);
        }
        else if(input.length === 0 && displaySaveButton2 !== false){
            setDisplaySaveButton2(false);
        }
    };
	const onChooseUserEmail = async () => {
		await dispatch({
			type: "SET_EMAIL",
			payload: newUserEmail,
		});
        if(newUserEmail.length > 0 && newUserEmail !== state.user.email){
			await firestore
                .collection("users")
                .doc(state.user.email)
                .update({
                    // update the chat by adding a message object to the messages array in firestore
                    email: newUserEmail
                })
                .then(() => {});
			await setDisplaySaveButton2(false);
			await delay(200);
			setDisplaySavedMessage2(true);

        }
    };

	const classes = useStyles();
	return (
            <div style={{overflow: 'hidden'}}>
                <NavBarComponent history={history} />
				{/* <div style = {{paddingTop: "10%"}}>
				</div> */}
                <div
					className={classes.root}
				>
                    <CssBaseline />
					
					<Paper elevation={3}>
                        <br />
						{/* <Slide timeout={{enter: '500ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
							<Avatar
								src={this.state.user.avatar}
								width="150"
								height="150"
								alt="profile pic"
								// className={classes.large}
							/>
						</Slide> */}
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Slide timeout={{enter: '500ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
								<Badge
									overlap="circle"
									anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
									}}
									style={{left:165}}
									badgeContent={
										<React.Fragment>
											<input
												accept="image/*"
												//className={classes.input}
												id="icon-button-avatar"
												onChange={onChooseAvatar}
												type="file"
												style={{ display: 'none'}}
											/>
											<label htmlFor="icon-button-avatar">
												<IconButton color="primary" component="span" style={{left:5}}>
													<PhotoCameraIcon style={{ color: "#184A46", zIndex: 1}} />
												</IconButton>
											</label>
											<UploadInfoComponent
												progress={progress}
												uploadTask={task}
												fileName={fileName}
												showComplete={showComplete}
												showLogo={showLogo}
												setShowComplete={setShowComplete}
												setShowLogo={setShowLogo}
											/>
										</React.Fragment>
									}
								>
									<Avatar 
										alt="Remy Sharp"
										src={state.home.loadedAvatars[state.user.email]}
										className={classes.avatar}
										variant="circular"
									/>
								</Badge>
							</Slide>
                		</Grid>
						<Grid
							container
							direction='row'
							alignItems='center'
							justify='center'
							style={{marginTop:'10%', marginBottom:'1%'}}
							spacing={3}
						>
							<Grid item xs={4}>
								<Slide timeout={{enter: '500ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
									<Button
										variant="outlined"
										disabled
										style={{
											fontSize: 15,
											color: "#184A46",
											borderRadius: 5, 
											borderColor: "green", 
											// width: "90%", 
											float:'right'
										}}    
									>
										Name
									</Button>
								</Slide>
							</Grid>
							<Grid item xs={6}>
								<Slide timeout={{enter: '500ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
									<h3>{state.user.username}</h3>
								</Slide>
							</Grid>
							<Grid item xs={2}>
								<Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
									<IconButton
										// style={{margin: '5% 0 0 25%'}}
										size='small'
										onClick={() => {
											setShowNameTextfield(!showNameTextfield);
										}}   
									>
										<EditIcon
											className={classes.editButton}
										/>
									</IconButton>
								</Slide>
							</Grid>
									
						</Grid>
						<Zoom timeout={{appear:500, enter: 1000, exit:1000}} in={showNameTextfield} mountOnEnter unmountOnExit>
							<Grid 
								container
								direction='row'
								alignItems='center'
								justify='center'
							>
								<Grid item xs ={10}>
									<CssTextField
										fullWidth
										className={classes.margin}
										label={state.user.username}
										variant="outlined"
										id="name"
										margin="dense"
										InputProps={{
											className: classes.input
										}}
										//fullWidth
										// helperText="* Enter your new group chat name *"
										onChange={e => {
											// setNewChatName(e.target.value);
											handleNameInput(e.target.value)
										}}
									/>
								</Grid>
								<Grid item xs ={2}>
									<Grid
										container
										direction='row'
										alignItems='center'
									>
										<Zoom in={displaySaveButton1} mountOnEnter unmountOnExit>
											<IconButton
												// style={{position:'absolute', top: 220, left:'88%'}}
												style={{right:20}}
												onClick={() => {
												    onChooseUsername();
												}}   
											>
												<SaveIcon
													// style={{display: `${displaySaveButton}`}}
													className={classes.editButton}
												/>
											</IconButton>
										</Zoom>
										<Slide direction='left' in={displaySavedMessage1} mountOnEnter unmountOnExit>
											<Button
												disabled
												size='small'
												startIcon={<DoneOutlineIcon className={classes.checkedIcon}/>}
												style={{color:'green', right: 10}}
											>
												Saved!
											</Button>
										</Slide>
										
									</Grid>
								</Grid>
							</Grid>
						</Zoom>
						
						<Grid
							container
							direction='row'
							alignItems='center'
							justify='center'
							style={{marginTop:'2.5%', marginBottom: '0.5%'}}
							spacing={3}
						>
							<Grid item xs={4}>
								<Slide timeout={{enter: '500ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
									<Button
										variant="outlined"
										disabled
										style={{
											fontSize: 15,
											color: "#184A46",
											borderRadius: 5, 
											borderColor: "green", 
											// width: "90%", 
											float:'right'
										}}    
									>
										Email
									</Button>
								</Slide>
							</Grid>
							<Grid item xs={6}>
								<Slide timeout={{enter: '500ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
									<h3>{state.user.email}</h3>
								</Slide>
							</Grid>
							<Grid item xs={2}>
								<Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
									<IconButton
										// style={{margin: '5% 0 0 25%'}}
										size='small'
										onClick={() => {
											setShowEmailTextfield(!showEmailTextfield);
										}}   
									>
										<EditIcon
											className={classes.editButton}
										/>
									</IconButton>
								</Slide>
							</Grid>
									
						</Grid>
						<Zoom timeout={{appear:500, enter: 1000, exit:1000}} in={showEmailTextfield} mountOnEnter unmountOnExit>
							<Grid 
								container
								direction='row'
								alignItems='center'
								justify='center'
							>
								<Grid item xs ={10}>
									<CssTextField
										fullWidth
										className={classes.margin}
										label={state.user.email}
										variant="outlined"
										id="name"
										type="email"
										margin="dense"
										InputProps={{
											className: classes.input
										}}
										//fullWidth
										// helperText="* Enter your new group chat name *"
										onChange={e => {
										    // setNewChatName(e.target.value);
										    handleEmailInput(e.target.value)
										}}
									/>
								</Grid>
								<Grid item xs ={2}>
									<Grid
										container
										direction='row'
										alignItems='center'
									>
										<Zoom in={displaySaveButton2} mountOnEnter unmountOnExit>
											<IconButton
												// style={{position:'absolute', top: 220, left:'88%'}}
												style={{right:15}}
												onClick={() => {
												    onChooseUserEmail();
												}}   
											>
												<SaveIcon
													// style={{display: `${displaySaveButton}`}}
													className={classes.editButton}
												/>
											</IconButton>
										</Zoom>
										<Slide direction='left' in={displaySavedMessage2} mountOnEnter unmountOnExit>
											<Button
												disabled
												size='small'
												startIcon={<DoneOutlineIcon className={classes.checkedIcon}/>}
												style={{color:'green', right: 10}}
											>
												Saved!
											</Button>
										</Slide>
										
									</Grid>
								</Grid>
							</Grid>
						</Zoom>
                        {/* <Slide timeout={{enter: '500ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
							<button
                            onClick={() =>
                               <Route path="/dashboard"/>
                            }
                            variant="contained"
                            fullWidth
                        >
                            Edit
                        </button>
						</Slide> */}
                        
                    </Paper>
                 
                    {/* <Paper className={classes.paper}>
                        <br />
                        <Avatar
                            src={this.state.user.avatar}
                            width="150"
                            height="150"
                            alt="profile pic"
                            className={classes.large}
                        />
                        <h1>{this.state.user.name}</h1>
                        <h2>{this.state.user.email}</h2>
                        <button
                            onClick={() =>
                                this.props.history.push("/profile/edit")
                            }
                            variant="contained"
                            fullWidth
                        >
                            Edit
                        </button>
                    </Paper> */}
				</div>
            </div>
        );
};
