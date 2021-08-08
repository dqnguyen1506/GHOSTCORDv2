import React, { useState, useEffect, useContext } from "react";
import { Avatar, 
    IconButton, 
    TextField, 
    Menu, 
    MenuItem, 
    Button, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Grid,
    Badge,
    Box,
    Typography,
    Divider,
    Slide
} from "@material-ui/core";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { firestore, db } from "../../api-config/fire";
import firebase from "firebase/app";
import AttachmentIcon from '@material-ui/icons/Attachment';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { teal } from '@material-ui/core/colors';
import InfoIcon from '@material-ui/icons/Info';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import PersonIcon from '@material-ui/icons/Person';
import { createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu, bindPopover } from 'material-ui-popup-state';
import Popover from '@material-ui/core/Popover';
import { GlobalContext } from "../../global-context/State";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import images from '../../assets/Themes/Images';
import {ChatInfoComponent} from './chatInfo';
import {UploadInfoComponent} from './uploadInfo';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    gif: {
        "&:hover": {
            opacity: 0.5, // <- add here your desired color, for demonstration purposes I chose red
        }
    }
  }));

const StyledOnlineBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "$ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}))(Badge);

/* Badge (w/o animation) for user OFFLINE status */
const StyledOfflineBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: "gray",
        color: "gray",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}))(Badge);

const ChatViewComponent = ({ chat, avatars, email, username }) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [ progress, setProgress ] = useState(0);
    const [ fileName, setFileName ] = useState(10);
    const [showLogo, setShowLogo] = useState(true);
    const [showComplete, setShowComplete] = useState(false);
    const [ task, setTask ] = useState(0);
    /* create delay to ensure dialog sliding animation */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    /* control opening and closing (with a 0.5s delay) of dialog */
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = async () => {
        setOpen(false);
        await delay(500);
    };
    /* */
    const updateHasRead = () => {
        var chatsRef = firestore.collection("chats").doc(chat.id);
        for(var x in chat.usersHasRead){
            var batch = firestore.batch();
            if (chat.usersHasRead[x].email != state.user.email){
                if(!chat.usersHasRead[x].chatIsSelected){
                    batch.update(chatsRef, {
                        usersHasRead: firebase.firestore.FieldValue.arrayRemove({
                            email: chat.usersHasRead[x].email, 
                            hasRead: chat.usersHasRead[x].hasRead, 
                            chatIsSelected: chat.usersHasRead[x].chatIsSelected
                        })
                    });
                    batch.update(chatsRef, {
                        usersHasRead: firebase.firestore.FieldValue.arrayUnion({
                            email: chat.usersHasRead[x].email, 
                            hasRead: false,
                            chatIsSelected: false
                        })
                    });
                    batch.commit()
                        .then(() => console.log('Success!'))
                        .catch(err => console.error('Failed!', err));
                }
            }
        };
    };
    const sendMessage = (message, chat, email, username,type,fileName) => {
        if (message.length > 0) {
        
            firestore
            .collection("users")
            .doc(email)
            .get()
            .then(res => {
                firestore
                .collection("chats")
                .doc(chat.id)
                .update({
                    // update the chat by adding a message object to the messages array in firestore
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        sender: email,
                        senderUsername: res.data().name,
                        message: message,
                        timestamp: Date.now(),
                        type: type,
                        fileName: fileName
                    }),
                })
                .then(() => {});
                updateHasRead();
            // clear the chat input
            document.getElementById("messagebox").value = "";
            });
            // only send if the message isn't empty
            
        }
    };
    const [message, setMessage] = useState("");
    // const [bubbleColors, setBubbleColors] = useState({});
    const onChoosePhoto = async event => {
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
                                sendMessage(url, chat, email, username,2,image.name)
                            });
                    }
                );
        
                // alert("photo sent!");
            }
        } else {
            
        }
    }
    const onChooseAttachment = async event => {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0]
            if (image) {
                const uploadTask = db.ref(`attachments/${image.name}`).put(image);
                await setTask(uploadTask);
                await setFileName(image.name);
                await dispatch({
                    type: "SET_SHOW_UPLOAD_INFO",
                    payload: true,
                });
                // if(!showLogo){
                // await setShowLogo(true);
                // // }
                // // if(showComplete){
                // await setShowComplete(false);
                // }
                console.log("updating picture");
                await uploadTask.on(
                    "state_changed",
                    async snapshot => {
                        const prog = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        if(prog === 100){
                            await setShowLogo(false);
                            await delay(800);
                            await setShowComplete(true);
                        }
                        setProgress(prog);
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        db
                            .ref("attachments")
                            .child(image.name)
                            .getDownloadURL()
                            .then(url => {
                                sendMessage(url, chat, email, username,3,image.name)
                            });
                    }
                );
        
                // alert("attachment sent!");
            }
        } else {
            
        }
        // await dispatch({
        //     type: "SET_SHOW_UPLOAD_INFO",
        //     payload: true,
        // });
    }
    const imageClick = (name) => {
        alert(`this is ${name}`)
    } 
