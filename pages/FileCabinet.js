import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cabinet from "../components/FileCabinet/Cabinet";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Layout from "../components/layout";
import { $CommonServiceFn } from "../components/network/Service";
import { $Service_Url } from "../components/network/UrlPath";
import konsole from "../components/control/Konsole";
import { accessToFileCabinet, imagePath } from "../components/control/Constant";
import Router from "next/router";
import { SET_LOADER } from "../components/Store/Actions/action";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
// import Filecabinetmodal from './FileCabinetModal/Filecabinetmodal';
import Filecabinetmodal from "../components/FileCabinetModal/Filecabinetmodal";
import PdfViwer from "../components/PdfViwer/PdfViwer";
import withAuth from "../components/WithPermisson/withPermisson";

const FileCabinet = (props) => {
  const [userDetail, setUserDetail] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fileCabinetTypeList, setFileCabinetTypeList] = useState([]);
  const [fileCabinetType, setFileCabinetType] = useState({});
  const [doctypeName, setDoctypeName] = useState();
  const [breadcrumbdata, setBreadcrumbdata] = useState();
  const [showCabinetModal, setShowCabinetModal] = useState(false);
  const [openModOther, setOpenModOther] = useState(true);
  const [currentshow, setcurrentshow] = useState(false);
  const containerRef = useRef(null);

  //Sumit code start
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useLayoutEffect(() => {
    if(!containerRef.current) return;

    containerRef.current.style.height = `calc(${`${window.innerHeight}px - 10rem`})`

  }, [containerRef.current]);

  //Sumit code end

  useEffect(() => {
    let userDetail = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    let subtenantId = sessionStorage.getItem("SubtenantId")
    setUserDetail(userDetail);
    getFileCabinetType(subtenantId);
  }, []);

  useEffect(() => {
    if (breadcrumbdata && !doctypeName?.fileTypeName) {
      setSelectedIndex(-1);
    }
  }, [breadcrumbdata]);

  konsole.log("doctypeName", doctypeName);

  const getFileCabinetType = (subtenantId) => {
    props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFileCabinetType,
      "",
      (response) => {
        if (response) {
          konsole.log("setFileCabinetTypeList", response)
          props.dispatchloader(false);
          let fileTypeObj = response.data.data;
          let fileTypeData = fileTypeObj.filter(item => item.value === '8' || item.value === "6");

          for (let loop = 0; loop < fileTypeData.length; loop++) {
            fileTypeData[loop]["imageUrl"] = imagePath[loop];
          }
          konsole.log("fileTypeObjfileTypeObj", fileTypeData)
          // if (subtenantId == 2 || subtenantId == 742) {
          //   fileTypeData = fileTypeObj
          // } else {
          // }
          setFileCabinetTypeList(fileTypeData);
          setFileCabinetType(fileTypeData[0]);
          konsole.log("fileTypeObj", fileTypeObj, imagePath);
        }
      }
    );
  };

  const handleClickButton = (index) => {
    setShow(true);
    if (breadcrumbdata?.length != 0) {
      setcurrentshow(true);
    }
    const fileTypeObj = fileCabinetTypeList[index];
    setSelectedIndex(index);
    setFileCabinetType(fileTypeObj);
  };

  const openModal = (e) => {
    setOpenModOther(true);
    setShow(true);
  };
  const openModalOther = (e) => {
    setOpenModOther(false);
    setShow(true);
  };

  return (
    <Layout name="File Cabinet"  >
      <Row style={{}}>
        <Col>
          {/* <Breadcrumb>
            <Breadcrumb.Item href="#">File Cabinet</Breadcrumb.Item>
            {breadcrumbdata && doctypeName?.fileTypeName && (
              <Breadcrumb.Item href="#">
                {doctypeName?.fileCategoryType
                  ? doctypeName?.fileCategoryType
                  : fileCabinetType.label}
              </Breadcrumb.Item>
            )}
            {breadcrumbdata &&
            doctypeName?.fileTypeName &&
            breadcrumbdata != undefined &&
            breadcrumbdata?.length !== 0 ? (
              <>
                {breadcrumbdata[0] != "  " &&
                breadcrumbdata[0] !== undefined ? (
                  <Breadcrumb.Item href="#" onClick={openModalOther}>
                    <span>{breadcrumbdata[0]}</span>
                  </Breadcrumb.Item>
                ) : (
                  ""
                )}
                {breadcrumbdata[1] != "  " &&
                breadcrumbdata[1] !== undefined ? (
                  <Breadcrumb.Item href="#" onClick={openModal}>
                    <span>{breadcrumbdata[1]}</span>
                  </Breadcrumb.Item>
                ) : (
                  ""
                )}
                <Breadcrumb.Item href="#">
                  <span>{doctypeName?.fileTypeName}</span>
                </Breadcrumb.Item>
              </>
            ) : (
              ""
            )}
          </Breadcrumb> */}
        </Col>
      </Row>
      <div className="cabinet container-fluid" ref={containerRef} id="fileCabinetContainer">
        {/*  */}
        <div className="container-fluid py-2">
          <Row className=" file-cabinet-head">
            <Col className="p-0">
              <div className="d-flex align-items-center justify-content-between ">
                <div className="content-box">
                  <div className="d-flex d-flex align-items-center justify-content-start">
                    {" "}
                    <img
                      src="/icons/ProfilebrandColor2.svg"
                      className="maleAvatarUser"
                      alt="user"
                    />
                    <h2 className="ms-2">{userDetail?.memberName} </h2>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="mt-4">
            <Row>
              <Col xs={2} className="">
                <div className="file">
                  <div
                    className="d-flex flex-column align-items-center justify-content-center gap-1"
                    id="  "
                  >
                    {fileCabinetTypeList.length > 0 &&
                      fileCabinetTypeList.map((map, index) => {
                        konsole.log("map.imageURl", map)
                        return (
                          <button
                            className={`${selectedIndex == index
                                ? "activeButtonCard "
                                : "buttonCard"
                              }`}
                            onClick={() => handleClickButton(index)}
                            key={index}
                          >
                            {/* <i><img src='../images/vector.png' alt='vector'/></i> */}
                            <img src={map.imageUrl} alt="" />
                            <center className="ms-1">{map.label}</center>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </Col>
              <Col xs={10} className="ps-0">
                {doctypeName == "Will" ? <h2>{userDetail?.memberName}</h2> : ""}
                {breadcrumbdata && doctypeName?.fileTypeName ? (
                  <PdfViwer doctypeName={doctypeName} setDoctypeName={setDoctypeName} />
                ) : (
                  "Please Select a FileCabinet ."
                )}
              </Col>
              {
                show == true &&
                <Filecabinetmodal
                  text={fileCabinetType}
                  show={show}
                  setShow={setShow}
                  setDoctypeName={setDoctypeName}
                  setBreadcrumbdata={setBreadcrumbdata}
                  openModOther={openModOther}
                  currentshow={currentshow}
                />
              }
            </Row>
          </div>
        </div>
      </div>
      
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader,
    }),
});

export default withAuth(connect("", mapDispatchToProps)(FileCabinet), accessToFileCabinet);
