"use strict";

let divMenu = null;
let divContent = null;
let userID;

const signOutButton = document.getElementById("signOutButton");

document.addEventListener("DOMContentLoaded", (e) => {
  divMenu = document.getElementById("divMenu");
  divContent = document.getElementById("divContent");

  userID = parseInt(localStorage.getItem("userID"));
  if (userID) {
    showCreateUser();
  } else {
    showLogin();
  }
});

function showCreateUser() {
  loadTemplate("menu_1", divMenu, true);
  loadTemplate("createUser", divContent, true);
  const createUserButton = document.getElementById("createUserButton");

  createUserButton.onclick = async function (e) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pswHash").value;
    sha256(password, async (pswHash) => {
      const user = { name, email, pswHash };
      const respon = await postTo("/user", user);
    });
  };
}

function showLogin() {
  loadTemplate("loginUser", divContent, true);

  const loginButton = document.getElementById("loginButton");
  loginButton.onclick = async function (e) {
    const email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPswHash").value;
    sha256(password, async (pswHash) => {
      let user = { email, pswHash };
      console.log(user);
      const resp = await postTo("/user/login", user);
      const shema = await resp.json();
      console.log(shema);
      userID = shema.data.id;
      localStorage.setItem("userID", userID);
      location.reload();
    });
  };
}
