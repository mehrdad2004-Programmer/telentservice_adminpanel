console.log("session is " + sessionStorage.getItem('auth-token'))
if(!sessionStorage.getItem("auth-token")){
    window.location.href = "/"
}