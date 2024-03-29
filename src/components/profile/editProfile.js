import React, { Component } from 'react';
import fire, { db } from "../../api-config/fire";
import { Link } from "react-router-dom";
import { Button, Grid, TextField, Paper, Typography, FormControl, InputLabel, Input } from '@material-ui/core';
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBarComponent from "../../routes/navBar/navBar";
import styles from './styles';
import withStyles from "@material-ui/core/styles/withStyles";
import "./profile.css";
import {
    Slide,
} from "@material-ui/core";

class EditProfileComponent extends Component {

	
	constructor(props) {
		super(props);

		this.state = {
			image: "",
			url: "",
			user: "",
			name: "",
			avatar: "",
		};

		this.userTyping = this.userTyping.bind(this);
		this.update = this.update.bind(this);
	}
	
	render() {
		const { classes } = this.props;

        return (
			<div style={{overflow: 'hidden'}}>
				<NavBarComponent />
				<div style = {{paddingTop: "10%"}}>
				</div>
				<main className={classes.main}>
					<CssBaseline />
					<Paper className={classes.paper}>
						<Slide timeout={{enter: '500ms'}} direction="down" in={true} mountOnEnter unmountOnExit>
							<Typography component="h1" variant="h5">
								Edit Page
							</Typography>
						</Slide>
						<form className={classes.form}>
							<Slide timeout={{enter: '500ms'}} direction="left" in={true} mountOnEnter unmountOnExit>
								<FormControl fullwidth margin="normal">
									<InputLabel htmlFor="edit-name">
										Edit Name
									</InputLabel>	
									<Input
										id="edit-name" 
										placeholder={this.state.user.name}
										onChange={ e => {this.userTyping("name", e);}}
									></Input>
								</FormControl>
							</Slide>
							<Slide timeout={{enter: '500ms'}} direction="right" in={true} mountOnEnter unmountOnExit>
								<FormControl fullwidth margin="normal">
								<InputLabel htmlFor="edit-avatar">
									Edit Avatar
								</InputLabel>
								<Input
									id="edit-avatar" 
									type="file" 
									onChange={ e => {this.userTyping("avatar", e)}}
								></Input>
								</FormControl>	
							</Slide>
							
							<br/>
							<Slide timeout={{enter: '500ms'}} direction="up" in={true} mountOnEnter unmountOnExit>
								<div className="buttons">
									<button 
										variant="contained" 
										color="primary" 
										type="submit" 
										fullWidth
										onClick={this.update}
										className={classes.submit}
									>
										Save
									</button>	
									<button 
										variant="contained" 
										color="secondary" 
										fullWidth
										onClick={() => this.props.history.push("/profile")}
										className={classes.submit}
									>
										Cancel
									</button>
								</div>
							</Slide>
							
						</form>
					</Paper>
				</main>
			</div>
        )
    }

    componentDidMount() {
		var user = fire.auth().currentUser;
		if(user != null) {
			fire.firestore()
				.collection('users')
				.where("email", "==", user.email)
				.get()
				.then(snapshot => {
					var user = "";
					snapshot.forEach(doc => {
						var data = doc.data();
						user = data;
					});
					this.setState({ user: user });
				})
				.catch(error => console.log(error));
		}
		else {
			console.log("user not found");
		}
	};

	componentDidUpdate() {
		var user = fire.auth().currentUser;
		if(user != null) {
			fire.firestore()
				.collection('users')
				.where("email", "==", user.email)
				.get()
				.then(snapshot => {
					var user = "";
					snapshot.forEach(doc => {
						var data = doc.data();
						user = data;
					});
					this.setState({ user: user });
				})
				.catch(error => console.log(error));
		}
		else {
			console.log("user not found");
		}
	};
	
	userTyping = (type, e) => {
		switch (type) {
			case "name":
				this.setState({ name: e.target.value });
				break;
			case "avatar":
				// this.setState({ avatar: e.target.value });
				if (e.target.files[0]) {
					const image = e.target.files[0];
					this.setState(() => ({ image }));
				}
				break;
			default:
				break;
		}
	};

	update = (e) => {
		e.preventDefault();
		// updating the user's name if there is an input
		if(this.state.name != ""){
			fire.firestore().collection('users').doc(fire.auth().currentUser.email).update({
				name: this.state.name
			});
		}
		// updating the user's avatar
		const { image } = this.state;
		const uploadTask = db.ref(`images/${image.name}`).put(image);
		console.log("updating picture");
		uploadTask.on(
			"state_changed",
			snapshot => {},
			error => {
				console.log(error);
			},
			() => {
				db
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						this.setState({ url });
						// storing in firebase
						console.log("storing file in the firebase")
						fire
							.firestore()
							.collection("users")
							.doc(fire.auth().currentUser.email)
							.update({ avatar: url });
					});
			}
		);

		alert("Profile saved successfully!");
		this.props.history.push("/profile")
	};
}

export default withStyles(styles)(EditProfileComponent);

