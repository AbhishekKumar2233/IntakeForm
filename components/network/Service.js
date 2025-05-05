import axios from "axios";
import konsole from "../control/Konsole";
import { $Service_Url, Api_Url } from "./UrlPath";
import Router from "next/router";
import { ABaseUrl, logoutUrl } from "../control/Constant";
import { $JsonHelper } from "../../component/Helper/$JsonHelper";


let $CommonServiceFn = {
    InvokeCommonApi: function (method, url, inputdata, callback) {
        //return function (dispatch) {
        let token = sessionStorage.getItem("AuthToken") || "";
        // konsole.log("Req url " + url);
        // konsole.log("Token " + token),
        // konsole.log("Input " + JSON.stringify(inputdata));
        // axios.defaults.headers = { 'Content-Type': 'application/json,application/json-patch+json' }
        //dispatch({ type: SET_LOADER, payload: true });
        axios({
            headers: { 'Access-Control-Allow-Origin': true, "Authorization": `Bearer ${token}`},
            // config: { headers: { 'Content-Type': 'application/json,application/json-patch+json' } },
            method: method,
            url: url,
            data: inputdata,
            // timeout: 2000
        })
            //axios.post(method,inputdata)    
            .then(data => {
                konsole.log("URL-", url)
                if (callback) {
                    callback(data, null);
                }
                // return response.data.data.jwtToken;
            })
            .catch(error => {
                let errordata = null;
                konsole.log("Error ", error + url)
                konsole.log("Error ", error.response)
                if (error.response) {
                    errordata = error.response;
                    if (errordata.status == 401) {
                        sessionStorage.setItem("AuthToken", "");
                        Router.push("/login");
                    }
                    // konsole.log(errordata);
                    if (errordata.status !== 401 && errordata.status == 404) {
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                    if (errordata.status !== 401 && errordata.status == 400) {
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                    if (errordata.status !== 401 && errordata.status == 503) {
                        konsole.log("Something went Wrong. Try again later.");
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                    if (errordata.status !== 401 && errordata.status == 500) {
                        callback(null, errordata);
                    }
                }

            });

    },
    InvokeContractApi: function (method, url, inputdata, callback) {

        axios({
            // headers: { 'Content-Type': 'application/json-patch+json' },
            // config: { headers: { 'Content-Type': 'application/json-patch+json, application/x-www-form-urlencoded' } },
            method: method,
            url: url,
            data: (inputdata !== null) ? inputdata : null
        })
            .then(data => {
                konsole.log("URL-", url)
                if (callback) {
                    callback(data, null);
                }
            })
            .catch(error => {
                let errordata = null;
                konsole.log("Error ", error + url)
                konsole.log("Error ", error.response)
                if (error.response) {
                    errordata = error.response;
                    if (errordata.status == 401) {
                        let newWin = window.open(`${ABaseUrl}/ContractExpressAuth`, 'height=200,width=150');

                        if (!newWin || newWin.closed || typeof newWin.closed == "undefined") {
                            alert("please disable popup blocker to proceed.");
                        }
                        callback(null, errordata);
                    }
                    if (errordata.status !== 401 && errordata.status == 404) {
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                    if (errordata.status !== 401 && errordata.status == 400) {
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                    if (errordata.status !== 401 && errordata.status == 503) {
                        konsole.log("Something went Wrong. Try again later.");
                    }
                    if (errordata.status !== 401 && errordata.status == 500) {
                        callback(null, errordata);
                    }
                }

            });

    },
    InvokeFileApi: function (method, url, inputdata, callback) {

        //return function (dispatch) {
        let token = sessionStorage.getItem("AuthToken") || "";
        // konsole.log("Req url " + url);
        // konsole.log("Token " + token),
        // konsole.log("Input " + JSON.stringify(inputdata));

        //dispatch({ type: SET_LOADER, payload: true });
        axios({
            headers: { 'Access-Control-Allow-Origin': true, "Authorization": `Bearer ${token}` },
            method: method,
            url: url,
            data: inputdata
        })
            //axios.post(method,inputdata)    
            .then(data => {
                if (callback) {
                    callback(data, null);
                }
                // return response.data.data.jwtToken;
            })
            .catch(error => {
                let errordata = null;
                konsole.log("Error ", error + url)
                konsole.log("Error ", error?.response)
                if (error.response) {
                    errordata = error?.response;
                    if (errordata?.status == 400) {
                        if (errordata?.data?.messages) {
                            callback(null, errordata?.data?.messages[0])
                        }
                        if (errordata?.data?.errors) {
                            callback(null, errordata)
                        }
                    }
                    if (errordata.status == 401) {
                        sessionStorage.setItem("AuthToken", "");
                        Router.push("/login");
                    }
                    // konsole.log(errordata);
                    if (errordata?.status !== 401 && errordata?.status == 404 || errordata?.status == 413) {
                        if (callback) {
                            callback(null, errordata);
                        }
                    }
                }


            });

    },
    InvokeCommonSocialInviterApi: function (method, url, inputdata, header,callback) {
        //return function (dispatch) {
        let token = sessionStorage.getItem("AuthToken") || "";
        konsole.log("Req url " + url);
        // konsole.log("Token " + token),
            // konsole.log("Input " + JSON.stringify(inputdata));

        //dispatch({ type: SET_LOADER, payload: true });

        // if(header !== ""){
        //     axios.defaults.headers = header
        // }

        axios({
            headers: { 'Access-Control-Allow-Origin': true, "Authorization": `Bearer ${token}`,...header },
            config: { headers: header },
            method: method,
            
            url: url,
            data: inputdata
        })
        .then(data => {
            if (callback) {
                konsole.log("URL-", url,data);
                callback(data,null);
            }
        })
        .catch(error => {
            let errordata = null;
            konsole.log("Error ",error + url)
            konsole.log("Error ", error.response)
            if (error.response) {
                errordata = error.response;
                if (errordata.status == 401) {
                    sessionStorage.setItem("AuthToken","");
                }
                // konsole.log(errordata);
                if (errordata.status !== 401 && errordata.status == 404) {
                    if (callback) {
                        return callback(null,errordata);
                    }
                }
                if (errordata.status !== 401 && errordata.status == 400) {
                    if (callback) {
                        return callback(null,errordata);
                    }
                }
                if (errordata.status !== 401 && errordata.status == 503) {
                    konsole.log("Something went Wrong. Try again later.");
                }
                if (callback) {
                    return callback(null, errordata);
                }
            }
        });
    },
}

let $postServiceFn = {
    postAddOther: function (method, arrayOfData, callback) {
        let url = (method == "POST") ? $Service_Url.addOtherPath : method == "PUT" ? $Service_Url.updateOtherPath : "";
        konsole.log("arryaofOther", arrayOfData, url);
        $CommonServiceFn.InvokeCommonApi(method, url,
            arrayOfData, (response) => {
                if (response) {
                    callback(response)
                }
            })
    },
    getIpAddress: async () => {
        let data = await fetch($Service_Url.ipaddress);
        return await data.json();
    },

    putUserInfo: function (memberData, callback) {
        const inputData = getUpdateMemberJSON(memberData);

        konsole.log("konsole input Data at personal", JSON.stringify(inputData));
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, inputData, (response) => {
            if (response) {
                konsole.log('success datata', response);
                callback(response);
            }
        });
    },
    putUserInfo2: function (memberData, callback) {
        // konsole.log("konsole input Data at personal", JSON.stringify(inputData));
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putUpdateMember, memberData, (response) => {
            if (response) {
                konsole.log('success datata', response);
                callback(response);
            }
        });
    },

    putMemberAddress: function (userId, addressId, sameAsUserId, isActive, userAddressId, isDeleted, updatedBy, callback) {
        // const inputData = getUpdateMemberJSON(memberData);
        let updateAddress = {
            userId: userId,
            addressId: addressId,
            sameAsUserId: sameAsUserId,
            isActive: isActive,
            userAddressId: userAddressId,
            isDeleted: isDeleted,
            updatedBy: updatedBy
        }

        konsole.log("konsole input Data at personal", updateAddress);
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putMemberAddress, updateAddress, (response) => {
            if (response) {
                konsole.log('success datata', response);
                callback(response);
            }
        });
    },
    putMemberAddressData: function (userId, json, addressId, updatedBy, callback) {
        let updateAddress =
        {
            "userId": userId,
            "address": {
                "lattitude": json?.lattitude,
                "longitude": json?.longitude,
                "addressLine1": json?.addressLine1,
                "addressLine2": json?.addressLine2,
                //   "addressLine3": "",
                "zipcode": json?.zipcode || json?.zip || "",
                "county": json?.county || "",
                "city": json?.city,
                "state": json?.state,
                "country": json?.country,
                "addressTypeId": 1,
                "addressId": addressId,
                "updatedBy": updatedBy,
                "isActive": true
            }
        }
        $CommonServiceFn.InvokeCommonApi("PUT", $Service_Url.putupdateAddress, updateAddress, (response) => {
            if (response) {
                konsole.log('successuiudatata', response);
                callback(response);
            }
        });
    },

    postMapOther: function (method, arrayOfData, callback) {
        konsole.log("arryaofOther", arrayOfData);
        $CommonServiceFn.InvokeCommonApi(method, $Service_Url.mapOtherwithFormPath,
            arrayOfData, (response) => {
                if (response) {
                    callback(response)
                }
            })

    },
    postFileUpload: function (file, userId, loggedInUser, fileTypeId, fileCategoryId, fileStatusId, callback,userfileName) {
        let formdata = new FormData();
        formdata.append('file', file)
        formdata.append('UserId', userId)
        formdata.append('UploadedBy', loggedInUser)
        formdata.append('FileTypeId', fileTypeId)
        formdata.append('FileCategoryId', fileCategoryId);
        formdata.append('FileStatusId', fileStatusId)
        if(userfileName){
            formdata.append('UserFileName',userfileName)
        }
        $CommonServiceFn.InvokeFileApi("POST", $Service_Url.fileUploadPath,
            formdata, (response, errorData) => {
                if (response) {
                    konsole.log("responseresponse", response)
                    callback(response);
                }
                else if (errorData) {
                    konsole.log("responseresponse", errorData)
                    callback(null, errorData);
                }
            })
    },

    postbulkfileupload: function (file, uploadedby, callback) {
        let formdata = new FormData();
        formdata.append('file', file)
        formdata.append('uploadedBy', uploadedby)

        konsole.log("formdataformdata", JSON.stringify(file))
        $CommonServiceFn.InvokeFileApi("POST", $Service_Url.postbulkfile,
            formdata, (response, errorData) => {
                if (response) {
                    callback(response);
                }
                else if (errorData) {
                    callback(null, errorData);
                }
            })

    },

    handleAddprofessinal: (professUserId, primaryUserId, professTypeId, createdBy, callback) => {
        let postData = {
            userId: primaryUserId,
            createdBy: createdBy,
            professionalUser: {
                proTypeId: parseInt(professTypeId),
                proUserId: professUserId
            }
        }
        konsole.log("postData at addprofessional", postData);
        // debugger
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postaddprofessionluser,
            postData, (response) => {
                konsole.log("response", response);
                callback(response);
            })
    },   
    memberAddress: (userId, addressId, sameAsUserId, isActive, createdBy, callback2) => {
        let postAddress = {
            userId: userId,
            addressId: addressId,
            sameAsUserId: sameAsUserId,
            isActive: isActive,
            createdBy: createdBy

        }
        konsole.log("postData at addprofessional", postAddress);
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postMemberAddress,
            postAddress, (response) => {
                konsole.log("response at services", response);
                callback2(response);
            })
    },
    postAddressByUserId: (userId, adress, createdBy, callback2) => {

        let json =
        {
            "userId": userId,
            "address": {
                "lattitude": adress?.lattitude,
                "longitude": adress?.longitude,
                "addressLine1": adress?.addressLine1,
                "addressLine2": adress?.addressLine2,
                "zipcode": adress?.zipcode || adress?.zip,
                "county": adress?.county|| "",
                "city": adress?.city,
                "state": adress?.state,
                "country": adress?.country,
                "addressTypeId": 1,
                "createdBy": createdBy
            }
        }
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAddAddress,
            json, (response) => {
                konsole.log("response at services", response);
                callback2(response);
            })
    },
    postuserorderAddUserOrder: (adduserobj, callback2) => {
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAddUserOrder, adduserobj, (response) => {
            callback2(response);
        })
    },


    auth0ConfigApi: (callback) => {
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAuthApiSettings, "", (response) => {
            if (response) {
                callback(response);
            }
        })
    },
    mapDataWithPrimaryUser: async (method, apiUrl, userPostData) => {
        return new Promise((resolve, reject) => {
            // debugger
            $CommonServiceFn.InvokeCommonApi(method, apiUrl,
                userPostData, (response, errorData) => {
                    if (response) {
                        if (response.status == 200) {
                            resolve("done");
                        }
                        else {
                            resolve("reject");
                        }
                    } else {
                        resolve("reject");
                    }
                })
        });
    },

    mapInsuranceWithSpouseUser: async (method, apiUrl, spouseSameInsuranceData, sameWithPrimary, userPostData) => {
        return new Promise((resolve, reject) => {
            if (spouseSameInsuranceData?.length > 0 && sameWithPrimary == false) {
                konsole.log("methodapiurl2", userPostData, spouseSameInsuranceData);
                $CommonServiceFn.InvokeCommonApi(method, apiUrl,
                    userPostData, (response, errorData) => {
                        if (response) {
                            konsole.log("mapuserspousedata2", userPostData, response);
                            if (response.status == 200) {
                                resolve("done");
                            }
                            else {
                                resolve("reject");
                            }
                        } else {
                            resolve("reject");
                        }
                    })
            }
            else if (sameWithPrimary == true) {
                $CommonServiceFn.InvokeCommonApi(method, apiUrl,
                    userPostData, (response, errorData) => {
                        if (response) {
                            konsole.log("mapuserspousedata", userPostData, response);
                            if (response.status == 200) {
                                resolve("done");
                            }
                            else {
                                resolve("reject");
                            }
                        } else {
                            resolve("reject");
                        }
                    })
            } else {
                resolve("run without mapping");
            }
        });
    },
    //    unmapInsuranceWithSpouseUser:async(method,apiUrl,userPostData)=>{
    //     return new Promise((resolve,reject)=>{
    //         $CommonServiceFn.InvokeCommonApi(method, apiUrl,
    //             userPostData, (response, errorData) => {
    //                 if (response) {
    //                     if (response.status == 200) {
    //                         resolve("done");
    //                     }
    //                     else {
    //                         resolve("reject");
    //                     }
    //                 } else {
    //                     resolve("reject");
    //                 }
    //             })
    //     })
    //    },
    unMappedInsDataofSpouse: async (method, apiUrl, userPostData) => {
        return new Promise((resolve, reject) => {
            // debugger
            $CommonServiceFn.InvokeCommonApi(method, apiUrl,
                userPostData, (response, errorData) => {
                    if (response) {
                        if (response.status == 200) {
                            resolve("done", response);
                        }
                        else {
                            resolve("reject", response);
                        }
                    } else {
                        resolve("reject");
                    }
                })
        });
    },

    deleteprofessionalMapedUser: async (method, apiurl, userPostData) => {
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi(method, apiurl, userPostData, (response, err) => {
                if (response) {
                    resolve("done", response)
                } else {
                    resolve("reject", err)
                }
            })
        })
    },
    deleteprofessionalbyDocuserId: async (method, apiurl, userPostData) => {
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi(method, apiurl, userPostData, (response, err) => {
                if (response) {
                    resolve("done", response)
                } else {
                    resolve("reject", err)
                }
            })
        })
    },
    addmemberprimarycarephycians: async (method, url, jsonobj) => {
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi(method, url, jsonobj, (response, errorData) => {
                if (response) {
                    if (response.status == 200) {
                        resolve(response);
                    } else {
                        resolve(response);
                    }
                } else {
                    resolve(errorData);
                }
            })
        })
    },
    memberRelationshipAddPut: async (method, url, json) => {
        let jsonObj = (json !== undefined && json !== null && json !== '') ? json : ""
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi(method, url, jsonObj, (response, err) => {
                if (response) {
                    konsole.log("responsememberRelationshipAddPut", response)
                    resolve(response, 'response')
                } else {
                    resolve('error', err)
                }
            })
        })
    },




}

