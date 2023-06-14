// Drag N Drop
function allowDrop(event) {
  event.preventDefault();
}
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
}

const isLogin = sessionStorage.getItem("isLogin");
if (!isLogin) {
  window.location.href = "/login.html";
}

// Fetch Task
const todoItem = document.getElementById("todo");
window.onload = function () {
  //   AJAX Call di sini
  const xhr = new XMLHttpRequest();
  const url = "/data/data-task.json";

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Check data, apakah sudah ada di localStorage
      let data = JSON.parse(localStorage.getItem("data"));

      if (!data) {
        localStorage.setItem("data", this.response);
        // Kalau belum, save data ke localStorage
        data = JSON.parse(localStorage.getItem("data"));
      }

      // Render ke HTML
      for (let i = 0; i < data.length; i++) {
        let article = document.createElement("article");
        let badgeDelete = document.createElement("a");
        let badgeEdit = document.createElement("a");
        let p = document.createElement("p");
        let h4 = document.createElement("h4");
        h4.appendChild(document.createTextNode(data[i].title));
        p.appendChild(document.createTextNode(data[i].desc));
        article.setAttribute("class", "border p-3 mt-3");
        article.setAttribute("ondragstart", "drag(event)");
        article.setAttribute("draggable", "true");
        article.setAttribute("id", data[i].id);
        badgeDelete.setAttribute("href", "#");
        badgeDelete.setAttribute(
          "class",
          "badge bg-danger link-underline link-underline-opacity-0 mr-3"
        );
        badgeDelete.setAttribute("data-id", data[i].id);
        badgeDelete.setAttribute("data-bs-toggle", "modal");
        badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
        badgeEdit.setAttribute("href", "#");
        badgeEdit.setAttribute(
          "class",
          "badge bg-info link-underline link-underline-opacity-0 mr-3"
        );
        badgeEdit.setAttribute("data-id", "edit-" + data[i].id);
        badgeEdit.setAttribute("data-bs-toggle", "modal");
        badgeEdit.setAttribute("data-bs-target", "#myModalEdit");
        badgeEdit.setAttribute("data-title", data[i].title);
        badgeEdit.setAttribute("data-description", data[i].desc);

        article.appendChild(h4);
        article.appendChild(p);
        article.appendChild(badgeDelete);
        article.appendChild(badgeEdit);
        badgeDelete.appendChild(document.createTextNode("Delete"));
        badgeEdit.appendChild(document.createTextNode("Edit"));

        todoItem.appendChild(article);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

// fungsi add
const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (title && description) {
    let article = document.createElement("article");
    let badgeDelete = document.createElement("a");
    let badgeEdit = document.createElement("a");
    let p = document.createElement("p");
    let h4 = document.createElement("h4");
    h4.appendChild(document.createTextNode(title));
    p.appendChild(document.createTextNode(description));
    article.setAttribute("class", "border p-3 mt-3");
    article.setAttribute("ondragstart", "drag(event)");
    article.setAttribute("draggable", "true");
    article.setAttribute("id", title + description);
    badgeDelete.setAttribute("href", "#");
    badgeDelete.setAttribute(
      "class",
      "badge bg-danger link-underline link-underline-opacity-0 mr-3"
    );
    badgeDelete.setAttribute("data-id", title + description);
    badgeDelete.setAttribute("data-bs-toggle", "modal");
    badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
    badgeEdit.setAttribute("href", "#");
    badgeEdit.setAttribute(
      "class",
      "badge bg-info link-underline link-underline-opacity-0 mr-3"
    );
    badgeEdit.setAttribute("id", "edit-" + title + description);
    badgeEdit.setAttribute("data-bs-toggle", "modal");
    badgeEdit.setAttribute("data-bs-target", "#myModalEdit");
    badgeEdit.setAttribute("data-title", title);
    badgeEdit.setAttribute("data-description", description);

    article.appendChild(h4);
    article.appendChild(p);
    article.appendChild(badgeDelete);
    article.appendChild(badgeEdit);
    badgeDelete.appendChild(document.createTextNode("Delete"));
    badgeEdit.appendChild(document.createTextNode("Edit"));

    todoItem.appendChild(article);

    const task = {
      id: title + description,
      title: title,
      desc: description,
    };

    const data = JSON.parse(localStorage.getItem("data"));
    data.push(task);

    localStorage.setItem("data", JSON.stringify(data));

    const modalAdd = bootstrap.Modal.getInstance("#myModalAdd");
    modalAdd.hide();

    addForm.reset();
  } else {
    const toastAdd = document.getElementById("liveToastAdd");
    const toast = new bootstrap.Toast(toastAdd);
    toast.show();
  }

  // Check if title & description exist
  // If yes, save item to localStorage
  // Next, render HTML / render DOM
  // If no, show toast
});

