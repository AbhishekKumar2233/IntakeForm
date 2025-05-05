import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { Button, Modal } from 'react-bootstrap';
import Api from '../GeneratePdf/helper/api';
import { SET_LOADER } from '../Store/Actions/action';
import { connect } from "react-redux";
import konsole from '../control/Konsole';
import { $AHelper } from '../control/AHelper';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';


// ****************_____________COMPONENT IMPORT FOR SHOW SUMMARY____________*****************************
import FinancialSumInformation from "../GeneratePdf/components/Financial Information/Financial-Sum-Information";
import HealthInfoSumComponent from "../GeneratePdf/components/Health-Info-Component/Health-Info-Sum-Component";
import HousingInformationSumComponent from "../GeneratePdf/components/Housing-Information-Component/Housing-Information-Sum-Component";
import LegalSumInformation from "../GeneratePdf/components/Legal Information/Legal-Sum-Information";
import LivingSumWill from "../GeneratePdf/components/Living Will/Living-Sum-Will";
import AnatomicalSumGifts from "../GeneratePdf/components/Anatomical Gifts/Anatomical-Sum-Gifts";
import HandlingSumofRemains from "../GeneratePdf/components/Handling of Remains/HandlingSum-of-Remains";
import { Services } from "../network/Service";
import FiduciaryAssignSumNew from "../GeneratePdf/components/Fiduciary Assignment/FiduciaryAssignSumNew";

