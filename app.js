let loaded = false;
let audioContext = null;

function init() {

    // Only initialise if it is the first time
    if (!loaded) {
        audioContext = new AudioContext();
        loaded = true;
    }
}

let osc = null;
let filter = null;
let isPlayingOsc = false;

function saw() {

    console.log(" hello kids!");

    init();

    if (isPlayingOsc) {
        osc.stop();
        isPlayingOsc = false;
    } else {
        isPlayingOsc = true;

        // Create the nodes
        osc = audioContext.createOscillator();
        filter = audioContext.createBiquadFilter();

        // Set the properties of the nodes
        filter.type = 'bandpass';
        filter.frequency.value = 200;

        // choose from sawtooth, sine, square and triangle
        osc.type = 'sawtooth';

        // Connect the saw to the filter and then to the destination
        osc.connect(filter).connect(audioContext.destination);

        // Start the sound
        osc.start(audioContext.currentTime);

        // Schedule changes
        for (let i = 0; i < 100; i++) {
            osc.frequency.setValueAtTime(60 + i, audioContext.currentTime + i / 10);
            filter.frequency.setValueAtTime(Math.random() * 1000, audioContext.currentTime + i / 5);
        }
    }
}

let oscillator, tremolo, vibrato, gain, vibratoGain;
let isPlayingMod = false;

function modulation() {

    if (!isPlayingMod) {
        init();
        isPlayingMod = true;

        // Create the Oscillators
        oscillator = audioContext.createOscillator();
        tremolo = audioContext.createOscillator();
        vibrato = audioContext.createOscillator();
        gain = audioContext.createGain();
        vibratoGain = audioContext.createGain();

        // Set their values
        oscillator.frequency.value = 400.0;
        tremolo.frequency.value = 8.0;
        vibrato.frequency.value = 5.0;
        vibratoGain.gain.value = 1000;

        // Connect the osciallators (from tail to head)
        tremolo.connect(gain.gain);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        // Start the oscillators
        oscillator.start();
        tremolo.start();
        vibrato.start();
    } else {
        // Stop the oscillator
        oscillator.stop();
        tremolo.stop();
        vibrato.stop();
        isPlayingMod = false;
    }
}

function noise() {

    init();

    // Create a buffer
    let node = audioContext.createBufferSource();
    let buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate);

    // Get a handle of the buffer
    let data = buffer.getChannelData(0);

    // loop through the buffer size and fill the buffer with random numbers
    for (let i = 0; i < 4096; i++) {
        data[i] = Math.random();
    }

    // attach the buffer to the node with the loop option as true
    node.buffer = buffer;
    node.loop = true;

    // connect to destination
    node.connect(audioContext.destination);

    // start the noise
    node.start(audioContext.currentTime);

    // stop it after one second
    node.stop(audioContext.currentTime + 2);
}

function additive() {

    init();

    // use arrays for many oscillators and gains
    let oscillators = [];
    let amplifiers = [];
    let times = 50;

    for(let i = 0; i < times; i++) {
        oscillators[i] = audioContext.createOscillator();
        amplifiers[i] = audioContext.createGain();

        // Set the oscillator parameters
        oscillators[i].frequency.value = 100 * (1 + i);
        oscillators[i].type = 'sine';

        // Set the amplitude
        amplifiers[i].gain.value = 1.0 / times;

        // Connect the oscillator to the gain and gain to the output
        oscillators[i].connect(amplifiers[i]);
        amplifiers[i].connect(audioContext.destination);

        // Play a sound for 2 seconds
        oscillators[i].start();
        oscillators[i].stop(audioContext.currentTime + 2);
    }

}

// Listen to the click event of the button
document.getElementById("item1").addEventListener("click", saw);
document.getElementById("item2").addEventListener("click", modulation);
document.getElementById("item3").addEventListener("click", noise);
document.getElementById("item4").addEventListener("click", additive);
