import { useEffect } from 'react'
import { useState } from 'react'


export default function Scanner({ itemType, callback, resume, setResumeFunction }) {
    const [haveInitialized, setHaveInitialized] = useState(false)
    const [callbackHasReturned, setCallbackHasReturned] = useState(false)

    useEffect(() => {
        setResumeFunction(() => resumeScanner)

        // only init once
        if (!haveInitialized) {
            setHaveInitialized(true)

            startScanner(localCallback)
        }

        return () => {
            // always stop the scanner if we are leaving this component
            try {
                stopScanner("scanner component")
            }
            catch (error) {
                console.log("problem stopping camera: ", error)
            }
        }
    }, [resume])

    function localCallback(serial, symbology, error) {
        setCallbackHasReturned(true)

        callback(serial, symbology, error)
    }

    async function resumeScanner() {
        setCallbackHasReturned(false)
        resumeCortex()
    };

    return (
        <>
            <div className='m-3 py-5' hidden={callbackHasReturned}>
                <div className="font-medium text-gray-700 flex">
                    <div className="flex-grow" />
                    <div className='ml-1'>{"Scanning..."}</div>
                    <div className="flex-grow" />
                </div>

                <div id="videoContainer" className='mt-2 flex'>
                    <video className='flex-grow' id="video" playsInline />
                </div>

            </div>
        </>
    )
}
