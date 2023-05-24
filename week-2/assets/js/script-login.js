const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email-address").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    // Redirect to TODO page
    if (email == "john@gmail.com" && password == "12345") {
      window.location.href = "/index.html";
    } else {
      window.alert("Email / password salah!");
    }
  } else {
    window.alert("Email / password tidak boleh kosong!");
  }
});
