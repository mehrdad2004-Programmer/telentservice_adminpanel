document.addEventListener("DOMContentLoaded", function () {
    const provider = document.querySelector("#provider");
    const model = document.querySelector("#model");
    const parentProvider = document.querySelector("#provider-parent");
    const prompt = document.querySelector("#prompt");
    const p_box = document.querySelector("#p-box");

    const form = document.querySelector("form");
    const submit = document.querySelector("#submit");

    // Function to handle visibility of the prompt
    function handlePromptVisibility() {
        if (provider.value === "SmartSupport") {
            prompt.style.display = "none";
            p_box.style.display = 'none';
        } else {
            p_box.style.display = 'block';
            prompt.style.display = "block";
        }
    }

    // Fetch current settings and set them as default
    fetch(BASEURL + "/api/v1/AdminPanel/AiCurrentSettings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Set the default provider value
            provider.value = data.msg[0].provider || "none";

            // Set the default model value (this will be used in the dropdown)


            // Set the prompt value (just displaying it, not a select dropdown)
            prompt.value = data.msg[0].prompt || "";

            // Manually trigger change event to handle prompt visibility and model loading
            handlePromptVisibility();

            // Fetch models for AvalAI if the provider is set to "AvalAI"
            if (provider.value === "AvalAi") {
                fetchModels(true); // Fetch models initially if it's AvalAI
            }

            model.innerHTML = `<option>${data.msg[0].model}</option>` || "GPT";
        });

    // Function to fetch models and update the model dropdown
    function fetchModels(initialFetch = false) {
        model.innerHTML = "";  // Clear existing options

        // Fetch models from the AvalAI API
        fetch(BASEURL + "/api/v1/AIService/AvalAi/getModels", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
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
                    // If fetching models on page load (initialFetch is true), we add them directly
                    data.msg.data.forEach(item => {
                        const option = document.createElement("option");
                        option.textContent = item.id || item.model || item.title || "Unknown";
                        option.value = item.id || item.value || item.model || "";

                        // If this is the initial fetch, select the model that was set
                        if (initialFetch && option.value === model.value) {
                            option.selected = true;
                        }

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
    }

    // Handle provider change
    provider.addEventListener('change', function (e) {
        // Always control the prompt visibility
        handlePromptVisibility();

        // If the provider is AvalAI, load models from AvalAI API
        if (provider.value === "AvalAI") {
            fetchModels();  // Fetch models when switching to AvalAI provider
            parentProvider.style.display = "block";
        }
        else if (provider.value !== "SmartSupport" && provider.value !== "AIQ" && provider.value !== "none") {
            // Clear existing options first
            model.innerHTML = "";

            // Fetch models from another API if the provider is not SmartSupport or AIQ
            fetch(BASEURL + "/api/v1/AIService/AvalAi/getModels", {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
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

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!(model.value)) {
            model.value = "GPT";
        }

        if (confirm("آیا اطمینان دارید؟")) {
            fetch(BASEURL + "/api/v1/AdminPanel/updateAiSettings?id=1&provider=" + provider.value + "&model=" + model.value + "&prompt=" + prompt.value, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            }).then(response => response.json())
                .then(data => {
                    if (data.statuscode == 200) {
                        alert("با موفقیت بروزرسانی شد");
                        window.location.href = "/portal";
                        return;
                    }
                    alert("خطا در بروزرسانی ، لطفا مجدد تلاش کنید");
                });
        }
    });

});
