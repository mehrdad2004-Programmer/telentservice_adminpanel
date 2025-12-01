document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector("#content");
    const hash = window.location.hash.split("#")[1];

    fetch(BASEURL + "/api/v1/" + hash + "/questions/get", {
        method: "GET",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.msg.forEach((item, counter) => {
                // Creating a new div element for each item
                const div = document.createElement('div');
                div.classList.add('container', 'shadow', 'p-3', 'rounded-3', 'mt-4');

                // Filling the content inside the div
                div.innerHTML = `
                <div class='container'>
                    <span class="fw-bold">${counter + 1}#</span>
                </div>
                <div class="container mt-3">
                    <div>
                        <label>عنوان سوال</label>
                    </div>
                    <div>
                        <input type="text" name="question" id="question_${counter}" class="form-control mt-2">
                    </div>
                </div>
                <div class="container mt-3">
                    <div>
                        <label>برچسب سوال</label>
                    </div>
                    <div>
                        <input type="text" name="tag" id="tag_${counter}" class="form-control mt-2">
                    </div>
                </div>

                <div class="container d-lg-flex mt-4">
                    <div class="container">
                        <button id="edit_${counter}" class="btn btn-primary container" data-id="${item.id}">ویرایش</button>
                    </div>
                    <div class="container">
                        <button id="delete_${counter}" data-id="${item.id}" class="btn btn-danger container">حذف</button>
                    </div>
                </div>
            `;

                // Append the newly created div to the content
                content.appendChild(div);

                // Set the values using setAttribute after appending the div
                div.querySelector('#question_' + counter).setAttribute('value', item.question);
                div.querySelector('#tag_' + counter).setAttribute('value', item.tag);

                const editButton = document.querySelector(`#edit_${counter}`);
                const delButton = document.querySelector(`#delete_${counter}`);

                // Edit button listener
                editButton.addEventListener("click", function (event) {
                    event.preventDefault(); // Prevent default behavior (page reload)
                    const questionId = this.getAttribute("data-id");
                    const newQuestion = document.querySelector(`#question_${counter}`).value;
                    const newTag = document.querySelector(`#tag_${counter}`).value;

                    console.log("ID:", questionId, "New Question:", newQuestion);

                    if (confirm("آیا اطمینان دارید؟")) {
                        fetch(BASEURL + "/api/v1/" + hash + "/questions/update", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
                            },
                            body: JSON.stringify({
                                "questions": [
                                    {
                                        "id": parseInt(questionId), // Ensure the ID is treated as an integer
                                        "new_question": newQuestion,
                                        "new_tag": newTag
                                    }
                                ]
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.statuscode == 200) {
                                    alert("عملیات موفق")
                                    location.reload();
                                    return;
                                }
                                alert("عملیات ناموفق")
                            })
                            .catch(error => {
                                console.error("Error:", error);
                            });
                    }
                });

                // Delete button listener
                delButton.addEventListener("click", function (event) {
                    event.preventDefault(); // Prevent default behavior (page reload)
                    if (confirm("آیا اطمینان دارید؟")) {
                        // Correct selector here: Use '#' to select the correct button
                        const questionId = this.getAttribute("data-id");

                        fetch(BASEURL + "/api/v1/" + hash + "/questions/delete", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization" : "Bearer " + sessionStorage.getItem("auth-token")
                            },
                            body: JSON.stringify({
                                "questions": [
                                    {
                                        "id": parseInt(questionId) // Ensure the ID is passed as an integer
                                    }
                                ]
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.statuscode == 200) {
                                    alert("عملیات موفق")
                                    location.reload()
                                    return;
                                }
                                alert("عملیات ناموفق")
                            })
                            .catch(error => {
                                console.error("Error:", error);
                            });
                    }

                });
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});
