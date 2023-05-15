import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import SimulatorComponent from "@/components/SimulatorComponent";
import {useCallback, useEffect, useState} from "react";
import Bereshit, {INIT_ALT, INIT_HS, WEIGHT_EMP} from "@/logic/bereshit";
import ParametersComponent from "@/components/ParametersComponent";
import CodeEditorComponent from "@/components/CodeEditorComponent";
import {toast, Toaster} from "react-hot-toast";
import GraphsComponent from "@/components/GraphsComponent";
import LearningComponent from "@/components/LearningComponent";
import {Key, ViewState} from "@/util/enums";
import {useRouter} from "next/router";

const INITIAL_DATA = {
    verticalSpeed: 24.8,
    horizontalSpeed: INIT_HS,
    distance: 181 * 1000,
    angle: 58.3,
    altitude: INIT_ALT,
    fuel: 121,
    craftWeight: WEIGHT_EMP,
    NN: 0.7
};

const ALTITUDE_PID_DATA = {
    P0: 0.014,
    I0: 0.000000003,
    D0: 0.2
};

const ANGLE_PID_DATA = {
    P0: 0.314,
    I0: 0.00003,
    D0: 0.13
};

const UPDATE = "function update(error, dt) {\n" +
    "    if (this.firstRun) {\n" +
    "        this.firstRun = false;\n" +
    "        this.lastError = error;\n" +
    "    }\n" +
    "    const diff = (error - this.lastError) / dt;\n" +
    "    this.integralError += error * dt;\n" +
    "    const controlOut = this.P * error + this.I * this.integralError + this.D * diff;\n" +
    "    this.lastError = error;\n" +
    "    return controlOut;\n" +
    "}";

const NEXT_STEP = "function computeNextStep() {\n" +
    "    // main computations\n" +
    "    const ang_rad = this.degreesToRadians(this.ang);\n" +
    "    const h_acc = Math.sin(ang_rad) * this.acc;\n" +
    "    let v_acc = Math.cos(ang_rad) * this.acc;\n" +
    "    const vacc = this.moon.getAcc(this.hs);\n" +
    "    this.time += this.dt;\n" +
    "\n" +
    "    const dw = this.dt * this.globals.ALL_BURN * this.NN;\n" +
    "    if (this.fuel > 0) {\n" +
    "        this.fuel -= dw;\n" +
    "        this.weight = this.globals.WEIGHT_EMP + this.fuel;\n" +
    "        this.acc = this.NN * this.accMax(this.weight);\n" +
    "    } else { // ran out of fuel\n" +
    "        this.acc = 0;\n" +
    "    }\n" +
    "\n" +
    "    v_acc -= vacc;\n" +
    "    if (this.hs > 0) {\n" +
    "        this.hs -= h_acc * this.dt;\n" +
    "    }\n" +
    "    this.dist -= this.hs * this.dt;\n" +
    "    this.vs -= v_acc * this.dt;\n" +
    "    this.alt -= this.dt * this.vs;\n" +
    "\n" +
    "    if (this.hs < 2.5)\n" +
    "        this.hs = 0;\n" +
    "}";

const TABS = [
    {code: UPDATE, title: 'PID Update'},
    {code: NEXT_STEP, title: 'Spacecraft physics'}
];

let timeouts = [];
let allData = [];

