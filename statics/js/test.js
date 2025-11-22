document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector("#content");
    const submit = document.querySelector("#submit");

    async function fetchData(url, requestMethod = "GET", requestBody = null) {
        const response = await fetch(url, {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: requestBody
        });

        return response;
    }

    let currentFetch = Promise.resolve();

    // QUESTION TYPES
    const questionTypes = ["MBTI", "Holland", "Gardner"];

    // ALL QUESTIONS
    let allQuestions = [];

    // GETTING ALL TYPE QUESTIONS
    questionTypes.forEach(item => {
        currentFetch = currentFetch.then(() => {
            return fetchData("http://localhost:8000/api/v1/" + item + "/questions/get")
                .then(response => response.json())
                .then(data => {
                    data.msg.forEach(item2 => {
                        item2.q_type = item;
                        allQuestions.push(item2);
                    })
                })
        })
    });

    currentFetch.then(() => {
        allQuestions.forEach((item, index) => {
            content.innerHTML += `
        <div class="container mt-3 shadow p-3 rounded rounded-3 border border-2">
            <div class="container">
                <span>${index + 1}) </span>
                <label>${item.question}</label>
            </div>
            <div class="container mt-3">

                <div class="container">
                    <input type="radio" class='ans' pivote="${item.pivote}" q-id="${item.id}" ans_type="${item.type}" name="${index+1}" q-type="${item.q_type}" value="1"> 
                    <label>بسیار ضعیف</label>
                </div>

                <div class="container">
                    <input type="radio" class='ans' pivote="${item.pivote}" q-id="${item.id}" ans_type="${item.type}" name="${index+1}" q-type="${item.q_type}" value="2"> 
                    <label>ضعیف</label>
                </div>

                <div class="container">
                    <input type="radio" class='ans' pivote="${item.pivote}" q-id="${item.id}" ans_type="${item.type}" name="${index+1}" q-type="${item.q_type}" value="3"> 
                    <label>متوسط</label>
                </div>

                <div class="container">
                    <input type="radio" class='ans' pivote="${item.pivote}" q-id="${item.id}" ans_type="${item.type}" name="${index+1}" q-type="${item.q_type}" value="4"> 
                    <label>خوب</label>
                </div>

                <div class="container">
                    <input type="radio" class='ans' pivote="${item.pivote}" q-id="${item.id}" ans_type="${item.type}" name="${index+1}" q-type="${item.q_type}" value="5"> 
                    <label>عالی</label>
                </div>

            </div>
        </div>
            `;
        });
    });


    // -----------------------------------------
    //         SUBMIT – JSON BUILDER
    // -----------------------------------------
    submit.addEventListener('click', function (e) {
        e.preventDefault();

        let sampleJson = {
            "MBTI": {
                "EI": [],
                "SN": [],
                "TF": [],
                "JP": []
            },
            "Holland": [],
            "Gardner": []
        };

        let ans = document.querySelectorAll(".ans");

        ans.forEach(radio => {
            if (radio.checked) {

                const qType = radio.getAttribute("q-type");
                const qId = radio.getAttribute("q-id");
                const score = radio.value;
                const answerType = radio.getAttribute("ans_type");
                const category = radio.getAttribute("pivote"); // EI, SN, TF, JP

                const answerObject = {
                    "q_id": parseInt(qId),
                    "score": parseInt(score),
                    "type": answerType
                };

                if (qType === "MBTI") {
                    if (sampleJson.MBTI[category]) {
                        sampleJson.MBTI[category].push(answerObject);
                    }
                } else if (qType === "Holland") {
                    sampleJson.Holland.push(answerObject);
                } else if (qType === "Gardner") {
                    sampleJson.Gardner.push(answerObject);
                }
            }
        });

        fetchData("http://localhost:8000/api/v1/systematic/recommendation", "POST", JSON.stringify(sampleJson))
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    });

});
