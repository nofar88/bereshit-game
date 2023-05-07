import * as Bereshit_101 from "@/logic/bereshit";
import Moon from "@/logic/Moon";
import {ALL_BURN} from "@/logic/bereshit";

const WEIGHT_EMP = 165; // kg

export default class SpaceCraft {
    constructor(vs, hs, ang, fuel, NN, dist, alt, time, dt, acc, weight, compute) {
        this.weight = weight;
        this.acc = acc;
        this.dt = dt;
        this.time = time;
        this.alt = alt;
        this.dist = dist;
        this.vs = vs;
        this.hs = hs;
        this.ang = ang;
        this.fuel = fuel;
        this.NN = NN;
        this.moon = Moon;
        this.globals = {ALL_BURN, WEIGHT_EMP};

        try {
            this.computeNextStep = new Function('return ' + compute)().bind(this);
        } catch (e) {
            console.log(e);
            this.omputeNextStep = this.originalComputeNextStep;
        }
    }

// increase thrust with [0,1] constrain
    increaseThrust(inc) {
        const val = this.NN + inc;
        if (val >= 0 && val <= 1) {
            this.NN = val;
        }
        if (val > 1) {
            this.NN = 1;
        }

        if (val < 0) {
            this.NN = 0;
        }
    }

// increase angle with [0,90] constrain
    increaseAngle(angInc) {
        const val = this.ang + angInc;
        if (val >= 0 && val <= 90) {
            this.ang = val;
        }
        if (val > 90) {
            this.ang = 90;
        }

        if (val < 0) {
            this.ang = 0;
        }
    }


    accMax(weight) {
        return this.calcAcc(weight, true, 8);
    }


    calcAcc(weight, main, seconds) {
        let t = 0;
        if (main) {
            t += Bereshit_101.MAIN_ENG_F;
        }
        t += seconds * Bereshit_101.SECOND_ENG_F;
        return t / weight;
    }

    degreesToRadians(degrees) {
        const pi = Math.PI;
        return degrees * (pi / 180);
    }

    // physics computations
    originalComputeNextStep() {
        // main computations
        const ang_rad = this.degreesToRadians(this.ang);
        const h_acc = Math.sin(ang_rad) * this.acc;
        let v_acc = Math.cos(ang_rad) * this.acc;
        const vacc = this.moon.getAcc(this.hs);
        this.time += this.dt;

        const dw = this.dt * ALL_BURN * this.NN;
        if (this.fuel > 0) {
            this.fuel -= dw;
            this.weight = WEIGHT_EMP + this.fuel;
            this.acc = this.NN * this.accMax(this.weight);
        } else { // ran out of fuel
            this.acc = 0;
        }

        v_acc -= vacc;
        if (this.hs > 0) {
            this.hs -= h_acc * this.dt;
        }
        this.dist -= this.hs * this.dt;
        this.vs -= v_acc * this.dt;
        this.alt -= this.dt * this.vs;

        if (this.hs < 2.5)
            this.hs = 0;
    }
}