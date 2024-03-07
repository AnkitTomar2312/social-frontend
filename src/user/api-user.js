import baseURL from "../config";

//used for register user in Signup.js
const create = async (user) => {
  try {
    let response = await fetch(baseURL + "/api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//Used to List the users in the Users.js
const list = async (signal) => {
  try {
    let response = await fetch(baseURL + "/api/users", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//reading the data by userId used in EditProfile.js and Profile.js
const read = async (params, credentials, signal) => {
  try {
    let response = await fetch(baseURL + "/api/users/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//update will work in the EditProfile.js
const update = async (params, credentials, user) => {
  try {
    let response = await fetch(baseURL + "/api/users/" + params.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//used in the DeleteUser.js
const remove = async (params, credentials) => {
  try {
    let response = await fetch(baseURL + "api/users" + params.userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
//used in the FindPeople.js
const follow = async (params, credentials, followId) => {
  try {
    let response = await fetch(baseURL + "/api/users/follow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, followId: followId }),
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (params, credentials, unfollowId) => {
  try {
    let response = await fetch(baseURL + "/api/users/unfollow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId }),
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
//used in the FindPeople.js
const findPeople = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      baseURL + "/api/users/findPeople/" + params.userId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, list, remove, read, update, follow, unfollow, findPeople };
