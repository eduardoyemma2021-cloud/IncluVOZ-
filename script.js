const video = document.getElementById("video");
const texto = document.getElementById("texto");
const historial = document.getElementById("historial");

navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
    .then(stream => {
        video.srcObject = stream;
        document.getElementById("estado").innerHTML =
            "✅ Cámara conectada";
    });

function iniciarReconocimiento() {

    const recognition =
        new webkitSpeechRecognition();

    recognition.lang = "es-CO";

    recognition.start();

    recognition.onresult = (event) => {

        const frase =
            event.results[0][0].transcript;

        texto.value = frase;

        guardar(frase);

    };
}

function leerTexto() {

    const voz =
        new SpeechSynthesisUtterance(texto.value);

    voz.lang = "es-ES";

    speechSynthesis.speak(voz);

}

function guardar(mensaje) {

    const hora =
        new Date().toLocaleTimeString();

    historial.innerHTML +=
        `<p>[${hora}] ${mensaje}</p>`;

}

function actualizarFecha() {

    const ahora = new Date();

    document.getElementById("fecha").innerHTML =
        ahora.toLocaleString("es-CO");

}

setInterval(actualizarFecha, 1000);

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults(results => {

    if (!results.multiHandLandmarks) return;

    texto.value = "✋ Mano detectada";

});

const camera = new Camera(video, {
    onFrame: async() => {
        await hands.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start();