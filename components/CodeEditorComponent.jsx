import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {okaidia} from '@uiw/codemirror-theme-okaidia';
import styles from '../styles/CodeEditorComponent.module.css'

// קומפננת עריכת קוד בשני קודים שהבאנו את האפשרות לערוך
export default function CodeEditorComponent({tabs, onCodeChange, activeTab, onActiveTabChange}) {
    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {tabs.map((tab, i) =>
                    <p className={activeTab === i ? styles.active : ''}
                       key={tab.title}
                       onClick={() => onActiveTabChange(i)}>
                        {tab.title}
                    </p>)}
            </div>
            <CodeMirror
                value={tabs[activeTab].code}
                theme={okaidia}
                extensions={[javascript({jsx: true})]}
                onChange={onCodeChange}
            />
        </div>
    );
}
