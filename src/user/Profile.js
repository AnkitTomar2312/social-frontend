import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";
import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import { read } from "./api-user.js";
import { Redirect, Link } from "react-router-dom";
import FollowProfileButton from "./../user/FollowProfileButton";
import ProfileTabs from "./ProfileTab";
import { listByUser } from "./../post/api-post.js";
import baseURL from "../config";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: "1em",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10,
  },
}));

export default function Profile({ match }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    following: false,
  });
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.accessToken },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToSignin: true });
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });
        loadPosts(data.id);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower.id == jwt.user.id;
    });
    return match;
  };
  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user.id,
      },
      {
        t: jwt.accessToken,
      },
      values.user.id
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };
  const loadPosts = (user) => {
    listByUser(
      {
        userId: user,
      },
      {
        t: jwt.accessToken,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };
  const removePost = (post) => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  const photoUrl = values.user.id
    ? `${baseURL}/api/users/photo/${values.user.id}?${new Date().getTime()}`
    : baseURL + "/api/users/defaultphoto";
  if (values.redirectToSignin) {
    return <Redirect to="/signin" />;
  }
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText
            primary={values.user.name}
            secondary={values.user.email}
          />{" "}
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user.id == values.user.id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + values.user.id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user.id} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              following={values.following}
              onButtonClick={clickFollowButton}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={values.user.about}
            secondary={
              "Joined: " + new Date(values.user.created).toDateString()
            }
          />
        </ListItem>
      </List>
      {/* <ProfileTabs
        user={values.user}
        posts={posts}
        removePostUpdate={removePost}
      /> */}
    </Paper>
  );
}
