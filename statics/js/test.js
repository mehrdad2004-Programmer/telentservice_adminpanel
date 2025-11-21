document.addEventListener('DOMContentLoaded', function () {

    // =====================================================================
    //                      STANDARDIZED GARDNER MAPPING
    // =====================================================================
    const GARDNER_MAP = {
        "visual_learning": "L",      // دیداری
        "verbal_communication": "J", // زبانی
        "logical_skills": "M",       // منطقی
        "musical_ability": "S",      // موسیقایی
        "interpersonal_skills": "I", // بین‌فردی
        "intrapersonal_skills": "B", // درون‌فردی
        "bodily_kinesthetic": "K",   // حرکتی
        "naturalist": "N",           // طبیعی
        "auditory_learning": "A"     // شنیداری
    };

    // =====================================================================
    //                           LOAD TEST DATA
    // =====================================================================
    function loadTestData() {
        try {
            const saved = JSON.parse(localStorage.getItem("testData"));
            if (saved) {
                return {
                    MBTI: saved.MBTI || { EI: [], SN: [], TF: [], JP: [] },
                    Holland: saved.Holland || [],
                    Gardner: saved.Gardner || []
                };
            }
        } catch (e) {
            console.error("loadTestData error:", e);
        }
        return {
            MBTI: { EI: [], SN: [], TF: [], JP: [] },
            Holland: [],
            Gardner: []
        };
    }
    let testData = loadTestData();

    // =====================================================================
    //                             DOM ELEMENTS
    // =====================================================================
    const elements = {
        test: document.querySelector("#test"),
        next: document.querySelector("#next"),
        previous: document.querySelector("#previous"),
        content: document.querySelector("#content"),
        analysisSection: document.querySelector("#analysis-section")
    };

    const tests = ["#MBTI", "#Holland", "#Gardner"];

    // =====================================================================
    //                   NAVIGATION + INITIALIZATION
    // =====================================================================
    loadTestBasedOnHash();
    window.addEventListener('hashchange', loadTestBasedOnHash);

    elements.next.addEventListener('click', function (e) {
        e.preventDefault();
        if (validateCurrentTest()) {
            saveCurrentTestData();
            goNext();
        }
    });

    elements.previous.addEventListener('click', function (e) {
        e.preventDefault();
        saveCurrentTestData();
        goPrev();
    });

    function goNext() {
        const i = tests.indexOf(window.location.hash);
        window.location.hash = tests[(i + 1) % tests.length];
    }

    function goPrev() {
        const i = tests.indexOf(window.location.hash);
        window.location.hash = tests[(i - 1 + tests.length) % tests.length];
    }

    // =====================================================================
    //                    ANALYSIS BUTTON HANDLER
    // =====================================================================
    document.addEventListener('click', function (e) {
        if (e.target.id === "analysis-button") {
            e.preventDefault();
            saveCurrentTestData();
            if (validateAllTests()) analyzeTest();
        }
    });

    // =====================================================================
    //                     SAVE WHEN RADIO CHANGES
    // =====================================================================
    document.addEventListener('change', function (e) {
        if (e.target.type === "radio") saveCurrentTestData();
    });

    // =====================================================================
    //                        LOAD TEST BASED ON HASH
    // =====================================================================
    function loadTestBasedOnHash() {
        testData = loadTestData();

        const hash = window.location.hash || "#MBTI";
        const testType = hash.substring(1);

        const index = tests.indexOf(`#${testType}`);
        if (index === -1) {
            window.location.hash = tests[0];
            return;
        }

        elements.test.textContent = testType;

        const prevIndex = (index - 1 + tests.length) % tests.length;
        const nextIndex = (index + 1) % tests.length;

        elements.previous.href = tests[prevIndex];
        elements.next.href = tests[nextIndex];

        if (elements.analysisSection) {
            if (testType === "Gardner") {
                elements.analysisSection.style.display = "block";
                elements.next.style.display = "none";
            } else {
                elements.analysisSection.style.display = "none";
                elements.next.style.display = "block";
            }
        }

        fetchQuestions(testType, elements.content, testData);
    }

    // =====================================================================
    //                           VALIDATION
    // =====================================================================
    function validateCurrentTest() {
        const total = document.querySelectorAll('tbody tr').length;
        const answered = getAnsweredQuestionCount();
        return answered === total;
    }

    function getAnsweredQuestionCount() {
        const names = new Set();
        document.querySelectorAll("input[type=radio]").forEach(r => names.add(r.name));

        let count = 0;
        names.forEach(n => {
            if (document.querySelector(`input[name="${n}"]:checked`)) count++;
        });

        return count;
    }

    function validateAllTests() {
        const data = loadTestData();

        const mbtiTotal = Object.values(data.MBTI).reduce((s, a) => s + a.length, 0);
        if (mbtiTotal === 0) return false;

        if (!data.Holland.length) return false;
        if (!data.Gardner.length) return false;

        return true;
    }

    // =====================================================================
    //                            SAVE ANSWERS
    // =====================================================================
    function saveCurrentTestData() {
        const testType = window.location.hash.substring(1);

        testData = loadTestData();

        const answers = collectAnswers(testType);
        if (!answers) return;

        // 💥 مهم: از این به بعد، کامل جایگزین می‌کنیم، merge نمی‌کنیم
        testData[testType] = answers;
        localStorage.setItem("testData", JSON.stringify(testData));
    }

    function collectAnswers(testType) {
        const radios = document.querySelectorAll("input[type=radio]:checked");
        if (!radios.length) return null;

        return testType === "MBTI"
            ? collectMBTIAnswers(radios)
            : collectSimpleAnswers(radios, testType);
    }

    // =====================================================================
    //                    MBTI USING PIVOT  (NO PREV MERGE)
    // =====================================================================
    function collectMBTIAnswers(radios) {

        // 🔥 از صفر می‌سازیم، نه بر اساس داده‌های قبلی
        const mbti = {
            EI: [],
            SN: [],
            TF: [],
            JP: []
        };

        radios.forEach(radio => {
            const qid = parseInt(radio.name);
            const score = parseInt(radio.value);
            let dim = radio.dataset.type;

            if (!["EI", "SN", "TF", "JP"].includes(dim)) dim = "EI";

            // اگر برای همین سؤال قبلاً چیزی هست حذفش کن
            mbti[dim] = mbti[dim].filter(a => a.q_id !== qid);

            mbti[dim].push({
                q_id: qid,
                score: score,
                type: getMBTITypeLetter(dim, score)
            });
        });

        return mbti;
    }

    function getMBTITypeLetter(dim, score) {
        return {
            EI: score > 3 ? "I" : "E",
            SN: score > 3 ? "N" : "S",
            TF: score > 3 ? "F" : "T",
            JP: score > 3 ? "P" : "J"
        }[dim];
    }

    // =====================================================================
    //               HOLLAND + GARDNER — REBUILD FROM SCRATCH
    // =====================================================================
    function collectSimpleAnswers(radios, testType) {

        // 🔥 هیچ prev ای در کار نیست، هر بار از صفر می‌سازیم
        const answers = [];

        radios.forEach(r => {
            const qid = parseInt(r.name);
            const score = parseInt(r.value);

            let dim = r.dataset.type;

            if (testType === "Gardner") {
                // q.tag یا q.type در رندر به data-type داده شده
                dim = GARDNER_MAP[dim] || "L";
            }

            answers.push({
                q_id: qid,
                score: score,
                type: dim
            });
        });

        return answers;
    }

    // =====================================================================
    //                 FETCH + RENDER QUESTIONS
    // =====================================================================
    async function fetchQuestions(testType, container, testData) {
        container.innerHTML = "";

        try {
            const res = await fetch(`http://localhost:8000/api/v1/${testType}/questions/get`);
            const data = await res.json();

            renderQuestions(container, data.msg, testType, testData[testType]);
        } catch (e) {
            console.error("fetchQuestions error:", e);
        }
    }

    function renderQuestions(container, questions, testType, savedAnswers) {
        container.innerHTML = "";

        questions.forEach(q => {
            const row = document.createElement("tr");

            const qType = getQuestionType(testType, q);

            row.innerHTML = `
                <th>${escapeHtml(q.question)}</th>
                ${[5,4,3,2,1].map(v => `
                    <td>
                        <input 
                            type="radio" 
                            name="${q.id}"
                            value="${v}"
                            data-type="${qType}"
                            ${isSaved(savedAnswers, q.id, v, testType, qType) ? "checked" : ""}
                        >
                    </td>
                `).join("")}
            `;

            container.appendChild(row);
        });
    }

    function getQuestionType(testType, q) {
        if (testType === "MBTI") {
            let dim = null;

            if (q.pivot) {
                if (typeof q.pivot === "string") dim = q.pivot;
                else if (typeof q.pivot.dimension === "string") dim = q.pivot.dimension;
                else if (typeof q.pivot.type === "string") dim = q.pivot.type;
            }

            return ["EI", "SN", "TF", "JP"].includes(dim) ? dim : "EI";
        }

        if (testType === "Holland") {
            return q.type || q.pivot?.type || "R";
        }

        if (testType === "Gardner") {
            // از tag استفاده می‌کنیم تا در collectSimpleAnswers به کد تبدیلش کنیم
            return q.tag || q.type;
        }
    }

    function isSaved(saved, qid, value, testType, type) {
        if (!saved) return false;

        if (testType === "MBTI") {
            return saved[type]?.some(a => a.q_id === qid && a.score === value);
        }

        return saved.some(a => a.q_id === qid && a.score === value);
    }

    // =====================================================================
    //                          SEND ANALYSIS
    // =====================================================================
    function analyzeTest() {
        const data = loadTestData();

        console.log("FINAL SENT PAYLOAD:", JSON.stringify(data, null, 2));

        fetch("http://localhost:8000/api/v1/systematic/recommendation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(result => {
            showResult(result);
            localStorage.removeItem("testData");
        })
        .catch(err => {
            console.error(err);
            alert("خطا در ارسال اطلاعات.");
        });
    }

    // =====================================================================
    //                       SHOW RESULT MODAL
    // =====================================================================
    function showResult(data) {
        const modal = document.createElement("div");
        modal.className = "modal fade show";
        modal.style.display = "block";
        modal.style.background = "rgba(0,0,0,0.5)";

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5>نتایج تحلیل آزمون</h5>
                        <button class="close" onclick="this.closest('.modal').remove()">&times;</button>
                    </div>

                    <div class="modal-body">
                        <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">بستن</button>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    function escapeHtml(str) {
        return str ? str.replace(/[&<>"]/g, c => ({
            "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;"
        }[c])) : "";
    }

});
