//cek apakah user sudah login. jika belum redirect ke halaman login
let getIsLogin = sessionStorage.getItem("isLogin")
if(!getIsLogin){
  window.location.href = "/login.html";
}

//get profile data
window.onload = function (){
    let  xhr = new XMLHttpRequest();
    let url = "/data/data-profile.json"; //ganti nama file sesuai nama file json kalian
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let data = JSON.parse(this.response)
            console.log(data)
            //seleksi elemen
            let profile_picture = document.getElementById("profile_picture")
            profile_picture.setAttribute("src", data.profile_picture)
            let name = document.getElementById("name")
            name.innerHTML = "Halo Nama Saya " + data.name
            let biography = document.getElementById("biography")
            biography.innerHTML =  data.biography
            let total_task = document.getElementById("total_task")
            total_task.innerHTML = data.task_detail.total_task
            let task_done = document.getElementById("task_done")
            task_done.innerHTML = data.task_detail.task_done
            let task_on_progress = document.getElementById("task_on_progress")
            task_on_progress.innerHTML = data.task_detail.task_on_progress
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}




//jam
let p = document.getElementById("jam")

function myTime(){
    let jam = new Date()
    p.innerHTML = jam.toLocaleTimeString([], {
        hour12:false
    })
}
setInterval(myTime, 1000)
