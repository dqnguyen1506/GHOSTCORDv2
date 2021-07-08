import React, { useState, useContext } from "react";
import { GlobalContext } from "../state/State.js";
import { firestore, db } from "../config/fire";
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
    CircularProgress,
    Typography
  } from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import StopIcon from '@material-ui/icons/Stop';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const zoomProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 800, exit: 800 }
};

const useStyles = makeStyles((theme) => ({
    // ghostcord logo
    large: {
        width: theme.spacing(11), 
        height: theme.spacing(11),
        alignSelf: "center",
        margin: "5%",
        // marginTop:'-18%'
      },
    button: {
        fill:'#184A46'
    },
    CircularProgress: {
        color:'green'
    },
    dialog:{
        minHeight: '400',
        maxHeight: '400',
    },
}));
  

export const UploadInfoComponent = ({
    progress, 
    uploadTask, 
    fileName, 
    showComplete, 
    showLogo, 
    setShowComplete, 
    setShowLogo 
}) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [message, setMessage] = useState("upload completed");
    const [dialogButtonMessage, setDialogButtonMessage] = useState("confirm");
    // const [showComplete, setShowComplete] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    var color = showComplete 
        ?   "red" 
        :   "white"
    const classes = useStyles();
    return(
        <Dialog
            classes={{ paper: classes.dialog }}
            onExited={()=> {
                setShowLogo(true);
                setShowComplete(false);
                setMessage("upload completed");
                setDialogButtonMessage("confirm");
            }}
            // onEnter={()=> setMessage("upload completed")}
            fullWidth
            maxWidth={'xs'}
            keepMounted
            disableBackdropClick
            disableEscapeKeyDown
            open={state.display.showUploadInfo}
            onClose={() => {
                dispatch({
                    type: "SET_SHOW_UPLOAD_INFO",
                    payload: false,
                });
            }}
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            TransitionProps={zoomProps}
        >
            <Slide timeout={{enter: 500}} direction="right" in={showComplete} mountOnEnter unmountOnExit>
                <Button
                    variant="outlined"
                    disabled
                    style={{
                        fontSize: 22,
                        color: "red",
                        borderRadius: 5, 
                        borderColor: "green", 
                        width: "80%", 
                        alignSelf: "center",
                        // position:'absolute'
                        marginTop:'9.4%',
                        marginBottom:'9%'
                        // marginTop:`${margin}`
                    }}  
                    // startIcon={<DoneOutlineIcon/>}  
                >
                    {message}
                </Button>
            </Slide>
 
            <Slide timeout={{appear:500, enter: 0, exit:500}} direction="right" in={showLogo} mountOnEnter unmountOnExit>
                <Avatar 
                    alt="Remy Sharp"
                    src={require("../logo/logo.jpg")}
                    className={classes.large}
                    variant="circular"
                />
            </Slide>
            {/* <Slide timeout={{enter: '1200ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
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
                    Upload Information
                </Button>
            </Slide> */}
            <Grid 
                container
                direction='column'
                justify='center'
                alignItems='center'
                style={{marginTop:'5%'}}
            >
                <Box position="relative" display="inline-flex">
                    <CircularProgress className={classes.CircularProgress} variant="determinate" value={progress} size={250} />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection='column'
                    >
                        <Typography variant="h4" component="div" color="textSecondary">{`${progress}%`}</Typography>
                        {/* <Typography style={{marginTop:'5%', width:'40%'}} variant="subtitle" component="div" color="textSecondary">{"144-1440485_quotation-marks-hd-png-download.png"}</Typography> */}
                        <Grid
                            container
                            direction='row'
                            justify='center'
                            alignItems='center'
                            style={{
                                color: "#184A46",
                                // borderRadius: 5, 
                                // border: "5px solid #184A46 ", 
                                marginBottom:'5%', 
                                // width:'60%', 
                                }}
                        >   
                            {/* resume button */}
                            <IconButton 
                                onClick={()=> uploadTask.resume()}
                                disabled={showComplete}
                            >
                                <PlayCircleOutlineIcon fontSize='large' className={classes.button}/>
                            </IconButton>
                            {/* pause button */}
                            <IconButton 
                                onClick={()=> uploadTask.pause()}
                                disabled={showComplete}
                            >
                                <StopIcon fontSize='large' className={classes.button}/>
                            </IconButton>
                            {/* cancel button */}
                            <IconButton 
                                onClick={async()=> {
                                    await uploadTask.cancel();
                                    await setMessage("Upload cancelled");
                                    await setShowLogo(false);
                                    await setDialogButtonMessage("exit");
                                    await delay(500);
                                    await setShowComplete(true);
                                }}
                                disabled={showComplete}
                            >
                                <CancelOutlinedIcon fontSize='large' className={classes.button}/>
                            </IconButton>
                            
                        </Grid>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    disabled
                    style={{
                        fontSize: 17,
                        color: "#184A46",
                        borderRadius: 5, 
                        borderColor: "green", 
                        width: "80%", 
                        alignSelf: "center",
                        marginTop:'9.4%',
                        // marginBottom:'9%',
                        wordBreak:'break-word'
                    }}    
                >
                    {fileName}
                </Button>
                {/* <Typography style={{marginTop:'5%'}} variant="subtitle" component="div" color="textSecondary">{"144-1440485_quotation-marks-hd-png-download.png"}</Typography> */}
                {/* <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    style={{
                        color: "#184A46",
                        borderRadius: 5, 
                        border: "5px solid #184A46 ", 
                        marginBottom:'5%', 
                        width:'60%', 
                        }}
                >   
                    <Grid
                        container
                        direction='column'
                    >

                    </Grid>
                    <PlayCircleOutlineIcon fontSize='large' className={classes.button}/>
                    <StopIcon fontSize='large' className={classes.button}/>
                    <CancelOutlinedIcon fontSize='large' className={classes.button}/>
                </Grid> */}
                {/* <Zoom timeout={{enter: 500}} in={showComplete} mountOnEnter unmountOnExit> */}
                    <DialogActions style={{justifyContent: "center", top:'50%'}}>
                        <Button
                            style={{color: `${color}`}}
                            onClick={() => {
                                dispatch({
                                    type: "SET_SHOW_UPLOAD_INFO",
                                    payload: false,
                                })
                            }}
                            color="primary"
                        >
                            {dialogButtonMessage}
                        </Button>
                    </DialogActions>
                {/* </Zoom> */}
            </Grid>
        </Dialog>
    );
};