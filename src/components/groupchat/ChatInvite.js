import React, { useState, useEffect, useContext } from "react";
import {
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    InputLabel,
    Button,
    Typography,
    Divider,
    Avatar,
    Zoom,
    Slide
} from "@material-ui/core";
import { firestore } from "../../api-config/fire";
import firebase from "firebase/app";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';
import { GlobalContext } from "../../global-context/State";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom direction="right" ref={ref} {...props} />;
});
const zoomProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 800, exit: 800 }
};
const sendInvite = async (
    chats,
    username,
    selectedChat,
    setInviteError,
    selectedFriend
) => {
    if (selectedChat !== "") {
        if (selectedFriend === "") {
            setInviteError(null);

            let inviteEmail = await firestore
                .collection("users")
                .where("name", "==", username)
                .get()
                .then((res) => {
                    if (res.docs[0] !== undefined) {
                        return res.docs[0].id;
                    }
                    setInviteError("No user with that name exists!");
                })
                .catch((err) => {
                    console.log("[ChatInvite] Error ", err);
                    return;
                });

            if (inviteEmail !== undefined) {
                await firestore
                    .collection("chats")
                    .doc(chats.find((e) => e.name === selectedChat).id)
                    .update({
                        invited: firebase.firestore.FieldValue.arrayUnion(
                            inviteEmail
                        ),
                    })
                    .catch((err) => {
                        console.log("[ChatInvite] Error ", err);
                        return;
                    });
                setInviteError("Invite sent!");
            }
        } else {
            let inviteEmail = await firestore
                .collection("users")
                .where("name", "==", selectedFriend)
                .get()
                .then((res) => {
                    if (res.docs[0] !== undefined) {
                        return res.docs[0].id;
                    }
                    setInviteError("No user selected!");
                })
                .catch((err) => {
                    console.log("[ChatInvite] Error ", err);
                    return;
                });

            if (selectedFriend !== undefined) {
                await firestore
                    .collection("chats")
                    .doc(chats.find((e) => e.name === selectedChat).id)
                    .update({
                        invited: firebase.firestore.FieldValue.arrayUnion(
                            inviteEmail
                        ),
                    })
                    .catch((err) => {
                        console.log("[ChatInvite] Error ", err);
                        return;
                    });
                setInviteError("Invite sent!");
            }
        }
    } else {
        setInviteError("Select a chat!");
    }
};

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      '& p':{                 //color of helper text
        color:'#89A18F',
      },
    //   '& label.Mui-focused': { //color of input label when focused
    //     color: 'black',
    //   },
      "& .MuiInputBase-root": { //color of input
        color: "green",
      },
      "& .MuiFormLabel-root": {
        color: "black",
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#184A46', // default underline color
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: 'green', // color of underline when hovered
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green', // color of underline when focused
      },
      
    },
    margin: {
      margin: theme.spacing(1),
    },
    // ghostcord logo
    large: {
        width: theme.spacing(11), 
        height: theme.spacing(11),
        alignSelf: "center",
        margin: "5%"
      },
  }));
  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });
