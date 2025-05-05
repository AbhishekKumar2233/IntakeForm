import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Layout from "../components/layout";
import Emergencymain from "../components/Emergeny/Emergencymain";
import withAuth from "../components/WithPermisson/withPermisson";
import { accessToFileCabinet, demo } from "../components/control/Constant";

const Emergency = () => {
    return (
        <Layout name="Emergency">
           <Emergencymain />
        </Layout>
    );
};


export default withAuth(Emergency,accessToFileCabinet)
