const audioContext = new AudioContext();

function sequence() {

    function play(note, start, length) {

        // create the oscillator
        let osc = audioContext.createOscillator();
        let volume = audioContext.createGain();

        // connect it to the destination
        osc.connect(volume);
        volume.connect(audioContext.destination);

        // Always set frequency to 440 now
        osc.frequency.value = 440;

        // Use the parameter "note" to detune the frequency
        osc.detune.value = note;

        // Create a simple "envelope" for our sound
        volume.gain.setValueAtTime(0, start);
        volume.gain.linearRampToValueAtTime(1, start + length * 0.1);
        volume.gain.setValueAtTime(1, start + length * 0.9);
        volume.gain.linearRampToValueAtTime(0, start + length * 0.99);

        osc.start(start);
        osc.stop(start + length);
    }

    [0, -2, -4, -2, 0, 8, -1].forEach(function(value, index) {
        play(value * 100, audioContext.currentTime + index * 0.3, 0.3);
    });
}

function rrand(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function curve () {

    function doCurve (duration, offset) {

        // Create the nodes and array of frequencies
        let osc = audioContext.createOscillator();
        let volume = audioContext.createGain();

        let freqs = [];
        freqs[0] = 100;
        freqs[1] = 500;
        freqs[2] = 100;
        freqs[3] = 500;
        freqs[4] = 100;
        freqs[5] = 500;
        freqs[6] = 100;
        freqs[7] = 500;
        freqs[8] = 100;
        freqs[9] = 500;

        // Set the values
        osc.frequency.value = freqs[0];
        osc.frequency.setValueAtTime(osc.frequency.value, audioContext.currentTime);

        // The setValueCurveAtTime
        osc.frequency.setValueCurveAtTime(freqs, audioContext.currentTime + offset, duration);

        osc.start(audioContext.currentTime);
        osc.connect(audioContext.destination);
        osc.stop(audioContext.currentTime + duration);
    }

    // runs the doCurve function with random duration and offset
    doCurve( rrand(0.5, 2.0), rrand(0.1, 0.4) );
}

document.getElementById("item1").addEventListener("click", sequence);

document.getElementById("item2").addEventListener("click", curve);