export default function Home() {
    const [data, setData] = useState(INITIAL_DATA);
    const [altitudePidData, setAltitudePidData] = useState(ALTITUDE_PID_DATA);
    const [anglePidData, setAnglePidData] = useState(ANGLE_PID_DATA);
    const [crashed, setCrashed] = useState(false);
    const [viewState, setViewState] = useState(ViewState.Learning);
    const [tabs, setTabs] = useState(TABS);
    const [activeTab, setActiveTab] = useState(0);


    const [fuel, setFuel] = useState(INITIAL_DATA.fuel);
    const updateFuel = (data) => {
        if (typeof data === 'object') {
            setFuel(data.fuel);
        }
    }
    useEffect(() => {
        if (viewState !== ViewState.Learning) {
            return;
        }
        const bereshit = new Bereshit(data, altitudePidData, anglePidData, tabs[0].code, tabs[1].code);
        bereshit.lunch(updateFuel);
    }, [altitudePidData, anglePidData, data, tabs, viewState]);

    const router = useRouter();

    const updateData = (newData) => {
        setData(newData);
    }

    const updateFinish = (status) => {
        setViewState(ViewState.Done);
        if (status) {
            toast.error("The spacecraft crashed. It's okay, try again.");
            setCrashed(true);
        } else {
            toast('You successfully landed the spacecraft!', {
                icon: '👏',
            });
        }
    }

    const handleError = (message) => {
        toast.error(message);
        setViewState(ViewState.Done);
    }

    let i = 1;
    const handleUpdate = useCallback((newData) => {
        let handler;
        switch (typeof newData) {
            case "boolean":
                handler = updateFinish;
                break;

            case "object":
                handler = updateData;
                break;

            case "string":
                handler = handleError;
                break;
        }

        timeouts.push(setTimeout(() => handler(newData), i * 50));
        i++;
    }, [i]);

    const updateInitialParams = (key, newValue) => {
        setData(prev => ({...prev, [key]: newValue}));
    }

    const updateAltitudePidData = (key, newValue) => {
        setAltitudePidData(prev => ({...prev, [key]: newValue}))
    }

    const updateAnglePidData = (key, newValue) => {
        setAnglePidData(prev => ({...prev, [key]: newValue}))
    }

    const onCodeChange = useCallback((value) => {
        const newTabs = [...tabs];
        tabs[activeTab].code = value;
        setTabs(newTabs);
    }, [activeTab, tabs]);

    const handleClick = useCallback(() => {
        if (viewState === ViewState.Learning) {
            setViewState(ViewState.DataEntry);
        }

        if (viewState === ViewState.DataEntry) {
            setViewState(ViewState.Running);
            const bereshit = new Bereshit(data, altitudePidData, anglePidData, tabs[0].code, tabs[1].code);
            bereshit.lunch(handleUpdate);
        }
    }, [viewState, data, altitudePidData, anglePidData, tabs, handleUpdate]);

    const handleKeyPressed = useCallback((key) => {
        switch (key) {
            case Key.Up:
                setData(prev => ({...prev, altitude: prev.altitude + 20}));
                break;
            case Key.Down:
                setData(prev => ({...prev, altitude: prev.altitude - 20}));
                break;
            case Key.Left:
                setData(prev => ({...prev, angle: prev.angle + 5}));
                break;
            case Key.Right:
                setData(prev => ({...prev, angle: prev.angle - 5}));
                break;
        }
    }, []);

    const handleReset = () => {
        router.reload();
    }


    const csvMaker = function (objArray) {
        // const csvRows = [];
        // const headers = Object.keys(data[0]);
        // csvRows.push(headers.join(','));
        // debugger
        // const values = data.map(entry => Object.values(entry).join(','));
        // csvRows.push(...values);
        // return csvRows.join('\n');
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let csv = '';

        // Add headers
        const headers = Object.keys(array[0]).filter(header => header !== 'distance' && header !== 'craftWeight');
        csv += headers.join(',') + '\n';

        // Add rows
        for (const row of array) {
            const values = headers.map(header => row[header]);
            csv += values.join(',') + '\n';
        }

        return csv;
    }

    const download = function (data) {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('download', 'simulation data.csv');
        a.click()
    }

    const handleDownload = () => {
        const csvData = csvMaker(allData);
        download(csvData);
    }

    useEffect(() => {
        allData = [...allData, data];
    }, [data]);

    return (
        <>
            <Head>
                <title>The Bersheet simulation</title>
                <meta name="description" content="The Bersheet simulation"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <Toaster position="bottom-center"
                         reverseOrder={false}/>
                <SimulatorComponent data={data} crashed={crashed}/>
                {viewState === ViewState.Learning && <LearningComponent onKeyPressed={handleKeyPressed}
                                                                        onClick={handleClick}
                                                                        data={data}
                                                                        fuel={fuel}/>}
                {viewState === ViewState.DataEntry && <>
                    <ParametersComponent initialData={data}
                                         onInitialChange={updateInitialParams}
                                         altitudePIDData={altitudePidData}
                                         onAltitudeChange={updateAltitudePidData}
                                         anglePidData={anglePidData}
                                         onAngleChange={updateAnglePidData}/>
                    <CodeEditorComponent tabs={tabs}
                                         onCodeChange={onCodeChange}
                                         onActiveTabChange={setActiveTab}
                                         activeTab={activeTab}/>
                    <button className={styles.playButton} onClick={handleClick}>Lunch</button>
                </>}
                {(viewState === ViewState.Running || viewState === ViewState.Done) && <>
                    <GraphsComponent data={data}/>
                    <div className={styles.buttonsBar}>
                        <button className={styles.resetButton}
                                onClick={handleReset}>Reset
                        </button>
                        {viewState === ViewState.Done &&
                            <button className={styles.resetButton}
                                    onClick={handleDownload}>Download Data
                            </button>
                        }
                    </div>
                </>}
            </main>
        </>
    )
}
