import { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'

import Scanner from '../components/scanner'


export default function CreateItemFromScan(props) {
    const router = useRouter()
    const [errorMsg, setErrorMsg] = useState("")
    const [serial, setSerial] = useState(null)
    const [symbology, setSymbology] = useState(null)
    const [haveInitialized, setHaveInitialized] = useState(false)
    const [resumeScanner, setResumeScannerFunction] = useState(null)
    var isShowingPreview = true

    // useEffect(() => {
    //     if (!haveInitialized) {
    //         setHaveInitialized(true)

    //     }
    // }, [])

    useEffect(() => {
        if (!haveInitialized) {
            setHaveInitialized(true)

        }
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                // Will run when leaving the current page; on back/forward actions
                // Add your logic here, like toggling the modal state
                stopScanner()
            }
            return true;
        });
    
        return () => {
            router.beforePopState(() => true);
        };
    }, [router]);

    async function scanResultCallback(curSerial, symbology, error) {
        setSerial(curSerial)
        setSymbology(symbology)

        if (error == null) {
            setSerial(curSerial)
            setSymbology(symbology)
        }
        else {
            setErrorMsg(error)
        }
    }

    async function toggleVideoPreview() {
        if (isShowingPreview) {
            stopCameraPreview()
        }
        else {
            startCameraPreview()
        }
        isShowingPreview = !isShowingPreview
    }

    return (
        <>
            <div className="static ml-0 mr-0 -mt-5 pt-0">
                <Scanner itemType="testScan" callback={scanResultCallback} setResumeFunction={setResumeScannerFunction} />

                {serial &&
                    <div>
                        <div>Barcode: {serial}</div>
                        <div>Symbology: {symbology}</div>
                    </div>
                }

                {errorMsg &&
                    <div className="mt-6">
                        {"error: " + errorMsg}
                    </div>
                }

                <button type="button" 
                    onClick={e => {
                        stopScanner()
                        router.push('/')
                    }}
                >
                    Cancel
                </button>

                <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={e => {
                        toggleVideoPreview()
                    }}
                >
                    Toggle video preview
                </button>
            </div>
        </>
    )
}