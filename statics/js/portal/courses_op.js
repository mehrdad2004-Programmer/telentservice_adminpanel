document.addEventListener("DOMContentLoaded", function () {
    //inserting courses
    submit.addEventListener("click", function (e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);

        const formdata = new FormData(document.querySelector("form"))
        let jsonData = {};

        let url = "";
        let method = "";

        console.log(urlParams.get("op"))

        switch(urlParams.get("op")){
            case "add":
                url = "http://localhost:8000/api/v1/Courses/insertCourses";
                method = "POST";
                break;
            case "update":
                url = "http://localhost:8000/api/v1/Courses/updateCourses";
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