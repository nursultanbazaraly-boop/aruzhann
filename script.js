const button = document.getElementById("startButton");
const flames = document.querySelectorAll(".flame");
const message = document.getElementById("message");
const container = document.querySelector(".container");

let audioContext;
let analyser;
let microphone;
let dataArray;
let listening = false;

button.addEventListener("click", async () => {

    button.innerHTML = "🎤 Үрлеңіз...";

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        microphone = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;

        microphone.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        listening = true;

        detectBlow(stream);

    } catch (e) {

        alert("Микрофонға рұқсат беріңіз 😊");

    }

});

function detectBlow(stream){

    if(!listening) return;

    analyser.getByteFrequencyData(dataArray);

    let total = 0;

    for(let i=0;i<dataArray.length;i++){

        total += dataArray[i];

    }

    let volume = total / dataArray.length;

    if(volume > 35){

        listening = false;

        stream.getTracks().forEach(track => track.stop());

        extinguishCandles();

        return;

    }

    requestAnimationFrame(()=>detectBlow(stream));

}

function extinguishCandles(){

    flames.forEach((flame,index)=>{

        setTimeout(()=>{

            flame.classList.add("off");

        },index*350);

    });

    setTimeout(showMessage,1800);

}
function showMessage(){

    container.style.display = "none";

    message.classList.remove("hidden");

    message.classList.add("show");

    typeWriter();

    createHearts();

}

function typeWriter(){

    const textElement = document.querySelector("#message p");

    const text = textElement.innerText;

    textElement.innerText = "";

    let i = 0;

    function typing(){

        if(i < text.length){

            textElement.innerHTML += text.charAt(i);

            i++;

            setTimeout(typing,35);

        }

    }

    typing();

}

function createHearts(){

    for(let i=0;i<70;i++){

        const heart=document.createElement("div");

        heart.innerHTML="❤️";

        heart.style.position="fixed";
        heart.style.left=Math.random()*100+"vw";
        heart.style.top="105vh";
        heart.style.fontSize=(18+Math.random()*20)+"px";
        heart.style.pointerEvents="none";
        heart.style.transition="all 6s linear";
        heart.style.zIndex="9999";

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.style.top="-10vh";
            heart.style.transform=`translateX(${Math.random()*200-100}px) rotate(${Math.random()*360}deg)`;
            heart.style.opacity="0";

        },50);

        setTimeout(()=>{

            heart.remove();

        },6500);

    }

}
