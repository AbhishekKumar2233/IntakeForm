import konsole from "../../../components/control/Konsole";
import { $Service_Url } from "../../../components/network/UrlPath"
import { getApiCall, postApiCall } from "../../../components/Reusable/ReusableCom"

export const deleteProfessional = async ( list2Delete ) => {
    let n = list2Delete?.length;
    let promiseArr = Array(n).fill(undefined);
    for(let i = 0; i < n; i++) {
        promiseArr[i] = postApiCall("DELETE", $Service_Url.deleteProfessionalUser, list2Delete[i]);
    }
    await Promise.all(promiseArr).then((values) => {
        if(values.includes("err")) return false;
        return true;
    })

    return false;
}

export const primaryProfUpsert = (method, JsonObject) => {
    const url = method == "POST" ? $Service_Url.postAddPhysician : $Service_Url.putPrimaryCarePhysicianPath;
    return postApiCall(method, url, JsonObject);
}

export const mapPrimaryProf = (method, JsonObject) => {
    const url = method == "POST" ? $Service_Url.mapPrimaryCare : $Service_Url.mapUpdatePrimaryCare;
    return postApiCall(method, url, JsonObject);
}

export const getPrimaryProfs = ( primaryUserId ) => {
    const url = $Service_Url.getPrimaryPhysician + primaryUserId;
    return postApiCall('GET', url, {});
}


export const getPrimaryCareMapId = (proUserId, userId, getFullDetails) => {
    return new Promise((resolve, reject) => {
        getApiCall("GET", $Service_Url.mapGetPrimaryCare + `/${userId}?ProUserId=${proUserId}`)
        .then(res => {
            konsole.log("SDvbsj", res?.[0]);
            return getFullDetails ? resolve(res?.[0]) : resolve(res?.[0]?.primaryCareId);
        })
    })
}

export const deletePrimaryCareProf = ( primaryCareId, userId, loggedInUserId ) => {
    return new Promise((resolve, reject) => {
        postApiCall("DELETE", $Service_Url.deleteSpecialistDatabyDocuserId, {
            userId: userId,
            deletedBy: loggedInUserId,
            primary_Care_Id : primaryCareId,
        }).then(res => resolve(res));
    })
}