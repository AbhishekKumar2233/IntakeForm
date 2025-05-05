import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Form, Row } from 'react-bootstrap'
import { CustomCheckBox } from '../Custom/CustomComponent';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import { getApiCall, postApiCall } from '../../components/Reusable/ReusableCom';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
import { $AHelper } from '../Helper/$AHelper';


const jsonObjArr = [

    {
        "contactMapId": 0,
        "primaryMemberId": "", //primaryUserId
        "contactNatureId": 1,
        "contactUserId": "", //memberId//
        "notifyConditionId": 1,
        "contactStatus": false,
        "upsertedBy": "",
        "notifyConditionName": 'Illness'
    },
    {
        "contactMapId": 0,
        "primaryMemberId": "",
        "contactNatureId": 1,
        "contactUserId": "",
        "notifyConditionId": 2,
        "contactStatus": false,
        "upsertedBy": "",
        "notifyConditionName": "End of Life"
    },
    {
        "contactMapId": 0,
        "primaryMemberId": "",
        "contactNatureId": 1,
        "contactUserId": "",
        "notifyConditionId": 3,
        "contactStatus": false,
        "upsertedBy": "",
        "notifyConditionName": "Death"
    }
    , {
        "contactMapId": 0,
        "primaryMemberId": "",
        "contactNatureId": 1,
        "contactUserId": "",
        "notifyConditionId": 4,
        "contactStatus": false,
        "upsertedBy": "",
        "notifyConditionName": "Mental health",
    }


]



const AssignNotification = forwardRef((props, ref) => {

    const { primaryUserId, loggedInUserId } = usePrimaryUserId();
    const { memberid } = props;
    const [jsonOfNotify, setJsonOfNotify] = useState(jsonObjArr);
    const [isApiCall, setIsApiCall] = useState(false)

    const startingTabIndex = props?.startTabIndex ?? 0;

    console.log("isApiCall", isApiCall)
    // @@define useEffect
    useEffect(() => {
        if ($AHelper.$isNotNullUndefine(primaryUserId) && $AHelper.$isNotNullUndefine(memberid)) {
            fetchSavedData()
        } else {
            setJsonOfNotify(jsonObjArr)
        }
    }, [memberid, primaryUserId])

    // @@ use Imperative handle
    useImperativeHandle(ref, () => ({
        saveNotifiDetails, handleclear
    }));

    const handleclear = () => {
        return new Promise((resolve, reject) => {
            for(const item of jsonObjArr){
                if(item.contactStatus == true){
                    item.contactStatus = false
                    item.primaryMemberId = ""
                    item.upsertedBy = ""
                }
            }
            setJsonOfNotify(jsonObjArr);
            resolve('resolve')
        })

    }


    // get saved data;
    const fetchSavedData = async () => {
        let url = `${$Service_Url.getNotifyContactMapApi}/${primaryUserId}/0/0?ContactUserId=${memberid}`;
        const resultOfNotifyData = await getApiCall('GET', url, '');
        if (resultOfNotifyData != 'err') {
            updateNotifyDetails(resultOfNotifyData)
        } else {
            setJsonOfNotify(jsonObjArr)
        }
    }



    // @update state
    const updateNotifyDetails = (resultOfNotifyData) => {
        if (resultOfNotifyData !== 'err' && resultOfNotifyData.length > 0) {
            let updatedArray = [...jsonOfNotify];
            resultOfNotifyData.forEach(dataItem => {
                let index = updatedArray.findIndex(item => item.notifyConditionId === dataItem.notifyConditionId);
                if (index !== -1) {
                    updatedArray[index] = dataItem;
                    updatedArray[index].updatedBy = loggedInUserId;
                    updatedArray[index].upsertedBy = loggedInUserId;
                }
            });
            console.log('updatedArray', updatedArray);
            setJsonOfNotify(updatedArray);
        }
    }



    const handleIsApiCall = () => {
        setIsApiCall(true)
    }

    // @@ handle checkbox 
    const handleCheckboxChange = (index, e) => {
        handleIsApiCall()
        const { checked } = e.target;
        setJsonOfNotify((prev) => {
            let newArray = [...prev]
            newArray[index].contactStatus = checked;
            newArray[index].primaryMemberId = primaryUserId;
            newArray[index].contactUserId = memberid;
            newArray[index].upsertedBy = loggedInUserId;
            return newArray
        })

    };




    // @ save and update
    const saveNotifiDetails = async (userId) => {
        return new Promise(async (resolve, reject) => {
            console.log("isApiCall1", isApiCall)
            // if (isApiCall == false) {
            //     konsole.log("resolve without api call")
            //     resolve('resolve without api call');
            //     return;
            // }
            konsole.log("jsonOfNotifyjsonOfNotify", jsonOfNotify)
            const jsonObj = jsonOfNotify.filter((item) => item.contactStatus == true || item.contactMapId != 0)?.map(item => ({ ...item, contactUserId: userId }));

            konsole.log("jsonObjjsonObjjsonObj", jsonObj);
            if (jsonObj.length > 0) {
                const _resultpostApi = await postApiCall('POST', $Service_Url.upsertNotifyContactMapApi, jsonObj);
                konsole.log("_resultpostApi09090", _resultpostApi);
                handleclear()
                if (_resultpostApi != 'err') {
                    updateNotifyDetails(_resultpostApi.data.data)
                }

                resolve(_resultpostApi)
            } else {
                resolve('resolve')
            }
        })


    }


    konsole.log("jsonOfNotify", jsonOfNotify)
    return (
        <>
            <div id='assignNotification' className="assignnotification-for">
                <Row>
                    <div className="d-flex flex-column mb-1">
                        <h5 className='assignnotification-for-h1 me-5'>Which of the below notifications, would you’d you like this person to receive?</h5>

                        {jsonOfNotify.length > 0 && jsonOfNotify.map((item, index) => {
                            return <div className='m-2 mb-0'>
                                <CustomCheckBox
                                    tabIndex={startingTabIndex + 1} 
                                    key={index}
                                    label={item.notifyConditionName}
                                    name={item.notifyConditionName}
                                    id={index}
                                    onChange={(e) => handleCheckboxChange(index, e)}
                                    value={item.contactStatus}
                                />
                            </div>
                        })}


                    </div>
                </Row>
            </div>

        </>
    )
})

export default AssignNotification
