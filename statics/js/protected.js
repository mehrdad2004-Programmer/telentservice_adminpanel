console.log(sessionStorage.getItem('auth-token'))
if(!sessionStorage.getItem("auth-token")){
    window.location.href = "/"
}