import React from 'react'
import SetupLayout from '../../component/Layout/SetupLayout'
import Head from 'next/head'
import { CustomModal } from '../../component/Custom/CustomModal'
import CustomeIdleTimer from '../../components/TimerHandler/CustomeIdleTimer'

const index = () => {

  console.log("dashboard")
  return (
    <div>
      <Head>
        <title>Aging Options</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <SetupLayout name='dashboard' id='9'>
        {/* dashboard */}
        {/* <CustomModal /> */}
      </SetupLayout>
    </div>
  )
}

export default index
