import "../styles/index.scss";
import axios from "axios";

let URL = "http://localhost:3000/Users";
let tbody = document.querySelector("#tbody");
let saveButton = document.querySelector("#saveButton");
let saveButtonOnModal = document.querySelector("#saveButtonOnModal");
let nameField = document.querySelector("#nameField");
let emailField = document.querySelector("#emailField");
let jobTitleField = document.querySelector("#jobTitleField");
let modalNameField = document.querySelector("#modalNameField");
let modalEmailField = document.querySelector("#modalEmailField");
let modalJobTitleField = document.querySelector("#modalJobTitleField");
let allowDelete = document.querySelector("#allowDelete");

window.onload = function () {
  axios
    .get(URL)
    .then((response) => {
      response.data.forEach((user) => {
        createTableElement(user, tbody);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  saveButton.addEventListener("click", () => {
    createNewUser();
  });
};

function createTableElement(user, tbody) {
  const TR = document.createElement("tr");

  let tdID = document.createElement("td");
  tdID.innerHTML = user.id;
  TR.appendChild(tdID);

  let tdName = document.createElement("td");
  tdName.innerHTML = user.name;
  TR.appendChild(tdName);

  let tdEmail = document.createElement("td");
  tdEmail.innerHTML = user.email;
  TR.appendChild(tdEmail);

  let tdJobTitle = document.createElement("td");
  tdJobTitle.innerHTML = user.jobTitle;
  TR.appendChild(tdJobTitle);

  let tdAction = document.createElement("td");
  tdAction.className = "text-center";

  let editButton = document.createElement("button");
  editButton.className = "btn btn-info";
  editButton.innerHTML = `<i class="fa fa-edit"></i>&nbsp;Edit`;
  editButton.addEventListener("click", () => {
    $("#userInfoEditModal").modal("toggle");
    let editURL = URL + "/" + user.id;

    modalNameField.value = user.name;
    modalEmailField.value = user.email;
    modalJobTitleField.value = user.jobTitle;

    saveButtonOnModal.addEventListener("click", () => {
      let obj = {
        name: modalNameField.value,
        email: modalEmailField.value,
        jobTitle: modalJobTitleField.value,
      };

      axios
        .put(editURL, obj)
        .then((response) => {
          tdName.innerHTML = obj.name;
          tdEmail.innerHTML = obj.email;
          tdJobTitle.innerHTML = obj.jobTitle;
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger mx-1";
  deleteButton.innerHTML = `<i class="fa fa-trash"></i>&nbsp;Delete`;
  deleteButton.addEventListener("click", () => {
    $("#deleteConfirmationModal").modal("toggle");
    allowDelete.addEventListener("click", () => {
      deleteUser(user.id, TR);
    });
  });
  tdAction.appendChild(editButton);
  tdAction.appendChild(deleteButton);

  TR.appendChild(tdAction);
  tbody.appendChild(TR);
}

function createNewUser() {
  let obj = {
    name: nameField.value,
    email: emailField.value,
    jobTitle: jobTitleField.value,
  };

  axios
    .post(URL, obj)
    .then((response) => {
      createTableElement(response.data, tbody);
    })
    .catch(function (error) {
      console.log(error);
    });

  clearInputField();
}

function deleteUser(id, TR) {
  let deleteURL = URL + "/" + id;
  axios
    .delete(deleteURL)
    .then((response) => {
      tbody.removeChild(TR);
    })
    .catch((error) => {
      console.log(error);
    });
}

function clearInputField() {
  nameField.value = "";
  emailField.value = "";
  jobTitleField.value = "";
}
