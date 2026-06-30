// =====================================================
// Groundwater AI Assistant v2.0
// Frontend Controller
// =====================================================

// ===============================
// HTML ELEMENTS
// ===============================

const district = document.getElementById("district");
const predictBtn = document.getElementById("predictBtn");

const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");

const response = document.getElementById("response");

const riskCard = document.getElementById("riskCard");
const riskTitle = document.getElementById("riskTitle");
const riskText = document.getElementById("riskText");

const downloadBtn = document.getElementById("downloadBtn");

const themeToggle = document.getElementById("themeToggle");

// ===============================
// GLOBAL VARIABLES
// ===============================

let forecastChart = null;

let latestPrediction = null;

let predictionHistory =
JSON.parse(localStorage.getItem("predictionHistory")) || [];



// ===============================
// SAVE HISTORY
// ===============================

function saveHistory(districtName,forecast){

    predictionHistory.unshift({

        district:districtName,

        forecast:forecast,

        time:new Date().toLocaleString()

    });

    if(predictionHistory.length>5){

        predictionHistory.pop();

    }

    localStorage.setItem(

        "predictionHistory",

        JSON.stringify(predictionHistory)

    );

}

// ===============================
// ANIMATED COUNTER
// ===============================

function animateValue(element,start,end,duration){

    let startTime=null;

    function animation(currentTime){

        if(!startTime){

            startTime=currentTime;

        }

        const progress=Math.min(

            (currentTime-startTime)/duration,

            1

        );

        const value=(progress*(end-start)+start).toFixed(2);

        element.innerHTML=`${value}<span class="unit"> mbgl</span>`;

        if(progress<1){

            requestAnimationFrame(animation);

        }

    }

    requestAnimationFrame(animation);

}

// ===============================
// UPDATE FORECAST CARDS
// ===============================

function updateForecastCards(forecast){

    animateValue(q1,0,forecast[0].prediction,1000);

    animateValue(q2,0,forecast[1].prediction,1200);

    animateValue(q3,0,forecast[2].prediction,1400);

}

// ===============================
// UPDATE CHART
// ===============================

function updateChart(forecast){

    const ctx=document.getElementById("forecastChart");

    if(forecastChart){

        forecastChart.destroy();

    }

    forecastChart=new Chart(ctx,{

        type:"line",

        data:{

            labels:[

                "Quarter 1",

                "Quarter 2",

                "Quarter 3"

            ],

            datasets:[{

                label:"Groundwater Level",

                data:[

                    forecast[0].prediction,

                    forecast[1].prediction,

                    forecast[2].prediction

                ],

                borderColor:"#38bdf8",

                backgroundColor:"rgba(56,189,248,.18)",

                borderWidth:4,

                fill:true,

                pointRadius:6,

                pointHoverRadius:8,

                tension:.45

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:1800,

                easing:"easeOutQuart"

            },

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                x:{

                    ticks:{

                        color:"#ffffff"

                    },

                    grid:{

                        color:"rgba(255,255,255,.05)"

                    }

                },

                y:{

                    ticks:{

                        color:"#ffffff"

                    },

                    grid:{

                        color:"rgba(255,255,255,.05)"

                    }

                }

            }

        }

    });

}
// =====================================================
// RISK INDICATOR
// =====================================================

function updateRisk(forecast){

    const avg =
    (
        forecast[0].prediction +
        forecast[1].prediction +
        forecast[2].prediction
    ) / 3;

    riskCard.className = "risk-card";

    if(avg < 3){

        riskCard.classList.add("low");

        riskTitle.innerHTML = "🟢 Low Risk";

        riskText.innerHTML =
        "Groundwater levels are healthy. No immediate concern.";

    }

    else if(avg < 6){

        riskCard.classList.add("moderate");

        riskTitle.innerHTML = "🟡 Moderate Risk";

        riskText.innerHTML =
        "Groundwater levels are moderate. Water conservation is recommended.";

    }

    else{

        riskCard.classList.add("high");

        riskTitle.innerHTML = "🔴 High Risk";

        riskText.innerHTML =
        "Groundwater levels are low. Immediate groundwater recharge measures are recommended.";

    }

}


// =====================================================
// GENERATE AI RESPONSE
// =====================================================

function updateResponse(data,forecast){

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

<strong>${forecast[2].quarter}</strong>

</p>

<br>

${marked.parse(data.explanation)}

<br>

<p>

This prediction is generated using

Machine Learning,

historical groundwater trends,

rainfall patterns,

lag features

and AI explanation.

</p>

`;

}


// =====================================================
// PREDICT BUTTON
// =====================================================

predictBtn.addEventListener("click",async()=>{

    if(district.value===""){

        alert("Please select a district.");

        return;

    }

    predictBtn.disabled=true;

    predictBtn.innerHTML="⏳ Predicting...";

    response.innerHTML=`

    <h3>Analyzing groundwater...</h3>

    <div class="typing">

        <span></span>

        <span></span>

        <span></span>

    </div>

    `;

    try{

        const res=await fetch(

        "https://groundwater-ai-assistant-3rfp.onrender.com/predict",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                district:district.value

            })

        }

        );

        const data=await res.json();

        const forecast = data.forecast;

latestPrediction = {
    forecast: forecast,
    explanation: ""
};

// Show prediction immediately
updateForecastCards(forecast);

updateChart(forecast);

updateRisk(forecast);

saveHistory(district.value, forecast);

// Show loading while AI explanation is generated
response.innerHTML = `
<h3>🤖 AI Explanation</h3>

<div class="typing">
    <span></span>
    <span></span>
    <span></span>
</div>

<p>Generating AI explanation...</p>
`;

// Request AI explanation separately
const explainRes = await fetch(
    "https://groundwater-ai-assistant-3rfp.onrender.com/explanation",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            district: district.value,
            forecast: forecast
        })
    }
);

const explainData = await explainRes.json();

latestPrediction.explanation = explainData.explanation;

updateResponse(
    {
        explanation: explainData.explanation
    },
    forecast
);

    }

    catch(err){

        console.log(err);

        response.innerHTML="❌ Unable to connect to backend.";

    }

    finally{

        predictBtn.disabled=false;

        predictBtn.innerHTML="🔮 Predict 3-Month Outlook";

    }

});
// =====================================================
// DOWNLOAD REPORT
// =====================================================



if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {

        if (!latestPrediction) {

            alert("Generate a prediction first.");

            return;

        }

        const forecast = latestPrediction.forecast;

        const report = `

GROUNDWATER AI ASSISTANT REPORT

======================================

District : ${district.value}

Quarter 1 : ${forecast[0].prediction} mbgl
Quarter 2 : ${forecast[1].prediction} mbgl
Quarter 3 : ${forecast[2].prediction} mbgl

======================================

AI EXPLANATION

${latestPrediction.explanation}

======================================

Generated using AI-Based Groundwater Prediction System

`;

        const blob = new Blob([report], {
            type: "text/plain"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `${district.value}_Groundwater_Report.txt`;

        a.click();

        URL.revokeObjectURL(url);

    });

}



// =====================================================
// DARK / LIGHT MODE
// =====================================================



if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            themeToggle.innerHTML = "☀️";

        } else {

            themeToggle.innerHTML = "🌙";

        }

    });

}







// =====================================================
// PAGE LOAD
// =====================================================

window.onload = () => {

    console.log("Groundwater AI Assistant Ready ✅");

};