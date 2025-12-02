document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const question_type = document.querySelector("#question_type")
    const pivote = document.querySelector("#pivote");
    const submit = document.querySelector("#submit");

    question_type.textContent = params.get("type")

    if (params.get("type") != "MBTI") {
        pivote.style.display = 'none'
    }



    submit.addEventListener("click", function (e) {
        const fomrData = new FormData(document.querySelector("form"))
        const jsonData = Object.fromEntries(fomrData.entries());

        const data = {
            "questions" : [
                {
                    "question" : jsonData.question,
                    "tag" : jsonData.tag,
                    "type" : jsonData.type,
                    "pivote" : jsonData.pivote
                }
            ]
        }

        console.log(data)
        e.preventDefault()
        fetch(BASEURL + "/api/v1/" + params.get("type") + "/questions/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body : JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.statuscode == 201) {
                    alert("با موفقیت ذخیره شد")
                    window.location.href = "/portal/"
                }
            })
    })
})