let $getServiceFn = {
    getOtherById: function (arrayOfData, callback) {
        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.addOtherPath,
            arrayOfData, (response) => {
                if (response) {
                    callback(response)
                }
            })
    },
    handleLogout: (e) => {
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        window.sessionStorage.clear();
        const params = `Account/Signout?appState=${stateObj.appState}&userId=${stateObj.userId}&roleId=${stateObj.roleId}&loggenInId=${stateObj.loggenInId}&success=true`;
        konsole.log("params", params);
        window.location.replace(logoutUrl + params);
    },
    getContractTemplate: (callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.getContractTemplatePath,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getContractDetail: (contractId, callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.getContractDetailPath + `/${contractId}`,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    postGenrateDoc: (json, callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.genrateDocumentFile + `/${json?.userName}?version=${json?.version}`,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getDocumentVersion: (fileName, callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.getDocVersion + `/${fileName}`,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getAuthUserAcademy: (user_email, callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.getAcademyUserData + `=${user_email}`,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getLegalDoc: (data, callback) => {
        $CommonServiceFn.InvokeContractApi("POST", $Service_Url.createXmlGenraterDocFile,
            data,(response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getSelectedDocuments: (data,docList, callback) => {
        $CommonServiceFn.InvokeContractApi("POST", $Service_Url.createXmlGenraterDocFile+"?target_template="+docList,
            data,(response, error) => {
                if (response) {
                    callback(response)
                }else{
                    callback(null, error);
                }
            })
    },
    getLegalDocForAsset: (data, callback) => {
        $CommonServiceFn.InvokeContractApi("POST", $Service_Url.createXmlGenraterDocFileForAsset,
            data,(response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getDocumentFolder:(urlData, callback) => {
                $CommonServiceFn.InvokeContractApi("Get", $Service_Url.generateDocumentsFolder+`?${urlData}`,
                    '', (response, error) => {
                        if (response) {
                            callback(response)
                        }
                        else {
                            callback(null, error);
                        }
                    })
    },
    getEnqurieMemberlist: (subtenantId, callback) => {
        $CommonServiceFn.InvokeContractApi("Get", $Service_Url.getEnquiryMembers + `/${subtenantId}`,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getFileStatusdata: (isActive) => {

        $CommonServiceFn.getFileStatus("Get", $Service_Url.getFileStatus + { isActive },
            '', (response, error) => {
                if (response) {
                    konsole.log("responsds", response)
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getFileBelongsTo: () => {

        $CommonServiceFn.getFileBelongsTo("Get", $Service_Url.getFileBelongsToPath,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    konsole.log("errrr", error)
                    callback(null, error);
                }
            })
    },
    getProfessUsers: (obj, callback) => {

        let data = `?ProSerDescId=${obj.ProSerDescId}&ProTypeId=${obj?.proTypeId}&PageNumber=${obj?.pageNumber}&RowsOfPage=${obj?.rowsOfPage}&SearchName=${obj?.searchName}`
        konsole.log("professinal get", $Service_Url.getProfessionalUsers + data);

        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getProfessionalUsers + data,
            '', (response, error) => {
                if (response) {
                    konsole.log("responseService", response)
                    callback(response)
                }
                else {
                    callback(null, error);
                    konsole.log("ErroService", error)
                }
            })
    },
    getProfessUsersV3: (obj, callback) => {

        let data = `?ProSerDescIds=${obj.ProSerDescIds}&ProTypeIds=${obj?.proTypeIds}&ProSubTypeIds=${obj?.proSubTypeIds}&PageNumber=${obj?.pageNumber}&RowsOfPage=${obj?.rowsOfPage}&SearchName=${obj?.searchName}`
        konsole.log("professinal get v3", $Service_Url.getProfessionalUsers + data);

        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getProfessionalUsersV3 + data,
            '', (response, error) => {
                if (response) {
                    konsole.log("responseService", response)
                    callback(response)
                }
                else {
                    callback(null, error);
                    konsole.log("ErroService", error)
                }
            })
    },
    postGetProfessUsersV3: (obj, callback) => {
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postGetProfessionalUsersV3,
        obj, (response, error) => {
            if (response) {
                konsole.log("responseService", response)
                callback(response)
            }
            else {
                callback(null, error);
                konsole.log("ErroService", error)
            }
        })
    },
    getMarginalTax: (obj, callback) => {

        $CommonServiceFn.InvokeCommonApi("Get", $Service_Url.getMarginalTaxRate + `?taxableIncome=${obj?.taxableIncome}&countryId=${obj?.countryId}&userTypeId=${obj?.userTypeId}&TaxYear=01/01/${obj.textYear}`,
            '', (response, error) => {
                if (response) {
                    konsole.log("responseService", response)
                    callback(response)
                }
                else {
                    callback(null, error);
                    konsole.log("ErroService", error)
                }
            })
    },

    // postUserRolefun:function(loginUserId,roleId,isActive,createdBy,UserId){
    //     let formdata = new FormData();
    //     formdata.append('loginUserId',loginUserId)
    //     formdata.append('roleId',roleId)
    //     formdata.append('isActive',isActive)
    //     formdata.append('createdBy',createdBy)
    //     formdata.append('UserId',UserId)

    //     $CommonServiceFn.InvokeFileApi("POST", $Service_Url.postUserRole + "4a9935bf-9f54-4833-b7f2-d9471de31514",
    //     formdata, (response, errorData) => {
    //         if(response){
    //             callback(response);
    //         }
    //         else if(errorData){
    //             callback(null, errorData);
    //         }
    //     })
    // },
    getFileStatusdata: (isActive) => {

        $CommonServiceFn.getFileStatus("Get", $Service_Url.getFileStatus + { isActive },
            '', (response, error) => {
                if (response) {
                    konsole.log("responsds", response)
                    callback(response)
                }
                else {
                    callback(null, error);
                }
            })
    },
    getFileBelongsTo: () => {

        $CommonServiceFn.getFileBelongsTo("Get", $Service_Url.getFileBelongsToPath,
            '', (response, error) => {
                if (response) {
                    callback(response)
                }
                else {
                    konsole.log("errrr", error)
                    callback(null, error);
                }
            })
    },
    updateChildDetails: (userId, IsChildUserId) => {
        konsole.log('userIduserIduserIduserIduserId', userId, IsChildUserId)
        return new Promise((resolve, reject) => {
            $CommonServiceFn.InvokeCommonApi('PUT', $Service_Url?.updateMemberChildByUserId + `?userId=${userId}&IsChildUserId=${IsChildUserId}`, "", (response, error) => {
                if (response) {
                    konsole.log('updateMemberChildByUserIdres', response)
                    resolve('resolve')
                } else {
                    konsole.log('updateMemberChildByUserIdres', error)
                    resolve('resolve')
                }
            })
        })
    },  
    userValidateLinks: async ({ LinkStatusId, UniqueLinkKey, LinkTypeId }) => {
        let cancel;
        let url = $Service_Url?.getvalidateUserLinks + `?LinkStatusId=${LinkStatusId}&UniqueLinkKey=${UniqueLinkKey}&LinkTypeId=${LinkTypeId}`;
        return invoke(url, 'GET', cancel);
    }


}


// axios.defaults.headers.post['Accept'] = 'application/json, text/plain, */*';
// axios.defaults.headers.Authorization = `Bearer ${token}`; 

const getUpdateMemberJSON = (memberData) => {
    const inputData = {
        userId: (memberData !== "") ? (memberData.userId !== undefined) ? memberData.userId : "" : "",
        fName: (memberData !== "") ? (memberData.fName !== undefined) ? memberData.fName : "" : "",
        mName: (memberData !== "") ? (memberData.mName !== undefined) ? memberData.mName : "" : "",
        lName: (memberData !== "") ? (memberData.lName !== undefined) ? memberData.lName : "" : "",
        dob: (memberData !== "") ? (memberData.dob !== undefined) ? memberData.dob : null : null,
        nickName: (memberData !== "") ? (memberData.nickName !== undefined) ? memberData.nickName : null : null,
        genderId: (memberData !== "") ? (memberData.genderId !== undefined) ? memberData.genderId : null : null,
        maritalStatusId: (memberData !== "") ? (memberData.maritalStatusId !== undefined) ? memberData.maritalStatusId : null : null,
        suffixId: (memberData.suffixId !== undefined) ? memberData.suffixId : null,
        birthPlace: (memberData !== "") ? (memberData.birthPlace !== undefined) ? memberData.birthPlace : null : null,
        citizenshipId: (memberData.citizenshipId !== undefined) ? memberData.citizenshipId : null,
        noOfChildren: (memberData !== "") ? (memberData.noOfChildren !== undefined) ? memberData.noOfChildren : null : null,
        isVeteran: (memberData !== "") ? (memberData.isVeteran !== undefined) ? memberData.isVeteran : false : false,
        isPrimaryMember: (memberData !== "") ? (memberData.isPrimaryMember !== undefined) ? memberData.isPrimaryMember : false : false,
        memberRelationshipVM: (memberData !== "") ? (memberData.memberRelationshipVM !== undefined) ? memberData.memberRelationshipVM : null : null,
        updatedBy: (memberData !== "") ? (memberData.updatedBy !== undefined) ? memberData.updatedBy : '' : '',
        subtenantId : (memberData !== "") ? (memberData.subtenantId !== undefined) ? memberData.subtenantId : '' : '',
    }
    return inputData;
}




// file upload like all module ----------------------------------------------------------------------------------------------------------------------------------------
// axios.defaults.timeout = 15000;
const invoke = (url, method, body, cancel) => {
    axios.defaults.baseURL = ABaseUrl;
    
    if (cancel) {
        cancel();
    }
        
    try {
         konsole.log('URL: ' + url);
        konsole.log('method:' + method);
        konsole.log(((method == "POST") ? "body" : 'params') + JSON.stringify(body));
        let token = sessionStorage.getItem("AuthToken");
        
        
        konsole.log("token ", `Bearer ${token}`);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        
        
        
        return axios({
            cancelToken: new axios.CancelToken(function executor(c) {
                cancel = c;
            }),

            method: method,
            url: url,
            params: (method === "GET") ? body : null,
            data:
            method === "POST" || method === "PUT" || method === "DELETE"
            ? body
            : null,
        });
    } catch (error) {
                if (axios.isCancel(error)) {
            konsole.error('Request canceled', error.message);
        } else {
            konsole.error('Something went wrong: ', error.message)
        }
    }
};
const invokefileApi = (url, method, body, cancel) => {
    
    if (cancel) {
        cancel();
    }
    // axios.defaults.headers.common['Content-Type'] = `multipart/form-data;boundary`
    try {
        konsole.log('URL: ' + url);
        konsole.log('method:' + method);
        konsole.log(((method == "POST") ? "body" : 'params') + JSON.stringify(body));
        axios.defaults.baseURL = ABaseUrl;
        let token = sessionStorage.getItem("AuthToken");
        
        konsole.log("token ", `Bearer ${token}`);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return axios({
            cancelToken: new axios.CancelToken(function executor(c) {
                cancel = c;
            }),
            method: method,
            url: url,
            params: (method === "GET") ? body : null,
            data: (method === "POST") ? body : null
        });
    } catch (error) {
        if (axios.isCancel(error)) {
            konsole.error('Request canceled', error.message);
        } else {
            konsole.error('Something went wrong: ', error.message)
        }
    }
};
// file upload like all module ----------------------------------------------------------------------------------------------------------------------------------------



const Services = {

    // new file cabinet api------------------------------------------

    getMainCabinetContainer: async ({ belongsTo,cabinetId, createdBy, isActive, subtenantId, roleId }) => {
        let cancel;
        let url = Api_Url.getMainCabinet;
        let body = {};
        body["belongsTo"] = belongsTo;
        body["cabinetId"] = cabinetId;
        body["isActive"] = isActive;
        body["subtenantId"] = subtenantId;
        body["createdBy"] = createdBy;
        body["roleId"] = roleId;
        return invoke(url, "GET", body, cancel);
    },
    upsertMainCabinet: async (jsonObj) => {
        let cancel
        let url = Api_Url.upsertMainCabinet
        return invoke(url, 'POST', jsonObj, cancel)
    },
    upsertCabinetCategoryType: async (jsonObj) => {
        let cancel;
        let url = Api_Url.upsertCabinetCategoryType
        return invoke(url, 'POST', jsonObj, cancel)
    },
    getFileCategoryTypeList:async(jsonObj)=>{
        let cancel;
        let url = Api_Url.getFileCategoryTypeList
        return invoke(url, 'POST', jsonObj, cancel)
    },
    upsertCabinetFolder: async (jsonObj) => {
        let cancel;
        let url = Api_Url.upsertCabinetFolder
        return invoke(url, 'POST', jsonObj, cancel)
    },
    deleteFileCabinetFolder: async ({folderId,memberUserId,subtenantId,roleId,deletedBy,folderCategoryId}) => {
        let cancel;
        let body={}
        let url =  Api_Url.deleteFileCabinetFolder+`${folderId}/${memberUserId}/${subtenantId}/${roleId}/${deletedBy}/${folderCategoryId}`
        konsole.log('urlurlurlurl',url)
        return invoke(url,"DELETE",body,cancel)
      },
    getAllSubtenantDetails: async (json) => {
        let cancel;
        let url = Api_Url.getSubtenantDetails
        return invoke(url, 'POST', json, cancel)
    },
    getUserListBySubtenantId: async (jsonObj) => {
        let cancel;
        let url = Api_Url.getUserList
        return invoke(url, 'POST', jsonObj, cancel)
    },
    getfileBelongsTo: async (clientId) => {
        let cancel;
        let url = Api_Url.fileBelongsTo + `?ClientUserId=${clientId}`
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    getFileCabinetFolderDetails: async (jsonObj) => {
        let cancel;
        let url = Api_Url.getFileCabinetFolderDetails;
        return invoke(url, "POST", jsonObj, cancel);
    },
    upsertCabinetFolderPermissions: async (jsonObj) => {
        let cancel;
        let url = Api_Url.upsertCabinetFolderPermissions;
        return invoke(url, "POST", jsonObj, cancel);
    },
    getPermissionsFolder: async (jsonObj) => {
        let cancel;
        let url = Api_Url.getFoldersPermissions
        return invoke(url, "POST", jsonObj, cancel);
    },
    postUploadUserDocumant: async ({ UserId, FileStatusId, EmergencyDocument, DocumentLocation, FileTypeId, UserFileName, File, FileCategoryId, DateFinalized, Description, UploadedBy }) => {

        let cancel;
        let url = Api_Url.postUploadUserDocument;
        let formData = new FormData()
        formData.append('UserId', UserId)
        formData.append('FileStatusId', FileStatusId)
        formData.append('EmergencyDocument', EmergencyDocument)
        formData.append('DocumentLocation', DocumentLocation)
        formData.append('FileTypeId', FileTypeId)
        formData.append('UserFileName', UserFileName)
        formData.append('File', File)
        formData.append('FileCategoryId', FileCategoryId)
        formData.append('DateFinalized', DateFinalized)
        formData.append('Description', Description)
        formData.append('UploadedBy', UploadedBy)

        return invokefileApi(url, "POST", formData, cancel)

    },
    postUploadUserDocumantV2: async ({ FileId, UserId, FileStatusId, EmergencyDocument, DocumentLocation, FileTypeId, UserFileName, File, FileCategoryId, DateFinalized, Description, UploadedBy }) => {

        konsole.log('FileIdFileId')
        let cancel;
        let url = Api_Url.postUploadUserDocumentV2;
        let formData = new FormData()
        formData.append('UserId', UserId)
        formData.append('FileId', FileId)
        formData.append('FileStatusId', FileStatusId)
        formData.append('DocumentLocation', DocumentLocation)
        formData.append('FileTypeId', FileTypeId)
        formData.append('UserFileName', UserFileName)
        if (FileId == 0) {
            formData.append('File', File)
        }
        if(EmergencyDocument==true || EmergencyDocument==false ){
            formData.append('EmergencyDocument', EmergencyDocument)
        }
        formData.append('FileCategoryId', FileCategoryId)
        if (DateFinalized) {
            formData.append('DateFinalized', DateFinalized)
        }
        formData.append('Description', Description)
        formData.append('UploadedBy', UploadedBy)

        return invokefileApi(url, "POST", formData, cancel)

    },
    addUserFileCabinet: async (json) => {
        let cancel;
        let url = Api_Url.addUserFileCabinet
        let body = json
        return invoke(url, 'POST', body, cancel)
    },
    getFileTypeByCategory: async (categoryId) => {
        let cancel;
        let url = Api_Url.getFileTypeByCategory + `?fileCategoryId=${categoryId}`
        let body = {}
        return invoke(url, "GET", body, cancel)
    },
    getFileFromCabinet: async (primaryUserId) => {
        let cancel;
        let url = Api_Url.getUserFileCabinetFile + primaryUserId
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    getFileForView: async ({ primaryUserId, fileId, fileTypeId, fileCategoryId, requestedBy }) => {
        let cancel;
        let url = Api_Url.getFileForView + `${primaryUserId}/${fileId}/${fileTypeId}/${fileCategoryId}/${requestedBy}`
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    postGetAddUpdateFileRemarks: async (method, json) => {
        let cancel;
        let url = (method == 'GET') ? Api_Url.getFileCabinetRemarks : (method == 'PUT') ? Api_Url.putUpdateFileRemarks : Api_Url.postAddFileRemarks
        let body = json
        method = (method == 'GET') ? 'POST' : method
        return invoke(url, method, body, cancel)
    },
    deleteFileCabinetByFileId: async (json) => {
        let cancel;
        let url = Api_Url.deleteFileCabinetFileByFileId
        let body = json
        return invoke(url, 'DELETE', body, cancel)
    },
    
    deleteTaxInfoIndex: async (userId,userTaxId,deletedBy) => {
        let cancel;
        let url = Api_Url.putTaxInformation +`?UserId=${userId}&UserTaxId=${userTaxId}&DeletedBy=${deletedBy}`
        let body ;
        return invoke(url, 'DELETE', body, cancel)
    },
    getBeneficiaryList: async (userId) => {
        let cancel;
        let url = Api_Url.getBeneficiaryList + userId
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    getFiduciaryList: async (userId) => {
        let cancel;
        let url = Api_Url.getFiduciaryList + userId
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    getFiduciaryDetailsListByUserId:async(userId)=>{
        let cancel;
        let url=Api_Url.getFiduciaryDetailsListByUserId+userId+`?IsActive=true`
        let body={}
        return invoke(url,"GET",body,cancel)
    },
    getBeneficiaryDetailsListByUserId:async(userId)=>{
        let cancel;
        let url=Api_Url.getBeneficiaryDetailsListByUserId+userId+`?IsActive=true`
        let body={}
        return invoke(url,"GET",body,cancel)
    },
    getMemberProfessionals: async ({ MemberUserId,PrimaryUserId }) => {
        let cancel;
        let url = Api_Url.getMemberProfessionals + `?MemberUserId=${MemberUserId}&PrimaryUserId=${PrimaryUserId}`
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    upsertShareFileStatus: async (jsonObj) => {
        let cancel;
        let url = Api_Url.upsertShareFileStatus
        return invoke(url, 'POST', jsonObj, cancel)
    },
    getSharedFileStatus: async ({ primaryMemberUserId }) => {
        let cancel;
        let url = Api_Url.getSharedFileStatus + `?primaryUserId=${primaryMemberUserId}`
        let body = {}
        return invoke(url, 'GET', body, cancel)
    },
    getUserListByRoleId: async (jsonObj) => {
        let cancel;
        let url = Api_Url.getUserListByRoleId
        return invoke(url, 'POST', jsonObj, cancel)

    },
    getLoginUserDetails: async (userId) => {
        let cancel;
        let url = Api_Url.getLoginUserDetailsPath + `?UserId=${userId}`
        let body = {}
        return invoke(url, 'GET', body, cancel)

    },
    apiCallForChechLegalDocStatus:async(userId)=>{
        let cancel;
        let url = Api_Url.checkInCabinetIsAnyLegalDoc+userId
        return invoke(url, 'GET', '', cancel)
    },
    convertToIndiaFormat: (mobileNumber, countryCode) => {
        const digitsOnly = mobileNumber.replace(/\D/g, '');
        const formattedNumber = digitsOnly.replace(/(\d{5})(\d{5})/, `+${countryCode} $1-$2`);
        return formattedNumber;
    }, 
    PostEmail: async (jsonObj) => {
        let cancel;
        let url = Api_Url.postEmail
        return invoke(url, 'POST', jsonObj, cancel)
    },    
    getBloodTypes: async (jsonObj) => {
        let cancel;
        let url = Api_Url.getBloodType
        return invoke(url, 'GET', cancel)
    },  
    
    getUserSubscriptions : (json) =>{
        let cancel;
        let url = Api_Url.getUserSubscriptionsPath + json
        let body = {}
        konsole.log("url1212",url)
        return invoke(url, 'GET', body, cancel)
    },
    getUserSubscriptionPlans : (json) =>{
        let cancel;
        let url = Api_Url.getUserSubscriptionPlansPath + json
        let body = {}
        return invoke(url, 'GET', body, cancel)
    }, 
    getSaleAbleSKU: async (json) => {
        let cancel;
        let url = Api_Url.getUserSaleableSkuPath + json
        let body = {}
        return invoke(url, "GET", body, cancel);
      },
      getRateCard: async (rateCardId, skuListId,subtenantId, isActive) => {
        let cancel;
        let url = Api_Url.getRateCardPath;
        let body = {}
        if(rateCardId){
          body['rateCardId'] = rateCardId
        }
        body['skuListId'] = skuListId
        body['subtenantId'] = subtenantId
        body['isActive'] = isActive
        return invoke(url, "GET", body, cancel);
      },
      getCentralizedSubsTransc: async (json) => {
        let cancel;
        let url = Api_Url.getCentralizedSubsTranscPath
        let body = {}
        konsole.log("urllll",url)
        return invoke(url, "POST", json, cancel);
      },
      getUserProfile: async (json) => {
        let cancel;
        let url = Api_Url.getUserProfilePath + json
        let body = {}
        return invoke(url, "GET", body, cancel);
      },
      getUserOrderDetails: async (json) => {
        let cancel;
        let url = Api_Url.getUserOrderDetailsPath + `?UserId=${json}`
        let body = {}
        return invoke(url, "GET", body, cancel);
      },
    splitCommonAddress: async ( userAddressJson ) => { 
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));

        return new Promise((resolve, reject) => {
            if(!userAddressJson?.sameAsUserId) return resolve(userAddressJson);
            if(!userAddressJson?.userId) return resolve("err");
            
            const removeCommonAddressJson = {
                "userId": userAddressJson?.userId,
                "sameAsUserId": userAddressJson?.sameAsUserId,
                "isActive": false,
                "isDeleted": true,
                "userAddressId": userAddressJson?.userAddressId,
                "updatedBy": stateObj.userId,
                "addressId": userAddressJson?.addressId
            }
            let cancel;
            const removeCommonAddressUrl = $Service_Url.postMemberAddress
            const removeCall = invoke(removeCommonAddressUrl, "PUT", removeCommonAddressJson, cancel); // removing common address

            const AddAsNewAddressUrl = $Service_Url.postAddAddress;
            const AddAddressJson = $JsonHelper.createAddressJsons(userAddressJson?.userId, stateObj.userId, userAddressJson?.addressTypeId, {
                ...userAddressJson,
                "sameAsUserId": null,
                "sameAsUserName": null,
                "sameAsUserRelation": null,
                "userAddressId": null,
                "addressId": null
            }, "POST");
            const addCall = invoke(AddAsNewAddressUrl, "POST", AddAddressJson, cancel);

            Promise.all([removeCall, addCall]).then(([removeResponse, addResponse]) => {
                return resolve(addResponse.data.data.addresses[0]);
            }).catch(() => resolve("err"));
        })

    },
      postfileuploadspeaker: async (File, UploadedBy, UserId, FileTypeId, FileCategoryId, fileStatusId) => {
        let cancel;
        let url = Api_Url.postUploadUserDocument;
        let formdata = new FormData();
        formdata.append('file', File);
        formdata.append('uploadedBy', UploadedBy);
        formdata.append('userId', UserId);
        formdata.append('fileTypeId', FileTypeId)
        formdata.append('fileCategoryId', FileCategoryId);
        formdata.append('fileStatusId', fileStatusId)
    
        return invokefileApi(url, "POST", formdata, cancel)
    
      },
}










// api call with new method----------------------------------------------------------------------------------------------------------------------------------------








export { $getServiceFn, $postServiceFn, $CommonServiceFn, Services };