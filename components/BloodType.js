import React, { useState, useEffect} from 'react'
import { Services, $CommonServiceFn } from './network/Service';
import { $Service_Url } from './network/UrlPath';
import { bloodTypeQuestion } from './control/Constant';
import { postApiCall, getApiCall, isNotValidNullUndefile } from './Reusable/ReusableCom';




const BloodType = (props, ref) => {
    const {memberUserid,setLoader } = props
    const [formlabelData, setFormlabelData] = useState({})
    const [bloodTyps, setBloodTyps] = useState()
   
    useEffect(() => {
        getBloodTypesFunc()
        fectchsubjectForFormLabelId()
    }, [])

    
    const handleLabelSelection = (event, formLabelDatawithlabel, formlabelwithlabel) => {
        event.stopPropagation()
        const eventId = event.target.value;
        const eventName = event.target.options[event.target.selectedIndex].getAttribute('data-name');
        const questionId = formLabelDatawithlabel?.questionId;
        const userSubjectDataId = formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.userSubjectDataId ? formLabelDatawithlabel?.response[0]?.userSubjectDataId : 0 ;
          if(isNotValidNullUndefile(eventName)){
            handleUpdateSubmitSeconde(userSubjectDataId, eventId, questionId, eventName, formLabelDatawithlabel);
          }
      

    };
    const handleUpdateSubmitSeconde = async (userSubjectDataId, eventId, questionId, eventName, formLabelDatawithlabel) => {
        let isUpdate = formLabelDatawithlabel?.response.some(ele => ele?.userSubjectDataId && ele?.userSubjectDataId !== 0)
      if (isUpdate == true) {
           let updateJson = {
                "userId": memberUserid,
                "userSubjects": [
                    {
                        "userSubjectDataId": userSubjectDataId,
                        "subjectId": questionId,
                        "subResponseData": eventId,
                        "responseId": formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.responseId
                    }
                ]
            }
            
            updateResponse(updateJson)
        } else {
            let json = [
                {
                    "userSubjectDataId": userSubjectDataId,
                    "subjectId": questionId,
                    "subResponseData": eventId,
                    "responseId": formLabelDatawithlabel?.response.length > 0 && formLabelDatawithlabel?.response[0]?.responseId,
                    "userId": memberUserid
                }
            ]
            addResponse(json)
            
        }



    };
    const addResponse = (json) => {
        setLoader(true)
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postaddusersubjectdata, json, (response) => {
            if (response) {
                setLoader(false)
                fectchsubjectForFormLabelId()
              
            } else {
                setLoader(false)
            }
        })

    }
    const updateResponse = (json) => {
        setLoader(true)
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putSubjectResponse, json, (response, error) => {
            if (response) {
                setLoader(false)
                fectchsubjectForFormLabelId()
            } else {
                setLoader(false)
            }
        })

    }

    const getBloodTypesFunc = () => {
        setLoader(true)
        Services.getBloodTypes().then((res) => {
            setLoader(false)
            setBloodTyps(res?.data?.data)
        }).catch((err) => {
            setLoader(false)

        })
    }
    const fectchsubjectForFormLabelId = async () => {
        let formlabelData = {}
        setLoader(true)
        let resultsubjectlabel = await postApiCall('POST', $Service_Url.getsubjectForFormLabelId, bloodTypeQuestion);
        if (resultsubjectlabel == 'err') return;
        for (let obj of resultsubjectlabel.data.data) {
            let label = "label" + obj.formLabelId;
           formlabelData[label] = obj.question;
            let result = await getApiCall('GET', $Service_Url.getSubjectResponse + memberUserid + `/0/0/${formlabelData[label].questionId}`, null);
            if (result !== 'err' && result?.userSubjects?.length != 0) {
                let responseData = result?.userSubjects;
                if (result !== 'err' && result?.userSubjects?.length != 0) {
                    for (let i = 0; i < formlabelData[label].response.length; i++) {
                        for (let j = 0; j < responseData.length; j++) {
                            if (formlabelData[label].response[i].responseId === responseData[j].responseId) {
                                if (responseData[j].responseNature == "Text") {
                                    if (responseData[j].questionId == "218") {
                                        formlabelData[label].response[i]["userSubjectDataId"] = responseData[j].userSubjectDataId;
                                        formlabelData[label].response[i]["response"] = responseData[j].response;
                                    }
                                }
                            }

                        }

                    }
                }
            } 
            
        }
        setLoader(false)
        setFormlabelData(formlabelData)
    }
    
    const style = (response, formLabelDatawithlabel) => {
        let formLabel = formLabelDatawithlabel;
      
        if (isNotValidNullUndefile(formLabel) && formLabel.response.length >= 0 && formLabel.response[0]?.userSubjectDataId) {
          let getIndex = formLabel.response.findIndex(ele => ele?.response === response?.value);
      
          return {
            backgroundColor: getIndex !== -1 ? '#76272B' : 'white',
            color: getIndex !== -1 ? 'white' : 'inherit'
          };
        }
        return {
          backgroundColor: 'white',
          color: 'inherit'
        };
      };
      


    const QuestionAndAnswerInput = (formLabelDatawithlabel, name, withlabel) => {
        return (
            <>
                <div>
                    <span className='me-2'>{(formLabelDatawithlabel && formLabelDatawithlabel.question)}</span>
                    <select
                        defaultValue={formLabelDatawithlabel?.response?.[0]?.response}
                        style={{ width: '100px', backgroundColor: 'white', color: 'black', border: "0.1px solid #ced4da" }}
                        onChange={(e) => handleLabelSelection(e, formLabelDatawithlabel, withlabel)}
                    >   
                            <option data-name="None"value="10">None</option>
                        {formLabelDatawithlabel && bloodTyps?.map((response) => (

                            <option key={response.value} value={response.value} data-name={response.label} style={{ ...style(response, formLabelDatawithlabel), width: '80%' }} >
                                {response.label}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        )
    }
  


    return (
        <>
            <div style={{ marginTop: "auto" }}>
                {
                    isNotValidNullUndefile(formlabelData) && formlabelData?.label1014 &&
                    QuestionAndAnswerInput(formlabelData?.label1014, 'stylehomeSub', 'label1014')
                }
            </div>
        </>
    )
}

export default BloodType