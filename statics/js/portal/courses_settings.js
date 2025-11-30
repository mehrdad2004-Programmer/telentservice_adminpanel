document.addEventListener("DOMContentLoaded", function(){
    const content = document.querySelector("#content");
    const submit = document.querySelector("#submit");

    // Function to attach event listeners to delete buttons
    function attachDeleteListeners() {
        const delButtons = document.querySelectorAll(".delbutton");
        console.log("Delete buttons found:", delButtons.length);
        
        delButtons.forEach(button => {
            button.addEventListener('click', function(e){
                e.preventDefault();
                const rowId = this.getAttribute("row-id");
                
                if(confirm("آیا اطمینان دارید؟")){
                    fetch("http://localhost:8000/api/v1/Courses/deleteCourses?id=" + rowId, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.statuscode == 200){
                            alert("با موفقیت حذف شد");
                            // Optional: Remove the row from DOM or reload the page
                            location.reload();
                        } else {
                            alert("خطا در حذف - " + data.statuscode);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert("خطا در ارتباط با سرور");
                    });
                }
            });
        });
    }

    // Getting courses
    fetch("http://localhost:8000/api/v1/Courses/getCourses")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        let counter = 0;
        data.msg.forEach(item => {
            counter++;
            content.innerHTML += `
                <tr>
                    <td>${counter}</td>
                    <td>${item.course_name}</td>
                    <td>${item.mbti_tags}</td>
                    <td>${item.holland_tags}</td>
                    <td>${item.gardner_tags}</td>
                    <td>${item.description}</td>
                    <td>
                        <a href="courses_op.html?op=update&id=${item.id}" class="btn btn-primary" row-id='${item.id}'>ویرایش</a>
                        <div style='height:10px;width:20px'></div>
                        <a href="#" class="btn delbutton btn-danger" row-id='${item.id}'>حذف</a>
                    </td>
                </tr>
            `;
        });

        // Attach event listeners AFTER the HTML is rendered
        attachDeleteListeners();
    })
    .catch(error => {
        console.error('Error fetching courses:', error);
        alert("خطا در دریافت اطلاعات دوره ها");
    });

});