import React, { useContext, useEffect, useMemo, useState } from "react";
import { $AHelper } from "../Helper/$AHelper";
import { Table } from "react-bootstrap";
import { CustomButton, CustomButton3 } from "../Custom/CustomButton";
import CustomModal from "../Custom/CustomModal";
import { $ApiHelper } from "../Helper/$ApiHelper";
import usePrimaryUserId from "../Hooks/usePrimaryUserId";
import { isNotValidNullUndefile, postApiCall } from "../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../components/network/UrlPath";
import { globalContext } from "../../pages/_app";
import { useLoader } from "../utils/utils";
import { CustomInputSearch } from "../Custom/CustomComponent";
import { useAppDispatch, useAppSelector } from "../Hooks/useRedux";
import { selectOccurrance } from "../Redux/Store/selectors";
import { updateOccurranceDetails } from "../Redux/Reducers/occurranceSlice";
import konsole from "../../components/control/Konsole";


const AgentTable = (props) => {
    const { primaryDetails, spouseDetails, subtenantId, spouseUserId, primaryUserId, loggedInUserId, primaryMemberFullName, spouseFullName, isPrimaryMemberMaritalStatus, spouseFirstName } = usePrimaryUserId();
    const { setWarning } = useContext(globalContext)
    const [searchValue, setSearchValue] = useState('');
    const [showModal,setShowmodal] = useState(false);
    const [mailTemplate, setMailtemplate] = useState(<></>)
    const [selectedAgent,setSelectedAgent] = useState({})
    const [emailtempdata,setemailtempdata] = useState({})
    const [texttempdata,settexttempdata] = useState({})
    const occurrenceApiData = useAppSelector(selectOccurrance);
    const { occurranceDetails } = occurrenceApiData;
    const dispatch = useAppDispatch();
    const occurrenceId = 20;
    const [showTable,setShowtable] = useState(1)

    const tableHeader = showTable == 1 ? [
        { id: 1, name: 'Agent' },
        { id: 2, name: 'Document' },
        { id: 3, name: 'Role' },
        { id: 4, name: 'Order' },
        { id: 5, name: 'Status' },
    ] : [
        { id: 1, name: 'Document' },
        { id: 2, name: 'Role' },
        { id: 3, name: 'Agent' },
        { id: 4, name: 'Order' },
        { id: 5, name: 'Status' },
    ];

    useEffect(()=>{
        // fetchTemplate()
        console.log(occurranceDetails,"occurranceDetails")
        if(!$AHelper.$isNotNullUndefine(occurranceDetails[occurrenceId])){
            fetchTemplate();
        }
    },[occurranceDetails])


    const filteredSearchData = useMemo(() => {
        if ($AHelper.$isNotNullUndefine(searchValue)) {
            const searchString = searchValue.toLowerCase();
            return props?.agentData.length > 0 && props?.agentData != 'err' && props?.agentData.filter(item => showTable == 1 ? item?.fullName?.toLowerCase().includes(searchString) : item?.legalDocName?.toLowerCase().includes(searchString));
        }
        return (props?.agentData == 'err') ? [] : props?.agentData || [];
    }, [searchValue, props?.agentData]);


    const fetchTemplate = async () => {
            useLoader(true)
            // const obj = { occurrenceId: 20, subtenantId: 2 }
            // let updateOccurranceDetails = occurranceDetails[occurrenceId]
            let updatedOccDetail = occurranceDetails;
        if (!$AHelper.$isNotNullUndefine(updatedOccDetail[occurrenceId])) {
            useLoader(true);
            const obj = { occurrenceId: occurrenceId, subtenantId: subtenantId }
            let _resultOfOcc22 = await $ApiHelper.$getOccurrance(obj);
            useLoader(false);
            konsole.log("_resultOfOcc22", _resultOfOcc22);
            if (_resultOfOcc22 == 'err404') {
                alert($Msg_InviteSpouse?._emailTemplate404);
                return;
            }

            if (!updatedOccDetail || !Object.isExtensible(updatedOccDetail)) {
                updatedOccDetail = { ...occurranceDetails }; // Create a new extensible object
            }

            updatedOccDetail[occurrenceId] = _resultOfOcc22;

            konsole.log(occurranceDetails,"updatedOccDetail1", updatedOccDetail);

            dispatch(updateOccurranceDetails(updatedOccDetail));
            konsole.log(occurranceDetails,"updatedOccDetail2", updatedOccDetail);

    }
}
    // console.log(filteredSearchData,"filteredSearchData",agentData)
    
    const sentInvite = async (item) => {
        // console.log(item,"itemitemitemitem")

        konsole.log("occurranceDetails", occurranceDetails);

        // Add the functionality to send the invite here
        if (!$AHelper.$isNotNullUndefine(occurranceDetails[occurrenceId])) {
            setWarning("warning", "Warning", "The email template is not available Please contact the administrator to send an invite.");
            return;
        } 

        let updatedOccDetails=occurranceDetails[occurrenceId]
        let emailTemp = updatedOccDetails.emailTemp[0].templateContent;
        let textTemp = updatedOccDetails.textTemp[0].textTemplateContent;

        emailTemp = emailTemp.replace('@@AGENTNAME',item.fullName);
        emailTemp = emailTemp.replace('@@USERNAME',props?.activeTab == 1 ? primaryMemberFullName : spouseFullName);

        textTemp = textTemp.replace('@@AGENTNAME',item.fullName);
        textTemp = textTemp.replace('@@USERNAME',props?.activeTab == 1 ? primaryMemberFullName : spouseFullName);

        setMailtemplate({emailTemp:emailTemp,textTemp:textTemp})
        setemailtempdata(updatedOccDetails?.emailTemp[0])
        settexttempdata(updatedOccDetails?.textTemp[0])

        setSelectedAgent(item)
        setShowmodal(true)
    }

    const handleNextBtn = () => {
        if (props?.activeTab == 1) {
            props?.setActiveTab(2);
        } else {
            $AHelper.$dashboardNextRoute('Emergency')
        }
    };


    const userGenerateLinks = async () => {
        let dataObj = {
            subtenantId: subtenantId ? subtenantId :2,
            linkTypeId: 2,
            linkStatusId: 1,
            userId: selectedAgent?.agentUserId,
            occurrenceId: 20,
            createdBy: loggedInUserId,
          };

        if(selectedAgent.agentEmailId == null){
            setWarning('warning', 'Warning', `Please enter the user's primary email to send the invitation link`);
            setShowmodal(false);
            return;
        }

        useLoader(true)
        const generateLinks = await postApiCall('POST',$Service_Url.userGenerateLinks,dataObj)
        useLoader(false)
        if(generateLinks != 'err'){
            const uniqueLink = generateLinks.data.data.uniqueLinkURL+"&&SHOW_LIST_ALL";
            sentMailApi(uniqueLink);
        }
    }


    const sentMailApi = async(uniqueLink) => {
        let emailTemps = mailTemplate.emailTemp;
        emailTemps = emailTemps.replaceAll('@@UNIQUELINK',uniqueLink);

        let dataObj = {
            emailType: emailtempdata.templateType,
            emailTo: selectedAgent?.agentEmailId,
            emailSubject: emailtempdata.emailSubject,
            emailContent: emailTemps,
            // "emailFrom": commmediumdata.commMediumRoles[0].fromRoleId,
            // emailFromDisplayName: commmediumdata.commMediumRoles.fromRoleName,
            emailTemplateId: emailtempdata.templateId,
            emailStatusId: 1,
            emailMappingTable: selectedAgent.fullName,
            emailMappingTablePKId: selectedAgent.agentUserId,
            createdBy: loggedInUserId,
          };


          
        let textTemps = mailTemplate.textTemp;
        textTemps = textTemps.replaceAll('@@UNIQUELINK',uniqueLink);

        let dataObjtext = {
            smsType: texttempdata.textTemplateType,
            textTo: selectedAgent.agentMobileNo,
            textContent: textTemps,
            smsTemplateId: texttempdata.textTemplateId,
            smsStatusId: 1,
            smsMappingTable: "",
            smsMappingTablePKId: "",
            createdBy: loggedInUserId,
          };

          const jsonObj = {
            // isMobile
            isEmail:true,
            isMobile:selectedAgent?.agentMobileNo == null ? false : true,
            emailJson: dataObj,
            mobileJson: dataObjtext,
        }

        useLoader(true)
        const postsentmailApi = await $ApiHelper.$sentMail(jsonObj);
          useLoader(false)
          if(postsentmailApi != 'err'){
            setWarning('successfully', 'Successfully', `Invitation for agent sent successfully`);
          }
          setShowmodal(false);
    }



    return(
        <div className="col-12 mt-10">
        <div id="information-table" className="my-5 information-table border-0 mt-4">
            <div className="col-12 table-search-section px-4 align-items-center mb-0 py-0 mt-3  border-none" style={{height:'40px'}}>
                <div className="children-header col-5">
                    <span>Agents/Legal Documents</span>
                    <span className="badge ms-1">{filteredSearchData.length > 0 && filteredSearchData.filter((item, index, self) => index === self.findIndex((t) => t.agentUserId === item.agentUserId)).length} Added</span>
                </div>
                </div>
                <div className="mx-4">
                <hr />
                </div>
                <div className='col-12 p-2 d-flex gap-3 px-3 my-2' style={{height:'56px'}}>
                    <div className="col-9 h-100">
                    <CustomInputSearch
                        isError=''
                        label=''
                        id='search'
                        placeholder='Search'
                        onChange={setSearchValue}
                    />
                    </div>
                    <div className="p-2 h-100" style={{fontSize:'14px', border:'1px solid #AAAAAA',borderRadius:'6px',width:'50%'}}>
                        <p className="d-flex gap-0 align-items-center justify-content-center h-100"><span className="col-3">Sort by:</span><select className="col-8 p-0" style={{border:'none',color:'#171717'}} onChange={(e)=>setShowtable(e.target.value)}><option value="1">Agent</option><option value="2">Legal Documents</option></select></p>
                    </div>
                </div>
            <div className='table-responsive fmlyTableScroll mx-3 border border-1 rounded-3 mb-2 mt-3'>
                <Table id="datatable" className="custom-table border-table">
                    <thead className="sticky-header">
                        <tr>
                            {tableHeader.map((item, index) => (
                                <th className="py-3" key={index}>{item.name}</th>
                            ))}
                        </tr>
                </thead>
                {filteredSearchData?.length > 0 ? (
    <tbody id="databody">
        {[...filteredSearchData]?.sort((a, b) => {
        if (showTable == 1) {
      const dateA = new Date(a.agentDOB);
      const dateB = new Date(b.agentDOB);
      if (isNotValidNullUndefile(dateA) || isNotValidNullUndefile(dateB))
        return -1;
          return dateA - dateB;
        } else {
          const getLegalDoc = (item) =>
            item.testSupportDocName == null && item.testDocId == null
              ? item.legalDocName
              : item.testDocId == null
              ? item.testSupportDocName
              : item.testSupportDocName == null
              ? item.testDocName
              : "-";

          return getLegalDoc(a).localeCompare(getLegalDoc(b));
        }
    })?.map((item, index, array) => {
            const { fullName, legalDocName, agentRole, agentRank, statusName, testSupportDocName, testDocId, testDocName } = item;
            let legalDocname = testSupportDocName == null && testDocId == null ? legalDocName : testDocId == null ? testSupportDocName : testSupportDocName == null ? testDocName : "-";
            let statusColor = statusName === 'Accepted' ? {color: '#0A690A', background: '#DBF3DF', border: '#1EA51F'} :
                              statusName === 'Pending' ? {color: '#B54708', background: '#FFFAEB', border: '#FEDF89'} :
                              statusName === 'Declined' ? {color: '#900000', background: '#F8D9D9', border: '#E16E6E'} :
                              {color: '#B54708', background: '#FFFAEB', border: '#FEDF89'};
            let buttonText = item?.statusName === 'Accepted' && item?.isUserActive === false ? 'Activate Agent' :
                             item?.statusName === 'Accepted' && item?.isUserActive === true ? 'User Activated' :
                             item?.statusName === 'Declined' ? 'Send Invite for Declined Role' : 'Send Invite';

            // Count consecutive rows with the same fullName
            let rowSpan = 1;
            for (let i = index + 1; i < array.length; i++) {
                if (array[i].fullName === fullName) {
                    rowSpan++;
                } else {
                    break;
                }
            }


            let rowSpan2 = 1;
            for (let i = index + 1; i < array.length; i++) {
                const legalDocnames =
            array[i].testSupportDocName == null && array[i].testDocId == null
              ? array[i].legalDocName
              : array[i].testDocId == null
              ? array[i].testSupportDocName
              : array[i].testSupportDocName == null
              ? array[i].testDocName
               : "-";
          if (legalDocnames === legalDocname) {
                    rowSpan2++;
                } else {
                    break;
                }
            }

            return showTable == 1 ? (

                    <tr key={index}>
                        {/* Only show the fullName and button once for consecutive rows */}
                        {index === 0 || array[index - 1].fullName !== fullName ? (
                            <td rowSpan={rowSpan} className="fw-bold" style={{color: '#222222'}}>
                                {fullName}
                                <br />
                                <button 
                                    className="mt-2 px-3 py-0 statusbtn" 
                                    style={{border: '1.5px solid #AA6E7A', background: '#F1E7E9', color: '#720D21', fontSize: '14px', borderRadius: '8px'}}
                                    disabled={statusName == "Accepted" ? true : false}
                                    onClick={() => sentInvite(item)}
                                >
                                    {buttonText}
                                </button>
                            </td>
                        ) : null}

                        <td>{legalDocname}</td>
                        <td>{agentRole}</td>
                        <td>{agentRank}</td>
                        <td className="fw-bold" style={{color: statusColor.color}}>
                            <span className="p-2 px-3" style={{background: statusColor.background, border: `1px solid ${statusColor.border}`, borderRadius: '16px'}}>{statusName}</span>
                        </td>
                    </tr>
                ) : (
                    <tr key={index}>
                  {index === 0 || (() => {
              const prevItem = array[index - 1];
              const prevLegalDocname =
                prevItem.testSupportDocName == null && prevItem.testDocId == null
                  ? prevItem.legalDocName
                  : prevItem.testDocId == null
                  ? prevItem.testSupportDocName
                  : prevItem.testSupportDocName == null
                  ? prevItem.testDocName
                  : "-";
              return prevLegalDocname !== legalDocname;
            })() ? (
              <td  rowSpan={rowSpan2}  className="fw-bold"  style={{ color: "#222222" }}>
                                {legalDocname}
                            </td>
                         ) : null}
                        <td>{agentRole}</td>
                        <td>{fullName}</td>
                        <td>{agentRank}</td>
                        <td className="fw-bold" style={{color: statusColor.color}}>
                            <span className="p-2 px-3" style={{background: statusColor.background, border: `1px solid ${statusColor.border}`, borderRadius: '16px'}}>{statusName}</span>
                        </td>
                    </tr>
            );
        })}
    </tbody>
) : (
    <tbody>
        <tr>
            <td colSpan={tableHeader.length}>
                <div className="text-center no-data-found">No Data Found</div>
            </td>
        </tr>
    </tbody>
)}

                </Table>
            </div>
            <div className="d-flex justify-content-end mt-3 mb-3 me-3">
            <CustomButton label={isPrimaryMemberMaritalStatus && props?.activeTab == "1" ? `Proceed to ${spouseFirstName} Information` : "Proceed to Emergency"}  onClick={()=>handleNextBtn()} />
            </div>
        </div>
        <CustomModal
                open={showModal}
                handleOpenModal={()=>setShowmodal(false)}
                header={'Preview Send Email & Text'}
                size='lg'
                backClick={() => setShowmodal(false)}
                refrencePage='InviteAgent'
                sentBtnClick={()=>userGenerateLinks()}

            >
                <div style={{ minHeight: "50vh", maxHeight: "60vh", height: "100vh", overflowX: "none", overflowY: "scroll" }} className="">
                    <div className="position-relative" style={{ pointerEvents: "none" }}>
                        <div className="mt-0 m-5">
                            Email Template
                            <div dangerouslySetInnerHTML={{ __html: mailTemplate.emailTemp }} id="emailtemplate" contentEditable="false" className="p-0 m-0" />
                        </div>
                        <div className='mt-0 m-5'>
                            Text Template
                            <div className="mt-3 p-4 border">
                            <div dangerouslySetInnerHTML={{ __html: mailTemplate.textTemp }} id="texttemplate" contentEditable="false" className="p-0 m-0" />
                            </div>
                        </div>
                    </div>
                </div>



            </CustomModal>
    </div>
    )
}

export default AgentTable;