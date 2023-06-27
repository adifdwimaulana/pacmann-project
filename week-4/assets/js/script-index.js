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
  var data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
}
//cek apakah user sudah login. jika belum redirect ke halaman login
let getIsLogin = sessionStorage.getItem("isLogin")
if(!getIsLogin){
  window.location.href = "/login.html";
}
//GET DATA FROM JSON
//seleksi todoITEM untuk menampung selurush item
let todoItem = document.getElementById("todo");
//fungsi dijalankan ketika window berhasil load
window.onload = function () {
  //buat object ajax dan url data
  let xhr = new XMLHttpRequest();
  let url = "/data/data-task.json"; //ganti nama file sesuai nama file json kalian
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //masukan response kedalam local storage
      //ambil data dari local storage
      let getData = JSON.parse(localStorage.getItem("data"));
      //cek jika tidak ada data pada localstorage ambil dari json
      if (getData == null) {
        localStorage.setItem("data", this.response);
        getData = JSON.parse(localStorage.getItem("data"));
      }
      //looping seluruh data untuk menampilkan data pada browser
      for (let i = 0; i < getData.length; i++) {
        //artikel akan menjadi elemen parent yang akan menampung data
        let article = document.createElement("article");
        //buat button yang akan menampung tombol aksi
        let badgeDelete = document.createElement("button");
        let badgeEdit = document.createElement("button");

        //buat element paragraf dan header 4
        let h4 = document.createElement("h4");
        let p = document.createElement("p");
        //buat title dan description dari data menjadi child text node pada h4 dan p
        // console.log(data[0].tasks[i].title)
        h4.appendChild(document.createTextNode(getData[i].title));
        h4.setAttribute("id", getData[i].title);
        p.appendChild(document.createTextNode(getData[i].desc));

        //tambahkan konfigurasi html pada artkel
        article.setAttribute("class", "border p-3 mt-3");
        article.setAttribute("ondragstart", "drag(event)");
        article.setAttribute("draggable", "true");
        //berikan attribute id pada artikel
        article.setAttribute("id", getData[i].id);

        //konfigurasi attribute untuk tombol edit dan
        badgeDelete.setAttribute("href", "#");
        badgeDelete.setAttribute("class", "badge bg-danger ");
        badgeDelete.setAttribute("data-id", getData[i].id);
        badgeDelete.setAttribute("data-bs-toggle", "modal");
        badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
        badgeEdit.setAttribute("href", "#");
        badgeEdit.setAttribute("class", "badge bg-info ");
        badgeEdit.setAttribute("data-title", getData[i].title);
        badgeEdit.setAttribute("data-description", getData[i].desc);
        badgeEdit.setAttribute("data-bs-toggle", "modal");
        badgeEdit.setAttribute("data-bs-target", "#myModalEdit");

        //append element h4, p , tombol hapus, dan edit menjadi anak artikel
        article.appendChild(h4);
        article.appendChild(p);
        article.appendChild(badgeDelete);
        article.appendChild(badgeEdit);
        //buat tombol delete dan edit memiliki tulisan "delete" dan "edit"
        badgeDelete.appendChild(document.createTextNode("Delete"));
        badgeEdit.appendChild(document.createTextNode("Edit"));

        //append artikel kedalam sebuah todoITem
        todoItem.appendChild(article);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
};

//Fungsi ADD
//seleksi tombol tambah
const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", function (event) {
  event.preventDefault()
  //seleksi nilai dari input title dan description
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  //buat elemen artikel yang akan menampung task item
  let article = document.createElement("article");
  //seleksi form untuk mereset form setelah diisi
  let addForm = document.getElementById("add-form");

  //cek apakah title dan description itu kosong atau tidak
  if ((title && description) != "") {
    //buat elemen tombol dan paragraf dan h eader 4
    let badgeDelete = document.createElement("button");
    let badgeEdit = document.createElement("button");
    let p = document.createElement("p");
    let h4 = document.createElement("h4");
    h4.setAttribute("id", title);
    //berikan nilai dari title dan description pada h4 dan p
    h4.appendChild(document.createTextNode(title));
    p.appendChild(document.createTextNode(description));

    //konfigurasu pada html artikel, hapus dan edit
    article.setAttribute("class", "border p-3 mt-3");
    article.setAttribute("ondragstart", "drag(event)");
    article.setAttribute("draggable", "true");
    article.setAttribute("id", "id" + title);
    badgeDelete.setAttribute("href", "#");
    badgeDelete.setAttribute("class", "badge bg-danger ");
    badgeDelete.setAttribute("data-id", title + description);
    badgeDelete.setAttribute("data-bs-toggle", "modal");
    badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
    badgeEdit.setAttribute("data-bs-toggle", "modal");
    badgeEdit.setAttribute("data-bs-target", "#myModalEdit");
    badgeEdit.setAttribute("href", "#");
    badgeEdit.setAttribute("class", "badge bg-info ");
    badgeEdit.setAttribute("data-title", title);
    badgeEdit.setAttribute("data-description", description);
    badgeEdit.setAttribute("data-bs-toggle", "modal");
    badgeEdit.setAttribute("data-bs-target", "#myModalEdit");

    //append h4 p hapus dan edit ke artikel
    article.appendChild(h4);
    article.appendChild(p);
    article.appendChild(badgeDelete);
    article.appendChild(badgeEdit);
    //berikan tombol hapus dan edit tulisan "delete" dan "edit"
    badgeDelete.appendChild(document.createTextNode("Delete"));
    badgeEdit.appendChild(document.createTextNode("Edit"));

    //jadikan artikel anak dari todoITEM
    todoItem.appendChild(article);

    //buat sebuah object task berdasarkan task baru
    let tasks = {
      id: "id" + title,
      title: title,
      desc: description,
    };
    //ambil data task dari localstorage
    let data = JSON.parse(localStorage.getItem("data"));
    //masukan data task kedalam array data dari localstorage
    data.push(tasks);
    //masukan array yang baru ditambahkan data pada localstorage
    localStorage.setItem("data", JSON.stringify(data));

    //close the modal after adding data
    const myModalAdd = bootstrap.Modal.getInstance("#myModalAdd");
    myModalAdd.hide();

    //reset form
    addForm.reset();
  } else {
    const toastLiveExample = document.getElementById("liveToastAdd");
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
  }
});

