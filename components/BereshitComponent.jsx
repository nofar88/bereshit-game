import React, {useEffect} from "react";
import Image from "next/image";
import {INIT_ALT, INIT_HS} from "@/logic/bereshit";
import styles from '../styles/BereshitComponent.module.css';

export default function BereshitComponent({data: {altitude, angle, horizontalSpeed}}) {
    const calcHeight = () => {
        if (!altitude) return '0px';

        const percent = 1 - ((Math.max(0, altitude) / INIT_ALT));
        return `calc(62vh * ${percent})`
    }

    return (
        <Image
            className={styles.bereshit}
            style={{transform: `translateY(${calcHeight(altitude)}) translateX(calc(20vw * (${horizontalSpeed} / ${INIT_HS}))) rotate(${angle}deg)`}}
            width={100}
            height={100}
            alt="bereshit"
            src="/bereshit.png"/>
    );
}