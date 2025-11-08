
//hidden parts
document.addEventListener("DOMContentLoaded", function () {

    const form1 = document.querySelector("#form1");
    const form2 = document.querySelector("#form2");

    const div_form1 = document.querySelector("#div_form1")
    const div_form2 = document.querySelector("#div_form2")

    const forgetPassLink = document.querySelector("#forgetPassLib")

    const card = document.querySelector("#card")

    function updateContent() {
        const hash = window.location.hash;

        switch (hash) {
            case "#forgetPassword":
                card.innerHTML = `
                    <div class="container mt-4" id="div_form2">
                        <div class="container text-center">
                            <span>فراموشی رمز عبور</span>
                        </div>
                        <div class="container mt-3">
                            جهت فراموشی رمزعبور، لطفا نام کاربری خود را وارد نمایید
                        </div>
                        <form method="post" id="form2" class="mt-3">
                            <div>
                                <label>نام کاربری</label>
                                <div class="mt-2">
                                    <input type="text" name="username" id="username" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="ارسال پیامک"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                break;

            case "#newPassword":
                card.innerHTML = `
                    <div class="container mt-4" id="div_form2">
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
                                    <input type="text" name="password" id="password" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-3">
                                <label>تکرار رمز</label>
                                <div class="mt-2">
                                    <input type="text" name="repass" id="repass" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="تایید"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                break;
            case "#OTP":
                card.innerHTML = `
                    <div class="container mt-4" id="div_form2">
                        <div class="container text-center">
                            <span>رمز یکبار مصرف</span>
                        </div>
                        <form method="post" id="form2" class="mt-3">
                            <div>
                                <label>رمز یکبار مصرف را وارد کنید</label>
                                <div class="mt-2">
                                    <input type="text" name="password" id="password" class="form-control container">
                                </div>
                            </div>
                            <div class="mt-2">
                                <input type="submit" name="submit" id="submit" value="تایید"
                                    class="btn btn-primary form-control container mt-3">
                            </div>
                        </form>
                    </div>
                `;
                break;

            default:
                card.innerHTML = `
                    <div class="container mt-4" id="div_form1">
                        <div class="container text-center">
                            <div>
                                <img src="statics/images/logo/startabad.jpg" class="logo">
                            </div>
                            <div class="mt-4">
                                <span>
                                    موسسه آموزشی استارت آباد
                                </span>
                            </div>
                            <div class="mt-2">
                                <span>
                                    پورتال مدیریت آزمون های استعداد سنجی
                                </span>
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
                break;
        }
    }

    updateContent();
    window.addEventListener('hashchange', updateContent);





    form1.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.querySelector("#username");
        const password = document.querySelector("#password");

        fetch("http://localhost:8000/api/v1/AuthSystem/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "Application/json",
                "Credentials": "include"
            },
            body: JSON.stringify({
                "username": username.value,
                "password": password.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.statuscode == 200) {
                    alert("خوش آمدید");
                    window.location.href = "/portal/index.html";
                    return;
                }

                alert("نام کاربری یا رمز عبور اشتباه است")
            })
    })
});


