document.addEventListener("DOMContentLoaded", async function(e){
    const provider = document.querySelector("#provider");
    const model = document.querySelector("#model");
    const prompt = document.querySelector("#prompt");


    const data = await fetch(BASEURL + "/api/v1/AdminPanel/getAiSettings",{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
        }
    })
        .then(response => response.json())
        .then(data => {
            provider.textContent = data.msg[0].provider;
            model.textContent = data.msg[0].model;
            prompt.textContent = data.msg[0].prompt
        });

    

    const tests = ["MBTI", "Holland", "Gardner"];
        
    let counters = {
        "MBTI" : "",
        "Holland" : "",
        "Gardner" : ""
    };

    const fetchData = async () => {
        // Create an array of promises for each fetch request
        const promises = tests.map(($item) => {
            return fetch(BASEURL + "/api/v1/" + $item + "/questions/get")
                .then(response => response.json())
                .then(data => {
                    counters[$item] = data.msg.length;
                });
        });

        // Wait for all fetch requests to finish
        await Promise.all(promises);

        // Now update the DOM after all fetches are done
        const mbti_count = document.querySelector("#mbti_count");
        const holland_count = document.querySelector("#holland_count");
        const Gardner_count = document.querySelector("#gardner_count");

        mbti_count.textContent = counters.MBTI;
        holland_count.textContent = counters.Holland;
        Gardner_count.textContent = counters.Gardner;
    };

    // Call the function to fetch data and update the DOM
    fetchData();

})