const formRegistration = document.getElementById("form-registration")
const btnRegis = document.getElementById("btn-reg")

//prevent form submit
formRegistration.addEventListener("submit", function(event){
    event.preventDefault()
})

//memanggil toast pada registration page
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
  toastTrigger.addEventListener('click', () => {
    const toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
  })
}

// btnRegis.addEventListener("click", function(event){
//     event.preventDefault
//     let email = document.getElementById('email').value
//     let nama = document.getElementById('nama').value
//     let password = document.getElementById('password').value
//     let confirm_password = document.getElementById('confirm_password').value
//     if((email && nama && password) != ''){
//         if(password == confirm_password){
//             window.location.href = "/login.html"
//         }else{
//             alert("Mohon maaf password anda tidak sama")
//         }
//     }else{
//         alert("Masukan data dengan benar!")
//     }
// })