console.log("Hello from index.js");

class CustomTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.startTime = 0;
    this.elapsedTime = 0;
    this.isRunning = false;
    this.animationFrameId = null;

    this.shadowRoot.innerHTML = `
        <style>
          .timer {
            font-size: 2em;
          }
          button {
            margin: 5px;
          }
        </style>
        <div class="timer">00:00:00.000</div>
        <button id="playPause">Play</button>
        <button id="reset">Reset</button>
      `;

    this.timerDisplay = this.shadowRoot.querySelector(".timer");
    this.playPauseButton = this.shadowRoot.querySelector("#playPause");
    this.resetButton = this.shadowRoot.querySelector("#reset");

    this.playPauseButton.addEventListener("click", () =>
      this.togglePlayPause()
    );
    this.resetButton.addEventListener("click", () => this.reset());
  }

  togglePlayPause() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isRunning = true;
    this.playPauseButton.textContent = "Pause";
    this.startTime = performance.now() - this.elapsedTime;
    this.update();
  }

  pause() {
    this.isRunning = false;
    this.playPauseButton.textContent = "Play";
    cancelAnimationFrame(this.animationFrameId);
  }

  reset() {
    this.pause();
    this.elapsedTime = 0;
    this.updateDisplay(0);
  }

  update() {
    if (!this.isRunning) return;
    this.elapsedTime = performance.now() - this.startTime;
    this.updateDisplay(this.elapsedTime);
    this.animationFrameId = requestAnimationFrame(() => this.update());
  }

  updateDisplay(time) {
    const totalMilliseconds = Math.floor(time);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const milliseconds = String(totalMilliseconds % 1000).padStart(3, "0");
    this.timerDisplay.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}

customElements.define("custom-timer", CustomTimer);
