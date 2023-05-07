import React, {useCallback, useEffect, useRef} from "react";
import * as THREE from "three";
import styles from '../styles/SimulatorComponent.module.css';
import BereshitComponent from "@/components/BereshitComponent";

export default function SimulatorComponent({data, crashed}) {
    const moonRef = useRef(null);

    useEffect(() => {
        const container = moonRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('moon-texture.jpg');

        const geometry = new THREE.SphereGeometry(1, 50, 50);
        const material = new THREE.MeshBasicMaterial({map: texture});

        const moon = new THREE.Mesh(geometry, material);
        moon.scale.set(1.8, 1.8, 1.8);
        scene.add(moon);

        camera.position.z = 3;

        function animate() {
            requestAnimationFrame(animate);
            moon.rotation.y += 0.0002;
            renderer.render(scene, camera);
        }

        animate();

        return () => container.innerHTML = '';
    }, []);

    return (
        <div className={styles.animationSide}>
            <BereshitComponent data={data}/>
            <div className={styles.moon} ref={moonRef}/>


            {crashed && <>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke2} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke3} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke2} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke3} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke2} src="/smoke.png" alt="smoke"/>
                </div>
                <div className={styles.smokeWrap}>
                    <img className={styles.smoke3} src="/smoke.png" alt="smoke"/>
                </div>
            </>}
        </div>
    );
}