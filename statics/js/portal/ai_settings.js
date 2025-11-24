const provider = document.querySelector("#provider");
const model = document.querySelector("#model");
const parentProvider = document.querySelector("#provider-parent");
const prompt = document.querySelector("#prompt");
const p_box = document.querySelector("#p-box")

const form = document.querySelector("form");
const submit = document.querySelector("#submit");

// کنترل نمایش و عدم نمایش prompt
function handlePromptVisibility() {
    if (provider.value === "SmartSupport") {
        prompt.style.display = "none";
        p_box.style.display = 'none';
    } else {
        p_box.style.display = 'block';
        prompt.style.display = "block";
    }
}

provider.addEventListener('change', function (e) {

    // همیشه وضعیت prompt را کنترل کن
    handlePromptVisibility();

    // اگر provider فقط AvalAI باشد مدل‌ها را لود کن
    if (provider.value !== "SmartSupport" && provider.value !== "AIQ" && provider.value !== "none") {

        // Clear existing options first
        model.innerHTML = "";

        // Fetch fresh data each time
        fetch(BASEURL + "/api/v1/AIService/AvalAi/getModels", {
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data);
                
                if (data.msg && data.msg.data && Array.isArray(data.msg.data)) {
                    data.msg.data.forEach(item => {
                        const option = document.createElement("option");
                        option.textContent = item.id || item.model || item.title || "Unknown";
                        option.value = item.id || item.value || item.model || "";
                        model.appendChild(option);
                    });
                } else {
                    console.error('Unexpected data structure:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching models:', error);
                const option = document.createElement("option");
                option.textContent = "Error loading models";
                option.value = "";
                model.appendChild(option);
            });
        
        parentProvider.style.display = "block";
    } 
    else {
        parentProvider.style.display = "none";

        // Clear and add GPT option
        model.innerHTML = "";
        const gptOption = document.createElement("option");
        gptOption.textContent = "GPT";
        gptOption.value = "GPT";
        model.appendChild(gptOption);
        model.value = "GPT";
    }
});


form.addEventListener('submit', function(e){
    e.preventDefault();

    if(!(model.value)){
        model.value = "GPT";
    }

    if(confirm("آیا اطمینان دارید؟")){
        fetch(BASEURL + "/api/v1/AdminPanel/updateAiSettings?id=1&provider=" + provider.value + "&model=" + model.value + "&prompt=" + prompt.value, {
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            }
        }).then(response => response.json())
            .then(data => {
                if(data.statuscode == 200){
                    alert("با موفقیت بروزرسانی شد");
                    window.location.href = "/portal";
                    return;
                }
                alert("خطا در بروزرسانی ، لطفا مجدد تلاش کنید")
            })
    }
});
