import React, {useEffect} from "react";
import styles from '../styles/LearningComponent.module.css';
import {Key} from "@/util/enums";

export default function LearningComponent({onKeyPressed, onClick, data, fuel}) {
    useEffect(() => {
        const handler = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    onKeyPressed(Key.Left);
                    break;
                case 'ArrowRight':
                    onKeyPressed(Key.Right);
                    break;
                case 'ArrowUp':
                    onKeyPressed(Key.Up);
                    break;
                case 'ArrowDown':
                    onKeyPressed(Key.Down);
                    break;
            }
        };

        window.addEventListener('keydown', handler);

        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [onKeyPressed]);

    return (
        <>
            <p className={styles.data}>Altitude: {data.altitude.toFixed(2)}m
                <br/>Angle: {data.angle.toFixed(2)}°
                <span className={styles.yellow}><br/>Estimated fuel: {fuel.toFixed(2)}</span></p>
            <div className={styles.container}>
                <h1>The Bersheet simulation</h1>
                <p>This game aims to teach us a basic understanding of how to make a spacecraft land on the moon without
                    crashing.<br/>The game relies on the data of the Bersheet spaceship as it crashed on the moon.<br/>
                    <span className={styles.yellow}>Your goal is to land the spacecraft on the moon with as much fuel as
                    possible without crashing</span></p>
                <img src="/altitude-instruction.jpg"
                     alt="altitude-instruction"
                     className={styles.image}/>
                <img src="/angle-instruction.jpg"
                     alt="angle-instruction"
                     className={styles.image}/>
                <button className={styles.simulationButton}
                        onClick={onClick}>Ready for simulation
                </button>
            </div>
        </>
    );
}