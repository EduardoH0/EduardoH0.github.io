export class StateManager {
    constructor() {
        this.state = {
            freeze: false,
        };
    }

    setFreeze() {
        this.state.freeze = true;
    }
    setUnfreeze() {
        this.state.freeze = false;
    }
    isFrozen() {
        return this.state.freeze;
    }
}