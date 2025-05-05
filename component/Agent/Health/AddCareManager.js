import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CustomInput, CustomTextarea } from "../../Custom/CustomComponent";
import ContactAndAddress from "../../Custom/Contact/ContactAndAddress";
import { postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import konsole from "../../../components/control/Konsole";
import { $JsonHelper } from "../../Helper/$JsonHelper";


const AddCareManager = forwardRef(({type,userId},ref) =>{
    const [professionalData,setProfessionaldata] = useState({...$JsonHelper.$jsonAddprofessional(type)})
    const [professionalUserId,setProfessionaluserId] = useState('')
    const contactAddress = useRef(null)
    const [showError,setShowerror] = useState(false)

    useEffect(()=>{
        addmemberfunc()
    },[type])

    const addmemberfunc = async () => {
        let dataobj = {
          subtenantId: 2,//subtenantId
          fName: "fname",
          mName: "mName",
          lName: "lName",
          isPrimaryMember: false,
          memberRelationship: null,
          createdBy: userId,
        };
    
        const apiResponse = await postApiCall("POST",$Service_Url.postAddMember,dataobj)
          if(apiResponse){
            konsole.log(apiResponse,"apiResponse")
            setProfessionaluserId(apiResponse.data.data.member.userId)
            }
      };

      const handleChange = (key,value) => {
        setProfessionaldata((prev)=>({...prev,[key]:value}))
        // if(key == 'fName'){
        //   setShowerror(false)
        // }
      }

      const addProfessional = async () => {
        if(professionalData?.fName == '' || professionalData?.fName == undefined || professionalData?.fName == null ){
          // setShowerror(true)
          return;
        }

        let dataobj = {
          userId:professionalUserId,
          subtenantId: '2',//subtenantId
          fName: professionalData.fName,
          mName: '',
          lName: professionalData.lName,
          isPrimary: false,
          memberRelationship: null,
          UpdatedBy: userId,
        };

        const putUserData = await postApiCall('PUT',$Service_Url.putUpdateMember,dataobj)
        if(putUserData != 'err'){
          konsole.log(putUserData,"putUserData")
        }

        let jsonObj = {...professionalData,userId:professionalUserId,upsertedBy:userId,}
        delete jsonObj.fName;
        delete jsonObj.lName;
        delete jsonObj.instructionsToAgent;
        const postProfessionalMapapi = await postApiCall('POST',$Service_Url.postProfessionalUserMapping,jsonObj);
        if(postProfessionalMapapi != 'err'){
            konsole.log(postProfessionalMapapi,"postProfessionalMapapi")
        }

        let jsonProfessional = [{
          ...$JsonHelper.$jsonProfessional(),
          "proUserId":postProfessionalMapapi.data.data[0].proUserId,
          "proCatId":postProfessionalMapapi.data.data[0].proCategories[0].proCatId,
          "userId":userId,
          "upsertedBy":userId,
          "instructionsToAgent":professionalData.instructionsToAgent,
        }]

        konsole.log(professionalData,"professionalDatajsonProfessional",jsonProfessional,postProfessionalMapapi)

        const postProfessionalUserapi = await postApiCall('POST',$Service_Url.postProfessionalUser,jsonProfessional)
        if(postProfessionalUserapi != 'err'){
          konsole.log(postProfessionalUserapi,"postProfessionalUserapi")
        }
        await contactAddress?.current?.handleSubmit()
        await contactAddress?.current?.submitContact()
      }

      useImperativeHandle(ref, () => ({
        addProfessional
      }));

    return(
        <>
        <div className="mt-10">
            <p>Please Provide</p>
            <div className="mt-10"><CustomInput label='First name' placeholder='Enter here' value={professionalData.fName} onChange={(e)=>handleChange('fName',e)} isError={showError ? 'Please enter the first name' : ''}  /></div>
            <div className="mt-10"><CustomInput label='Last name' placeholder='Enter here' value={professionalData.lName} onChange={(e)=>handleChange('lName',e)} /></div>
            <div className="mt-10">{(type == '1' || type == '3' ) ? <CustomInput label='Business name' placeholder='Enter here' value={professionalData?.businessName} onChange={(e)=>handleChange('businessName',e)} /> : <CustomInput label='Affiliated hospital (s)' placeholder='Enter here' value={professionalData?.businessName} onChange={(e)=>handleChange('businessName',e)} />}</div>
            <div className="mt-10"><CustomInput label='Website link' placeholder='Enter here' value={professionalData.websiteLink} onChange={(e)=>handleChange('websiteLink',e)} /></div>
            <div className="mt-10"><CustomTextarea label='Notes for Agents' value={professionalData.instructionsToAgent} placeholder='Enter here' onChange={(e)=>handleChange('instructionsToAgent',e)} /></div>
            <div className="mt-10">
            <ContactAndAddress userId={professionalUserId} refrencePage="caremanager" showType="both" ref={contactAddress} isMandotry={false} />
            </div>
        </div>
        </>
    )
})
export default AddCareManager;