// ****************_____________COMPONENT IMPORT FOR SHOW SUMMARY____________*****************************
const SummaryDoc = ({ btnLabel, modalHeader, component, dispatchloader,yourhouse1,memberId}) => {

    const componentRef = useRef(null);
    const api = new Api();
   
    let loggesInId = sessionStorage.getItem('loggedUserId')
    let primaryUserId = sessionStorage.getItem('SessPrimaryUserId')
    const [errorMessage, setErrorMessage] = useState('');
    const [primaryUser, setPrimaryUser] = useState('');
    const [spouseUserId, setSpouseUserId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const primaryMemberUserId = sessionStorage.getItem("SessPrimaryUserId");
    const [showMail, setShowMail] = useState(false);
    const [errors, setErrors] = useState({});
    const [showField, setShowField] = useState(false);
    const [base64Data, setBase64Data] = useState('');
    const userLoggedInDetail =JSON.parse(sessionStorage.getItem("userLoggedInDetail"));
    let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
    const [formData, setFormData] = useState({
        to: '',
        Subject: '',
        Compose: '',
        bcc: '',
        cc:userLoggedInDetail.primaryEmailId,
      });
      const[sendPdf,setSendPdf] = useState('')
      konsole.log(component,"comp")


    // ***********************____________COMPONENT_LIST_SUMMARY____________*******************
    const componentList = {
        Finance: <FinancialSumInformation primaryUserId={primaryMemberUserId} spouseUserId={spouseUserId} refrencePage="SummaryDoc" />,
        Health: <HealthInfoSumComponent primaryUserId={primaryMemberUserId} spouseUserId={spouseUserId}  refrencePage="SummaryDoc" />,
        Healthpage: <HealthInfoSumComponent primaryUserId={memberId} refrencePage="SummaryDoc2" />,
        Housing: <HousingInformationSumComponent primaryUserId={primaryMemberUserId} refrencePage="SummaryDoc"  yourhouse1={yourhouse1} />,
        Legal: <LegalSumComponent primaryUserId={primaryMemberUserId} spouseUserId={spouseUserId} refrencePage="SummaryDoc" />
    };
    // ***********************____________COMPONENT_LIST_SUMMARY____________*******************


    // ********************______________DEFINE_USEEFFECT______________*****************
    useEffect(() => {
        getUserByUserId()
    }, [primaryMemberUserId])
    // ********************______________FETCH_USERDATA______________*****************

    const getUserByUserId = () => {
        if (!isNotValidNullUndefile(primaryMemberUserId)) return;
        dispatchloader(true)
        api.GetUserByUserId(primaryMemberUserId).then((res) => {
            if (res) {
                konsole.log("responseresponse", res)
                const memberUserId = isNotValidNullUndefile(res.data.data.spouseUserId) ? res.data.data.spouseUserId : '';
                setPrimaryUser(res.data.data.memberName);
                setSpouseUserId(memberUserId);
                setShow(true);
            }

        }).catch(error => {
            setErrorMessage(error.response?.data?.messages?.[0]);
            dispatchloader(false);
            setShowModal(false);
        })
    }

    // ******************_____________MODAL _CONTENT___________***************
    const handleShowModal = () => {
        setShowModal(false)
    }
    // *********************_______________TRIGGER_PRINT PDF BUTTON_____________****************************************

    const reactToPrintTrigger = React.useCallback(() => {
        return <button className="theme-btn me-4" > Print PDF</button>;
      }, []);

    //   **********************____________PRINT CONTENT_____________**************************************************
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


      const generateBase64PDF = React.useCallback (() => {
        const content = componentRef.current;
        const options = {
          margin: 10,
          filename: 'output.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
      
          import("html2pdf.js").then((libr) => {
            libr.default().from(content).set(options).outputPdf().then(pdf => {
            const base64PDF = btoa(pdf);
            setBase64Data('data:application/pdf;base64,'+ base64PDF)
          })
         });
      },[componentRef.current])

   
      const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.to) {
            newErrors.to = 'To field is mandatory';
        }
        if (showField) {
            if (formData.to) {
                const toEmails = formData.to.split(',').map((email) => email.trim());
                for (const toEmail of toEmails) {
                    if (!emailRegex.test(toEmail)) {
                        newErrors.to = 'Please enter a valid email';
                        break;
                    }
                }
            }
            if (formData.cc) {
                const ccEmails = formData.cc.split(',').map((email) => email.trim());
                for (const ccEmail of ccEmails) {
                    if (!emailRegex.test(ccEmail)) {
                        newErrors.cc = 'Please enter a valid email';
                        break;
                    }
                }
            }
            if (formData.bcc) {
                const bccEmails = formData.bcc.split(',').map((email) => email.trim());
                for (const bccEmail of bccEmails) {
                    if (!emailRegex.test(bccEmail)) {
                        newErrors.bcc = 'Please enter a valid email';
                        break;
                    }
                }
            }
        }

         if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
          }
        //   konsole.log(base64Data,"baseData");
          if(isNotValidNullUndefile(base64Data)){    
          const blob = await fetch(base64Data).then((res) => res.blob());
          const file = new File([blob], `${modalHeader}.pdf`, { type: "pdf" });

          let formdata = new FormData();
          const emailContent=`Dear User,\n\nI trust this email finds you well.
           I am forwarding the attached document for your review
            and consideration. The document contains ${modalHeader} of ${userDetailOfPrimary?.memberName}\n\nWith Regards\n${userDetailOfPrimary?.memberName}
          `
          let finalEmailContent=formData?.Compose  == "" ? emailContent:formData?.Compose;
          finalEmailContent = finalEmailContent.replace(/\n/g, '<br>');
          formdata.append("CreatedBy",loggesInId)
          formdata.append("Emailcc", formData?.cc)
          formdata.append("Emailbcc" , formData?.bcc)
          formdata.append("File" , file)
          formdata.append("EmailType" , "SavePdfData")
          formdata.append("EmailTo" , formData?.to)
          formdata.append("EmailSubject" , formData?.Subject == "" ? (`${modalHeader} - ${userDetailOfPrimary.memberName}`)  :formData?.Subject)
          formdata.append("EmailContent",finalEmailContent)
          formdata.append("EmailTemplateId" , 1)
          formdata.append("EmailStatusId" , 1)
          formdata.append("EmailMappingTable" , "EmailMappingTable")
          formdata.append("EmailMappingTablePKId" ,primaryUserId)
          let result = Services.PostEmail(formdata)
          dispatchloader(true)
          result.then((res) => {
          dispatchloader(false)
          setShowMail(false)
          setFormData({
              ...formData,
              to: "",Subject:"",Compose:"", cc:"",bcc:""
              });
              AlertToaster.success("Email sent successfully");
          }).catch((err) => {
              console.log("errr",err)
              dispatchloader(false)
          })
        }
         }

        const handleChanges =(e)=>{
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: value
            });
            setErrors({
                ...errors,
                [name]: ''
            });
        }


        const toggleCc = () => {
            setShowField(!showField);
        }

        const modalToShare =()=>{
            generateBase64PDF()
            setShowMail(true)
        }

        const closeShareModal=()=>{
            setShowMail(false);
            setShowField(false)
        }
        konsole.log(componentRef?.current,"compRef")
    
    return (
        <>
            <button className="theme-btn" onClick={() => setShowModal(true)}> {btnLabel} </button>
            <Modal
                show={showModal}
                centered
                onHide={handleShowModal}
                id="gen"
                backdrop="static"
                size="lg"
                animation="false"
                className="generatePdfModal" >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{modalHeader} - {primaryUser}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="" >
                    <div className="App position-relative generatePdf pt-3" ref={componentRef} >

                        {/* ***********SUMMERY OF COMPONENT ******************************* */}
                        <div className="position-relative">
                        <div className="position-absolute h-100 w-100"></div>
                        {componentList[component]}
                        </div>
                        {/* ***********SUMMERY OF COMPONENT ******************************* */}

                    </div>
                </Modal.Body>
                <Modal.Footer className="text-center">
          <div class="w-100">
            <ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} />
            <button className="theme-btn mt-2" onClick={handleShowModal}>Close</button>
            <button className="theme-btn mt-2 ms-4" onClick={()=>modalToShare()}> Share</button>
          </div>
        </Modal.Footer>
            </Modal>

            <Modal 
            centered={true}
            size="md"
            show={showMail}
            backdrop="static" 
            style={{ opacity: "0.1 !importtant", zIndex: "9999", background: "rgba(0,0,0,0.5)" }}
            >
                <Modal.Header style={{ backgroundColor: "#871a27" }}>
                    <div className='row w-100'>
                        <div className='col-5'>
                            <h5 style={{ color: "aliceblue", marginBottom: "auto", }}><span>Forward Document</span></h5>
                        </div>
                        <div className=' offset-6 col-1 '>
                            <button className='closeButton bg-transparent text-white border-0 ' style={{fontSize:"19px",marginTop:"-8px"}} onClick={() => closeShareModal()}>x</button>
                        </div>             
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <> 
                        <form className="compose-container" 
                        onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <div className='position-relative'>
                                    <input type="text" id="to" name="to" className="recipient-input" placeholder="To" 
                                      onChange={handleChanges}
                                     />
                                
                                    <h6 className='position-absolute fw-normal top-0 end-0 mt-2 me-4 border-0 bg-white cursor-pointer' 
                                    onClick={toggleCc}
                                    >Cc / Bcc</h6>
                                    {errors.to && <p className='text-danger'> <div className="error">{errors.to}</div></p>}
                                </div>
                                {showField && <input type="text" id="cc" name="cc" className="recipient-input" placeholder="Cc" 
                                defaultValue={(`${userLoggedInDetail.primaryEmailId}`)} 
                                onChange={handleChanges}
                                 />}
                                 {errors.cc && <p className='text-danger'> <div className="error">{errors.cc}</div></p>}
                                {showField && <input type="text" id="bcc" name="bcc" className="recipient-input" placeholder="Bcc" 
                                onChange={handleChanges}
                                 />}
                                   {errors.bcc && <p className='text-danger'> <div className="error">{errors.bcc}</div></p>}

                            </div>
                            <input type="text" id="Subject" name="Subject" className="subject-input"
                              defaultValue={`${modalHeader} - ${userDetailOfPrimary.memberName}`}
                             onChange={handleChanges} 
                             />
                             
                            <textarea 
                            className="message-input" 
                            id="Compose" 
                            name="Compose" 
                            rows="10"
                            placeholder="Compose your message..."
                            defaultValue={`Dear User,\n\nI trust this email finds you well. I am forwarding the attached document for your review and consideration. The document contains ${modalHeader} of ${userDetailOfPrimary?.memberName}\n\nWith Regards\n${userDetailOfPrimary?.memberName}`}
                            onChange={handleChanges} 
                            />
                            <div className='d-flex justify-content-center w-100' >
                                <button type="submit" style={{ height: "46px" }} className="send-button me-2">Send</button>
                               
                            </div>
                        </form>
                    </>
                </Modal.Body >

            </Modal >

        </>
    )
}



const LegalSumComponent = ({ primaryUserId, spouseUserId }) => {

    return <>
        <LegalSumInformation primaryUserId={primaryUserId}  refrencePage="SummaryDoc" />
        <br></br>
        <div className='container-fluid '>
            <FiduciaryAssignSumNew refrencePage="SummaryDoc" />
            <div>
            <LivingSumWill primaryUserId={primaryUserId} spouseUserId={spouseUserId} refrencePage="SummaryDoc" />
            <AnatomicalSumGifts primaryUserId={primaryUserId} spouseUserId={spouseUserId} refrencePage="SummaryDoc" />
            <HandlingSumofRemains primaryUserId={primaryUserId} spouseUserId={spouseUserId} refrencePage="SummaryDoc" />
            </div>
        </div>
    </>
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(SummaryDoc);