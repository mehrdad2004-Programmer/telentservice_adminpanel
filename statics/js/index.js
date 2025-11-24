document.addEventListener("DOMContentLoaded", function () {
    const card = document.querySelector("#card");

    // Function to handle dynamic form and request
    function handleFormRequest(url, method, formContent, callback, extra = {}) {
        // Inject form content into the card
        card.innerHTML = formContent;

        const form = document.querySelector("form");

        // Add event listener to the form for handling the submit event
        form.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData);

            if (formValues.username) {
                localStorage.setItem("username", formValues.username); // Save the username
            }

            // Merge form values with the extra JSON data
            const dataToSend = { ...formValues, ...extra };

            // Make the fetch request with the provided URL and method
            fetch(url, {
                method: method,  // Use the method specified (POST, PATCH, PUT, etc.)
                headers: {
                    "Content-Type": "application/json",  // Set the content type as JSON
                    "Accept": "application/json"
                },
                // Only include the body if the method is POST, PATCH, PUT, or other body-accepting methods
                body: (method === "POST" || method === "PATCH" || method === "PUT") ? JSON.stringify(dataToSend) : null
            })
                .then(response => response.json())
                .then(data => {
                    callback(data); // Execute the callback function on successful response
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        });
    }



    // Function to update content based on the current hash or URL
    function updateContent() {
        const hash = window.location.hash;

        switch (hash) {
            case "#forgetPassword":
                const forgetPasswordContent = `
                    <div class="container mt-4">
                        <div class="container text-center">
                            <span>فراموشی رمز عبور</span>
                        </div>
                        <div class="container mt-3">
                            جهت فراموشی رمزعبور، لطفا نام کاربری خود را وارد نمایید
                        </div>
                        <form method="get" id="form2" class="mt-3">
                            <div>
                                <label>نام کاربری</label>
                                <div class="mt-2">
                                    <input type="text" name="username" id="username" class="form-control container" required>
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="ارسال پیامک"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                // Use the dynamic handler for the forgetPassword case
                handleFormRequest(BASEURL + "/api/v1/OTP/getCode?username=" + localStorage.getItem("username"), "GET", forgetPasswordContent, function (data) {
                    if (data.statuscode == 200) {
                        window.location.href = "#OTP";  // Go to OTP page
                    } else {
                        alert("مشکلی در ارتباط با سرور ایجاد شد");
                    }
                });
                break;

            case "#newPassword":
                const newPasswordContent = `
                    <div class="container mt-4">
                        <div class="container text-center">
                            <span> تنظیم مجدد رمز عبور</span>
                        </div>
                        <div class="container mt-3">
                            رمز عبور خود را با دقت وارد نمایید
                        </div>
                        <form method="post" id="form2" class="mt-3">
                            <div>
                                <label>رمزعبور</label>
                                <div class="mt-2">
                                    <input type="password" name="password" id="password" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-3">
                                <label>تکرار رمز</label>
                                <div class="mt-2">
                                    <input type="password" name="repass" id="repass" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="تایید"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                // Use the dynamic handler for the newPassword case
                handleFormRequest(BASEURL + "/api/v1/AuthSystem/changePassword", "PATCH", newPasswordContent, function (data) {
                    if (data.statuscode == 200) {
                        window.location.href = "#successPage"; // Redirect to success page
                    } else {
                        alert("مشکلی در تنظیم رمز عبور پیش آمد");
                    }
                }, {
                    "username" : localStorage.getItem("username")
                });
                break;

            case "#OTP":
                const otpContent = `
                    <div class="container mt-4">
                        <div class="container text-center">
                            <span>رمز یکبار مصرف</span>
                        </div>
                        <form method="get" id="form2" class="mt-3">
                            <div>
                                <label>رمز یکبار مصرف را وارد کنید</label>
                                <div class="mt-2">
                                    <input type="text" name="code" id="code" class="form-control container" required>
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="تایید"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                // Use the dynamic handler for the OTP case
                handleFormRequest(BASEURL + "/api/v1/OTP/checkCode", "POST", otpContent, function (data) {
                    if (data.statuscode == 200) {
                        window.location.href = "#newPassword";
                    } else {
                        alert("کد یکبار مصرف نامعتبر است");
                    }
                }, {
                    "username": localStorage.getItem("username")
                });
                break;

            default:
                const defaultContent = `
                    <div class="container mt-4">
                        <div class="container text-center">
                            <div>
                                <img src="statics/images/logo/startabad.jpg" class="logo">
                            </div>
                            <div class="mt-4">
                                <span> موسسه آموزشی استارت آباد </span>
                            </div>
                            <div class="mt-2">
                                <span>پورتال مدیریت آزمون های استعداد سنجی</span>
                            </div>
                        </div>
                        <form method="post" id="form1" class="mt-3">
                            <div>
                                <label>نام کاربری</label>
                                <div class="mt-2">
                                    <input type="text" name="username" id="username" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-3">
                                <label>رمزعبور</label>
                                <div class="mt-2">
                                    <input type="password" name="password" id="password" class="form-control container">
                                </div>
                            </div>

                            <div class="container mt-3">
                                <a href="#forgetPassword" class="text-decoration-none" id="forgetPassLib">فراموشی رمزعبور</a>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="ورود"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                // Use the dynamic handler for the default case (login form)
                handleFormRequest(BASEURL + "/api/v1/AuthSystem/login", "POST", defaultContent, function (data) {
                    if (data.statuscode == 200) {
                        alert("Login successful");
                        window.location.href = "/portal/index.html";
                    } else {
                        alert("Incorrect username or password.");
                    }
                });
                break;
        }
    }

    // Initial content update when the page loads
    updateContent();

    // Event listener for hashchange to update content dynamically
    window.addEventListener('hashchange', updateContent);
});
