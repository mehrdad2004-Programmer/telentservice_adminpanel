document.addEventListener("DOMContentLoaded", function(e){
    const provider = document.querySelector("#provider");
    const model = document.querySelector("#model");
    const prompt = document.querySelector("#prompt");


    const data = fetch(BASEURL + "/api/v1/AdminPanel/getAiSettings")
        .then(response => response.json())
        .then(data => {
            provider.textContent = data.msg[0].provider;
            model.textContent = data.msg[0].model;
            prompt.textContent = data.msg[0].prompt
        });
})