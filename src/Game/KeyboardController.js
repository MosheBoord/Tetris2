// This is only the basic logic to map key events and filter out which events we want.
// We can add a lot more logic. (for another time)
export default class KeyboardController {
  constructor() {
    this.keyDownMappings = {};
    this.keyUpMappings = {};
    this.keysDown = {};
    window.addEventListener("keydown", (event) => {
      // console.log(event);
      if (this.keyDownMappings[event.key]) {
        this.keyDownMappings[event.key].forEach((mapping) => {
          this.keysDown[event.key] = Date.now();
          mapping.fireEvent();
        });
      }
    });

    window.addEventListener("keyup", (event) => {
      if (this.keyUpMappings[event.key]) {
        this.keyUpMappings[event.key].forEach((mapping) => {
          if (
            !mapping.requiresMinimumTime ||
            Date.now - this.keysDown[event.key] >= mapping.minimumTimeDown
          ) {
            mapping.fireEvent();
          }
        });
      }
    });
  }

  mapKeyDown(key, callback) {
    this.keyDownMappings[key] = this.keyDownMappings[key]
      ? [...this.keyDownMappings[key], { fireEvent: callback }]
      : [{ fireEvent: callback }];
  }

  mapKeyUp(key, callback) {}
}
