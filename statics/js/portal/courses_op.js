document.addEventListener("DOMContentLoaded", function () {


    const urlParams = new URLSearchParams(window.location.search);

    const inputs = {
        "course_name" : document.querySelector("#course_name"),
        "mbti_tags" : document.querySelector("#mbti_tags"),
        "holland_tags" : document.querySelector("#holland_tags"),
        "gardner_tags" : document.querySelector("#gardner_tags"),
        "description" : document.querySelector("#description")        
    }

    //getting specific course data by its id
    fetch(BASEURL + "/api/v1/Courses/getCourses?id=" + urlParams.get("id"))
        .then(response => response.json())
        .then(data => {
            inputs.course_name.value = data.msg.course_name,
            inputs.mbti_tags.value = data.msg.mbti_tags,
            inputs.holland_tags.value = data.msg.holland_tags,
            inputs.gardner_tags.value = data.msg.gardner_tags,
            inputs.description.value = data.msg.description
        })
    //inserting courses
    submit.addEventListener("click", function (e) {
        e.preventDefault();


        const formdata = new FormData(document.querySelector("form"))
        let jsonData = {};

        let url = "";
        let method = "";

        console.log(urlParams.get("op"))

        switch(urlParams.get("op")){
            case "add":
                url = BASEURL + "/api/v1/Courses/insertCourses";
                method = "POST";
                break;
            case "update":
                url = BASEURL + "/api/v1/Courses/updateCourses";
                method = "PATCH";
                break;
        }

        for (const [key, val] of formdata.entries()) {
            jsonData[key] = val
        }

        jsonData['id'] = urlParams.get("id");

        console.log(jsonData);
        fetch(
            url,
            {
                method: method,
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.statuscode == 201 || data.statuscode == 200) {
                    alert("با موفقیت ثبت شد")
                    window.location.href= "/portal/courses_settings.html";
                } else {
                    alert("مشکلی در ثبت پیش آمد - " + data.statuscode)
                }
            })
    })
})