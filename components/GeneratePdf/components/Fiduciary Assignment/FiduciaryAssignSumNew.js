import React, { useEffect, useMemo, useState } from "react";      
import useUserIdHook from "../../../Reusable/useUserIdHook";
import { getApiCall, getApiCall2, postApiCall } from "../../../Reusable/ReusableCom";
import { $Service_Url } from "../../../network/UrlPath";
import konsole from "../../../control/Konsole";
import { Table } from "react-bootstrap";
import { $AHelper } from "../../../control/AHelper";

const FiduciaryAssignSumNew = ( props ) => {
    const [selectTableDocuments, setselectTableDocuments] = useState([]);
    const [PrimaryUserLegalMapping, setPrimaryUserLegalMapping] = useState({});
    const [SpouseUserLegalMapping, setSpouseUserLegalMapping] = useState({});
    const { _primaryMemberUserId, _spouseUserId, _userDetailOfPrimary } = useUserIdHook();

    useEffect(() => {
        fetchAllDetails()
        getUserLegalDocMappings();
    }, [])

    const totalLength = useMemo(() => {
        return (PrimaryUserLegalMapping?.fiduciaryAssignments?.length || 0) + (SpouseUserLegalMapping?.fiduciaryAssignments?.length || 0)
    }, [PrimaryUserLegalMapping, SpouseUserLegalMapping]);

    const fetchAllDetails = () => {
        if(!_primaryMemberUserId && _primaryMemberUserId == "null") return;

        getApiCall2("GET", $Service_Url.getLegalDocument + _primaryMemberUserId + "/0")
        .then((res) => {
            if(res == "err") throw new Error("api error")

            konsole.log("sbvkbws", res)
            let _selectTableDocuments = res?.data?.data?.legalDocuments || [];
            
            let otherLegalDocs = [];
            _selectTableDocuments.forEach(ele => {
                if(ele.legalDocTypeId == "999999") {
                    otherLegalDocs.push({
                        userId: _primaryMemberUserId,
                        othersMapNatureId: ele.userLegalDocId,
                        isActive: true,
                        othersMapNature: ""
                    })
                }
            })

            getOtherLegalDocs(_selectTableDocuments, otherLegalDocs);
        })
        .catch((err) => konsole.log("dafw", err))
    }

    const getOtherLegalDocs = (_selectTableDocuments, _otherLegalDocs) => {
        if(_otherLegalDocs?.length == 0) {
            setselectTableDocuments(_selectTableDocuments);
            return;
        }

        postApiCall("POST", $Service_Url.getOtherFromAPI, _otherLegalDocs)
        .then((res) => {
            if(res == "err") throw new Error("api error");

            const otherDocNames = res?.data?.data || [];
            konsole.log("sdvgjh", otherDocNames)
            otherDocNames?.forEach(ele => {
                for(let i = 0; i < _selectTableDocuments.length; i++) {
                    if(ele.othersMapNatureId == _selectTableDocuments[i]?.userLegalDocId) {
                        _selectTableDocuments[i] = { 
                            ..._selectTableDocuments[i], 
                            ...ele, 
                            legalDocType: ele.othersName
                        };
                    }
                }
            })

            konsole.log("wrhv", _selectTableDocuments, otherDocNames); 
            setselectTableDocuments(_selectTableDocuments);
        })
        .catch((err) => konsole.log("sdfs", err))
    }

    const getUserLegalDocMappings = () => {
        if(_primaryMemberUserId && _primaryMemberUserId != "null") getApiCall("GET", $Service_Url.getFiduciaryAsgnmntData + _primaryMemberUserId, setPrimaryUserLegalMapping)
        if(_spouseUserId && _spouseUserId != "null") getApiCall("GET", $Service_Url.getFiduciaryAsgnmntData + _spouseUserId, setSpouseUserLegalMapping)
    }
    
    return (
        <>
        <div className="contain">
            {props?.refrencePage == "SummaryDoc" ? <div className=" d-flex justify-content-start" style={{borderBottom:"2px solid #E8E8E8"}}>
                <h1 className="health_Info_h1 pb-3">Fiduciary Assignment</h1>
            </div> : <div>
                <p className='Heading mt-5 mb-1 generate-pdf-main-color'>Fiduciary Assignment:</p>
            </div>}
            {(totalLength == 0) && <p>(Not provided)</p>}
            {(totalLength > 0) && selectTableDocuments?.map(ele => {
                const filteredList4Primary = PrimaryUserLegalMapping?.fiduciaryAssignments?.filter(element => element.userLegalDocId == ele?.userLegalDocId)
                const filteredList4Spouse = SpouseUserLegalMapping?.fiduciaryAssignments?.filter(element => element.userLegalDocId == ele?.userLegalDocId)
                const needToShow = ((filteredList4Primary?.length || 0) + (filteredList4Spouse?.length || 0)) > 0;

                return (
                <>
                <ul className="pt-3 ps-3">
                    <li className="head-2">
                        {ele?.legalDocType}
                        {needToShow == false && <span className="ms-2" style={{fontSize: "12px", fontWeight: "400"}}>(Not provided)</span>}
                    </li>
                </ul>
                <DocTable userName={$AHelper.capitalizeAllLetters(_userDetailOfPrimary?.memberName)} mappedList={filteredList4Primary}/>                 
                <DocTable userName={$AHelper.capitalizeAllLetters(_userDetailOfPrimary?.spouseName)} mappedList={filteredList4Spouse}/>
                </>)
            })}
        </div>
        </>
    )
}

const DocTable = ( props ) => {
    useEffect(() => konsole.log("dfbdaf", props), [])
    return (
        <>
        {props?.mappedList?.length > 0 && <div className="contain">
            <p className='p2'>{props.userName}</p>
            <Table bordered>
                <thead>
                    <tr>
                        <th>Successor</th>
                        <th>Name</th>
                        <th>Relationship</th>
                    </tr>
                </thead>
                <tbody>
                {props?.mappedList?.sort((a, b) => a.sRankId - b.sRankId)?.map(ele => {
                    return (<tr>
                        <td>{ele.succesorRank}</td>
                        <td>{$AHelper.capitalizeAllLetters(ele.succesorName)}</td>
                        <td>{ele.relationshipWithUser}</td>
                    </tr>)
                })}
                </tbody>
            </Table>
        </div>}
        </>
    )
}

export default FiduciaryAssignSumNew;