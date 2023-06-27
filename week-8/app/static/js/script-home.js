const API_HOST = "http://127.0.0.1:5000/api";

// Section untuk drag and drop
function allowDrop(event) {
  //cegah perilaku default elemen
  event.preventDefault();
}
function drag(event) {
  //mendeteksi elemen yang di drag dengan melihat id
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  //cegah perilaku default elemen
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
  const dataId = event.srcElement.lastChild.id;

  checkStatus(dataId);
}

function updateStatus(id, status) {
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks/status/" + id;

  const data = JSON.stringify({
    status: !status,
  });

  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };

  xhr.send(data);
}

function checkStatus(id) {
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks/" + id;

  xhr.open("GET", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.response);

      updateStatus(id, response.data.status);
    }
  };

  return xhr.send();
}

// Get All Tasks
const todoItem = document.getElementById("todo");
const doneItem = document.getElementById("done");

window.onload = function () {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    window.location.href = "http://127.0.0.1:5000/auth/login";
  }

  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/tasks";

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const tasks = JSON.parse(this.response);

      tasks["data"].forEach((task) => {
        const article = document.createElement("article");
        const badgeDelete = document.createElement("button");
        const badgeEdit = document.createElement("button");

        const h4 = document.createElement("h4");
        const p = document.createElement("p");

        h4.appendChild(document.createTextNode(task.title));
        h4.setAttribute("id", task.id);
        p.appendChild(document.createTextNode(task.description));

        // article
        article.setAttribute("class", "border p-3 drag");
        article.setAttribute("ondragstart", "drag(event)");
        article.setAttribute("draggable", "true");
        article.setAttribute("id", task.id);

        badgeDelete.setAttribute("class", "badge bg-danger");
        badgeDelete.setAttribute("href", "#");
        badgeDelete.setAttribute("data-id", task.id);
        badgeDelete.setAttribute("data-bs-toggle", "modal");
        badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
        badgeDelete.appendChild(document.createTextNode("Delete"));

        badgeEdit.setAttribute("class", "badge bg-info");
        badgeEdit.setAttribute("href", "#");
        badgeEdit.setAttribute("data-id", task.id);
        badgeEdit.setAttribute("data-title", task.title);
        badgeEdit.setAttribute("data-description", task.description);
        badgeEdit.setAttribute("data-bs-toggle", "modal");
        badgeEdit.setAttribute("data-bs-target", "#myModalEdit");
        badgeEdit.appendChild(document.createTextNode("Edit"));

        article.appendChild(h4);
        article.appendChild(p);
        article.appendChild(badgeDelete);
        article.appendChild(badgeEdit);

        if (task.status == true) {
          article.setAttribute("style", "text-decoration: line-through");
          doneItem.appendChild(article);
        } else {
          todoItem.appendChild(article);
        }
      });
    }
  };

  xhr.send();
};

const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/tasks";
  //seleksi nilai dari input title dan description
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;

  //konfigurasi toast
  const toastLiveExample = document.getElementById("liveToastAdd");
  const toastMsgAdd = document.getElementById("toast-body-add");
  const toast = new bootstrap.Toast(toastLiveExample);
  //validasti input
  if (title == "") {
    toastMsgAdd.innerHTML = "Isian title tidak boleh kosong";
    toast.show();
  }
  if (description == "") {
    toastMsgAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
    toast.show();
  }
  let new_data = JSON.stringify({
    title: title,
    description: description,
  });

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //close the modal after adding data
      const myModalAdd = bootstrap.Modal.getInstance("#myModalAdd");
      myModalAdd.hide();

      //reset form
      addForm.reset();
      //refresh page
      location.reload();
    } else {
      //konfigurasi toast berhasil
      const toastLive = document.getElementById("liveToast");
      const toastMsg = document.getElementById("toast-body");
      const toast = new bootstrap.Toast(toastLive);
      toastMsg.innerHTML = "Data berhasil";
      toast.show();
    }
  };
  xhr.send(new_data);
});

// seleksi modal edit
const myModalEdit = document.getElementById("myModalEdit");
// ketika modal edit muncul jalankan fungsi berikut
myModalEdit.addEventListener("show.bs.modal", function (event) {
  //mendapatkan id dari item
  let dataId = event.relatedTarget.attributes["data-id"];
  // console.log(dataId.value)
  //get data with specific id
  let xhr = new XMLHttpRequest();
  let url = API_HOST + "/tasks/" + dataId.value;

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.response);
      let oldTitle = document.getElementById("edit-title");
      let oldDescription = document.getElementById("edit-description");
      oldTitle.value = data.data.title;
      oldDescription.value = data.data.description;
      //close the modal after adding data
    }
  };
  xhr.send();
  // let btnEdit = document.getElementById('btn-edit')
  let editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/tasks/" + dataId.value;

    let newTitle = document.getElementById("edit-title").value;
    let newDescription = document.getElementById("edit-description").value;
    //konfigurasi toast
    //konfigurasi toast
    const toastLiveExample = document.getElementById("liveToastEdit");
    const toastMsgEdit = document.getElementById("toast-body-edit");
    const toast = new bootstrap.Toast(toastLiveExample);
    //validasi input
    if (newTitle == "") {
      toastMsgEdit.innerHTML = "isian title tidak boleh kosong";
      toast.show();
    }
    if (newDescription == "") {
      toastMsgEdit.innerHTML = "isian description tidak boleh kosong";
      toast.show();
    }

    let data = JSON.stringify({
      title: newTitle,
      description: newDescription,
    });
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        //close the modal after edit data
        const myModalEdit = bootstrap.Modal.getInstance("#myModalEdit");
        myModalEdit.hide();
        //reset form and reload page
        editForm.reset();
        location.reload();
      }
    };
    xhr.send(data);
  });
});

const myModalDelete = document.getElementById("myModalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
  //mendeteksi elemen yang diklik user
  let dataId = event.relatedTarget.attributes["data-id"];
  const deleteForm = document.getElementById("delete-form");
  //ketika tombol delte diklik jalankan fungsi hapus
  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    let url = API_HOST + "/tasks/" + dataId.value;

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);

        const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
        myModalDelete.hide();

        const alertLoc = document.getElementById("alert-loc");
        const alertEl = document.createElement("div");
        alertEl.setAttribute("class", "alert alert-success");
        alertEl.setAttribute("role", "alert");
        alertEl.innerHTML = response.message;

        alertLoc.append(alertEl);

        document.getElementById(dataId.value).classList.add("d-none");
      }
    };
    xhr.send();
    //close modal
    // const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
    // myModalDelete.hide();
  });
});

//fugnsi untuk jam
const p = document.getElementById("jam");

function myTime() {
  let jam = new Date();
  p.innerHTML = jam.toLocaleTimeString([], {
    hour12: false,
  });
}
setInterval(myTime, 1000);

const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/auth/logout";

  xhr.open("POST", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  );
  xhr.onreadystatechange = function () {
    if (this.status == 200) {
      localStorage.removeItem("access_token");
      window.location.href = "http://127.0.0.1:5000/auth/login";
    } else {
      alert("Something went wrong");
    }
  };

  xhr.send();
});
