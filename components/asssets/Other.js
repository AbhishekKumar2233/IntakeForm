
import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { connect } from 'react-redux';
import konsole from '../control/Konsole';
import { $CommonServiceFn, $postServiceFn } from '../network/Service';
import { $Service_Url } from '../network/UrlPath';
import { SET_LOADER } from '../Store/Actions/action';
import { $AHelper } from '../control/AHelper';
import { CustomInput } from '../../component/Custom/CustomComponent';


class Other extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            userId: this.props.userId,
            othersName: "",
            othersCategoryId: this.props.othersCategoryId,
            othersId: "",
            loggedInUser: sessionStorage.getItem("loggedUserId") || '',
            isNewOther: false,
        }
    }


    componentDidMount() {
        this.getOtherFrmAPI(this.props.natureId);
        // alert(window?.location?.pathname)
        if(window?.location?.pathname?.includes("setup-dashboard/Filecabinet")) {
            this.setState({isNewOther: false});
        } else if(window?.location?.pathname?.includes("setup-dashboard")) {
            this.setState({isNewOther: true});
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.natureId !== this.props.natureId) {
            this.getOtherFrmAPI(this.props.natureId);
        }

    }

    getOtherFrmAPI = (natureId) => {
        let othersCategoryId = this.props.othersCategoryId;
        let getData = [{
            userId: this.props.userId,
            isActive: true,
            othersMapNatureId: natureId,
            // othersMapNatureId:0,
            othersMapNature: ""
        }]
        konsole.log("postdata", JSON.stringify(getData))
        $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getOtherFromAPI, getData, (response) => {
            if (response) {
                let res = response.data.data;
                konsole.log("respinseresponse", response)
                let otherObj = res.filter(otherRes => { return otherRes.othersCategoryId == othersCategoryId });
                this.setState({
                    othersName: otherObj.length > 0 ? otherObj[0].othersName : this.state.othersName,
                    othersId: otherObj.length > 0 ? otherObj[0].othersId : this.state.othersId,
                });
            }
        })
    }




    handleOthers = (value, name) => {
        konsole.log("wedvbjksdbv", typeof this.props?.setNeedUpdate);
        if(typeof this.props?.setNeedUpdate == 'function') this.props?.setNeedUpdate(true);
        if(this.state.isNewOther == false) {
            let getName = value?.target?.name;
            let getValue = value?.target?.value;

            let nameValue = getValue;
            this.setState({
                [getName]: nameValue
            })

            return;
        }

        let nameValue = value;
        this.setState({
            [name]: nameValue
        })
    }

    saveHandlerOtherOnlypost = (unniqueId) => {
        let disdata = [];
        disdata = [{
            othersCategoryId: this.props?.othersCategoryId,
            othersName: this.state.othersName,
            createdBy: this.state.loggedInUser,
            isActive: true,
        }]
        return new Promise((resolve, reject) => {
            $postServiceFn.postAddOther("POST", disdata, (response, err) => {
                if (response && this.props.dropValue == "999999") {
                    let responseData = response?.data?.data;
                    konsole.log("responsepostaddother", responseData)
                    let disObjId = this.mapOtherToObj(unniqueId, responseData);
                    $postServiceFn.postMapOther("POST", [disObjId], (response, error) => {
                        if (response) {
                            konsole.log("responsepostaddothera", responseData)
                            konsole.log("done", response);
                            resolve(response)
                        } else {
                            resolve('error', error)
                        }
                    })
                } else {
                    resolve('error', err)
                }
            })
        })

    }
    saveHandleOther = (uniqueId, spouseUserId) => {
        return new Promise(async (resolve, reject) => {
            // konsole.log("uniqueIduniqueId", uniqueId, spouseUserId,"this.state.othersId",this.state.othersId)
            let disdata = [];
            if (this.state.othersId == "") {
                disdata = [{
                    othersCategoryId: this.props.othersCategoryId,
                    othersName: this.state.othersName,
                    createdBy: this.state.loggedInUser,
                    isActive: true,
                }]
                await this.apiForOther("POST", uniqueId, disdata, spouseUserId);
                resolve('resolve')
            }
            else if (this.state.othersId !== "") {
                disdata = [{
                    othersCategoryId: this.props.othersCategoryId,
                    othersName: this.state.othersName,
                    othersId: this.state.othersId,
                    updatedBy: this.state.loggedInUser,
                    isActive: true,
                }]
                await this.apiForOther("PUT", uniqueId, disdata);
                resolve('resolve')
            }
        })

    }

    apiForOther = (method, uniqueId, totArray, spouseUserId) => {
        return new Promise(async (resolve, reject) => {
            if (totArray.length > 0) {
                $postServiceFn.postAddOther(method, totArray, async (response) => {
                    let responseData = response.data.data;
                    if (method == "POST") {
                        await this.mapOtherToForm(uniqueId, responseData, spouseUserId);
                    }
                    resolve('resolve')
                })
            } else {
                resolve('resolve')
            }


        })

    }

    mapOtherToForm = (uniqueId, veteranMapToOther, spouseUserId) => {
        return new Promise(async (resolve, reject) => {
            if (this.props.dropValue == "999999") {
                let disObjId = this.mapOtherToObj(uniqueId, veteranMapToOther);
                await this.mpApi(disObjId);
                if (spouseUserId !== undefined && spouseUserId != null && spouseUserId != '') {
                    let json = this.mapOtherToObj(uniqueId, veteranMapToOther);
                    json.userId = spouseUserId
                    await this.mpApi(json);
                }
                resolve('resolve')
            }
        })

    }

    mpApi = (disObjId) => {
        return new Promise((resolve, reject) => {
            $postServiceFn.postMapOther("POST", [disObjId], (response) => {
                resolve('resolve')
                if (response) {
                    konsole.log("done", response);
                }
            })
        })
    }

    mapOtherToObj = (objId, objOther) => {
        let totArray = {
            userId: this.state.userId,
            othersCategoryId: objOther[0].othersCategoryId,
            othersId: objOther[0].othersId,
            othersMapNatureId: objId,
            othersMapNatureType: "",
            isActive: true,
            createdBy: objOther[0].createdBy,
            remarks: ""
        }

        return totArray;
    }



    render() {
        return (
            <>
                {(this.props.dropValue == "999999" || this.props.showOtherField == true)
                    &&

                    <>

                        {(this.props.addStyle == 'NEWFILECABINET2') ? <>

                            <div className="col-12  p-0">
                                <div className="col-12 mt-4 p-0">
                                    <p className="mb-2 drawerPara newdrawerPara">Others Description</p>
                                    <div className='rateCardDivOutlines'>
                                        <div className="rateCardNameInputMainDivFile" >
                                            <input type="text"
                                                className='border-0 inputTextnewdrawerPara text-black other-input'
                                                placeholder="Other Description"
                                                name='othersName'
                                                value={this.state.othersName}
                                                onChange={(event) => this.handleOthers(event)}
                                                tabIndex={this?.props?.tabIndex}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            {this.state.isNewOther == true ? <CustomInput
                                tabIndex={this?.props?.tabIndex}
                                othersCategoryId={this.props.othersCategoryId}
                                isChildOther = {this.props?.isChildOther}
                                refrencePage = {this.props?.refrencePage}
                                isPersonalMedical={true}
                                // style={{textTransform:"capitalize"}}
                                label={this?.props?.noLabel == true ? null : "Other"}
                                name="othersName"
                                placeholder= {this.props?.isMonthlylyExpenses ? "Enter Expense Type" : "Other Description"}
                                id={this.props.id ?? 'other'}
                                value={this.state.othersName}
                                notCapital={true}
                                onChange={(event) => { this.props?.hanldeApiCall?.(), this.handleOthers(event, "othersName") }}
                                isError={this.props?.isError ? this.props?.isError : ''}
                            />
                                :
                            <Form.Control type='text' className={`w-100 ${(this.props.addStyle=="addStyle")?"otherDescritionBorderForAddFile":""}`} name="othersName" onChange={(event)=> this.handleOthers(event)} value={this.state.othersName} placeholder=" Other Description" />}
                        </>
                        }



                    </>
                }


            </>)
    }


}

export default Other;