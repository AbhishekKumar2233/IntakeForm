import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import React, { useState } from "react";
import { useEffect } from "react";
import Acordianfile from "./Acordianfile";
import konsole from "../../components/control/Konsole";
import { $CommonServiceFn, $getServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "../Store/Actions/action";

const Filecabinetmodal = (props) => {
  const [docmentShow, setDocumentShow] = useState(false);
  const [filedata, setFiledata] = useState([]);
  const [filemenu, setFilemenu] = useState([]);
  const [colorChange, setColorChange] = useState();
  let userId = sessionStorage.getItem("SessPrimaryUserId");
  const [showData, setShowData] = useState();
  const [showName, setShowName] = useState();
  const [pdfdata, setPdfdata] = useState([]);
  const [fileStatus, setfileStatus] = useState();
  const [folderType, setFolderType] = useState("")
  useEffect(() => {
    konsole.log("fileCabinetTypefileCabinetType", props.text);

    filecabinetfilestatusfunc(true);

konsole.log("Modal Dattata",props.filestatus,
props.openModOther,props.currentshow)    
    if (
      props.filestatus &&
      props.openModOther == true &&
      props.filestatus.length != 0
    ) {
      filemenu.filter((e, index) => {
        return e.label == props.filestatus ? docmentHandel(e.value, e.label,index) : "";
      });
      // filemenu.filter((index, e) => {
      //   setDocumentShow(false);
      //   setColorChange(-1);
      //   filecabinetdocumentfunc(-1);
      //   setfileStatus(index);
      // });
    }else if(props.currentshow){
       filemenu.filter((index, e) => {
        setDocumentShow(false);
        setColorChange(-1);
        filecabinetdocumentfunc(-1);
        setfileStatus(index);
      });
    }
  }, [props.text.value, showData]);

  

  useEffect(() => {
    konsole.log("userIdpropTextValue",userId, props.text.value)
    filecabinetPreparedfunc(userId, props.text.value);
  }, [props.text.value]);

  konsole.log("   props.currentshow", props?.currentshow);

  useEffect(() => {
    setColorChange(-1);
    setDocumentShow(false);
  }, [props.text.value]);

  const ImageHandle = (e) => {
    konsole.log("imageEEE",e)
    setShowData(e.value);
    setShowName(e.label);
  };

  const docmentHandel = (e, value,index) => {
    konsole.log("eeeeeee",e,value,index)
    setDocumentShow(true);
    setColorChange(index);
    setFolderType(e)
    filecabinetdocumentfunc(e);
    setfileStatus(value);
  };
  const documentNotShow = () => {
    setDocumentShow(false);
  };

  const filecabinetPreparedfunc = (userId, value) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.filecabinetPreparedByapi + userId + "/" + value,
      "",
      (response, errorData) => {
        if (response) {
          konsole.log("resFileData", response);
          setFiledata(response.data.data);

          setShowData(response.data.data[0].value);
          setShowName(response.data.data[0].label);
        } else if (errorData) {
          if((errorData.data.data.length == 0) && (props.text.value == 6 || props.text.value == 8)){
            const subtenantId = sessionStorage.getItem("SubtenantId")
            const subtenantName = sessionStorage.getItem("subtenantName")
            const obj = {
              value: subtenantId,
              label: subtenantName
            }
            errorData.data.data.push(obj)
            setFiledata(errorData.data.data)
            setShowData(errorData.data.data[0].value);
           setShowName(errorData.data.data[0].label);
            konsole.log("err", errorData);
          }
        }
      }
    );
  };

  const filecabinetfilestatusfunc = (filestatus) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.filecabinetfilestatus + "?IsActive=" + filestatus,
      "",
      (response, errorData) => {
        if (response) {
          let download = response?.data.data;
          if (parseInt(props?.text?.value) == 8){
            download = response?.data?.data?.filter((filt) => {return filt.value !== '1'});
          }
          konsole.log("response dada", download);
          setFilemenu(download);
        } else if (errorData) {
          konsole.log("err", errorData);
        }
      }
    );
  };
   const filterdata = filemenu.filter((e) => {
    if (props.text.value != 6) {
      return e.label !== "Fee Agreement & Other Forms";
    } else {
      return e;
    }
  });

  const filecabinetdocumentfunc = (e) => {
    let FileStatusId = e;
    let FileCategoryId = props.text.value;
    let PreparedByIndex = showData;
    

    konsole.log("FileStatusIdFileStatusId",userId,FileStatusId,FileCategoryId,PreparedByIndex)

    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.filecabinetdocument +
        "/" +
        userId +
        "?FileCategoryId=" +
        FileCategoryId +
        "&PreparedByIndex=" +
        PreparedByIndex +
        "&FileStatusId=" +
        FileStatusId,
      "",
      (response, errorData) => {
        if (response) {
          konsole.log("response", response);
          konsole.log("responseresponseresponse", response?.data?.data);
          setPdfdata(response.data.data);
        } else if (errorData) {
          konsole.log("err", errorData);
        }
      }
    );
  };

  const handleClose = (data) => {
    props.setShow(false);
    setDocumentShow(false);
    props.setDoctypeName(data);
    props.setBreadcrumbdata([showName, fileStatus, -1]);
    konsole.log("datadatadatadata", data);
  };


  konsole.log("filterdatafilterdata",filterdata)

  return (
    <div>
      <Modal
        show={props.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        centered={true}
      >
        <Modal.Header closeButton style={{ backgroundColor: "white" }}>
          <Modal.Title>
            <div>
              <Breadcrumb style={{ color: "black" }}>
                <Breadcrumb.Item href="#"> {props.text.label} </Breadcrumb.Item>
                <Breadcrumb.Item href="#" onClick={documentNotShow}>
                  {showName}
                </Breadcrumb.Item>
                {/* <Breadcrumb.Item href="#">
                  {docmentShow == true ? "Drafts" : ""}
                </Breadcrumb.Item> */}
                {docmentShow == true ? (
                  <Breadcrumb.Item href="#">
                    <span style={{ marginTop: "0px" }}>{fileStatus}</span>
                  </Breadcrumb.Item>
                ) : (
                  ""
                )}
              </Breadcrumb>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={5}>
              <Row>
                <Col xs={6} sm={6} md={6} lg={6} className="d-flex">
                  <div
                    className="p-1"
                    style={{
                      border: "2px solid #EBEDEF",
                      borderRadius: "3px",
                    }}
                  >
                    {konsole.log("fileData",filedata)}
                    {filedata.length != 0
                      ? 
                      filedata?.map((data, index) => (
                        <div
                        className="d-flex"
                        onClick={() => ImageHandle(data)}
                        >
                            {konsole.log("datatta",data)}
                            {showData == data.value ? (
                              <>
                                <div style={{ position: "relative" }}>
                                  <div
                                    style={{
                                      zIndex: "2",
                                      background:
                                        "url('images/Group884.png') no-repeat center center/cover",
                                      width: "122px",
                                      height: "76px",
                                      cursor: "pointer",
                                    }}
                                  ></div>
                                  <div
                                    className="d-flex justify-content-center align-items-center w-100 docText-Tag-Div"
                                    style={{
                                      position: "absolute",
                                      top: "32px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <h6
                                      style={{
                                        color: "white",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {" "}
                                      {data.label}
                                    </h6>
                                  </div>
                                </div>
                                <img
                                  src="images/line24.png"
                                  className="sidhiLineImage "
                                />
                                <img
                                  src="images/line24.png"
                                  className="sidhiLineImage "
                                />
                              </>
                            ) : (
                              <div style={{ position: "relative" }}>
                                <div
                                  style={{
                                    zIndex: "2",
                                    background:
                                      "url('images/Group879.png') no-repeat center center/cover",
                                    width: "122px",
                                    height: "47px",
                                    cursor: "pointer",
                                  }}
                                ></div>
                                <div
                                  className="d-flex justify-content-center align-items-center w-100 docText-Tag-Div"
                                  style={{
                                    position: "absolute",
                                    top: "14px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <h6
                                    style={{ color: "white", fontSize: "10px" }}
                                  >
                                    {" "}
                                    {data.label}
                                  </h6>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      : <div style={{ position: "relative" }}>
                      <div
                        style={{
                          zIndex: "2",
                          background:
                            "url('images/Group879.png') no-repeat center center/cover",
                          width: "122px",
                          height: "47px",
                          cursor: "pointer",
                        }}
                      ></div>
                      <div
                        className="d-flex justify-content-center align-items-center w-100 docText-Tag-Div"
                        style={{
                          position: "absolute",
                          top: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <h6
                          style={{ color: "white", fontSize: "10px" }}
                        >
                         No Files Available
                        </h6>
                      </div>
                    </div>
                    }
                  </div>
                  {/* <div className='GroupSelfDocDiv'>
                                            <img src="images/GroupSelfDoc.png" className='m-0 p-0 w-100' style={{ zIndex: "1" }} />
                                        </div> */}
                  {/* </div> */}
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className="m-0 p-0">
                  <div className="">
                    <div id="tree">
                      <div className="branch">
                        <div className="entry">
                          <span></span>

                          <div className="branch">
                            {filedata.length === 0
                              ? ""
                              : filterdata &&
                              filterdata.map((item, index) => {
                                  return (
                                    <div className="entry">
                                      <span>
                                        <div
                                          className="d-flex"
                                          style={{ cursor: "pointer" }}
                                        
                                        >
                                          <div style={{ width: "46px" }}>
                                            <img
                                              src="images/Group.png"
                                              className="m-0 mt-0 p-0 img-fluid"
                                              onClick={() =>
                                                docmentHandel(item.value, item.label,index)
                                              }
                                            />
                                          </div>
                                          <div
                                            className="d-flex justify-content-start align-items-center px-1 pt-2"
                                            style={{ width: "100px" }}
                                          >
                                            <h6
                                              className="m-0 p-0"
                                              style={{
                                                color: `${
                                                  colorChange == index
                                                    ? "#720C20"
                                                    : "Black"
                                                }`,
                                                fontWeight: 500,
                                                fontSize: "14px",
                                              }}
                                              onClick={() =>
                                                docmentHandel(item.value, item.label,index)
                                              }
                                            >
                                              {item.label}
                                            </h6>
                                          </div>
                                        </div>
                                      </span>
                                    </div>
                                  );
                                })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className='d-flex' style={{ cursor: "pointer" }} onClick={docmentHandel}>
                                        <div>
                                            <img src="images/Group.png" className='m-0 p-0 w-75' />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center px-2'>
                                            <h6 className='fw-bold' style={{ color: "#720C20" }}>Drafts</h6>
                                        </div>
                                    </div>
                                    <div className='d-flex' style={{ marginTop: "30px" }}>
                                        <div>
                                            <img src="images/Group.png" className='m-0 p-0 w-75' />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center px-2'>
                                            <h6 style={{ fontWeight: 600 }} >Current</h6>
                                        </div>
                                    </div>
                                    <div className='d-flex' style={{ marginTop: "30px" }}>
                                        <div>
                                            <img src="images/Group.png" className='m-0 p-0 w-75' />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center px-2'>
                                            <h6 style={{ fontWeight: 600 }}>Archives</h6>
                                        </div>
                                    </div>
                                    <div className='d-flex' style={{ marginTop: "30px" }}>
                                        <div>
                                            <img src="images/Group.png" className='m-0 p-0 w-75' />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center px-2 text-start' style={{ width: "110px" }}>
                                            <h6 className='' style={{ fontWeight: 600 }}>Fee Agreement & Other Forms</h6>
                                        </div>
                                    </div> */}
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={7} className="m-0 p-0">
              {docmentShow == true ? (
                <>
                  <Acordianfile handleClose={handleClose} pdfdata={pdfdata} text={props.text} filecabinetdocumentfunc = {filecabinetdocumentfunc} setDocumentShow = {setDocumentShow} folderType = {folderType}/>
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader,
    }),
});

export default connect("", mapDispatchToProps)(Filecabinetmodal);