import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { getApiCall, isNotValidNullUndefile, postApiCall } from "../../../components/Reusable/ReusableCom";
import { $Service_Url } from "../../../components/network/UrlPath";
import { personalMedicalHistry } from "../../../components/control/Constant";
import konsole from "../../../components/control/Konsole";
import usePrimaryUserId from "../../Hooks/usePrimaryUserId";
import { CustomTextarea, CustomRadioForMetadata } from "../../Custom/CustomComponent";
import { CustomButton } from "../../Custom/CustomButton";
import { useLoader } from "../../utils/utils";
import { globalContext } from "../../../pages/_app";

const  EnvironmentLifestyle = forwardRef(({userId,environmentLifestylePlaceholder, startTabIndex},ref) => {
    const { primaryUserId,isPrimaryMemberMaritalStatus } = usePrimaryUserId();
    const [formLabelData, setFormLabelData] = useState([])
    const startingTabIndex = startTabIndex ?? 0;
    const [formResponse, setFormResponse] = useState({
        label214: '', 
        label215: '', 
        label216: '', 
        label217: '',
        label1030: '',
        label1031: '',
        label1032: '',
        label948: ''
    });
    const {setWarning} = useContext(globalContext)
    const[arrayToDelete,setArrayToDelete]=useState([])

    useEffect(() => {
        if (userId) {
            getSubjectData(userId);
        }
    }, [userId]);

    const getSubjectData = async (userId) => {
            useLoader(true)
            const [responseSubjectData, responseGetApi] = await Promise.all([
                getApiCall('GET', `${$Service_Url.getSubjectResponse}${userId}/0/0/0`),
                postApiCall('POST', $Service_Url.getsubjectForFormLabelId, personalMedicalHistry.formLabelId)
            ]);
            useLoader(false)
            const userSubjects = responseSubjectData.userSubjects || [];
            let formLabelData = responseGetApi !== "error" ? responseGetApi.data.data : [];

            const updatedFormLabelData = formLabelData.map(label => {
                userSubjects.forEach(subject => {
                    if (label.question?.questionId === subject.questionId) {
                        if (subject.responseNature === "Radio") {
                            label.question.response.forEach((response, index) => {
                                if (response.responseId === subject.responseId) {
                                    label.question.response[index].checked = true;
                                    label.userSubjectDataId = subject.userSubjectDataId;
                                    konsole.log("sbvbks", subject, response);
                                    setFormResponse(prevState => ({
                                        ...prevState,
                                        [`label${label.formLabelId}`]: {...subject, response: response?.response}
                                    }));
                                }
                            });
                        } else if (subject.responseNature == "Text") {
                            label.question.response.forEach((response, index) => {
                                if (response.responseId === subject.responseId) {
                                    label.question.response[index].response = subject.response;
                                    label.userSubjectDataId = subject.userSubjectDataId;
                                    setFormResponse(prevState => ({
                                        ...prevState,
                                        [`label${label.formLabelId}`]: subject.response
                                    }));
                                }
                            });
                        }
                        label.responseNature = subject.responseNature;
                    }
                });
                return label;
            });
            // if(!isNotValidNullUndefile(updatedFormLabelData)){
                setFormLabelData(updatedFormLabelData)
            // }
    };

    const handleInputChange = (value, key) => {
        // konsole.log( key,value, "valuekeyslkfvhls");
        setFormResponse(prevState => ({
            ...prevState,
            [`label${key}`]: value
        }));
    };

    const handleTextareaChange = (value, key) => {
        konsole.log(value, key, "value,key");
        setFormResponse(prevState => ({
            ...prevState,
            [`label${key}`]: value
        }));
    };
    
     const SubmitData =async() =>{
        useLoader(true)
        let findNullSelectedQuestionsLabel=[]
        for(var i in formResponse){
                if(formResponse[i]==null){
                    findNullSelectedQuestionsLabel.push(i)
                }
            }
        let newformLabelData=JSON.parse(JSON.stringify(formLabelData))
        newformLabelData=newformLabelData.filter((data1)=>{
            return findNullSelectedQuestionsLabel.find((data2)=>{
                let newString=data2.slice(5)
                // konsole.log("newString",newString)
                return newString==data1.formLabelId
            })
        })
        // konsole.log("nsddddddddddddd",newformLabelData)
        let arrayToDelete=newformLabelData.map(data=>({userSubjectDataId:data.userSubjectDataId}))
        if(arrayToDelete?.length>0){
           await postApiCall("DELETE", $Service_Url.deleteSubjectUser+"?UserId="+userId, arrayToDelete);
        }
        
        // konsole.log("arrayToDelete",arrayToDelete)
        let userSubjectarray = formLabelData.map((e)=> {
                return{
                  "userSubjectDataId":e.userSubjectDataId ?? 0,
                  "subjectId":e.subjectId,
                  "subResponseData":e.formLabelId >= 214 && e.formLabelId <= 217 ? formResponse[`label${e.formLabelId}`]?.response : formResponse[`label${e.formLabelId}`],
                  "responseId": (e.formLabelId >= 214 && e.formLabelId <= 217) ? formResponse[`label${e.formLabelId}`]?.responseId : e.question.response[0].responseId
                }
              })
        userSubjectarray = userSubjectarray.filter((ele)=> isNotValidNullUndefile(ele?.userSubjectDataId) && isNotValidNullUndefile(ele?.subjectId) && isNotValidNullUndefile(ele?.subResponseData) && isNotValidNullUndefile(ele?.responseId))      
        let jsonObj = {
                userId:userId,
                userSubjects:userSubjectarray
              }
        // konsole.log("findNullSelectedQuestionsLabel",findNullSelectedQuestionsLabel,userSubjectarray)
        // konsole.log("medicalConditionRef",jsonObj)
        if(userSubjectarray.length > 0){
            const postSubjectresponse =await postApiCall('PUT',$Service_Url.putSubjectResponse,jsonObj);
            if(postSubjectresponse != "error"){
                useLoader(false)
                toasterAlert('successfully','Successfully saved data','Your data have been saved successfully')
                konsole.log(postSubjectresponse,"postSubjectresponse")
                getSubjectData(userId);
              }
        }    
        useLoader(false)       
      }
      
    const renderCustomInputs = (formLabelId, condition) => {
        if (condition) {
            return (
                <div className="mt-2 col-xs-12 col-md-6 col-lg-6">
                <CustomTextarea
                    tabIndex={startingTabIndex + 1}
                    label={formLabelId == '948' && "Which medications ?"}
                    placeholder="Comment"
                    value={formResponse[`label${formLabelId}`]}
                    onChange={e => handleTextareaChange(e, formLabelId)}
                    key={formLabelId}
                />
                </div>
            );
        }
        return null;
    };

    const toasterAlert = (type, title, description) => {
        setWarning(type, title, description);
      }

    useImperativeHandle(ref,()=>({
        SubmitData
    }))

    konsole.log("vghchg", formResponse)
    konsole.log("formLabelData123341",formLabelData)
    
    konsole.log(arrayToDelete,"qeitemarrayToDelete") 
    return (
        <div className={`col-12 d-xl-flex justify-content-xl-between mb-4 ${!isPrimaryMemberMaritalStatus ? "ps-4" : ""}`}>
            <div className="col-xl-12 mt-xl-0  col-12">
                {formLabelData.length > 0 && formLabelData.map(e => (
                    (e.formLabelId >= 214 && e.formLabelId <= 217) && (
                        <div className="col-12 spacingBottom" key={e.formLabelId}>
                            <CustomRadioForMetadata
                                tabIndex={startingTabIndex + 1}
                                placeholder={e.question.question}
                                options={e.question.response}
                                value={formResponse[`label${e.formLabelId}`]?.responseId}
                                onChange={ele => handleInputChange(ele, e.formLabelId)}
                            />
                            {renderCustomInputs(1030, e.formLabelId === 214 && formResponse.label214?.responseId === 28)}
                            {renderCustomInputs(1031, e.formLabelId === 215 && formResponse.label215?.responseId === 30)}
                            {renderCustomInputs(1032, e.formLabelId === 216 && formResponse.label216?.responseId === 32)}
                            {renderCustomInputs(948, e.formLabelId === 217 && formResponse.label217?.responseId === 34)}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
});

export default EnvironmentLifestyle;