import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import styles from '../styles/GraphsComponent.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

export default function GraphsComponent({data: {altitude, fuel, verticalSpeed, horizontalSpeed, NN, time}}) {
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState({altitude: [], fuel: [], verticalSpeed: [], NN: [], horizontalSpeed: []});

    useEffect(() => {
        setLabels(prevState => [...prevState, time])
    }, [time]);

    useEffect(() => {
        setData(prev => ({...prev, altitude: [...prev.altitude, altitude]}));
    }, [altitude]);

    useEffect(() => {
        setData(prev => ({...prev, fuel: [...prev.fuel, fuel]}));
    }, [fuel]);

    useEffect(() => {
        setData(prev => ({...prev, verticalSpeed: [...prev.verticalSpeed, verticalSpeed]}));
    }, [verticalSpeed]);

    useEffect(() => {
        setData(prev => ({...prev, NN: [...prev.NN, NN]}));
    }, [NN]);

    useEffect(() => {
        setData(prev => ({...prev, horizontalSpeed: [...prev.horizontalSpeed, horizontalSpeed]}));
    }, [horizontalSpeed]);

    // useEffect(() => {
    //     setData(prev => ({
    //         altitude: [...prev.altitude, altitude],
    //         fuel: [...prev.fuel, fuel],
    //         verticalSpeed: [...prev.verticalSpeed, verticalSpeed],
    //         horizontalSpeed: [...prev.horizontalSpeed, horizontalSpeed],
    //         NN: [...prev.NN, NN],
    //     }));
    // }, [altitude, fuel, verticalSpeed, horizontalSpeed, NN, time]);

    return (
        <div className={styles.container}>
            <div className={styles.graph}>
                <Line options={options} data={{
                    labels,
                    datasets: [
                        {
                            label: 'Altitude',
                            data: data.altitude,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                    ],
                }}/>
            </div>
            <div className={styles.graph}>
                <Line options={options} data={{
                    labels,
                    datasets: [
                        {
                            label: 'Fuel',
                            data: data.fuel,
                            borderColor: 'rgb(99,213,255)',
                            backgroundColor: 'rgba(99,219,255,0.5)',
                        },
                    ],
                }}/>
            </div>
            <div className={styles.graph}>
                <Line options={options} data={{
                    labels,
                    datasets: [
                        {
                            label: 'Vertical Speed',
                            data: data.verticalSpeed,
                            borderColor: 'rgb(180,255,99)',
                            backgroundColor: 'rgba(180,255,99,0.5)',
                        },
                        {
                            label: 'Horizontal Speed',
                            data: data.horizontalSpeed,
                            borderColor: 'rgb(255,169,99)',
                            backgroundColor: 'rgba(255,169,99,0.5)',
                        },
                    ],
                }}/>
            </div>
            <div className={styles.graph}>
                <Line options={options} data={{
                    labels,
                    datasets: [
                        {
                            label: 'NN',
                            data: data.NN,
                            borderColor: 'rgb(255,247,99)',
                            backgroundColor: 'rgba(255,234,99,0.5)',
                        },
                    ],
                }}/>
            </div>
        </div>);
}