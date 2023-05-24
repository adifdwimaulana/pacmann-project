const btnRegister = document.getElementById("btn-register");

btnRegister.addEventListener("click", (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email-address").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // All inputs should be filled
  if (fullname && email && password && confirmPassword) {
    // Password & confirmPassword should be matched
    if (password != confirmPassword) {
      window.alert("Password should be matched!");
    } else {
      window.location.href = "/login.html";
    }
  } else {
    window.alert("Form harus diisi lengkap!");
  }
});
