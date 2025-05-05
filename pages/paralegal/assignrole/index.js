import { useState, createRef } from 'react';
import Tophead from '../../../components/paralLegalComponent/header/tophead';
import { useScreenshot } from 'use-react-screenshot';
import { connect } from 'react-redux';
import Assignselectshow from './Assignselectshow'

import Head from 'next/head';
import AssignRolesShow from '../../../components/paralLegalComponent/AssingRoles/AssignRolesShow';
import withAuth from '../../../components/WithPermisson/withPermisson';
import { accessToParalegal } from '../../../components/control/Constant';
import CustomeIdleTimer from '../../../components/TimerHandler/CustomeIdleTimer';



const AssignRoles = (props) => {
    const ref = createRef(null)
    const [image, takeScreenshot] = useScreenshot()

    const getImage = () => {
        takeScreenshot(ref.current)

    }

return (
        <div ref={ref} className='bg-white'>
            <Head>
                <title>Aging Options</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            < div className={
                (props.showloader ? "overlay bg-white" : "")
            }>
                {props.showloader == true &&
                    (<div className="spinner-border text-primary blockuiloader"
                        id="spinner" role="status">
                        <span className="sr-only"></span>
                    </div>)}
                    <CustomeIdleTimer />
                <div style={{ height: "10rem", backgroundColor: "white" }}>
                    <Tophead getImage={getImage} page="Assignrole" image={image} />

                </div>
                <div className="d-flex flex-column assignRolesContainer bg-white" style={{ height: "calc(100vh - 10rem)", backgroundColor: "white", overflow: "scroll" }}>
                    <AssignRolesShow />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default withAuth(connect(mapStateToProps, "")(AssignRoles), accessToParalegal);
