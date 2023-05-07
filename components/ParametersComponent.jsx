import React from "react";
import styles from '../styles/ParametersComponent.module.css';

export default function ParametersComponent({altitudePIDData, onAltitudeChange, anglePidData, onAngleChange, initialData, onInitialChange}) {
    return (
        <div className={styles.container}>
            <div className={styles.pidData}>
                <h1>Altitude PID Controller</h1>
                <div className={styles.inputs}>
                    {Object.keys(altitudePIDData).map(key => (
                        <label key={key}>
                            <p>{key}</p>
                            <input type="number"
                                   onChange={(e) => onAltitudeChange(key, e.target.value)}
                                   value={altitudePIDData[key]}/>
                        </label>
                    ))}
                </div>

                <h1>Angle PID Controller</h1>
                <div className={styles.inputs}>
                    {Object.keys(anglePidData).map(key => (
                        <label key={key}>
                            <p>{key}</p>
                            <input type="number"
                                   onChange={(e) => onAngleChange(key, e.target.value)}
                                   value={anglePidData[key]}/>
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.initialData}>
                <h1>Initial Data</h1>
                <div className={styles.inputs}>
                    {Object.keys(initialData).map(key => (
                        <label key={key}>
                            <p>{key}</p>
                            <input type="number"
                                   onChange={(e) => onInitialChange(key, e.target.value)}
                                   value={initialData[key]}/>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}