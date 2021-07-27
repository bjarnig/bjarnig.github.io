let loaded = false;
let audioContext = null;

function init() {

    // Only initialise if it is the first time
    if (!loaded) {
        audioContext = new AudioContext();
        loaded = true;
    }
}

//////////////////////////////////////  Play Sample /////////////////////////////////////////

let audioBuffer;

function loadSample() {

    init();

    let request = new XMLHttpRequest();
    request.open("get", 'snd.mp3', true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            audioBuffer = buffer;
            alert('sample is now loaded!');
        });
    };

    request.send();
}

function playSample() {

    init();

    if (!audioBuffer) {
        alert('there is no audio buffer!');
    }

    let sound = audioContext.createBufferSource();
    sound.buffer = audioBuffer;
    sound.playbackRate.value = 10 * Math.random();
    sound.connect(audioContext.destination);
    sound.start(audioContext.currentTime);
}


///////////////////////////////////  Impulse Response  //////////////////////////////////////

let impulseBuffer;

function loadImpulse() {

    init();

    let request = new XMLHttpRequest();
    request.open("get", 'https://bjarnig.s3.eu-central-1.amazonaws.com/sounds/impulse.wav', true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            impulseBuffer = buffer;
            alert('impulse is now loaded!');
        });
    };

    request.send();
}

function playConvolution() {

    init();

    if (!impulseBuffer) {
        alert('there is no audio buffer!');
    }

    let gain = audioContext.createGain();
    let convolver = audioContext.createConvolver();
    let osc = audioContext.createOscillator();
    
    osc.type = "sawtooth";
    osc.frequency.value = 10;
    convolver.buffer = impulseBuffer;
    osc.connect(convolver);
    convolver.connect(gain);
    gain.gain.value = 0.75;
    gain.connect(audioContext.destination);
    osc.connect(audioContext.destination);
    osc.start(audioContext.currentTime);
}

function playDelay() {
    let source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = 10 * Math.random();
    var delay = audioContext.createDelay();
    delay.delayTime.value = Math.random();

    var feedback = audioContext.createGain();
    feedback.gain.value = 0.8;

    delay.connect(feedback);
    feedback.connect(delay);

    source.connect(delay);
    source.connect(audioContext.destination);
    delay.connect(audioContext.destination);
    source.start(audioContext.currentTime);
}

// our distortion curve function
function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for (; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg /
            (Math.PI + k * Math.abs(x));
    }
    return curve;
}

function playWaveshaping() {
    let source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = 5 * Math.random();

    var waveShaper = audioContext.createWaveShaper();
    waveShaper.curve = makeDistortionCurve(Math.random());

    // connect the nodes
    source.connect(waveShaper);
    waveShaper.connect(audioContext.destination);
    source.start(audioContext.currentTime);
}

// Listen to the click event of the button
document.getElementById("item1").addEventListener("click", loadSample);
document.getElementById("item2").addEventListener("click", playSample);
document.getElementById("item3").addEventListener("click", loadImpulse);
document.getElementById("item4").addEventListener("click", playConvolution);
document.getElementById("item5").addEventListener("click", playDelay);
document.getElementById("item6").addEventListener("click", playWaveshaping);
