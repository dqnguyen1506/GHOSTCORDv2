import React, { useContext, useState, useEffect } from "react";
import NavBarComponent from "../../routes/navBar/navBar";
import Divider from "@material-ui/core/Divider";
import SwipeableViews from 'react-swipeable-views';
import {
    Tabs,
    useTheme,
    AppBar,
    Tab,
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    ListItemSecondaryAction,
    IconButton,
    Grid,
    Badge,
    Button,
    Slide,
    withStyles
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from "@material-ui/icons/Add";
import { GlobalContext } from "../../global-context/State";
import { auth, firestore } from "../../api-config/fire";
import firebase from "firebase/app";
import Requests from "./Requests";
import FriendsListComponent from "./FriendsList";
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import AlertComponent from "../groupchat/Alert"


const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%',
    },

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

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div>
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
        </div>
    );
}

const FriendsComponent = ({ history }) => {
    const classes = useStyles();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const { state, dispatch } = useContext(GlobalContext);
    const [tab, setTab] = useState(0);
    const theme = useTheme();
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const handleChangeIndex = (index) => {
        setTab(index);
      };
    const [users, setUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if(state.user.friends.length > 0){
            firestore
            .collection("users")
            .where("email", "not-in", state.user.friends)
            .get()
            .then((res) => {
                setUsers(res.docs.map((doc) => doc.data()));
                setSearchedUsers(res.docs.map((doc) => doc.data()));
            });
            
        }
        
    }, [state.user.email, state.user.friends]);

    const onTextChange = (e) => {
        setSearch(e.target.value);
        console.log(e.target.value);
        onType(e.target.value);
    };

    const onType = (search) => {
        console.log("SEARCH QUEREY", search);
        setSearchedUsers(
            search === "" || undefined
                ? users
                : users.filter((el) =>
                      el.name !== undefined
                          ? el.name.toLowerCase().includes(search)
                          : null
                  )
        );
    };

    const sendRequest = async (email, name) => {
        if(state.display.showAlert === true){
            await dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        }
        if(state.alert.type !== 'friend request sent'){
            await dispatch({
                type: "SET_ALERT_TYPE",
                payload: 'friend request sent',
            });
            await dispatch({
                type: "SET_ALERT_MESSAGE",
                payload: 'Friend request sent!',
            });
        }
        await firestore
            .collection("users")
            .doc(state.user.email)
            .update({
                sent: firebase.firestore.FieldValue.arrayUnion({
                    email: email,
                    name: name,
                }),
            })
            .then(() => {});
        await firestore
            .collection("users")
            .doc(email)
            .update({
                received: firebase.firestore.FieldValue.arrayUnion({
                    email: state.user.email,
                    name: auth.currentUser.displayName,
                }),
            })
            .then(() => {});
        await dispatch({
            type: "SET_SHOW_ALERT",
            payload: true,
        });
        // firestore
        //     .collection("users")
        //     .where("email", "==", state.user.email)
        //     .onSnapshot((res) => {
        //         //setReceivedCount(res.docs[0].data().received.length);
        //         dispatch({
        //             type: "SET_FRIEND_REQUEST_COUNT",
        //             payload: res.docs[0].data().received.length,
        //         });
        //         if (res.docs[0].data().received.length > 0){
        //             dispatch({
        //                 type: "SET_SHOW_REQUEST_NOTIFICATION",
        //                 payload: '',
        //             });
        //         }else{
        //             dispatch({
        //                 type: "SET_SHOW_REQUEST_NOTIFICATION",
        //                 payload: 'none',
        //             });
        //         }
        //     });
    };

    // close the alert when user is not in friendsComponent
    useEffect(() => {
        if(state.display.showAlert === true){
            dispatch({
                type: "SET_SHOW_ALERT",
                payload: false,
            });
        }
    }, [history]);

    // auto close alert
    useEffect(() => {
        if(state.display.showAlert === true){
            async function autoClose(){
                try{
                    await delay(4000);
                    dispatch({
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
    return (
        <div style={{overflow:'hidden'}}>
            {/* request sent alert */}
            <AlertComponent/>
            {console.log(searchedUsers)}
            <NavBarComponent style={{ position: "sticky" }} history={history} />
            <div style={{ height: "93vh", width: "100vw" }}>
                <AppBar position="static"style={{ background:"linear-gradient(0deg, rgba(137,161,143,1) 100%, rgba(253,187,45,1) 100%)"}}>                    
                    <Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
                        <Tabs
                            variant="fullWidth"
                            TabIndicatorProps={{style: {backgroundColor:'#184A46'}}}
                            value={tab}
                            onChange={handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab label="Users" />
                            <Tab label="Friends" />
                            <Tab label={
                                <div><FiberManualRecordIcon 
                                    style={{display: `${state.display.showRequestNotification}`, color:'#f50057', verticalAlign: 'middle'}} 
                                    /> Requests 
                                </div>}  
                            />
                        </Tabs>
                    </Slide> 
                </AppBar>
                <Slide timeout={{enter: '500ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={tab}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={tab} index={0} dir={theme.direction}>
                            <Grid 
                                container
                                direction='column'
                                justify='center'
                                alignItems='center'
                                style={{overflow:'hidden'}}
                            >
                                {/* <Slide direction="right" in={true} mountOnEnter unmountOnExit> */}
                                    <CssTextField
                                        onChange={(e) => {
                                            onTextChange(e);
                                        }}
                                        label="Search for users..."
                                        value={search}
                                        style = {{width:'50%'}}
                                        variant = 'outlined'
                                    />
                                {/* </Slide> */}
                                <List style = {{width:'50%'}}
                                //style={{overflowY:"scroll"}}
                                >
                                    {searchedUsers.map((users, index) =>
                                        users.email !== state.user.email ? (
                                            <>
                                                <ListItem key={index}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={
                                                                state.home.loadedAvatars[
                                                                    users.email
                                                                ]
                                                            }
                                                        ></Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={users.name} secondary = {users.email}/>
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() =>
                                                                sendRequest(
                                                                    users.email,
                                                                    users.name
                                                                )
                                                            }
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                <Divider />
                                            </>
                                        ) : null
                                    )}
                                </List>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={1} dir={theme.direction}>
                            <FriendsListComponent
                                width="50vw"
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={2} dir={theme.direction}>
                            <Requests />
                        </TabPanel>
                    </SwipeableViews>
                </Slide>
                
            </div>
        </div>
    );
};

export default FriendsComponent;
