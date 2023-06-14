// Harcode login
const formLogin = document.getElementById("form-login");
const btnLogin = document.getElementById("btn-login");

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
});

window.onload = function () {
  const xhr = new XMLHttpRequest();
  const url = "/data/data-user.json";

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.response);

      btnLogin.addEventListener("click", (event) => {
        event.preventDefault();

        let loginEmail = document.getElementById("login-email").value;
        let loginPassword = document.getElementById("login-password").value;

        if (loginEmail == data.email && loginPassword == data.password) {
          sessionStorage.setItem("isLogin", true);
          window.location.href = "/";
        } else {
          const toastLive = document.getElementById("liveToast");
          const toastMsg = document.getElementById("toast-body");
          toastMsg.innerHTML = "Email / password salah";
          const toast = new bootstrap.Toast(toastLive);
          toast.show();
        }
      });
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

// btnLogin.addEventListener("click", function (event) {
//   event.preventDefault;
//   let loginEmail = document.getElementById("login-email").value;
//   let loginPassword = document.getElementById("login-password").value;
//   if ((loginEmail && loginPassword) != "") {
//     if (loginEmail == "admin@mail.com" && loginPassword == "12345678") {
//       window.location.href = "/index.html";
//     } else {
//       window.alert("Email atau Password salah!");
//     }
//   } else {
//     window.alert("Mohon mengisi Form login dengan benar!");
//   }
// });
