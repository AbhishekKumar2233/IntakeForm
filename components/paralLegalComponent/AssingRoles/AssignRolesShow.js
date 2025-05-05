import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { connect } from 'react-redux';
import { globalContext } from '../../../pages/_app';
import konsole from '../../control/Konsole';
import { Msg } from '../../control/Msg';
import { $CommonServiceFn } from '../../network/Service';
import { $Service_Url } from '../../network/UrlPath';
import { SET_LOADER } from '../../Store/Actions/action';
import AssignRoleContainer from './AssignRoleContainer';
import ListLegalDocuments from './listLegalDocuments';
import { $AHelper } from '../../control/AHelper';

function AssignRolesShow(props) {
    const context = useContext(globalContext);
    const [allFamilyMembers, setAllFamilyMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [spouseUserid, setspouseUserid] = useState("")
    
    useEffect(() => {
        const userId = sessionStorage.getItem("SessPrimaryUserId");
        const spouseUserId = sessionStorage.getItem("spouseUserId")
        setspouseUserid(spouseUserId)
        // FileBelongsTo(userId)
        fetchFamilyMembers(userId);
        setSelectedMemberId(userId)
      return () => {
        // console.clear();
      }
    }, [])
    
  return (
      <div className=''>
            <Row className='border-bottom py-2'>
                <div className='d-flex gap-2 align-items-center'>
                  <h4 className='me-2'>Choose a Member</h4>
                  <div className='d-flex align-items-center'>
                      {
                          allFamilyMembers.length > 0 && allFamilyMembers.map((member, index) => {
                            const fullName = $AHelper.capitalizeAllLetters(member.fName + " " + member.lName);
                              return(
                                  <span key={index}>
                                      <Form.Check  className="chekspace d-flex align-items-center me-4" type="radio" id={member.memberId} name="selectedMember" value={member.userId} label={fullName} onChange={handleChange} checked={(selectedMemberId == member.userId)} />
                                  </span>
                              )
                          })
                      }
                      {spouseUserid !== "null" && <Form.Check  className="chekspace d-flex align-items-center me-4" type="radio" name="selectedMember" label={"Joint"} onChange={handleChange}/>}
                  </div>
                </div>
            </Row>
            {
                selectedMemberId !== "" ?
                  <AssignRoleContainer userId={selectedMemberId}/>
                  :
                    <></>
            }
    </div>
  )


    function toasterAlert(test, type) {
        context.setdata($AHelper.toasterValueFucntion(true, test, type))
    }

    async function fetchFamilyMembers(userid) {
        userid = userid || this.state.userId;
        props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi( "GET", $Service_Url.getFamilybyParentID + userid,"", async (response, error) => {
            props.dispatchloader(false);
            if (response) {
                let tempdata = response.data.data;
                konsole.log('atempData',tempdata)

                let tempallfamilymembers = [];
                let tempprimary = tempdata;
                let tempspouse = tempdata[0].children;
                konsole.log("memberShow", response.data.data);
                tempallfamilymembers.push.apply(tempallfamilymembers, tempprimary);
                if (
                    tempprimary.length > 0 &&
                    (parseInt(tempprimary[0].maritalStatusId) == 1 ||
                        parseInt(tempprimary[0].maritalStatusId) == 2)
                ) {
                    tempallfamilymembers.push.apply(tempallfamilymembers, tempspouse);
                }
                konsole.log('tempallfamilymemberstempallfamilymemberstempallfamilymembers',tempallfamilymembers)
                setAllFamilyMember(tempallfamilymembers)
            } else {
                toasterAlert(Msg.ErrorMsg, "Warning")
            }
        })
    }

    function handleChange (event, index){
        const eventValue = event.target.value == "on" ? "Joint" : event.target.value;
        const eventName = event.target.name;
        switch (eventName){
            case 'selectedMember':
                setSelectedMemberId(eventValue);
            break;
            default:
                konsole.log("")
        }
    }
}

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(AssignRolesShow);