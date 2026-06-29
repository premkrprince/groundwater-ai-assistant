// ===============================
// HTML Elements
// ===============================

const district = document.getElementById("district");

const predictBtn = document.getElementById("predictBtn");

const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");

const response = document.getElementById("response");


// ===============================
// Predict Button
// ===============================

predictBtn.addEventListener("click", async function (e) {

    e.preventDefault();


    // Check district

    if (district.value === "") {

        alert("Please select a district.");

        return;

    }


    // Loading UI

    predictBtn.classList.add("loading");

    predictBtn.innerHTML = "Analyzing...";

    response.innerHTML = `
        <p><strong>Analyzing groundwater trends...</strong></p>

        <div class="typing">

            <span></span>
            <span></span>
            <span></span>

        </div>
    `;


    try {

        // Send request

        const res = await fetch("http://127.0.0.1:5000/predict", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                district: district.value

            })

        });


        const data = await res.json();


        console.log(data);


       // ===============================
// Update Forecast Cards
// ===============================

const forecast = data.forecast;

q1.innerHTML = `${forecast[0].prediction}<span class="unit"> mbgl</span>`;
q2.innerHTML = `${forecast[1].prediction}<span class="unit"> mbgl</span>`;
q3.innerHTML = `${forecast[2].prediction}<span class="unit"> mbgl</span>`;

// ===============================
// AI Explanation
// ===============================

const avg =
(
    forecast[0].prediction +
    forecast[1].prediction +
    forecast[2].prediction
) / 3;

let status = "";

if (avg < 3) {

    status = "🟢 Groundwater levels are expected to remain healthy over the next three quarters.";

}
else if (avg < 6) {

    status = "🟡 Groundwater levels are expected to remain moderate. Efficient water use and regular monitoring are recommended.";

}
else {

    status = "🔴 Groundwater levels are expected to decline significantly. Water conservation and groundwater recharge measures are strongly recommended.";

}

response.innerHTML = `
<h3>🤖 AI Groundwater Analysis ✅</h3>

<p><strong>District:</strong> ${district.value}</p>

<p>
Forecast generated for
<strong>${forecast[0].year}</strong>
Quarter
<strong>${forecast[0].quarter}</strong>
to
Quarter
<strong>${forecast[2].quarter}</strong>.
</p>

<br>

${marked.parse(data.explanation)}

<br><br>

<p>
This forecast is generated using historical groundwater trends,
rainfall patterns, lag-based groundwater behaviour and a trained
machine learning model.
</p>
`;
    }

    catch (error) {

        console.log(error);

        response.innerHTML = "❌ Unable to connect to backend.";

    }

    finally {

        predictBtn.classList.remove("loading");

        predictBtn.innerHTML = "🔮 Predict 3-Month Outlook";

    }

});