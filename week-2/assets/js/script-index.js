function dragStart(event) {
  event.dataTransfer.setData("todo", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("todo");
  event.target.appendChild(document.getElementById(data));
}

function allowDrop(event) {
  event.preventDefault();
}

// CRUD
const todo = document.getElementById("todo-item");
const btnAdd = document.getElementById("btn-add");
btnAdd.addEventListener("click", (event) => {
  event.preventDefault();

  const title = window.prompt("Masukkan Judul");
  const description = window.prompt("Masukkan deskripsi");

  const card = document.createElement("div");
  const article = document.createElement("article");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  const btnWrapper = document.createElement("div");
  const btnDelete = document.createElement("button");
  const btnEdit = document.createElement("button");

  card.setAttribute("class", "card p-4 my-1");
  card.setAttribute("draggable", "true");
  card.setAttribute("id", title);
  card.setAttribute("ondragstart", "dragStart(event)");

  h3.appendChild(document.createTextNode(title));
  p.appendChild(document.createTextNode(description));

  article.appendChild(h3);
  article.appendChild(p);

  btnWrapper.setAttribute("class", "d-flex flex-row gap-2");
  btnDelete.setAttribute("type", "button");
  btnDelete.setAttribute("class", "btn btn-danger");
  btnDelete.appendChild(document.createTextNode("Delete"));
  btnEdit.setAttribute("type", "button");
  btnEdit.setAttribute("class", "btn btn-info");
  btnEdit.appendChild(document.createTextNode("Edit"));

  btnWrapper.appendChild(btnDelete);
  btnWrapper.appendChild(btnEdit);

  card.appendChild(article);
  card.appendChild(btnWrapper);

  todo.appendChild(card);
});

function handleEdit(id) {
  const title = window.prompt("Masukkan Judul");
  const description = window.prompt("Masukkan Deskripsi");

  const btnEdit = document.getElementById(id);
  const article = btnEdit.parentNode.parentNode;
  const h3 = article.firstElementChild;
  const p = article.firstElementChild.nextSibling.nextSibling;

  h3.innerHTML = title;
  p.innerHTML = description;
}

function handleDelete(id) {
  const btnDelete = document.getElementById(id);
  const card = btnDelete.parentNode.parentNode.parentNode;

  card.setAttribute("class", "d-none");
}

function showRealtimeClock() {
  const footerTime = document.getElementById("footer-time");
  const time = new Date();
  footerTime.innerHTML = time.toLocaleTimeString([], {
    hour12: false,
  });
}

setInterval(showRealtimeClock, 1000);
