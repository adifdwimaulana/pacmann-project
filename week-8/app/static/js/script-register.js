const API_HOST = "http://127.0.0.1:5000/api";
const formRegister = document.getElementById("form-register");

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  const xhr = new XMLHttpRequest();
  const url = API_HOST + "/auth/register";

  const name = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  const toastLive = document.getElementById("liveToast");
  const toastMsg = document.getElementById("toast-body");
  toastMsg.innerHTML = "Form tidak boleh kosong!";
  const toast = new bootstrap.Toast(toastLive);

  if (!name || !email || !password || !confirmPassword) return toast.show();
  if (password != confirmPassword) {
    toastMsg.innerHTML = "Password yang dimasukkan tidak cocok!";
    return toast.show();
  }

  const data = JSON.stringify({
    name: name,
    email: email,
    password: password,
  });

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  xhr.onreadystatechange = function () {
    if (this.status == 200) {
      const toastLiveSuccess = document.getElementById("liveToastSuccess");
      const toastMsgSuccess = document.getElementById("toast-body-success");
      toastMsgSuccess.innerHTML = "Data berhasil dimasukkan!";
      const toastSuccess = new bootstrap.Toast(toastLiveSuccess);
      toastSuccess.show();

      formRegister.reset();
    } else {
      toastMsg.innerHTML = this.response;
      toast.show();
    }
  };

  xhr.send(data);
});
