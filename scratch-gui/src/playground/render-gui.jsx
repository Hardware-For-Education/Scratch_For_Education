import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import TitledHOC from '../lib/titled-hoc.jsx';
import log from '../lib/log.js';
import VirtualMachine from 'scratch-vm';
import ScratchStorage from 'scratch-storage';
import 'regenerator-runtime/runtime';

const onClickLogo = () => {
    window.location = 'https://scratch.mit.edu';
};

const handleTelemetryModalCancel = () => {
    log('User canceled telemetry modal');
};

const handleTelemetryModalOptIn = () => {
    log('User opted into telemetry');
};

const handleTelemetryModalOptOut = () => {
    log('User opted out of telemetry');
};

const getModuloFromURL = () => {
    const p = new URLSearchParams(window.location.search);
    return p.get('modulo') || 'default.sb3';
};

/*
 * Render the GUI playground. This is a separate function because importing anything
 * that instantiates the VM causes unsupported browsers to crash
 * {object} appTarget - the DOM element to render to
 */
export default async appTarget => {
    GUI.setAppElement(appTarget);

    // note that redux's 'compose' function is just being used as a general utility to make
    // the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
    // ability to compose reducers.
    const WrappedGui = compose(
        AppStateHOC,
        HashParserHOC,
        TitledHOC
    )(GUI);

    // Cargar escenario del modulo
    const vm = new VirtualMachine();
    window.scratchVM = vm;

    // Adjuntar storage mínimo (necesario para cargar .sb3 desde buffer)
    const storage = new ScratchStorage();
    vm.attachStorage(storage);

    let projectData;

    // Descarga del sb3
    const modulo = getModuloFromURL(); // Nombre del modulo en la URL

    const url = `https://tinycoderspuj.github.io/TinyCodersModules/${modulo}`;
    console.log('📦 Descargando proyecto:', url);

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const buf = await resp.arrayBuffer();
        projectData = new Uint8Array(buf);
        console.log('✅ .sb3 descargado');
    } catch (e) {
        console.error('❌ No se pudo descargar el .sb3:', e);

        const url = `https://tinycoderspuj.github.io/TinyCodersModules/default.sb3`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const buf = await resp.arrayBuffer();
        projectData = new Uint8Array(buf);

    }

    // TODO a hack for testing the backpack, allow backpack host to be set by url param
    const backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
    const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

    const scratchDesktopMatches = window.location.href.match(/[?&]isScratchDesktop=([^&]+)/);
    let simulateScratchDesktop;
    if (scratchDesktopMatches) {
        try {
            // parse 'true' into `true`, 'false' into `false`, etc.
            simulateScratchDesktop = JSON.parse(scratchDesktopMatches[1]);
        } catch {
            // it's not JSON so just use the string
            // note that a typo like "falsy" will be treated as true
            simulateScratchDesktop = scratchDesktopMatches[1];
        }
    }

    if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }

    ReactDOM.render(
        // important: this is checking whether `simulateScratchDesktop` is truthy, not just defined!
        simulateScratchDesktop ?
            <WrappedGui
                isScratchDesktop
                showTelemetryModal
                canSave={false}
                onTelemetryModalCancel={handleTelemetryModalCancel}
                onTelemetryModalOptIn={handleTelemetryModalOptIn}
                onTelemetryModalOptOut={handleTelemetryModalOptOut}
                vm={vm}
                projectData={projectData}
            /> :
            <WrappedGui
                backpackVisible
                showComingSoon
                backpackHost={backpackHost}
                canSave={false}
                onClickLogo={onClickLogo}
                vm={vm}
                projectData={projectData}
            />,
        appTarget);
};
