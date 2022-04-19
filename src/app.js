// src/app.js

import { Auth, getUser } from "./auth";
import {
  deleteFragment,
  getFragment,
  getFragmentMeta,
  getUserFragments,
  postFragments,
  putFragment,
} from "./api";

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const getButton = document.querySelector("#get");
  const postButton = document.querySelector("#post");
  const content = document.querySelector("#content");
  const contentType = document.querySelector("#type");
  const fragments_id = document.querySelector("#fragments_id");
  const deleteButton = document.querySelector("#delete");
  const fragment_id = document.querySelector("#fragment_id");
  const upd_content = document.querySelector("#upd_content");
  const putButton = document.querySelector("#update");
  const get_id = document.querySelector("#get_id");
  const getById = document.querySelector("#getbyid");
  const getInfo = document.querySelector("#getInfo");
  const photoUpload = document.querySelector("#photo");
  const metaData = document.querySelector("#fragments");
  const infoData = document.querySelector("#content-type");

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
  // Do an authenticated request to the fragments API server and log the result
  getButton.onclick = async () => {
    const data = await getUserFragments(user);
    fragments.innerHTML = "";
    data.fragments.forEach((element) => {
      const text = document.createTextNode(JSON.stringify(element));
      fragments.appendChild(text);
    });
  };
  getById.onclick = async () => {
    var res = await getFragment(user, get_id.value);
    if(res[0].includes("application/json")){
      infoData.innerHTML = JSON.stringify(res[1]);
    }
    infoData.innerHTML = res;
  };
  getInfo.onclick = async () => {
    var res = await getFragmentMeta(user, get_id.value);
    infoData.innerHTML = JSON.stringify(res);
  };
  postButton.onclick = async () => {
    if (
      contentType.options[contentType.selectedIndex].value == "text/plain" ||
      contentType.options[contentType.selectedIndex].value == "text/markdown" ||
      contentType.options[contentType.selectedIndex].value == "text/html" ||
      contentType.options[contentType.selectedIndex].value == "application/json"
    ) {
      await postFragments(
        user,
        contentType.options[contentType.selectedIndex].value,
        content.value
      );
    } else {
      await postFragments(
        user,
        contentType.options[contentType.selectedIndex].value,
        photoUpload
      );
    }
  };
  deleteButton.onclick = () => {
    deleteFragment(user, fragments_id.value);
  };
  putButton.onclick = async () => {
    putFragment(
      user,
      fragment_id.value,
      contentType.options[contentType.selectedIndex].value,
      upd_content.value
    );
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
