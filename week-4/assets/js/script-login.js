// Harcode login
const formLogin = document.getElementById("form-login")
const btnLogin = document.getElementById("btn-login")

//prevent form submit
formLogin.addEventListener("submit", function(event){
    event.preventDefault()
})
//ambil data dari json kemudian
//login when click button
window.onload = function (){
    let  xhr = new XMLHttpRequest();
    let url = "/data/data-user.json"; //ganti nama file sesuai nama file json kalian
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let data = JSON.parse(this.response)
            console.log(data)
            //seleksi elemen
            btnLogin.addEventListener("click", function(){
                let loginEmail = document.getElementById("login-email").value
                let loginPassword = document.getElementById("login-password").value
                if((loginEmail && loginPassword) != ''){
                    if((loginEmail == data.email) && (loginPassword == data.password)){
                        //gunakan session storage untuk menyimpan data user
                        sessionStorage.setItem("isLogin", true)
                        window.location.href = "/index.html";
                    }else{
                        const toastLive= document.getElementById("liveToast");
                        const toastMsg = document.getElementById("toast-body")
                        toastMsg.innerHTML = "Email atau password salah"
                        const toast = new bootstrap.Toast(toastLive);
                        toast.show();
                    }
                }else{
                    const toastLive= document.getElementById("liveToast");
                    const toastMsg = document.getElementById("toast-body")
                    toastMsg.innerHTML = "Mohon mengisi form login dengan benar!"
                    const toast = new bootstrap.Toast(toastLive);
                    toast.show();
                }
            })
            
            
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}



