export default class Moon {
    static ACC = 1.622;
    static EQ_SPEED = 1700;
    static RADIUS = 3475 * 1000;

    static getAcc(speed) {
        const n = Math.abs(speed) / this.EQ_SPEED;
        return (1 - n) * this.ACC;
    }
}