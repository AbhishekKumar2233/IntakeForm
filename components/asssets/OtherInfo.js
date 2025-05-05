import React, { useState, useEffect, useMemo } from "react";
import { $CommonServiceFn } from "../network/Service";
import { $Service_Url } from "../network/UrlPath";
import { $AHelper } from "../../component/Helper/$AHelper";
import konsole from "../control/Konsole";
import { useLoader } from "../../component/utils/utils";

const OtherInfo = ({ othersMapNatureId, FieldName, userId,othersCategoryId }) => {
  const [otherfieldname, setOtherfieldName] = useState("");
  useEffect(() => {
    if(FieldName == 'Other'){
   getOtherFromApi();
    }
    return () => {};
  }, [FieldName,userId]);

    const getOtherFromApi = () => {
        let jsonobj = [{userId: userId, othersMapNatureId: othersMapNatureId,isActive: true,othersMapNature: ""}];
   
    useLoader(true)
    $CommonServiceFn.InvokeCommonApi("POST",  $Service_Url.getOtherFromAPI,  jsonobj,  (response,err) => {
        if (response) {
          konsole.log("responseresponseresponseresponse", response);
          let responsedata=response?.data?.data
          let otherObj = responsedata?.filter(otherRes => { return otherRes?.othersCategoryId == othersCategoryId});
          let othersName= otherObj?.length > 0 ? otherObj[0].othersName : ""
          setOtherfieldName(othersName)
          useLoader(false)
        }else{
            konsole.log("Error",err)
            useLoader(false)
        }
      }
    );
  };

  const fieldnamewithother=useMemo(()=>{
    return  $AHelper.$isNotNullUndefine(otherfieldname) && FieldName == 'Other' ? `${otherfieldname}`: FieldName;
  },[FieldName,otherfieldname])

  return fieldnamewithother;
};
export default OtherInfo;