const color = teal[800];
const theme = createMuiTheme({
  palette: {
    common: { black: color, white: color },
    primary: { main: color, dark: color, light: color },
    text: { primary: color, secondary: color }
  },
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: `1px solid ${color}`
        }
      }
    }
  }
});
    // scroll the the bottom of the chat view
    useEffect(() => {
        const container = document.getElementById("chatview-container");
        if (container) container.scrollTo(0, container.scrollHeight);
    }, [chat]);
    
    const classes = useStyles();

    if (chat === undefined) {
        return <></>;
    } else {
        var chatName = 
            chat.type != "groupchat" 
            ? chat.usernames.filter((username) => username != state.user.username)
            : chat.name;
        var recipientEmail = 
            chat.type != "groupchat" 
                ? chat.users.filter((email) => email != state.user.email)
                : chat.owner;
        var badgeColor = 
            state.home.statuses[recipientEmail] === "online" 
            ?   'green'
            :   'grey'
            
        return (
            // <Slide timeout={{enter: '0ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
            <div
                style={{
                    // height: 990,
                    height:'93vh',
                    width:'83vw',
                    // width: "100%",
                    // borderWidth: 1,
                    // borderStyle: "solid",
                    alignSelf: "flexStart",
                    display:'flex',
                    flexDirection: 'column',
                    overflow:'hidden',
                    // overflowY:'auto',
                    // overflowX:'hidden',
                    position:'relative',
                    margin:'auto',
                    // backgroundColor: "white",
                //    borderColor: "red",
                }}
            >
                {/*Display selected group chat info*/}
                <Slide timeout={{enter: '1000ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
                    <div 
                        style ={{
                            // width: "83vw",
                            display:'flex',
                            flexDirection: 'row',
                            alignItems:'center',
                            // width: 'auto',
                            // minWidth: 100,
                            // overflowX: "hidden",
                            // overflowY: "hidden",
                            height: 70,
                            // height: '7vh',
                            backgroundColor: "#89a18f",
                            //textAlign: 'center',
                            fontSize: '20px',
                            color: '#444544',
                            borderBottom:'1px solid grey',
                        }}
                    >
                        <Grid 
                            container
                            spacing={1}
                            direction='row'
                            justify='center'
                            alignItems='center'
                            // style={{margin: 'auto',}}
                        >
                            <Grid item xs={6} >
                                {chat.type === "1on1"
                                    /* if its a 1-on-1 chat, display friend's avatar
                                    with online status badge */
                                    ? state.home.statuses[recipientEmail] === "online" 
                                        /* if online, display online badge */
                                        ? 
                                            <StyledOnlineBadge
                                                overlap="circle"
                                                anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                                }}
                                                variant="dot"
                                                style={{float:'right'}}
                                            >
                                                <Avatar 
                                                    alt="Remy Sharp"
                                                    src={state.home.loadedAvatars[recipientEmail]}
                                                    className={classes.large}
                                                    variant="circular"  
                                                />   
                                            </StyledOnlineBadge>
                                        /* if offline, display offline badge */
                                        :   
                                            <StyledOfflineBadge
                                                overlap="circle"
                                                anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                                }}
                                                variant="dot"
                                                style={{float:'right'}}
                                            >
                                                <Avatar 
                                                    alt="Remy Sharp"
                                                    src={state.home.loadedAvatars[recipientEmail]}
                                                    className={classes.large}
                                                    variant="circular"  
                                                />   
                                            </StyledOfflineBadge>
                                    /* if its groupchat chat, display avatar with
                                    no status */
                                    : 
                                        <Avatar 
                                            alt="Remy Sharp"
                                            src={chat.avatar}
                                            className={classes.large}
                                            variant="circular"
                                            style={{float:'right'}}  
                                        />   
                                }
                            </Grid>
                            {/* chat name + status (for direct messaging) */}
                            <Grid item xs={5}>
                                {chatName}
                                {chat.type === '1on1' 
                                    ?   <Grid 
                                            item 
                                            xs
                                            style={{fontSize: 17, color: `${badgeColor}`}}
                                        >
                                            {state.home.statuses[recipientEmail]}
                                        </Grid>
                                    :   null}
                            </Grid>

                            <Grid item xs={1} style={{textAlign: 'right', paddingRight: "1%"}}>
                                    {/* <PopupState variant="popover" popupId="popup-info">
                                    {(popupState) => (
                                        <React.Fragment>
                                            <IconButton {...bindTrigger(popupState)}>
                                                <InfoIcon style={{fontSize:30}}> 
                                                </InfoIcon>
                                            </IconButton>
                                            <Menu {...bindMenu(popupState)}>
                                                <ListItem onClick={popupState.close}>
                                                    <ListItemIcon style={{minWidth: '40px'}}>
                                                        <PersonIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary='Members' />
                                                </ListItem>
                                                {chat.users.map((user, ind) => {
                                                    return (
                                                        <div key={ind}>
                                                            <ListItem onClick={popupState.close}>{user}</ListItem>
                                                        </div>
                                                    );
                                                })}
                                                
                                            </Menu>
                                            
                                        </React.Fragment>
                    
                                    )}
                                </PopupState> */}
                                <IconButton 
                                    onClick={() => {
                                        /* show the chatInfo component 
                                                as well as showing the actual
                                                chatInfo dialog */ 
                                        dispatch({
                                            type: "SET_SHOW_CHAT_INFO",
                                            payload: true,
                                        }); 
                                        handleClickOpen();
                                    }}
                                >
                                    <InfoIcon style={{fontSize:30}}/> 
                                </IconButton>
                                <ChatInfoComponent
                                    chat={chat}
                                />
                                
                            </Grid>
                        </Grid>
                        {/* {<Avatar 
                            alt="Remy Sharp"
                            src={require("../logo/logo.jpg")}
                            className={classes.large}
                            variant="circular"
                        />} */}

                        {/*selected group chat name*/}
                        {/* {chatName} */}

                        {/*display group chat members*/}
                        {/* <PopupState variant="popover" popupId="popup-info">
                            {(popupState) => (
                                <React.Fragment>
                                    <IconButton {...bindTrigger(popupState)}>
                                        <InfoIcon style={{fontSize:18}}> 
                                        </InfoIcon>
                                    </IconButton>
                                    <Menu {...bindMenu(popupState)}>
                                        <ListItem onClick={popupState.close}>
                                            <ListItemIcon style={{minWidth: '40px'}}>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary='Members' />
                                        </ListItem>
                                        {chat.users.map((user, ind) => {
                                            return (
                                                <div key={ind}>
                                                    <ListItem onClick={popupState.close}>{user}</ListItem>
                                                </div>
                                            );
                                        })}
                                        
                                    </Menu>
                                    
                                </React.Fragment>
            
                            )}
                        </PopupState> */}
                    </div>
                </Slide>
                {/* chat */}
                <Slide timeout={{enter: '1000ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
                    <div
                        id="chatview-container"
                        style={{
                            height: "80vh",
                            // width: "83vw",
                            overflowY: "scroll",
                            scrollbarWidth: 'thin',
                            // overflowX: "hidden",
                            paddingLeft: "10px",
                            borderRight: '1px solid gray',
                            // borderLeft:'1px solid gray',
                            backgroundColor:'white',
                            // borderWidth: 3,
                            // borderStyle: "outset",
                            // borderColor: "blue",
                        }}
                    >
                        {/* chat messages */}
                        {chat.messages.length === 0 ? (
                            <Grid
                                container
                                direction='row'
                                justify='center'
                                alignItems='center'
                                style={{marginTop:"2%"}}
                            >
                                <Grid item xs={6}>
                                    <div
                                        style={{float:'right'}}
                                    >
                                        Say hi to your friend! 
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <img
                                        width={40}
                                        height={40}
                                        style={{marginLeft: 10}}
                                        src={images.ic_wave_hand}
                                    />
                                </Grid>
                                
                            </Grid>
                        ) : (
                            chat.messages.map((msg, index) => {
                                // Map all messages
                                var position =
                                    msg.sender !== email 
                                    ? msg.sender === "New Chat Member Alert" ? "none" :"left" 
                                    : "right";
                                var bubbleColor =
                                    msg.sender !== email 
                                    ? msg.sender === "New Chat Member Alert" ? "white" :"linear-gradient(0deg, rgba(198,210,201,1) 100%, rgba(253,187,45,1) 100%)"
                                    : "rgb(29,84,84)";
                                var fontColor =
                                    msg.sender !== email ? "#000000" : "#FFFFFF"; // If user sent message, set color
                                
                                var position2 = 
                                    msg.type === 4 ? "auto" : "none"
                                return (
                                    // Chat bubble
                                    <div
                                        key={index}
                                        style={{
                                            float: `${position}`,
                                            clear: "both",
                                            padding: "15px 10px 15px 10px",
                                            boxSizing: "border-box",
                                            wordWrap: "break-word",
                                            marginTop: "5px",
                                            marginBottom: "10px",
                                            marginRight: "10px",
                                            background: `${bubbleColor}`,
                                            width: "300px",
                                            borderRadius: "10px",
                                            fontSize: "20px",
                                            fontFamily: "arial",
                                            color: `${fontColor}`,
                                            display: "flex",
                                            alignItems: "center",
                                            margin: `${position2}`
                                        }}
                                    >
                                        {/* Avatar in chat bubble */}
                                        {msg.type != 4 &&
                                            <div style={{ paddingRight: 8 }}>
                                            <Avatar
                                                src={
                                                    msg.senderUsername !== username
                                                        ? avatars[msg.sender]
                                                        : avatars[email]
                                                }
                                                style={{ borderRight: "10px" }}
                                            />
                                            </div>
                                        }
                                        
                                        {/* Timestamp and Sender */}
                                        <div>
                                            {/*regular message*/}
                                            {msg.type === 1 &&
                                                <div style={{fontSize: "15px", width: '230px'}}>
                                                    {msg.message}
                                                </div>
                                            }
                                            {/*image*/}
                                            {msg.type === 2 &&
                                                <div>
                                                    <img
                                                    style={{width: '100%', height: '300px'}}
                                                    src={msg.message}
                                                    alt= "cannot load image"
                                                    />
                                                </div>
                                            }
                                            {/*attachment*/}
                                            {msg.type === 3 &&
                                                <div>
                                                    <Button 
                                                        href={msg.message}
                                                        target="_blank" //open attachment in a new tab
                                                        variant="outlined" 
                                                        color="secondary"
                                                        //className={classes.button}
                                                        startIcon={<AttachmentIcon />}
                                                    >
                                                        {msg.fileName}
                                                    </Button>
                                                </div>
                                            }
                                            {/*new chat member alert*/}
                                            {msg.type === 4 &&
                                                <div style={{fontSize: "12px", textAlign: "center"}}>
                                                
                                                    <Button 
                                                        variant="outlined" 
                                                        disabled 
                                                        startIcon={<EmojiPeopleIcon />}
                                                        style={{color: "#184A46", borderColor: "#1D5454"}}>
                                                    {`"${msg.message}" has joined the chat!`}
                                                    </Button>
                                                    {new Date(
                                                    msg.timestamp
                                                ).toLocaleString()}
                                                </div>
                                            }
                                            
                                            {/* gifs */}
                                            {msg.type === 5 &&
                                                <div>
                                                    <img
                                                    style={{width: 175, height: 150}}
                                                    src={require(`../../assets/images/${msg.fileName}`)}
                                                    alt= "cannot load image"
                                                    />
                                                </div>
                                            }
                                            {/* message date/sender username */}
                                            {msg.type != 4 &&
                                                <div
                                                style={{
                                                    fontSize: "12px",
                                                    paddingTop: 5,
                                                    whiteSpace: "pre-wrap",
                                                }}
                                                >
                                                    {new Date(
                                                        msg.timestamp
                                                    ).toLocaleString()}
                                                    {/*sender name*/}                                           
                                                    {msg.sender === email &&
                                                        <div>
                                                            {'Sent by: You'}
                                                        </div>
                                                    }
                                                    {msg.sender !== email &&
                                                        <div>
                                                            {`Sent By: ${msg.senderUsername}`}
                                                        </div>
                                                    }
                                                </div>
                                            }
                                            
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Slide>
                <Slide timeout={{enter: '1000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                    {/* Chat message input */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            // width: "83vw",
                            // height: 'auto',
                            height: 60,
                            // minHeight:"5%",
                            width: '100%',
                            // minWidth: '50%',
                            backgroundColor: "white",
                            // border:'1px solid grey',
                            // marginTop: "1vh",
                            // borderWidth: 3,
                            // borderStyle: "outset",
                            // borderColor: "purple",
                            margin:'auto',
                            alignItems:'center',
                        }}
                    >
                        {/*Send photos */}
                        <input
                            accept="image/*"
                            //className={classes.input}
                            id="icon-button-photo"
                            onChange={onChoosePhoto}
                            type="file"
                            style={{ display: 'none', }}
                        />
                        <label htmlFor="icon-button-photo">
                            <IconButton color="primary" component="span">
                                <PhotoCamera style={{ color: teal[900] }} />
                            </IconButton>
                        </label>
                    
                        {/*Send attachment */}
                        <input
                            accept="media_type"
                            //className={classes.input}
                            id="icon-button-attachment"
                            onChange={onChooseAttachment}
                            type="file"
                            style={{ display: 'none', }}
                        />
                        <label htmlFor="icon-button-attachment">
                            <IconButton color="primary" component="span">
                                <AttachmentIcon style={{ color: teal[900], marginTop: 0 }}/>
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
                        {/* gifs */}
                        <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                                <div>
                                {/* gifs button */}
                                <IconButton {...bindTrigger(popupState)}>
                                    <EmojiEmotionsIcon
                                        style={{ color: teal[900], marginTop: 0}} />
                                </IconButton>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                    }}
                                >
                                    {/* gifs display */}
                                    <Grid
                                        style={{maxHeight: 500, maxWidth: 500}}
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images .mimi1}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi1.gif")}                                      
                                                    // onClick={() => sendMessage("message", chat, email, username,1,"")}
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi2}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi2.gif")}                                     
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi3}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi3.gif")}                                    
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi4}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi4.gif")}                        
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi5}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi5.gif")}                             
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi6}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi6.gif")}                          
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi7}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi7.gif")}                               
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi8}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi8.gif")}                                
                                                />
                                            </a>
                                        </Grid>
                                        <Grid item xs>
                                            <a className={classes.gif} >
                                                <img
                                                    style={{height: '150px', width: '150px'}}
                                                    src={images.mimi9}  
                                                    onClick={() => sendMessage("gif", chat, email, username,5 ,"mimi9.gif")}                               
                                                />
                                            </a>
                                        </Grid>
                                    </Grid>
                                </Popover>
                                </div>
                            )}
                        </PopupState>
                        <MuiThemeProvider theme={theme}>
                            <TextField
                                label="Enter a message!"
                                variant='outlined'
                                id="messagebox"
                                style={{ flexGrow: 1}}
                                size='small'
                                onKeyUp={(e) =>
                                    e.keyCode === 13 // If the user hits enter
                                        ? sendMessage(message, chat, email, username,1,"")
                                        : setMessage(e.target.value)
                                }
                            />
                        </MuiThemeProvider>
                        <IconButton
                            onClick={() =>
                                sendMessage(message, chat, email, username,1,"")
                            }
                        >
                            <SendRoundedIcon style={{ color: teal[900] }} />
                        </IconButton>
                    </div>
                </Slide>
            </div>
            // </Slide>
        );
    }
};


export default ChatViewComponent;
