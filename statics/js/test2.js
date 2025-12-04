document.addEventListener("DOMContentLoaded", function () {

    let questions = [];
    const q_types = ["MBTI", "Holland", "Gardner"];

    const total = document.querySelector("#total");
    const count = document.querySelector("#count");
    const question = document.querySelector("#question");
    const q_no = document.querySelector("#q_no");
    const answers = document.querySelector("#answers");
    const submit = document.querySelector("#submit");

    const next = document.querySelector("#next");
    const previous = document.querySelector("#previous");

    let q_counter = 0;
    let counter = 0;

    let userAnswers = {};

    submit.style.display = "none";

    // Inject Bootstrap spinner into submit button
    submit.innerHTML = `
        <span id="submitSpinner" class="spinner-border spinner-border-sm me-2 d-none"></span>
        <span id="submitText">اتمام آزمون</span>
    `;

    const spinner = document.querySelector("#submitSpinner");
    const submitText = document.querySelector("#submitText");


    // FETCH QUESTIONS
    q_types.map(async function (item) {
        await fetch("http://localhost:8000/api/v1/" + item + "/questions/get")
            .then(response => response.json())
            .then(data => {

                data.msg.forEach(q => questions.push(q));
                counter++;

                if (counter === q_types.length) {
                    renderQuestion();
                    renderAnswers();
                    updateSubmitVisibility();
                }
            });
    });


    function renderQuestion() {
        total.textContent = questions.length;
        q_no.textContent = q_counter + 1;
        count.textContent = q_counter + 1;
        question.textContent = questions[q_counter].question;
    }


    function renderAnswers() {

        answers.innerHTML = `
            ${renderOption(1)}
            ${renderOption(2)}
            ${renderOption(3)}
            ${renderOption(4)}
            ${renderOption(5)}
        `;

        if (userAnswers[q_counter]) {
            let saved = userAnswers[q_counter];
            let input = document.querySelector(
                `input[name="choice_${q_counter + 1}"][value="${saved}"]`
            );
            if (input) input.checked = true;
        }

        document.querySelectorAll(`input[name="choice_${q_counter + 1}"]`)
            .forEach(radio => {
                radio.addEventListener("change", function () {

                    userAnswers[q_counter] = radio.value;

                    setTimeout(() => {
                        goNextQuestion();
                    }, 300);

                });
            });
    }


    function goNextQuestion() {

        if (q_counter + 1 >= questions.length) {
            updateSubmitVisibility();
            return;
        }

        q_counter++;
        renderQuestion();
        renderAnswers();
        updateSubmitVisibility();
    }


    next.addEventListener("click", function () {

        if (!userAnswers[q_counter]) {
            alert("Please select an answer before moving to next.");
            return;
        }

        if (q_counter + 1 >= questions.length) return;

        q_counter++;
        renderQuestion();
        renderAnswers();
        updateSubmitVisibility();
    });


    previous.addEventListener("click", function () {

        if (q_counter - 1 < 0) return;

        q_counter--;
        renderQuestion();
        renderAnswers();
        updateSubmitVisibility();
    });


    function updateSubmitVisibility() {
        const isLast = q_counter === questions.length - 1;

        if (isLast) {
            submit.style.display = "block";
            next.style.display = "none";
        } else {
            submit.style.display = "none";
            next.style.display = "block";
        }
    }


    // -------------------------------------
    // SUBMIT BUTTON — WITH BOOTSTRAP SPINNER
    // -------------------------------------
    submit.addEventListener("click", function () {

        if (Object.keys(userAnswers).length !== questions.length) {
            alert("Please answer all questions.");
            return;
        }

        // 🔥 Show spinner + disable button
        spinner.classList.remove("d-none");
        submit.disabled = true;

        let sampleJson = {
            "MBTI": { "EI": [], "SN": [], "TF": [], "JP": [] },
            "Holland": [],
            "Gardner": [],
            "fname": localStorage.getItem("fname"),
            "lname": localStorage.getItem("lname"),
            "username": localStorage.getItem("username")
        };

        questions.forEach((q, index) => {
            const score = parseInt(userAnswers[index]);
            const answerObject = {
                q_id: q.id,
                score: score,
                type: q.type
            };

            if (q.q_type === "MBTI") {
                sampleJson.MBTI[q.pivote].push(answerObject);
            } else if (q.q_type === "Holland") {
                sampleJson.Holland.push(answerObject);
            } else if (q.q_type === "Gardner") {
                sampleJson.Gardner.push(answerObject);
            }
        });

        fetch("http://localhost:8000/api/v1/systematic/recommendation", {
            method: "POST",
            body: JSON.stringify(sampleJson),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(r => r.json())
            .then(data => {

                // 🔥 Hide spinner + re-enable
                spinner.classList.add("d-none");
                submitText.textContent = "اتمام آزمون";
                submit.disabled = false;

                showModal(data);
            })
            .catch(err => {

                spinner.classList.add("d-none");
                submitText.textContent = "Submit";
                submit.disabled = false;

                alert("Error submitting. Please try again.");
            });

    });


    function showModal(resultData) {

        document.getElementById("res_mbti").textContent = resultData.test_analysis.MBTI;
        document.getElementById("res_holland").textContent = resultData.test_analysis.Holland;
        document.getElementById("res_gardner").textContent = resultData.test_analysis.Gardner;

        document.querySelector("#result_description").textContent = resultData.description;

        let ul = document.getElementById("res_courses");
        ul.innerHTML = "";

        resultData.recommendation.forEach(c => {
            const li = document.createElement("li");
            const a = document.createElement("a");

            a.href = c.url;
            a.textContent = c.course;
            a.target = "_blank";

            a.addEventListener("click", function (e) {
                e.preventDefault();

                fetch("http://localhost:8000/api/v1/Report/insertClicks", {
                    method: "POST",
                    body: JSON.stringify({
                        "username": localStorage.getItem("username"),
                        "course": c.course,
                        "res_id": resultData.id
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                })
                    .then(r => r.json())
                    .then(d => {
                        if (d.statuscode == 201) {
                            window.open(c.url);
                        } else {
                            alert("Error opening course: " + d.statuscode);
                        }
                    });
            });

            li.appendChild(a);
            ul.appendChild(li);
        });

        document.getElementById("resultModal").style.display = "flex";

        document.querySelector("#closemodal").addEventListener('click', function(){
            closeModal();
        })

        function closeModal() {
            document.getElementById("resultModal").style.display = "none";
        }

    }


    function renderOption(val) {
        return `
        <div class="container mt-3">
            <label class="radio">
                <input type="radio" name="choice_${q_counter + 1}" value="${val}" />
                <span class="custom"></span>
                Option ${val}
            </label>
        </div>`;
    }

});
