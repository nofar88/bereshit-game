import PID from "@/logic/PID";
import SpaceCraft from "@/logic/SpaceCraft";
import Moon from "@/logic/Moon";

export const WEIGHT_EMP = 165; // kg
export const WEIGHT_FULE = 420; // kg
export const WEIGHT_FULL = WEIGHT_EMP + WEIGHT_FULE; // kg
export const MAIN_ENG_F = 430; // N
export const SECOND_ENG_F = 25; // N
export const MAIN_BURN = 0.15; //liter per sec, 12 liter per m'
export const SECOND_BURN = 0.009; //liter per sec 0.6 liter per m'
export const ALL_BURN = MAIN_BURN + 8 * SECOND_BURN;

export const INIT_ALT = 13748;
export const INIT_HS = 932;

export default class Bereshit {
    constructor(initialData, altitudePidData, anglePidData, pidUpdateCode, spaceCraftCompute) {
        this.initial = initialData;
        this.altitudePid = altitudePidData;
        this.anglePid = anglePidData;
        this.pidUpdateCode = pidUpdateCode;
        this.spaceCraftCompute = spaceCraftCompute;
    }

    getDesiredHs(alt) {
        const minAlt = 2000;
        const maxAlt = 30000;
        if (alt < minAlt)
            return 0;
        if (alt > maxAlt)
            return Moon.EQ_SPEED;

        const norm = (alt - minAlt) / (maxAlt - minAlt);
        return norm * Moon.EQ_SPEED;
    }

    getDesiredVs(alt) {
        if (alt > 8000)
            return 30;
        if (alt > 500)
            return 24;
        if (alt > 300)
            return 12;
        if (alt > 100)
            return 6;
        if (alt > 50)
            return 3;
        if (alt > 25)
            return 2;
        return 1;
    }

    getDesiredAngle(alt) {
        if (alt > 1500)
            return 60;
        if (alt > 1200)
            return 50;
        if (alt > 1000)
            return 30;
        return 0;
    }

    lunch(handleUpdate = () => {
    }) {
        try {
            // starting point:
            const vs = this.initial.verticalSpeed;
            const hs = this.initial.horizontalSpeed;
            const dist = this.initial.distance;
            const ang = this.initial.angle; // zero is vertical (as in landing)
            const alt = this.initial.altitude; // 2:25:40 (as in the simulation) // https://www.youtube.com/watch?v=JJ0VfRL9AMs
            const time = 0;
            const dt = 1; // sec
            const acc = 0; // Acceleration rate (m/s^2)
            const fuel = this.initial.fuel; //
            const weight = this.initial.craftWeight + this.initial.fuel;
            const NN = this.initial.NN; // rate[0,1]

            // create a spacecraft with the starting conditions
            const craft = new SpaceCraft(vs, hs, ang, fuel, NN, dist, alt, time, dt, acc, weight, this.spaceCraftCompute);

            const pid = new PID(this.altitudePid.P0, this.altitudePid.I0, this.altitudePid.D0, this.pidUpdateCode);
            const pid_ang = new PID(this.anglePid.P0, this.anglePid.I0, this.anglePid.D0, this.pidUpdateCode);

            let iteration = 0;

            // ***** main simulation loop ******
            while (craft.alt > 0) {
                iteration++;
                if (iteration > 1500) {
                    throw new Error('Infinite loop, please fix the code');
                }

                if (craft.alt > INIT_ALT * 1.5) {
                    throw new Error('The spacecraft was lost in space...');
                }

                // get the desired vs, hs, angle
                const desired_vs = this.getDesiredVs(craft.alt);
                const desired_hs = this.getDesiredHs(craft.alt);
                const dsAngle = this.getDesiredAngle(craft.alt);

                // this pid takes the sum of horizontal and vertical errors
                const thrustIncr = pid.update(craft.vs - desired_vs + craft.hs - desired_hs, craft.dt);

                // angel correction
                const angIncr = pid_ang.update(dsAngle - craft.ang, craft.dt);

                // adjust angle
                craft.increaseAngle(angIncr);

                // adjust thrust
                craft.increaseThrust(thrustIncr);

                // physics stuff
                craft.computeNextStep();

                handleUpdate({
                    altitude: craft.alt,
                    angle: craft.ang,
                    verticalSpeed: craft.vs,
                    horizontalSpeed: craft.hs,
                    time: craft.time,
                    fuel: craft.fuel,
                    NN: craft.NN,
                });
            }

            handleUpdate(craft.fuel <= 0 || 0 < craft.alt || craft.vs >= 2.5 || craft.hs >= 2.5);
        } catch (e) {
            handleUpdate(e.toString())
        }
    }
}