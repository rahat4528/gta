/**
 * Procedural Web Audio API Sound Synthesizer
 * Generates realistic sports car engine harmonics, turbo blowoff, rain atmosphere,
 * and cyberpunk ambient synth drones without requiring external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master Gain
  private masterGain: GainNode | null = null;

  // Engine sound nodes
  private oscSub: OscillatorNode | null = null;
  private oscMain: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;
  private distortion: WaveShaperNode | null = null;

  // Rain sound nodes
  private _rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;

  // Turbo blowoff
  private lastThrottle = 0;
  private lastRpm = 800;

  // Tire screech
  private screechGain: GainNode | null = null;
  private screechFilter: BiquadFilterNode | null = null;

  public init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupEngineSynth();
      this.setupRainSynth();
      this.setupTireScreech();

      this.isInitialized = true;
    } catch {
      console.warn('Web Audio API not supported or user interaction pending.');
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private makeDistortionCurve(amount = 20) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private setupEngineSynth() {
    if (!this.ctx || !this.masterGain) return;

    // Sub-bass rumble (sine)
    this.oscSub = this.ctx.createOscillator();
    this.oscSub.type = 'sawtooth';
    this.oscSub.frequency.setValueAtTime(45, this.ctx.currentTime);

    // Main engine tone (sawtooth)
    this.oscMain = this.ctx.createOscillator();
    this.oscMain.type = 'sawtooth';
    this.oscMain.frequency.setValueAtTime(90, this.ctx.currentTime);

    // Higher harmonic resonance (triangle)
    this.oscHarmonic = this.ctx.createOscillator();
    this.oscHarmonic.type = 'triangle';
    this.oscHarmonic.frequency.setValueAtTime(180, this.ctx.currentTime);

    // Distortion
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(15);
    this.distortion.oversample = '2x';

    // Lowpass filter
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(3, this.ctx.currentTime);

    // Engine volume gain
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    // Connect engine nodes
    this.oscSub.connect(this.distortion);
    this.oscMain.connect(this.distortion);
    this.oscHarmonic.connect(this.distortion);

    this.distortion.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    this.oscSub.start();
    this.oscMain.start();
    this.oscHarmonic.start();
  }

  private setupRainSynth() {
    if (!this.ctx || !this.masterGain) return;

    // Generate brown/pink noise buffer for realistic rain sound
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Rain bandpass filter
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    rainFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    whiteNoise.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    whiteNoise.start();
    this._rainNode = whiteNoise;
  }

  private setupTireScreech() {
    if (!this.ctx || !this.masterGain) return;

    // Noise source for tire drift
    const bufferSize = this.ctx.sampleRate * 1;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const screechNoise = this.ctx.createBufferSource();
    screechNoise.buffer = noiseBuffer;
    screechNoise.loop = true;

    this.screechFilter = this.ctx.createBiquadFilter();
    this.screechFilter.type = 'bandpass';
    this.screechFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
    this.screechFilter.Q.setValueAtTime(5, this.ctx.currentTime);

    this.screechGain = this.ctx.createGain();
    this.screechGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    screechNoise.connect(this.screechFilter);
    this.screechFilter.connect(this.screechGain);
    this.screechGain.connect(this.masterGain);

    screechNoise.start();
  }

  public triggerTurboBlowoff(pressure: number) {
    if (!this.ctx || !this.masterGain || pressure < 0.3) return;

    // Procedural chirp / hiss
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    gain.gain.setValueAtTime(Math.min(pressure * 0.4, 0.4), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public update(params: {
    rpm: number;
    speed: number;
    throttle: number;
    driftAngle: number;
    turboPressure: number;
    rainIntensity: number;
    volume: number;
    muted: boolean;
  }) {
    if (!this.isInitialized || !this.ctx) return;

    const now = this.ctx.currentTime;

    // Master volume & mute
    if (this.masterGain) {
      const targetVol = params.muted ? 0 : params.volume;
      this.masterGain.gain.setTargetAtTime(targetVol, now, 0.05);
    }

    if (params.muted) return;

    // Engine Pitch calculation based on RPM
    // 800 RPM ~ 35 Hz base; 8000 RPM ~ 350 Hz base
    const baseFreq = 30 + (params.rpm / 8500) * 220;

    if (this.oscSub && this.oscMain && this.oscHarmonic && this.engineFilter) {
      this.oscSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.03);
      this.oscMain.frequency.setTargetAtTime(baseFreq, now, 0.03);
      this.oscHarmonic.frequency.setTargetAtTime(baseFreq * 2.02, now, 0.03);

      // Lowpass cutoff opens up as throttle increases
      const filterCutoff = 350 + (params.rpm / 8500) * 3200 + params.throttle * 1500;
      this.engineFilter.frequency.setTargetAtTime(filterCutoff, now, 0.04);
    }

    // Engine volume modulated by throttle
    if (this.engineGain) {
      const engineLevel = 0.2 + (params.rpm / 8500) * 0.3 + params.throttle * 0.25;
      this.engineGain.gain.setTargetAtTime(engineLevel, now, 0.05);
    }

    // Check for turbo blow-off trigger
    if (this.lastThrottle > 0.6 && params.throttle < 0.1 && this.lastRpm > 4500) {
      this.triggerTurboBlowoff(params.turboPressure);
    }
    this.lastThrottle = params.throttle;
    this.lastRpm = params.rpm;

    // Rain volume
    if (this.rainGain) {
      const rainVol = Math.min(params.rainIntensity * 0.3, 0.4);
      this.rainGain.gain.setTargetAtTime(rainVol, now, 0.1);
    }

    // Tire screech on drift
    if (this.screechGain && this.screechFilter) {
      const slip = Math.abs(params.driftAngle);
      const isScreeching = slip > 0.08 && params.speed > 40;
      const screechVol = isScreeching ? Math.min((slip - 0.08) * 1.5, 0.35) : 0;
      this.screechGain.gain.setTargetAtTime(screechVol, now, 0.05);

      if (isScreeching) {
        this.screechFilter.frequency.setTargetAtTime(2600 + Math.random() * 400, now, 0.02);
      }
    }
  }

  public destroy() {
    if (this._rainNode) {
      this._rainNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.isInitialized = false;
    }
  }
}

export const soundEngine = new SoundEngine();