// seleksi modal edit
const myModalEdit = document.getElementById("myModalEdit");
// ketika modal edit muncul jalankan fungsi berikut
myModalEdit.addEventListener("show.bs.modal", function (event) {
  //mendapatkan nilai title dan description lama dari event relatedTarget
  let oldTitle = document.getElementById("edit-title");
  let oldDescription = document.getElementById("edit-description");

  oldTitle.value = event.relatedTarget.attributes["data-title"].value;
  oldDescription.value =
    event.relatedTarget.attributes["data-description"].value;

  //ketika tombol edit dklik jalankan fungsi berikut
  //ambil tasks dari localStorage
  tasks = JSON.parse(localStorage.getItem("data"));

  //ambil task dengna nilai berbeda
  let sameTasks = tasks.filter(function (task) {
    return task.title == oldTitle.value;
  });
  //AMBIL TASK yang memiliki nilai berbeda
  let diffTask = tasks.filter(function (task) {
    return oldTitle.value != task.title;
  });

  // let btnEdit = document.getElementById('btn-edit')
  let editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTitle = document.getElementById("edit-title").value;
    let newDescription = document.getElementById("edit-description").value;
    if ((newTitle && newDescription) != "") {
      // console.log(sameValue[0].title)
      //gunakan title untuk menyeleksi element
      document.getElementById(sameTasks[0].id).firstChild.innerHTML = newTitle;
      document.getElementById(
        sameTasks[0].id
      ).firstChild.nextSibling.innerHTML = newDescription;
      document.getElementById(sameTasks[0].id).setAttribute("id", newTitle);
      //untuk memperbaiki bug dimana item yang diedit tidak menampilkan value yang benar
      //   document
      //     .getElementById(oldTitle.value)
      //     .nextSibling.nextSibling.setAttribute("data-id", "id" + newTitle);
      //   document
      //     .getElementById(oldTitle.value)
      //     .nextSibling.nextSibling.nextSibling.setAttribute(
      //       "data-title",
      //       newTitle
      //     );
      //   document
      //     .getElementById(oldTitle.value)
      //     .nextSibling.nextSibling.nextSibling.setAttribute(
      //       "data-description",
      //       newDescription
      //     );

      //buat sebuah object task dengan nilai yang baru
      let newTasks = {
        id: "id" + newTitle,
        title: newTitle,
        desc: newDescription,
      };
      //masukan nilai baru kedalam array data task
      diffTask.push(newTasks);
      localStorage.setItem("data", JSON.stringify(diffTask));
      //tutup modal edit
      const myModalEdit = bootstrap.Modal.getInstance("#myModalEdit");
      myModalEdit.hide();
    } else {
      const toastLiveEdit = document.getElementById("liveToastEdit");
      const toast = new bootstrap.Toast(toastLiveEdit);
      toast.show();
    }
    editForm.reset();
  });
  {
  }
});

// fungsi delete
const modalDelete = document.getElementById("myModalDelete");
modalDelete.addEventListener("show.bs.modal", (event) => {
  const dataId = event.relatedTarget.attributes["data-id"];
  //   console.log(dataId.value);
  const data = JSON.parse(localStorage.getItem("data"));
  const diffTasks = data.filter((d) => d.id != dataId.value);

  const deleteForm = document.getElementById("delete-form");
  deleteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(document.getElementById(dataId.value));
    document.getElementById(dataId.value).classList.add("d-none");
    localStorage.setItem("data", JSON.stringify(diffTasks));

    const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
    myModalDelete.hide();
  });
});

//fugnsi untuk jam
let p = document.getElementById("jam");

function myTime() {
  let jam = new Date();
  p.innerHTML = jam.toLocaleTimeString([], {
    hour12: false,
  });
}
setInterval(myTime, 1000);