//fungsi DELETE
// seleksi elemen modal delete
const myModalDelete = document.getElementById("myModalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
  //mendeteksi elemen yang diklik user
  let dataId = event.relatedTarget.attributes["data-id"]
  console.log(dataId)

  tasks = JSON.parse(localStorage.getItem("data"));
  let diffTask = tasks.filter(function (task) {
    return dataId.value != task.id;
  });

  //seleksi tombol delete pada modal form
  let deleteForm = document.getElementById("delete-form");
  //ketika tombol delte diklik jalankan fungsi hapus
  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    //seleksi elemebt dengan attr id sama dengan task
    document.getElementById(dataId.value).classList.add('d-none');
    //menghapus item task
    localStorage.setItem("data", JSON.stringify(diffTask));

    //close modal
    const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
    myModalDelete.hide();
  });
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
      document.getElementById(sameTasks[0].title).innerHTML = newTitle;
      document.getElementById(sameTasks[0].title).nextSibling.innerHTML =
        newDescription;
      document.getElementById(sameTasks[0].title).setAttribute("id", newTitle);
      //untuk memperbaiki bug dimana item yang diedit tidak menampilkan value yang benar
      document.getElementById(oldTitle.value).nextSibling.nextSibling.setAttribute('data-id', "id"+newTitle)
      document.getElementById(oldTitle.value).nextSibling.nextSibling.nextSibling.setAttribute('data-title', newTitle)
      document.getElementById(oldTitle.value).nextSibling.nextSibling.nextSibling.setAttribute('data-description', newDescription)

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
    }else{
      const toastLiveEdit = document.getElementById("liveToastEdit");
      const toast = new bootstrap.Toast(toastLiveEdit);
      toast.show();
    }
    editForm.reset();
  });{}
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
