import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Layout from "../components/layout";
// import ParentCabinet from "../components/newFileCabinet/ParentCabinet.js";
import { Form, Button, Table, Breadcrumb, Row, Col } from "react-bootstrap";
import { accessToFileCabinet } from "../components/control/Constant";
import withAuth from "../components/WithPermisson/withPermisson";
import ParentCabinet from "../components/newFileCabinet2/ParentCabinet.js";

const File_Cabinet = (props) => {
  return (
    <Layout name="File_Cabinet">
      <ParentCabinet />
      
    </Layout>
  );
};

export default withAuth(File_Cabinet, accessToFileCabinet)