export const ChatInvite = ({
    showChatInvite,
    closeChatInvite,
    chats,
    email,
}) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [selectedChat, setSelectedChat] = useState("");
    const [name, setName] = useState("");
    const [inviteError, setInviteError] = useState("");

    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState("");

    useEffect(() => {
        firestore
            .collection("users")
            .where("email", "==", email)
            .get()
            .then((res) => {
                setFriends(res.docs[0].data().friends);
            });
    }, [email]);
  
    const classes = useStyles();
    return (
        <Dialog 
            // PaperProps={{
            //     style: {
            //         backgroundColor: "#89A18F"
            //     },
            // }}
            TransitionProps={zoomProps}
            TransitionComponent={Transition}
            keepMounted
            open={showChatInvite}
            onClose={closeChatInvite}
            aria-labelledby="form-dialog-title"
        >
            <Slide timeout={{enter: '1000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                <Avatar 
                    alt="Remy Sharp"
                    src={require("../../assets/logo/logo.jpg")}
                    className={classes.large}
                    variant="circular"
                />
            </Slide>
            {/* <img
                style={{borderRadius: "50%"}}
                height="25%"
                width="25%"
                src={require("../logo/logo.jpg")}
                alt="Ghostcord"
                               
            /> */}
            {/* <Divider style={{backgroundColor: "green", width:"100%", alignSelf: "center"}}/> */}
            <Slide timeout={{enter: '1200ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                <Button
                    variant="outlined"
                    disabled
                    style={{
                        fontSize: 17,
                        color: "#184A46",
                        borderRadius: 5, 
                        borderColor: "green", 
                        width: "80%", 
                        alignSelf: "center"
                    }}    
                >
                    Invite a user to your group
                </Button>
            </Slide>
            {/* <DialogTitle style={{borderStyle:"" color:"#184A46", textAlign: "center"}}>Invite a user to your group</DialogTitle> */}
            {/* <Divider style={{backgroundColor: "green", width:"100%", alignSelf: "center"}}/> */}
            <DialogContent style={{overflow:'hidden'}} >
                <form className={classes.root} noValidate> 
                    <ThemeProvider theme={theme}> 
                        <Slide timeout={{enter: '1400ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                            <FormControl className={classes.margin}>
                                <InputLabel >Chat</InputLabel>
                                <Select
                                    value={selectedChat}
                                    onChange={(e) => setSelectedChat(e.target.value)}
                                >
                                    {chats.map((chat, index) => {
                                        if (chat.owner === email) {
                                            return (
                                                <MenuItem value={chat.name} key={index}>
                                                    {chat.name}
                                                </MenuItem>
                                            );
                                        }
                                        return null;
                                    })}
                                </Select>
                                <FormHelperText style={{color:"#89A18F"}}>* Must be owner of chat *</FormHelperText>
                            </FormControl>
                        </Slide>
                        
                        <Slide timeout={{enter: '1600ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                            <FormControl className={classes.margin} >
                                <InputLabel>Friends</InputLabel>
                                <Select
                                    value={selectedFriend}
                                    onChange={(e) => setSelectedFriend(e.target.value)}
                                >
                                    {friends !== undefined
                                        ? friends.map((friend, index) => {
                                            return (
                                                <MenuItem value={friend.name} key={index}>
                                                    {friend.name}
                                                </MenuItem>
                                            );
                                        })
                                        : null}
                                </Select>
                                <FormHelperText style={{color:"#89A18F"}}>* Select a friend to invite *</FormHelperText>
                            </FormControl>
                        </Slide>

                        <Slide timeout={{enter: '1800ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                            <Button
                                variant="outlined"
                                disabled
                                style={{
                                    fontSize: 15,
                                    color: "#184A46",
                                    borderRadius: 5, 
                                    borderColor: "green", 
                                    width: "95%", 
                                    alignSelf: "center",
                                    marginTop: '5%'
                                }}    
                            >
                                OR
                            </Button>
                        </Slide>
                        <Slide timeout={{enter: '2000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                            <TextField
                                variant="standard"
                                margin="dense"
                                label="Username"
                                helperText="* Enter a user's username *"
                                type="user"
                                className={classes.margin}
                                onChange={(e) => setName(e.target.value)}
                            >  
                            </TextField>
                        </Slide>
                    </ThemeProvider>
                </form>
            </DialogContent>
            <Slide timeout={{enter: '2150ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                <DialogActions style={{justifyContent: "center"}}>
                    <Button
                        style={{color: "green"}}
                        onClick={() =>
                            sendInvite(
                                chats,
                                name,
                                selectedChat,
                                setInviteError,
                                selectedFriend
                            )
                        }
                        color="primary"
                    >
                        Invite
                    </Button>
                    <Button
                        onClick={closeChatInvite} 
                        style={{color: "#184A46"}}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Slide>
            {inviteError ? (
                <Typography
                    component="h5"
                    variant="h6"
                    style={{ textAlign: "center" }}
                >
                    {inviteError}
                </Typography>
            ) : null}
        </Dialog>
    );
};
