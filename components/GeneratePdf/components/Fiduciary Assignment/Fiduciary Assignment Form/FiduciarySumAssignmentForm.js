import { useEffect, useState } from "react";
import { $CommonServiceFn } from "../../../../network/Service";
import { $Service_Url } from "../../../../network/UrlPath";

const FiduciarySumAssignmentForm = ({primaryUserId, spouseUserId, clientName, fiduAsgnmntTypeId}) => {

    const userId = (primaryUserId !== undefined && primaryUserId !== '') ? primaryUserId : '';
    const spouseUsrId = (spouseUserId !== undefined && spouseUserId !== '') ? spouseUserId : '';

    const [fidPriList, setFidPriList] = useState([]);
    const [fidSpouseList, setFidSpouseList] = useState([]);


    useEffect(()=>{
        if(userId !== ''){
            fetchPrimaryFid(userId);
        }
    },[userId])

    useEffect(() => {
        if (spouseUsrId !== '') {
            fetchSpouseFid(spouseUsrId);
        }
    }, [spouseUsrId])





    const fetchPrimaryFid = (userId) => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntData + userId,
            "", (response) => {
                if (response) {
                    let fidPriList= response.data.data.fiduciaryAssignments.filter((v, j) => v.fiduAsgnmntTypeId == fiduAsgnmntTypeId);
                    fidPriList =  fidPriList.sort((a, b) => { return a.sRank - b.sRank});
                    setFidPriList(fidPriList);
                }
            })
    }



    const fetchSpouseFid = (spouseUsrId) => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryAsgnmntData + spouseUsrId,
            "", (response) => {
                if (response) {
                let fidSpouseList= response.data.data.fiduciaryAssignments.filter((v, j) => v.fiduAsgnmntTypeId == fiduAsgnmntTypeId);
                fidSpouseList =  fidSpouseList.sort((a, b) => { return a.sRank - b.sRank});
                setFidSpouseList(fidSpouseList);
                }
            })
    }

    const fiduciaryListShow = (fidListObj) => {
        return(

            <div className="container">
            <table className='table-container '>
                        <thead>
                            <tr>
                                <th colSpan='3' className=' text-center p3'>{clientName}</th>
                            </tr>
                            <tr>
                                <th className='col-1'></th>
                                <th className='col-3'>Name</th>
                                <th className="col-2">Relationship</th>
                            </tr>
                        </thead>
                    <tbody>
                {
                    fidListObj.length > 0 && fidListObj.map((fid, index)=>{
                    return(
                        <tr key={index}>
                            <th>{(fid.sRank == '1')? <span>1<sup>st</sup> Choice</span>:(fid.sRank == '2')? <span>2<sup>nd</sup> Choice</span>:(fid.sRank == '3')? <span>3<sup>rd</sup> Choice</span>:""}</th>
                            <th><input type='text' className='border-bottom border-dark w-75' value={fid.succesorName}/></th>
                            <th><input type='text' className='border-bottom border-dark w-75' value={fid.relationshipWithUser}/></th>
                        </tr>
                    )})
                }
                </tbody>
            </table></div>
        )
    }


    
    return ( 
        <div className="">
            {
                (userId !== '')? fiduciaryListShow(fidPriList) : '' 
            }
            {
                (spouseUsrId !== '') ? fiduciaryListShow(fidSpouseList): ''
            }
        </div>
     );
}
 
export default FiduciarySumAssignmentForm;