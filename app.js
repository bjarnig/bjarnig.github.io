
let audioContext;

function play(frequency, time) {

  const osc = audioContext.createOscillator();
  const volume = audioContext.createGain();

  osc.type = 'square';
  osc.frequency.value = frequency;

  osc.connect(volume);
  volume.connect(audioContext.destination);

  volume.gain.setValueAtTime(0, time);
  volume.gain.linearRampToValueAtTime(1, time + 1);
  volume.gain.linearRampToValueAtTime(0, time + 2);

  osc.start();
}

function sequence () {

  console.log('sequence');

  audioContext = new AudioContext();

  [100,200,80,60,150].forEach((item, index) => {
    play(item, audioContext.currentTime + (index * 2));
  });

}

function saw(frequencies, duration) {

  const osc = audioContext.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueCurveAtTime(frequencies, audioContext.currentTime, duration);

  osc.connect(audioContext.destination);
  osc.start();

}

function curve() {
  audioContext = new AudioContext();
  let list = [100,200,300].map(function(item) { return item * Math.random() });
  saw(list, 5 * Math.random());
}

function noise() {

  if(!audioContext) {
      audioContext = new AudioContext();
  }

  const noise = audioContext.createBufferSource();
  const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate);
  let data = buffer.getChannelData(0);

  for (let i = 0; i < 4096; i++) {
    data[i] = Math.random();
  }

  noise.buffer = buffer;
  noise.loop = true;

  let filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3000;
  filter.Q.value = 8;

  noise.connect(filter);
  filter.connect(audioContext.destination);
  noise.start(audioContext.currentTime);

  for (var i = 0; i < 20; i++) {
    filter.frequency.setValueAtTime( 20 + (1000 * Math.random()), audioContext.currentTime + (i * 0.3));
  }

  noise.stop(audioContext.currentTime + 4);

}

document.getElementById('buttonSequence').addEventListener("click", sequence);

document.getElementById('buttonCurve').addEventListener("click", curve);

document.getElementById('buttonNoise').addEventListener("click", noise);
