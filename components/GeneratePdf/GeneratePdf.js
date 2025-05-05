import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { Button, Modal } from 'react-bootstrap';
import Api from "./helper/api";
import { SET_LOADER } from "../Store/Actions/action";
import { connect } from "react-redux";
import { $AHelper } from "../control/AHelper";
import konsole from "../control/Konsole";



//import file component
import PersonalInformation from './components/personal-information/personal-information';
import ChildrenComp from './components/children-component/children-component';
import HealthInfoComponent from './components/Health-Info-Component/Health-Info-Component'
import HousingInformationComponent from './components/Housing-Information-Component/Housing-Information-Component'
import ClientInformationForm from './components/Client-Information-Form/Client-Information-Form'
import FinancialInformation from './components/Financial Information/Financial-Information';
import LegalInformation from './components/Legal Information/Legal-Information';
import LivingWill from './components/Living Will/Living-Will';
import AnatomicalGifts from './components/Anatomical Gifts/Anatomical-Gifts';
import HandlingofRemains from './components/Handling of Remains/Handling-of-Remains'
import FiduciaryAssignSumNew from "./components/Fiduciary Assignment/FiduciaryAssignSumNew";



const GeneratePDF = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [primaryUser, setPrimaryUser] = useState('');
  const [spouseUserId, setSpouseUserId] = useState('');
  const memberId = (props.memberId !== undefined) ? props.memberId : '';
  const [show, setShow] = useState(false);
  const componentRef = useRef(null);

  const api = new Api();

  useEffect(() => {
    props.dispatchloader(true);
    api.GetUserByUserId(memberId)
      .then((res) => {
        props.dispatchloader(false);
        if(res){
          konsole.log("responseresponse",res)
          const memberUserId = (res.data.data.spouseUserId !== null) ? res.data.data.spouseUserId : '';
          setPrimaryUser(res.data.data.memberName);
          setSpouseUserId(memberUserId);
          setShow(true);
        }
      }).catch(error => {
        setErrorMessage(error.response?.data?.messages[0]);
        props.dispatchloader(false);
        setShow(false);
      })
  }, [])

  // const reactToDownloadPDF = () => {
  //   let doc = new jsPDF("p", "mm", "a4");

  //   let pdfjs = componentRef.current;

  //   doc.html(pdfjs, {
  //     callback: function(doc) {
  //       doc.save("output.pdf");
  //     },
  //   });
  // }



  const reactToPrintTrigger = React.useCallback(() => {
    return <button className="theme-btn me-4" > Print PDF</button>;
  }, []);

  // const reactToPrintContent = React.useCallback(() => {
  //   let elem = componentRef.current;
  //   let domClone = elem.cloneNode(true);
  //   let $printSection = document.createElement("div");
  //   $printSection.id = "printSection";
  //   $printSection.innerHTML = "";
  //   $printSection.appendChild(domClone);
  //   $printSection.style.width = "298mm"; /* DIN A4 standard paper size */
  //   $printSection.style.height = "210mm"
  //   // $printSection.style.padding = "50px"
  //   let contentHeight = $printSection.scrollHeight;
  //   $printSection.style.height = contentHeight + "px";
  //   $printSection.style.padding = "0 50px"
  //   return $printSection;
  // }, [componentRef.current]);

  const reactToPrintContent = React.useCallback(() => {
    let elem = componentRef.current;
    let domClone = elem.cloneNode(true);
    let $printSection = document.createElement("div");
    $printSection.id = "printSection";
    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    $printSection.style.width = "100%";
    let contentHeight = $printSection.scrollHeight;
    $printSection.style.height = contentHeight + "px";
    $printSection.style.padding = "0 40px";
    // let lastElement = $printSection.lastChild;
    // if (lastElement) {
    //   lastElement.classList.add("pageBreakAfter");
    // }
    return $printSection;
  }, [componentRef.current]);

  return (
    (show) ?
      <Modal show={props.show} centered onHide={props.handleShow} id="gen" backdrop="static" size="lg" animation="false" className="generatePdfModal" >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Client Information Detail - {primaryUser}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="" >
          <div className="App position-relative generatePdf pt-3" ref={componentRef}>
            <div className="pageBreakbefore"></div>
            <ClientInformationForm primaryUser={primaryUser} spouseUserId={spouseUserId}></ClientInformationForm>
            {/* <div className="pageBreakAfter"></div>  */}
            <div className="position-relative">

            <div className="position-absolute h-100 w-100"></div>
              {/* <div className="pageBreakAfter"></div> */}
              <br></br>
              {/* <div className="pt-5"></div> */}
              {<PersonalInformation primaryUserId={memberId} spouseUserId={spouseUserId} dispatchloader={props.dispatchloader}></PersonalInformation>}
              <br></br> 
              {/* <div className="pageBreakbefore"></div> */}
              {/* <div className="pt-5"></div> */}
               <ChildrenComp primaryUserId={memberId} spouseUserId={spouseUserId}></ChildrenComp>
              {/* <div className="pageBreakAfter"></div> */}
              <br></br>

              <HealthInfoComponent primaryUserId={memberId} spouseUserId={spouseUserId}></HealthInfoComponent>
              {/* <div className="pageBreakAfter"></div> */}
              <br></br>
              <HousingInformationComponent primaryUserId={memberId}></HousingInformationComponent>
              {/* <div className="pageBreakAfter"></div> */}
              <br></br>
              <FinancialInformation primaryUserId={memberId} spouseUserId={spouseUserId} />
              {/* <div className="pageBreakAfter"></div> */}
              <br></br>
              <LegalInformation primaryUserId={memberId} />    
              <br></br>
              <div className='container-fluid '>
                {/* <div className="pageBreakAfter"></div> */}
                <FiduciaryAssignSumNew />
                {/* <div className="pageBreakAfter"></div> */}
                <LivingWill primaryUserId={memberId} spouseUserId={spouseUserId} />

                <AnatomicalGifts primaryUserId={memberId} spouseUserId={spouseUserId} />

                <HandlingofRemains primaryUserId={memberId} spouseUserId={spouseUserId} />
              </div>   
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <div class="w-100">
            <ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} />
            <button className="theme-btn mt-2" onClick={props.handleShow}>Close</button>
          </div>
          {/* <button onClick={reactToDownloadPDF} style={{backgroundColor:"#751521", color:"white", border:"none", fontSize:"1.2em", borderRadius:"5px" }}>Download Pdf</button> */}
        </Modal.Footer>
      </Modal>
      :
      <Modal show={props.show} onHide={props.handleShow}>
        <Modal.Body>
          <center>{errorMessage}</center>
        </Modal.Body>
      </Modal>
  );
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({
      type: SET_LOADER,
      payload: loader
    }),
});

export default connect("", mapDispatchToProps)(GeneratePDF);
