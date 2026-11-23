/**
 * Procedural Web Audio API Sound Synthesizer for Phone OS
 * Generates haptic audio feedback (click, lock, unlock, chime, shutter)
 * and interactive synthesized background music tracks for the Music Player.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft keyboard / touch tap click
  public playTap() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Lock phone click
  public playLock() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore audio error
    }
  }

  // Unlock phone whoosh
  public playUnlock() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Ignore audio error
    }
  }

  // Notification chime (iOS style marimba/bell chord)
  public playNotification() {
    try {
      const ctx = this.getContext();
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.38);
      });
    } catch {
      // Ignore audio error
    }
  }

  // Camera shutter sound
  public playShutter() {
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Ignore audio error
    }
  }

  // Procedural Lo-Fi Music Synthesizer for Music Player App
  public startMusic(volume = 0.5, bpm = 85) {
    if (this.isMusicPlaying) return;
    try {
      const ctx = this.getContext();
      this.isMusicPlaying = true;

      // Master music gain node
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(Math.min(volume * 0.25, 0.3), ctx.currentTime);

      // Lowpass filter for dreamy lofi feel
      this.musicFilter = ctx.createBiquadFilter();
      this.musicFilter.type = 'lowpass';
      this.musicFilter.frequency.setValueAtTime(800, ctx.currentTime);
      this.musicFilter.Q.setValueAtTime(2, ctx.currentTime);

      this.musicFilter.connect(this.musicGain);
      this.musicGain.connect(ctx.destination);

      // Chord progression notes in Hz (Am - F - C - G progression)
      const chords = [
        [220.0, 261.63, 329.63], // A3, C4, E4
        [174.61, 220.0, 261.63], // F3, A3, C4
        [130.81, 164.81, 196.0], // C3, E3, G3
        [196.0, 246.94, 293.66], // G3, B3, D4
      ];

      let chordIndex = 0;
      const beatDuration = (60 / bpm) * 1000;

      const playChord = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicFilter) return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIndex];

        currentChord.forEach((freq) => {
          if (!this.ctx || !this.musicFilter) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          noteGain.gain.setValueAtTime(0.12, now);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + (beatDuration * 2) / 1000);

          osc.connect(noteGain);
          noteGain.connect(this.musicFilter);

          osc.start(now);
          osc.stop(now + (beatDuration * 2) / 1000);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      };

      playChord();
      this.musicInterval = window.setInterval(playChord, beatDuration * 2);
    } catch {
      // Ignore audio error
    }
  }

  public setMusicVolume(volume: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(Math.min(volume * 0.25, 0.3), this.ctx.currentTime, 0.05);
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      setTimeout(() => {
        this.musicGain?.disconnect();
        this.musicGain = null;
      }, 100);
    }
  }
}

export const soundEffects = new AudioSynthesizer();
