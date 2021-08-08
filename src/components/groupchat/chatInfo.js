import React, { useState, useContext } from "react";
import { GlobalContext } from "../../global-context/State.js";
import { firestore, db } from "../../api-config/fire";
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
  withStyles
} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import EditIcon from '@material-ui/icons/Edit';
import {UploadInfoComponent} from './uploadInfo'
import SaveIcon from '@material-ui/icons/Save';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

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

const useStyles = makeStyles((theme) => ({
    root: {
        margin:'3% 10% 5% 10%',
      },
    margin: {
        width:'80%',
        float:'right'
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

const zoomProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 800, exit: 800 }
};

export const ChatInfoComponent = ({chat}) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [ progress, setProgress ] = useState(0);
    const [ fileName, setFileName ] = useState(10);
    const [showLogo, setShowLogo] = useState(true);
    const [showComplete, setShowComplete] = useState(false);
    const [showTextfield, setShowTextfield] = useState(false);
    const [newChatName, setNewChatName] = useState("");
    const [ task, setTask ] = useState(0);
    const [ displaySaveButton, setDisplaySaveButton ] = useState(false);
    const [ displaySavedMessage, setDisplaySavedMessage ] = useState(false);
    /* create delay to ensure dialog sliding animation */
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const classes = useStyles();
    var recipientEmail = 
        chat.type != "groupchat" 
            ? chat.users.filter((email) => email != state.user.email)
            : chat.owner;
    var statusDotColor = 
        state.home.statuses[recipientEmail] === 'online'
        ? "#44b700"
        : "grey";
    var chatName = 
        chat.type != "groupchat" 
        ? chat.usernames.filter((username) => username != state.user.username)
        : chat.name;
    var chatAvatar = 
        chat.type != "groupchat" 
        ? state.home.loadedAvatars[recipientEmail]
        : chat.avatar;
    // var displaySaveButton = 
    //     newChatName.length > 0
    //         ?   true 
    //         :   false
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
                                    .collection("chats")
                                    .doc(chat.id)
                                    .update({
                                        //update avatar
                                        avatar: url
                                    })
                                    .then(() => {});
                            });
                    }
                );
        
                // alert("photo sent!");
            }
        }
    };
    const onChooseChatName = async () => {
        if(newChatName.length > 0 || newChatName !== chat.name){
            await firestore
                .collection("chats")
                .doc(chat.id)
                .update({
                    // update the chat by adding a message object to the messages array in firestore
                    name: newChatName
                })
                .then(() => {});
            await setDisplaySaveButton(false);
            await delay(200);
            setDisplaySavedMessage(true);

        }
    };
    const handleInput = async (input) => {
        await setNewChatName(input);
        if(displaySavedMessage !== false){
            await setDisplaySavedMessage(false);
            await delay(200);
        }
        if(input.length > 0 && displaySaveButton !== true){
            setDisplaySaveButton(true);
        }
        else if(input.length === 0 && displaySaveButton !== false){
            setDisplaySaveButton(false);
        }
    };
    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            keepMounted
            open={state.display.showChatInfo}
            onClose={() => {
                dispatch({
                    type: "SET_SHOW_CHAT_INFO",
                    payload: false,
                });
            }}
            onExit={() => {
                setShowTextfield(false);
                setNewChatName('');
                setDisplaySaveButton(false);
                setDisplaySavedMessage(false);
            }}
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            TransitionProps={zoomProps}
        >
            <DialogTitle>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={6}>
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
                                src={chatAvatar}
                                className={classes.avatar}
                                variant="circular"
                            />
                        </Badge>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton 
                            className={classes.closeButton}
                            onClick={() => {
                                dispatch({
                                    type: "SET_SHOW_CHAT_INFO",
                                    payload: false,
                                });
                            }}    
                        >
                            <CloseIcon  
                                style={{
                                    fill: '#184A46',
                                }}  
                            />
                        </IconButton>
                    </Grid>
                    
                </Grid>
            </DialogTitle>

            {chat.type !== "groupchat" &&
                <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                // spacing={2}
                >
                    <Grid item xs={6}>
                        <FiberManualRecordIcon
                            style={{color: `${statusDotColor}`, float:'right' }}
                            fontSize='small'
                        />           
                    </Grid>
                    <Grid item xs={6}>
                        {state.home.statuses[recipientEmail]}
                    </Grid>
                </Grid>
            }
            <Grid
                container
                direction='row'
                alignItems='center'
            >
                <Grid item xs ={10}>
                    <Button
                        variant="outlined"
                        disabled
                        style={{
                            fontSize: 20,
                            color: "#184A46",
                            borderRadius: 5, 
                            borderColor: "green", 
                            width: "80%", 
                            // alignSelf: "center",
                            // marginBottom: '5%',
                            marginTop:'2.5%',
                            float:'right'
                        }}    
                        >
                            {chatName}
                        
                    </Button>
                </Grid>
                {chat.type === "groupchat" &&
                    <Grid item xs ={2}>
                    <Grid
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                    // spacing={2}
                    >
                    <IconButton
                        // style={{margin: '5% 0 0 25%'}}
                        // size='small'
                        onClick={() => {
                            setShowTextfield(!showTextfield);
                        }}   
                    >
                        <EditIcon
                            className={classes.editButton}
                        />
                    </IconButton>
                    </Grid>
                </Grid>
                }
                
                
            </Grid>
            {/* <TextField>Hello</TextField> */}
            <DialogContent style={{overflow:'hidden'}}>
                <form className={classes.root} noValidate>
                    <Zoom timeout={{appear:500, enter: 1000, exit:1000}} in={showTextfield} mountOnEnter unmountOnExit>
                    {/* <ThemeProvider theme={theme}> */}
                        <Grid
                            container
                            direction='row'
                            alignItems='center'
                            // justify='center'
                        >
                            <Grid item xs ={10}>
                                <CssTextField
                                    fullWidth
                                    className={classes.margin}
                                    label={chatName}
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
                                        handleInput(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs ={2}>
                                <Grid
                                    container
                                    direction='row'
                                    alignItems='center'
                                    // justify='center'
                                >
                                    <Zoom in={displaySaveButton} mountOnEnter unmountOnExit>
                                        <IconButton
                                            // style={{position:'absolute', top: 220, left:'88%'}}
                                            // style={{float:'right'}}
                                            onClick={() => {
                                                onChooseChatName();
                                            }}   
                                        >
                                            <SaveIcon
                                                // style={{display: `${displaySaveButton}`}}
                                                className={classes.editButton}
                                            />
                                        </IconButton>
                                    </Zoom>
                                    <Slide direction='left' in={displaySavedMessage} mountOnEnter unmountOnExit>
                                        <Button
                                            disabled
                                            size='small'
                                            startIcon={<DoneOutlineIcon className={classes.checkedIcon}/>}
                                            style={{color:'green', left: 15}}
                                        >
                                            Saved!
                                        </Button>
                                    </Slide>
                                    
                                </Grid>
                            </Grid>
                        </Grid>
                    </Zoom>
                {/* </ThemeProvider> */}
                </form>
                <Grid 
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    spacing={2}
                >
                    <Grid item xs={5.5}>
                        <PersonIcon
                            fontSize='large'
                                style={{
                                    fill: '#184A46',
                                    float:'right',
                                    marginRight:'5%'
                            }}    
                        />
                    </Grid>
                    <Grid item xs={6.5}>
                        <ListItemText 
                            primary='Members' 
                            style={{color:'#184A46', fontSize:20}}
                        />
                        {/* <Button
                            variant="outlined"
                            disabled
                            style={{
                                fontSize: 20,
                                color: "#184A46",
                                borderRadius: 5, 
                                borderColor: "green", 
                                width: "80%", 
                                alignSelf: "center",
                                marginBottom: '5%',
                                border: '2px solid green'
                            }}    
                        >
                            Members
                        </Button> */}
                    </Grid>
                </Grid>
            </DialogContent>
            <Grid 
                container
                direction='column'
                justify='center'
                alignItems='center'
            >
                <List>
                    {chat.users.map((user, ind) => {
                        var admin = 
                            user === chat.owner
                            ? '(Admin)'
                            : ''
                        return (
                            <div key={ind}>
                                <Grid
                                    container
                                    direction='row'
                                    // justify='center'
                                    // alignItems='center'
                                    // spacing={3}
                                >
                                    <Grid style={{marginBottom:'5%'}} item xs={4}> 
                                        <ListItemAvatar>
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={state.home.loadedAvatars[user]}
                                                variant="circular"
                                                style={{float:'right'}}
                                            />
                                        </ListItemAvatar>
                                    </Grid>
                                    <Grid 
                                        item 
                                        xs={7}
                                        // style={{textIndent:'5%'}}    
                                    >
                                        <ListItem>{`${user} ${admin}`}</ListItem>
                                    </Grid>
                                </Grid>
                                
                            </div>
                        );
                    })}
                </List>
            </Grid>
            
 
                
        </Dialog>   
    );
};

