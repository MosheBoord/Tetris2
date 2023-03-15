export default class VideoGame {
  constructor() {
    this.timeSinceLastFrame = 0;
    this.frameRateInMilliseconds = 1000 / 60;
    this.runNextFrameLocked = false;
    this.startTime = performance.now();
    this.framesSinceStart = 0;
    this.loopCount = 0;
    this.state = {};
    this.events = {};
    this.setState = () => null;
  }

  start() {
    // const main = (tFrame) => {
    //   this.stopMain = window.requestAnimationFrame(main);
    //   this.runNextFrame(tFrame); // Call your update method. In our case, we give it rAF's timestamp.
    //   // render();
    // };

    // main(); // Start the cycle

    const main = () => {
      setTimeout(() => {
        // console.log(
        //   this.framesSinceStart * this.frameRateInMilliseconds,
        //   performance.now() - this.startTime + this.frameRateInMilliseconds
        // );
        if (
          this.framesSinceStart * this.frameRateInMilliseconds <
          performance.now() - this.startTime + this.frameRateInMilliseconds
        ) {
          this.framesSinceStart++;
          this.runNextFrame();
        }
        main();
      }, 1);
    };

    main();
  }

  pause() {}

  resume() {}

  stop() {
    clearInterval(this.gameLoop);
    window.cancelAnimationFrame(this.stopMain);
  }

  runNextFrame() {
    // console.log(this.frame++);
  }

  control(stateFunction) {
    this.setState = stateFunction;
  }

  inputEvent(event, data) {
    this.events[event].forEach((event) => {
      event(data);
    });
  }

  onInputEvent(event, callback) {
    this.events[event] = this.events[event]
      ? [...this.events[event], callback]
      : [callback];
  }
}
