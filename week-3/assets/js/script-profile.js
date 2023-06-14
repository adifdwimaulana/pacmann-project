//jam
let p = document.getElementById("jam");

const isLogin = sessionStorage.getItem("isLogin");
if (!isLogin) {
  window.location.href = "/login.html";
}

function myTime() {
  let jam = new Date();
  p.innerHTML = jam.toLocaleTimeString([], {
    hour12: false,
  });
}
setInterval(myTime, 1000);
