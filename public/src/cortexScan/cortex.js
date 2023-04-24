var clientCallback = null
var haveInitialized = false
var isCameraRunning = false

function resultCallback(serial, symbology, error) {
    if (clientCallback) {
        clientCallback(serial, symbology, error)
    }
}

function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

async function initCortex(apiKey) {
    try {
        //Initialize the decoder
        await CortexDecoder.CDDecoder.init("/src/cortexScan");

        //Activate the license
        await CortexDecoder.CDLicense.activateLicense(apiKey)

        //Switch preview dimension if mobile
        if (isMobile()) {
            switchVideoSize()
        }

        // default settings
        setDuplicateFilterDuration(2000)
    } catch (err) {
        resultCallback("", "", "Problem setting up scanner, is your camera enabled?")
    }
}

async function startScanner(callback) {
    // remember who wants to be notified
    clientCallback = callback

    if (!isCameraRunning) {
        isCameraRunning = true

        if (!haveInitialized) {
            try {
                await CortexDecoder.CDCamera.init();
            }
            catch (err) {
                isCameraRunning = false
                resultCallback("", "", "No camera available")
                return
            }

            const cameras = await CortexDecoder.CDCamera.getConnectedCameras()
            if (cameras.length > 0) {
                haveInitialized = true

                await setCamera(cameras[0].label)
            }
            else {
                isCameraRunning = false
                resultCallback("", "", "No camera available")
                return
            }
        }

        await startCamera()
        await startCameraPreview()
    }
}

async function stopScanner(page = "") {
    if (isCameraRunning) {
        stopCamera()
        // stopCameraPreview()

        isCameraRunning = false
    }
}

getResult = (result) => {
    try {
        if (result !== undefined && result.results.length > 0) {
            const curScan = result.results[0]
            const serial = curScan.barcodeData
            const symbology = curScan.symbologyName

            stopScanner()

            // report to the listener
            resultCallback(serial, symbology, null)
        }
    } catch (err) {
        resultCallback("", "", err)
    }
}

async function resumeCortex() {
    await startCamera()
    await startCameraPreview()
}

async function startCameraPreview() {
    let screenOrient = {};

    try {
        await CortexDecoder.CDCamera.startPreview(getResult);
        if (iPhoneorMac()) {

            if (!window.orientation) {
                if (window.innerWidth > window.innerHeight) {
                    screenOrient.orient = 'landscape';
                } else {
                    screenOrient.orient = 'portrait';
                }
            } else {
                screenOrient.angle = window.orientation;
            }
        } else {
            screenOrient.orient = (screen.orientation.type) || screen.mozOrientation || screen.msOrientation;
            screenOrient.angle = (screen.orientation.angle)
        }
    } catch (err) {
        resultCallback("", "", err)
    }
}

async function stopCameraPreview() {
    try {
        await CortexDecoder.CDCamera.stopPreview();
    } catch (err) {
        resultCallback("", "", err)
    }
}

async function setCamera(cameraLabel) {
    try {
        if (isMobile()) {
            CortexDecoder.CDCamera.setCameraPosition("BACK")
        } else {
            await CortexDecoder.CDCamera.setCamera(cameraLabel)
        }
    } catch (err) {
        resultCallback("", "", err)
    }
}

async function startCamera() {
    try {
        await CortexDecoder.CDCamera.startCamera()
    } catch (err) {
        resultCallback("", "", err)
    }
}

async function stopCamera() {
    try {
        await CortexDecoder.CDCamera.stopCamera();
    } catch (err) {
        resultCallback("", "", err)
    }
}

function getduplicateFilteringList() {
    let duplicateDelays = [0, 5000, 10000]
    try {
        let duplicateFilteringList = document.getElementById("duplicateFilteringList");
        for (let i of duplicateDelays) {
            let opt = document.createElement("button");
            opt.value = i;
            opt.innerHTML = i / 1000 + " sec delay";
            opt.style.display = "block"
            opt.style.fontSize = "20px"
            opt.style.margin = "auto"
            opt.setAttribute("class", "dropdown-btn")
            opt.onclick = function () {
                let header = document.getElementById("duplicateFilteringList");
                let btns = header.getElementsByClassName("dropdown-btn");
                for (let i = 0; i < btns.length; i++) {
                    if (btns[i].className == "dropdown-btn active") btns[i].className = "dropdown-btn"
                }
                this.className += " active";
                setDuplicateFilterDuration(this.value)
            }
            duplicateFilteringList.appendChild(opt)
        }
    } catch (err) {
        resultCallback("", "", err)
    }
}

function setDuplicateFilterDuration(duration) {
    try {
        CortexDecoder.CDDecoder.setDuplicateDelay(duration)
    } catch (err) {
        resultCallback("", "", err)
    }
}

function switchVideoSize() {
    if (document.getElementById("video").width == 360) {
        document.getElementById("video").width = 640
        document.getElementById("video").height = 360
    } else {
        document.getElementById("video").width = 360
        document.getElementById("video").height = 640
    }
}

function iPhoneorMac() {
    return [
        'iPhone',
        'iPod',
        'Mac68K',
        'MacPPC',
        'MacIntel',
        'iPad'
    ].includes(navigator.platform)
}
