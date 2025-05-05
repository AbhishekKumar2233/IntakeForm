import React, { useEffect,useRef, useState } from "react";
import Layout from "../components/layout.js";
import ParentCabinet from "../components/newFileCabinet/ParentCabinet.js";
import { Form, Button, Table, Breadcrumb, Row, Col } from "react-bootstrap";
import { accessToFileCabinet } from "../components/control/Constant.js";
import withAuth from "../components/WithPermisson/withPermisson.js";
import Profile from "../components/ProfilePage/Profile.js";

const Editprofile = (props) => {
  return (
    <Layout name="Edit Profile">
        <Profile typeOf = "GeneralSetting"/>
    </Layout>
  );
};

export default Editprofile
