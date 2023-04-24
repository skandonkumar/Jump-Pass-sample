import { SWRConfig } from 'swr'

import Head from 'next/head'
import { useEffect, useState } from 'react'

MyApp.getInitialProps = async (ctx) => {
  // const cortexApiKey = process.env.CORTEX_SCAN_API_KEY
  const cortexApiKey = "l8lS80DgLUZZ7TdGOK7QU61Vp4zM5aWqR/rpeyn4O0o1sXw7aNwCzw+iq2i+pNrblC8fRLMom+lK5KpLECcFz+dGMvPDsX4UKujewV9ZE20sOycsp4rOaHv4IyWCsYuFADiGdbpoOE8qDmBsotn9R8ZxcA2r2Ju7kzOQ4EeKYggOtDCA7xfnKLyAhYyicFMMDwObnMZCdTIocCor+/ybeQ3t1g6aLVC3+PDkHRA8zF0jSUIYaTZpytXQiM5o9gIaW/kW2aqu3OG8CgTvvYCKE30S3wBnYVo+iczmjHp5hz3yPfzyWQqrolZsiMbOxIqioz6U0IKghoX3z8Uexx2Bi6qh1jHnDJ7RXVvbUajlRwE8JfYugypjh7BXxJMswtbqY9DGGYqR5P8cimXDqyZB/g=="

  return { cortexApiKey: cortexApiKey }
}

function MyApp({ Component, pageProps, cortexApiKey }) {
  const [haveInitialized, setHaveInitialized] = useState(false)

  useEffect(() => {
    // only init once
    if (!haveInitialized) {
      setHaveInitialized(true)

      init()
    }

  }, [cortexApiKey])

  function init() {
    // keep trying until we can init the library
    if (typeof initCortex == "undefined") {
      setTimeout(init, 500)
    }
    else {
      initCortex(cortexApiKey)
    }
  }

  return (
    <>
      <Head>
        <script src="/src/cortexScan/CortexDecoderWeb.js" type="text/javascript" />
        <script src="/src/cortexScan/cortex.js" type="text/javascript" />
      </Head>

      <SWRConfig
        value={{
          fetcher: fetch,
          onError: (error) => {
            // no op
          },
        }}
      >

        <Component {...pageProps} />
      </SWRConfig >
    </>
  )
}

export default MyApp
