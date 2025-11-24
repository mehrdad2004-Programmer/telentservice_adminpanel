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
            return fetchData(BASEURL + "/api/v1/" + item + "/questions/get")
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

        // -------------------------------
        // 1) Validate that each question has an answer
        // -------------------------------

        // گروه‌بندی رادیوها بر اساس name
        let grouped = {};

        document.querySelectorAll(".ans").forEach(radio => {
            let name = radio.getAttribute("name");
            if (!grouped[name]) grouped[name] = [];
            grouped[name].push(radio);
        });

        // بررسی اینکه برای هر سوال حداقل یک گزینه انتخاب شده باشد
        for (let key in grouped) {
            let hasChecked = grouped[key].some(r => r.checked);

            if (!hasChecked) {
                alert(`لطفاً به سؤال شماره ${key} پاسخ دهید`);
                return; // جلوگیری از ادامه ارسال
            }
        }

        // -------------------------------
        // 2) Build JSON after validation
        // -------------------------------

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

        // -------------------------------
        // 3) Send request
        // -------------------------------

        fetchData(BASEURL + "/api/v1/systematic/recommendation", "POST", JSON.stringify(sampleJson))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                showModal(data)
            });
    });




    function showModal(resultData) {
        // fill modal fields
        document.getElementById("res_mbti").textContent = resultData.test_analysis.MBTI;
        document.getElementById("res_holland").textContent = resultData.test_analysis.Holland;
        document.getElementById("res_gardner").textContent = resultData.test_analysis.Gardner;

        // ⭐ اضافه شدن بخش توضیحات
        document.querySelector("#result_description").textContent = resultData.description;

        // add course list
        let ul = document.getElementById("res_courses");
        ul.innerHTML = ""; // clear old

        resultData.recommendation.forEach(c => {
            let li = document.createElement("li");
            li.textContent = c.course + " (امتیاز: " + c.score + ")";
            ul.appendChild(li);
        });

        // show modal
        document.getElementById("resultModal").style.display = "flex";
    }


    document.querySelector("#closemodal").addEventListener('click', function(){
        closeModal();
    })

    function closeModal() {
        document.getElementById("resultModal").style.display = "none";
    }


});
