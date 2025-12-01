document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector("#content")
    const submit = document.querySelector("#submit");
    const courses_box = document.querySelector("#courses");
    const count = document.querySelector("#count");
    
    fetch(BASEURL + "/api/v1/Courses/getCourses",{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
        }
    })
        .then(response => response.json())
        .then(data => {
            data.msg.forEach(item => {
                console.log(item.course_name)
                courses_box.innerHTML += `
                    <option>${item.course_name}</option>
                `
            })
        })

    submit.addEventListener("click", function (e) {
        e.preventDefault();

        const inputs = {
            "lname": document.querySelector('#lname'),
            "username": document.querySelector("#username"),
            "mbti": document.querySelector("#mbti"),
            "holland": document.querySelector("#holland"),
            "gardner": document.querySelector("#gardner"),
            "courses": document.querySelector("#courses")
        }

        console.log(inputs)

        let url = BASEURL + "/api/v1/Report/getReport?"

        Object.entries(inputs).forEach(([key, val]) => {
            if (key === 'courses' && (!val.value || val.value === "none")) {
                // Skip this key if 'courses' has no value or it's null
                return;
            }
            
            if (val.value) {
                url += key + "=" + val.value + "&";
            }
        });


        console.log(url);

        url.trim("&")

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.statuscode == 200) {
                    count.textContent = data.count
                    content.innerHTML = ""
                    data.msg.forEach(item => {
                        if(!(item.mbti)){
                            content.innerHTML = `
                                <div class="text-center mt-5 fw-bold">
                                    <span>no rows found</span>
                                </div>
                            `
                        }
                        content.innerHTML += `
                            <details class="p-1 rounded-3 border border-2 mt-3">
                                <summary>
                                    <span>${item.mbti.fname} ${item.mbti.lname}</span>
                                </summary>
                                <div class="container mt-3">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>MBTI</th>
                                                <th>GARDNER</th>
                                                <th>HOLLAND</th>
                                                <th>COURSES</th>
                                                <th>ANALYSIS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <td>${item.mbti.analysis}</td>
                                            <td>${item.gardner.analysis}</td>
                                            <td>${item.holland.analysis}</td>
                                            <td>${item.courses}</td>
                                            <td>${item.analysis}</td>
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        `
                    })

                } else if (data.statuscode == 404) {
                    count.textContent = data.count
                    content.innerHTML = `
                        <div class="text-center mt-5 fw-bold">
                            <span>no rows found</span>
                        </div>
                    `
                }
                else {
                    count.textContent = data.count
                    alert("مشکلی در جستجو پیش آمد - " + data.statuscode)
                }
            })
    })

})