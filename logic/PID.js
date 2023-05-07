export default class PID {
    constructor(p, i, d, update) {
        this.P = p;
        this.I = i;
        this.D = d;
        this.firstRun = true;
        this.integralError = 0;

        try {
            this.update = new Function('return ' + update)().bind(this);
        } catch (e) {
            console.log(e);
            this.update = this.originalUpdate;
        }
    }

    originalUpdate(error, dt) {
        if (this.firstRun) {
            this.firstRun = false;
            this.lastError = error;
        }
        const diff = (error - this.lastError) / dt;
        this.integralError += error * dt;
        const controlOut = this.P * error + this.I * this.integralError + this.D * diff;
        this.lastError = error;
        return controlOut;
    }
}