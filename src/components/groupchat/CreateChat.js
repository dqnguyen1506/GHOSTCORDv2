import React, { useState } from "react";
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
  Zoom
} from "@material-ui/core";
import { 
  makeStyles, 
  ThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

export const CreateChat = ({ closeCreateChat, showCreateChat, createChat }) => {
  const [newRoomName, setNewRoomName] = useState("");
  const zoomProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: { enter: 800, exit: 800 }
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& p':{                 //color of helper text
        color:'#89A18F',
        marginLeft: 0
      },
      "& .MuiInputBase-root": {
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
  
  const classes = useStyles();
  
  return (
    <div>
      <Dialog
        keepMounted
        open={showCreateChat}
        onClose={closeCreateChat}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        TransitionProps={zoomProps}
      >
        <Slide timeout={{enter: '1000ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
          <Avatar 
            alt="Remy Sharp"
            src={require("../../assets/logo/logo.jpg")}
            className={classes.large}
            variant="circular"
          />
        </Slide>
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
            Create group chat
          </Button>    
        </Slide>
        <Slide timeout={{enter: '1400ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
          <DialogContent style={{overflow:'hidden'}}>
            <form className={classes.root} noValidate>
              <ThemeProvider theme={theme}>
              <TextField
                className={classes.margin}
                label="Group chat name"
                variant="standard"
                id="name"
                type="email"
                margin="dense"
                type="email"
                helperText="* Enter your new group chat name *"
                onChange={e => setNewRoomName(e.target.value)}
            />
              </ThemeProvider>
            </form>
          
          </DialogContent>
        </Slide>
        <Slide timeout={{enter: '1550ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
          <DialogActions style={{justifyContent: "center"}}>
            <Button style={{color: "green"}} onClick={() => createChat(newRoomName)} color="primary">
              Create
            </Button>
            <Button style={{color: "#184A46"}} onClick={closeCreateChat} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Slide>
      </Dialog>
    </div>
  );
};
