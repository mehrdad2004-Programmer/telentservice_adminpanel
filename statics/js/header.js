document.addEventListener('DOMContentLoaded', function(){
    const navbox = document.querySelector("#nav-box");

    navbox.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">
                    <img src="../statics/images/logo/startabad.jpg" height="50px" width="50px">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse p-2" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="report.html">گزارشات</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="courses_settings.html">دوره ها</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="ai_settings.html">تنظیمات AI</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/">خروج از حساب کاربری</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    
    `

})