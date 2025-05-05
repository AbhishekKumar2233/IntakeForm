import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CustomCheckBox, CustomInputSearch } from "../Custom/CustomComponent";
import { CustomButton } from "../Custom/CustomButton";
import konsole from "../../components/control/Konsole";
import { postApiCall } from "../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../components/network/UrlPath";


const AddEmergencyContact = ({setAddemergencycontact,allFamilyMembers,fetchData,selectedUser,toasterAlert,setSelectedUser,_spousePartner,getFamilyMembers}) =>{
    const inviteEmergencyList = useMemo(()=>{return allFamilyMembers.filter(e=> e.isEmergencyContact == false && e.memberStatusId != 2 && selectedUser.userId != e.userId)},[allFamilyMembers,inviteEmergency])
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteEmergency,setInviteEmergency] = useState(inviteEmergencyList)
    const filteredUserContactDetails = useMemo(() => {
      if (!searchQuery) return inviteEmergency;

      return inviteEmergency.filter(data =>
          (data.fName + " " + data.lName).toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, inviteEmergency]);
  const [selectAllbtn,setSelectAll] = useState(false)


    const handleEmergencyCheckBox = (checkbox,item) => {
      let familyList = inviteEmergency;
      // setInviteEmergency(familyList)
      // console.log(item,"itemcheck",checkbox.target.checked)
      if(item == 'selectAll'){
        konsole.log("selectAll")
        familyList = familyList.map((e)=>{return{...e,'inviteEmergency':checkbox?.target?.checked}})
        setInviteEmergency(familyList)
        setSelectAll(selectAllbtn == true ? false : true)
      }else if(item != 'selectAll'){
        konsole.log(item,"selectAll")
        let updatedFamilyList = familyList.filter((e) => e.userId === item.userId).map((e) => ({ ...e,
          inviteEmergency: e?.inviteEmergency ? false : true, 
          }))[0];
          setInviteEmergency((emergency) => {
              const isExisting = emergency.some((e) => e.userId === updatedFamilyList.userId);
              if (isExisting) {
                  return emergency.map((e) =>
                      e.userId === updatedFamilyList.userId ? updatedFamilyList : e
                  );
              } else {
                  return [...emergency, updatedFamilyList];
              }
          });
      }
    }

    useEffect(()=>{
      let familyList = inviteEmergency?.length > 0 ? inviteEmergency : []
      let Selected = familyList?.every((e)=>{return e.inviteEmergency == true})
      let unSelected = familyList?.some((e)=>{return e.inviteEmergency == false})
      // console.log(unSelected,"unSelected",Selected,familyList)
      if(Selected == true){
        setSelectAll(true)
      }
      if(unSelected == true){
        setSelectAll(false)
      }
    },[inviteEmergency])

    const submitData = () => {
      let selectedContacts = inviteEmergency?.filter(e => e?.inviteEmergency == true);
      if (selectedContacts.length == 0) {
        toasterAlert('warning','Warning','Please select emergency contact');
        return;
      }
      let jsonObj = selectedContacts?.map((e)=>{
        return {
          "primaryUserId": e.primaryUserId,
          "relationshipTypeId": e.relationshipTypeId,
          "isFiduciary": e.isFiduciary,
          "isBeneficiary": e.isBeneficiary,
          "rltnTypeWithSpouseId": e.rltnTypeWithSpouseId,
          "relativeUserId": e.relativeUserId,
          "isEmergencyContact": e.inviteEmergency,
          "isChildCapableMgmtfinanc": e.isChildCapableMgmtfinanc,
          "userRltnshipId": e.userRelationshipId == undefined ? e.userRltnshipId : e.userRelationshipId,
          "userMemberId": e.memberId,
          "relationshipType": e.relationshipType
        }
      })
      konsole.log(jsonObj,"jsonObj,inviteEmergency",inviteEmergency)
      jsonObj.map(async (e)=>{
        const putMemberrelationship = await postApiCall('PUT',$Service_Url.postMemberRelationship,e);
        konsole.log(putMemberrelationship,"putMemberrelationship")
      })
      
      // toasterAlert('successfully','Successfully saved data','Selected Contact Added in Emergency Contact.')
      toasterAlert('successfully','Successfully saved data',' Your emergency contact have been added successfully')
      setInviteEmergency([])
      getFamilyMembers()
      setTimeout(()=>{
      fetchData(selectedUser?.userId,'noUpdatestate');
      },5000)
      setAddemergencycontact(false);
      setSelectedUser(selectedUser)
    }
    return(
    <div id="newModal" className='modals addEmergency'>
    <div className="modal" style={{ display: 'block', height:'95vh',borderRadius:'8px'}}>
      <div className="modal-dialog costumModal" style={{ maxWidth: '400px'}}>
        <div className="costumModal-content">
          <div className="modal-header py-0 py-10" style={{background:'#F8F8F8'}}>
            <h5 className="modal-title ms-1">Add Emergency Contact</h5>
            <img className='mt-0 me-1 cursor-pointer' onClick={()=>{setAddemergencycontact(false)}} src='/icons/closeIcon.svg'></img>
          </div>
          <div className="costumModal-body w-100 addMedication pt-0">
            <div className="mt-10 mb-5">
                <CustomInputSearch placeholder={'Search contact'} value={searchQuery} onChange={(e)=>setSearchQuery(e)} />
            </div>
            <br/>
            {filteredUserContactDetails?.length > 0 && (
          <div className="d-flex justify-content-between my-10">
            <p className="d-flex align-items-center"><CustomCheckBox label={''} hideLabel={true} value={selectAllbtn} onChange={(e) => handleEmergencyCheckBox(e,'selectAll')} />Select all</p>
            <p><span className="fw-bold">{filteredUserContactDetails?.length}</span> Contact</p>
          </div>
            )}
          <div className="">
            {filteredUserContactDetails.length == 0 ? (
              <p className="text-center text-muted">Not data found</p>
            ) : (
              filteredUserContactDetails.map((item,index)=>(
                <>
                <div className="d-flex justify-content-between my-10">
                    <div className="d-flex align-items-center fw-bold"><CustomCheckBox key={index} id={index} value={item?.inviteEmergency}  label={''} hideLabel={true} onChange={(e) => handleEmergencyCheckBox(e,item)} /><p>{item.fName+" "+item.lName}</p></div>
                    <p>{item.relationshipName == 'Primary' ? _spousePartner : item.relationshipName }</p>
                </div>
                <hr/>
                </>
            ))
            )}
            </div>
            <div className="d-flex justify-content-end mt-10">
                <CustomButton label="Save" onClick={()=>submitData()} />
            </div>
        </div>
        </div>
     </div>
   </div>
  </div>
    )
}
export default AddEmergencyContact;