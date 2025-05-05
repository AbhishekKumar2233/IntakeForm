import React, { Component } from 'react'
import { Button, Modal, Table, Form, Tab, Row, Col, Container, Nav, Dropdown, Collapse, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import { SET_LOADER } from '../components/Store/Actions/action'
import { $Service_Url } from "../components/network/UrlPath";
import { $CommonServiceFn, $postServiceFn } from '../components/network/Service';
import { Msg } from './control/Msg';
import konsole from './control/Konsole';
import Other from './asssets/Other';
import OtherInfo from './asssets/OtherInfo';
import { $AHelper } from '../components/control/AHelper';
import CurrencyInput from 'react-currency-input-field';
import PdfViewer2 from './PdfViwer/PdfViewer2';
import { globalContext } from "../pages/_app";
import AlertToaster from "./control/AlertToaster";
import { fileLargeMsg } from "./control/Constant";
import TableEditAndViewForDecease from './Deceased/TableEditAndViewForDecease';
import ExpensesPaidQuestion from './ExpensesPaidQues';
import { fileNameShowInClickHere, removeDuplicate } from './Reusable/ReusableCom';

export class RetirementAssets extends Component {
    static contextType = globalContext
    constructor(props, context) {
        super(props, context);
        this.state = {
            fileCategoryId: 5,
            fileTypeId: 11,
            fileObj: null,
            logginUserId: sessionStorage.getItem("loggedUserId"),
            userId: "",
            assetDocuments: [],
            show: false,
            PreConditionTypes: [],
            agingAssetBeneficiaryId: null,
            UserAgingAssests: [],
            OwnerTypes: [],
            beneficiaryList: [],
            beneficiary: "",
            agingAssetCatId: "2",
            agingAssetTypeId: "",
            ownerTypeId: "",
            nameOfInstitution: "",
            balance: "",
            disable: false,
            natureId: "",
            viewshowfile: false,
            viewFileId: '',
            fileuserInsDocId: '',
            fileuserInsId: '',
            viewshowfile: false,
            viewFileId: '',
            selectfileName: 'Click to Browse your file',
            fileuserInsDocId: '',
            fileuserInsId: '',
            updateOwnerData: [],
            spouseUserId: '',
            primarymemberDetails: {},
            relationRelationcheckBeneficiary: false,
            quesReponse:null
        };
        this.RetirementAssestsRef = React.createRef();
        this.ownerRef = React.createRef();
    }
    componentDidMount() {
        let newuserid = sessionStorage.getItem("SessPrimaryUserId") || "";
        let spouseUserId = sessionStorage.getItem("spouseUserId") || "";
        let primarymemberDetails = JSON.parse(
            sessionStorage?.getItem("userDetailOfPrimary")
        );
        this.setState({
            userId: newuserid,
            spouseUserId: spouseUserId,
            primarymemberDetails: primarymemberDetails
        })
        this.fetpreconditontypes();
        this.fetuseragingassets(newuserid);
        this.fetchownertypes(newuserid);
        this.fetchBeneficiaryList(newuserid)
        if (spouseUserId !== '' && spouseUserId !== null && spouseUserId !== undefined) {
            this.fetchmemberRelationshipDetails(spouseUserId)
        }
    }

    fetchmemberRelationshipDetails = async (spouseUserID) => {
        let url = `${$Service_Url.postMemberRelationship}/${spouseUserID}?primaryUserId=${spouseUserID}`;
        let method = "GET";
        let results = await $postServiceFn.memberRelationshipAddPut(method, url);
        this.setState({ relationRelationcheckBeneficiary: results.data?.data?.isBeneficiary })
        konsole.log('resultsresults', results);
    }
    fetchownertypes = (userId) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFileBelongsToPath + `?ClientUserId=${userId}`, "", (response, err) => {
            this.props.dispatchloader(false);
            if (response) {
                const responseMap = response.data.data.map(item => {
                    return { value: item.fileBelongsTo, label: (item.fileBelongsTo == "JOINT") ? "JOINT" : $AHelper.capitalizeAllLetters(item.belongsToMemberName)}
                })
                this.setState({
                    ...this.state,
                    OwnerTypes: responseMap,
                });
            } else err;
        }
        );
    }

    fetpreconditontypes = () => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getPreconditionType + "2",
            "", (response) => {
                if (response) {
                    this.props.dispatchloader(false);
                    this.setState({
                        ...this.state,
                        PreConditionTypes: response.data.data,
                    });
                }
            })
    }

    fetuseragingassets = (newuserid) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getUserAgingAsset + newuserid,
            "", (response) => {
                if (response) {
                    this.props.dispatchloader(false);
                    this.setState({
                        ...this.state,
                        UserAgingAssests: response.data.data.filter((v, j) => v.agingAssetCatId == "2"),
                    });
                }
            })
    }

    handleInputChange = (event) => {
        event.preventDefault();
        const eventId = event.target.id;
        const eventValue = event.target.value;
        konsole.log("eventUd", eventId, eventValue);
        if (eventId == "nameOfInstitution") {
            let nameValue = $AHelper.capitalizeFirstLetter(eventValue);
            if ($AHelper.isRegexForAll(nameValue)) {
                this.setState({
                    ...this.state,
                    [eventId]: nameValue,
                });
            }
            else {
                this.setState({
                    ...this.state,
                    [eventId]: "",
                })
            }
        }
        else if (eventId == "noOfChildren") {
            if ($AHelper.isNumberRegex(eventValue)) {
                this.setState({
                    ...this.state,
                    [eventId]: eventValue,
                });
            } else {
                this.toasterAlert("please enter valid number", "Warning")
                this.setState({
                    noOfChildren: 0,
                })
            }
        }
        else {
            this.setState({
                [eventId]: eventValue
            })
        }
    }


    validate = () => {
        let nameError = ""
        if (this.state.agingAssetTypeId == 0) {
            nameError = "Retirement Assets cannot be Blank"
        } else if (this.state.ownerTypeId == "") {
            nameError = "Owner cannot be blank"
        }
        //  else if (this.state.nameOfInstitution == "") {
        //     nameError = "Name of Institution cannot be Blank"
        // }
        //  else if (this.state.balance == "") {
        //     nameError = "Balance cannot be Blank"
        // }
        if (nameError) {
            this.setState({ disable: false })
            this.toasterAlert(nameError, "Warning")
            return false;
        }
        return true;
    }


    fetchBeneficiaryList = (newuserid) => {
        this.props.dispatchloader(true);
        $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getBeneficiaryByUserId + newuserid,
            "", (response) => {
                this.props.dispatchloader(false);
                if (response) {
                    // konsole.log("beneficiaryList", response);
                    this.setState({
                        ...this.state,
                        beneficiaryList: response.data.data,
                    });
                }
            })
    }
    
    updateRetirement = async (asset) => {
        konsole.log("assets", asset);
        konsole.log("assetasset", asset)
        let fileId = asset?.assetDocuments[0]?.fileId
        let selectfileName = asset?.assetDocuments[0]?.documentName
        let selectfileuserInsDocId = asset?.assetDocuments[0]?.userAgingAssetDocId
        konsole.log("asset?.assetDocuments[0]?.userInsDocId", asset?.assetDocuments[0]?.userInsDocId, asset?.assetDocuments[0]?.userInsId)
        this.setState({
            updateOwnerData: asset.assetOwners,
            agingAssetTypeId: asset.agingAssetTypeId,
            ownerTypeId: (asset.assetOwners.length == 2) ? "Joint" : (asset.assetOwners.length == 1) ? asset.assetOwners[0].ownerUserId : "-",
            nameOfInstitution: asset.nameOfInstitution,
            balance: asset.balance,
            natureId: asset.userAgingAssetId,
            beneficiary: asset.assetBeneficiarys[0]?.beneficiaryUserId,
            agingAssetBeneficiaryId: asset.assetBeneficiarys[0]?.agingAssetBeneficiaryId,
            assetOwners: asset.assetOwners,
            viewshowfile: (fileId !== undefined) ? true : false,
            viewFileId: fileId,
            selectfileName: (selectfileName !== null && selectfileName !== '' && selectfileName !== undefined) ? asset.agingAssetTypeId == '999999' ? 'Retirement Financial Assets' : asset.assetTypeName + '.pdf' : "Click to Browse your file",
            fileuserInsDocId: selectfileuserInsDocId,
            quesReponse:asset?.quesReponse
        })
    }



    selectFileUpload = () => {
        document.getElementById("fileUploadLifeId").click();
    }
    handleFileSelection = (e) => {
        if (e.target.files.length == 0) {
            this.setState({ fileObj: null })
            return
        }
        let typeOfFile = e.target.files[0].type;
        let fileofsize = e.target.files[0].size;
        if (typeOfFile !== "application/pdf") {
            this.toasterAlert("only pdf format allowed", "Warning")
            return;
        }
        if ($AHelper.fileuploadsizetest(fileofsize)) {
            this.toasterAlert(fileLargeMsg, "Warning");
            this.setState({ fileObj: null, selectfileName: "Click to Browse your file", });
            return;
        }
        this.setState({
            fileObj: e.target.files[0],
        })
    }





    handleFileUpload = (type) => {
        this.setState({ disable: true })
        if (this.state.fileObj !== null && this.state.fileObj !== undefined) {
            this.props.dispatchloader(true);
            $postServiceFn.postFileUpload(this.state.fileObj, this.state.userId, this.state.logginUserId, this.state.fileTypeId, this.state.fileCategoryId, 2, (response, errorData) => {
                this.props.dispatchloader(false);
                if (response) {
                    konsole.log("resposne", response);
                    let responseFileId = response.data.data.fileId;
                    let responsedocName = response.data.data.fileName;
                    let responsedocPath = response.data.data.fileURL;
                    this.handleAgingassetsubmit(type, responseFileId, responsedocName, responsedocPath);
                } else if (errorData) {
                    this.toasterAlert(errorData, "Warning")
                }
            })
        }
        else {
            this.handleAgingassetsubmit(type, null)
        }
    }



    handleAgingassetsubmit = (type, fileId, documentName, documentPath) => {
        konsole.log("fileId", fileId)
        konsole.log("documentPath", documentPath)
        konsole.log("documentName", documentName)
        let inputdata = JSON.parse(JSON.stringify(this.state));

        let assetBeneficiarysList = []
        if (this.state.beneficiary !== "" && this.state.beneficiary !== undefined) {
            assetBeneficiarysList = [{ beneficiaryUserId: this.state.beneficiary }]
        }
        let assetDocuments = [];
        if (fileId !== null) {
            assetDocuments = [{ documentName: documentName, documentPath: documentPath, "fileId": fileId }];
        }
        else {
            assetDocuments = [];
        }

        if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" && inputdata?.fileuserInsDocId !== undefined) {
            if (assetDocuments.length > 0) {
                assetDocuments[0]['userAgingAssetDocId'] = inputdata?.fileuserInsDocId
            }
        }

        let assetOwners = [];

        // ------------------------------------------Owner------------------------- Type------------------------- Update---------------------------------------

        if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") {
            const assetOwn = this.state.OwnerTypes.filter((item) => item.value !== "JOINT");
            let assetOwnersdata = assetOwn.map((item) => {
                return { ownerUserId: item.value, OwnerUserName: "OwnerUserName", isActive: true }
            });
            let updatupdateOwnerData = this.state.updateOwnerData
            if (this.state.ownerTypeId == 'JOINT') {
                for (let i = 0; i < updatupdateOwnerData.length; i++) {
                    for (let [index, item] of assetOwnersdata.entries()) {
                        if (updatupdateOwnerData[i].ownerUserId.toLowerCase() == assetOwnersdata[index].ownerUserId.toLowerCase()) {
                            assetOwnersdata[index]['agingAssetOwnerId'] = updatupdateOwnerData[i].agingAssetOwnerId
                            assetOwnersdata[index].OwnerUserName = updatupdateOwnerData[i].ownerUserName
                        }
                    }
                }
                assetOwners = assetOwnersdata
            } else {
                if (updatupdateOwnerData.length == 1 && updatupdateOwnerData[0].ownerUserId.toLowerCase() == this.state.ownerTypeId.toLowerCase()) {
                    assetOwnersdata = updatupdateOwnerData
                } else {
                    for (let [index, item] of assetOwnersdata.entries()) {
                        if (item.ownerUserId.toLowerCase() == this.state.ownerTypeId.toLowerCase()) {
                            assetOwnersdata[index].isActive = true
                            if (updatupdateOwnerData.length !== 1) {
                                assetOwnersdata[index]['agingAssetOwnerId'] = updatupdateOwnerData[1].agingAssetOwnerId
                            }
                        } else {
                            assetOwnersdata[index].isActive = false
                            assetOwnersdata[index]['agingAssetOwnerId'] = updatupdateOwnerData[0].agingAssetOwnerId
                        }
                    }
                }

                assetOwners = assetOwnersdata
            }


            // ------------------------------------------Owner------------------------- Type------------------------- ADD---------------------------------------

        } else {
            if (this.state.ownerTypeId !== "JOINT") {
                assetOwners = [{ ownerUserId: this.state.ownerTypeId, ownerUserName: "ownerUserName" }]
            } else {
                const assetOwn = this.state.OwnerTypes.filter((item) => item.value !== "JOINT");

                assetOwners = assetOwn.map((item) => {
                    return { ownerUserId: item.value, OwnerUserName: "OwnerUserName" }
                });
            }
        }


        if (this.validate()) {

            let asset = {
                agingAssetCatId: inputdata.agingAssetCatId,
                agingAssetTypeId: inputdata.agingAssetTypeId,
                ownerTypeId: 1,
                nameOfInstitution: $AHelper.capitalizeAllLetters(inputdata.nameOfInstitution),
                balance: inputdata.balance,
                createdBy: this.state.logginUserId,
                assetDocuments: assetDocuments,
                assetOwners: assetOwners,
                assetBeneficiarys: assetBeneficiarysList,
                isRealPropertys: [],
                quesReponse:this.state?.quesReponse
            }
            let method = "POST";
            let url = url = $Service_Url.postUseragingAsset;
            if (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") {
                asset["userAgingAssetId"] = this.state.natureId
                asset["updatedBy"] = this.state.logginUserId
                // if (asset["assetOwners"].length > 0) {
                //     asset["assetOwners"][0].agingAssetOwnerId = this.state.assetOwners[0].agingAssetOwnerId
                //     asset["assetOwners"][0].ownerUserName = this.state.assetOwners[0].ownerUserName
                // }
                if (assetBeneficiarysList.length == 0) {
                    delete asset["assetBeneficiarys"];
                }
                else {

                    const beneficiary = this.state.beneficiaryList.filter((res) => { return res.value == this.state.beneficiary })

                    let beneficiaryUserName = beneficiary.length == 0 ? this.state.primarymemberDetails?.memberName : beneficiary[0].label
                    if (this.state.agingAssetBeneficiaryId !== null && this.state.agingAssetBeneficiaryId !== undefined) {
                        asset["assetBeneficiarys"] = [{
                            beneficiaryUserId: this.state.beneficiary,
                            beneficiaryUserName: beneficiaryUserName,
                            agingAssetBeneficiaryId: this.state.agingAssetBeneficiaryId
                        }]
                    }
                    else {
                        asset["assetBeneficiarys"] = [{
                            beneficiaryUserId: this.state.beneficiary,
                            beneficiaryUserName: beneficiaryUserName,
                        }]
                    }
                    konsole.log("beneficairar", beneficiary);
                }
                method = "PUT";
                url = $Service_Url.putUpdateUserAgingAsset;
            }

            let totalinuptdata = {
                userId: this.state.userId,
                asset: asset
            }
            asset["isActive"] = true

            konsole.log(JSON.stringify(inputdata));
            konsole.log("cdddddd", totalinuptdata)
            konsole.log("jsonobj", totalinuptdata)
            this.props.dispatchloader(true);
            $CommonServiceFn.InvokeCommonApi(method, url, totalinuptdata, (response, error) => {
                if (response) {
                    this.setState({ selectfileName: 'Click to Browse your file' })

                    this.props.dispatchloader(false);
                    if(method == 'POST'){
                        AlertToaster.success("Data saved successfully");
                    }else{
                        AlertToaster.success("Data updated successfully");
                    }
                    // alert("Saved Successfully1");
                    konsole.log("responseresponse", response)
                    konsole.log("Success res" + JSON.stringify(response));
                    let assetResponse = response.data.data;
                    if (this.state.ownerTypeId == "999999") {
                        this.ownerRef.current.saveHandleOther(assetResponse.userAgingAssetId)
                    }
                    if (this.state.agingAssetTypeId == "999999") {
                        this.RetirementAssestsRef.current.saveHandleOther(assetResponse.userAgingAssetId);
                    }
                    if (type == "Add") {
                        this.props.handleretireproppopShow();
                    } else {
                        this.clearState();
                    }
                    // this.props.handleretireproppopShow();
                } else {
                    konsole.log("errorerror", error);
                    this.setState({ disable: false })

                }
                this.fetuseragingassets(this.state.userId)
                this.props.dispatchloader(false);
            })
        }
    }

    clearState = () => {
        this.setState({
            agingAssetTypeId: "",
            ownerTypeId: "",
            nameOfInstitution: "",
            balance: "",
            natureId: "",
            beneficiary: "",
            assetOwners: [],
            agingAssetBeneficiaryId: "",
            viewshowfile: false,
            viewFileId: "",
            selectfileName: "Click to Browse your file",
            fileuserInsDocId: "",
            fileObj: null,
            relationRelationcheckBeneficiary: false,
            updateOwnerData: [],
            disable: false,
            quesReponse:null
        });
    };
    toasterAlert(text, type) {
        this.context.setdata({
            open: true,
            text: text,
            type: type
        })
    }

    deleteUserData = async(assets) => {
        const req = await this.context.confirm(true, "Are you sure? you want to delete", "Confirmation");
        if (req == false) return;
        this.props.dispatchloader(true);

        konsole.log("assetsassets", assets);
        let jsonobj = {
            userId: assets.createdBy,
            asset: {
                agingAssetCatId: assets.agingAssetCatId,
                agingAssetTypeId: assets.agingAssetTypeId,
                ownerTypeId: assets.ownerTypeId,
                maturityYear: assets.maturityYear,
                userAgingAssetId: assets.userAgingAssetId,
                updatedBy: this.state.logginUserId,
                nameOfInstitution: assets?.nameOfInstitution,
                isActive: false,
                assetDocuments: [],
                assetOwners: assets.assetOwners,
                assetBeneficiarys: [],
                isRealPropertys: [],
            },
        };

        $CommonServiceFn.InvokeCommonApi(
            "PUT",
            $Service_Url.putUpdateUserAgingAsset,
            jsonobj,
            (res, err) => {
                this.props.dispatchloader(false);
                if (res) {
                    konsole.log("resresDelete", res);
                    AlertToaster.success("Data Deleted Successfully");
                    // this.props.handlenonretireproppopShow();
                    this.clearState();
                    this.fetuseragingassets(this.state.userId);
                } else {
                    konsole.log("errerre", err);
                    this.setState({ disable: false })
                }
            }
        );
    }

    getQuestionResponse=(value)=>{
        // konsole.log("vadsdsddlue",value)
        if(value){
          const jsonString = JSON.stringify(value);
          this.setState({quesReponse:jsonString})
        }
      }


    render() {
        let primaryLogId = this.state.userId
        let spouseLogId = this.state.spouseUserId
        let beneficiaryList = this.state.beneficiaryList;
        if (this.state.ownerTypeId.toLocaleUpperCase() == spouseLogId.toLocaleUpperCase()) {
            let obj = { value: this.state.userId, label: this.state.primarymemberDetails?.memberName }
            beneficiaryList = beneficiaryList.filter(item => item.value !== spouseLogId)
            beneficiaryList.push(obj)
        } else if (this.state.ownerTypeId == "JOINT") {
            let obj = { value: this.state.userId, label: this.state.primarymemberDetails?.memberName }
            beneficiaryList = beneficiaryList.filter(item => item.value !== primaryLogId)
            beneficiaryList.push(obj);
        }
        // else if (this.state.ownerTypeId == 'JOINT') {
        //     beneficiaryList = beneficiaryList.filter(item => item.value !== primaryLogId && item.value !== spouseLogId)
        // }

        let agingAssetType = (this.state.agingAssetTypeId !== "") ? this.state.PreConditionTypes.filter(item => item.value == this.state.agingAssetTypeId) : "";
        let beneficiary = (this.state.beneficiary !== "") ? beneficiaryList.filter(v => v.value == this.state.beneficiary) : "";
        let ownerTypeId = (this.state.ownerTypeId !== "") ? this.state.OwnerTypes.filter((item) => item.value.toLowerCase() === this.state.ownerTypeId.toLowerCase()) : "";
        let beneficiaryList2 = (this.state.relationRelationcheckBeneficiary == true) ? beneficiaryList : beneficiaryList.filter(item => item.value !== primaryLogId)
        return (
            <>
                {/* <style jsx global>{`
                    .modal-open .modal-backdrop.show{opacity:0;}
                    
                `}</style> */}

                <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            max-width: 52.25rem;
            margin: 1.75rem auto;
          }
        `}</style>


                <Modal show={this.props.show} size="lg"enforceFocus={false} centered onHide={this.props.handleretireproppopShow} backdrop="static" animation="false">
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>Retirement Financial Assets</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-2">
                        <div className='person-content'>
                            <Form.Group as={Row} className="">
                                <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                    <Select className="w-100 p-0 custom-select" onChange={(event) => this.setState({ agingAssetTypeId: event.value })} options={this.state.PreConditionTypes} value={agingAssetType} placeholder={$AHelper.mandatory("Description of Property")} maxMenuHeight={150} isSearchable />
                                </Col>
                                <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                    <Form.Control className='upperCasing' type="text" id="nameOfInstitution" value={this.state.nameOfInstitution.trimStart()} onChange={(event) => this.handleInputChange(event)} name="nameOfInstitution" placeholder="Name of Institution" onInput={this.getValue} />

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} >
                                {
                                    this.state.agingAssetTypeId == "999999" &&
                                    <Col xs="12" sm="12" md="6" lg="6" className="mb-2">
                                        <Other othersCategoryId={3} userId={this.state.userId} dropValue={this.state.agingAssetTypeId} ref={this.RetirementAssestsRef} natureId={this.state.natureId} />
                                    </Col>
                                }
                            </Form.Group>
                            <Form.Group as={Row} className="">
                                <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                    <CurrencyInput prefix='$' type="text" allowNegativeValue={false} className='border' value={this.state.balance} onValueChange={(balance) => this.setState({ balance: balance })} name="balance" placeholder='Balance' decimalScale="2" />
                                </Col>
                                <Col xs sm="6" lg="6" md="6" className='mb-2'>
                                    <Select className="w-100 p-0 custom-select" onChange={(event) => this.setState({ ownerTypeId: event.value })} placeholder={$AHelper.mandatory("Owner")} value={ownerTypeId} options={this.state.OwnerTypes} isSearchable />
                                </Col>
                            </Form.Group>
                            {
                                this.state.ownerTypeId == "999999" &&
                                <Form.Group as={Row} className="mb-2">
                                    <Col xs sm={{ span: 6, offset: 6 }} lg={{ span: 5, offset: 5 }}>
                                        <Other othersCategoryId={21} userId={this.state.userId} dropValue={this.state.ownerTypeId} ref={this.ownerRef} natureId={this.state.natureId} />

                                    </Col>
                                </Form.Group>
                            }
                            <Form.Group as={Row} className="">
                                <Col xs="12" sm="12" md="6" lg="6" className='mb-2'>
                                    <Select className=" custom-select" options={beneficiaryList2.map(ele => ({...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label): ''}))} isSearchable placeholder="Beneficiary"
                                     value = {(beneficiary?.length > 0 ? beneficiary?.map(ele => ({...ele, label: ele.label ? $AHelper.capitalizeAllLetters(ele.label) : ''})) : [])} onChange={(event) => this.setState({ beneficiary: event.value })} maxMenuHeight={80} />

                                </Col>



                                <Col xs="12" sm="12" md="6" lg="6">
                                    <div className='d-flex justify-content-between align-items-center p-0 ' >
                                        <div className='ps-2 d-flex align-items-center justify-content-between fileInoutHealth'>
                                           {fileNameShowInClickHere(this.state.fileObj ,this.state.selectfileName)}
                                            <span className='bg-secondary text-white cursor-pointer uploadButtonHeath' onClick={this.selectFileUpload}>
                                                Upload
                                            </span>
                                        </div>

                                        <div style={{ height: "100%", borderRadius: "0px 3px 3px 0px" }}>
                                            <input className="d-none" type="file" accept='application/pdf' id="fileUploadLifeId" onChange={this.handleFileSelection} />
                                            {(this.state.viewshowfile) &&
                                                <PdfViewer2 viewFileId={this.state.viewFileId} />
                                            }
                                        </div>
                                    </div>

                                </Col>

                                <Col>
                                        <ExpensesPaidQuestion getQuestionResponse={this?.getQuestionResponse}  quesReponse={this.state?.quesReponse}/>
                                </Col>

                            </Form.Group>
                        </div>

                        <div className='mt-3'>
                            <div>
                                <Button
                                    style={{ backgroundColor: "#76272b", border: "none" }}
                                    className="theme-btn float-end mb-2"
                                    //  onClick={this.handleAgingassetsubmit}
                                    onClick={() => this.handleFileUpload("Add")}
                                    disabled={this.state.disable == true ? true : false}
                                >
                                    {
                                        (this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "") ?
                                            "Update" : "Save"
                                    }
                                </Button>
                            </div>
                            <div className="">
                                {this.state.natureId !== undefined && this.state.natureId !== null && this.state.natureId !== "" ? ("") : (
                                    <Button className="theme-btn float-end anotherBTn" onClick={() => this.handleFileUpload("AddMore")} style={{ marginRight: "10px", backgroundColor: "#76272b", border: "none" }} disabled={this.state.disable == true ? true : false}>  Add Another </Button>
                                )}
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 table-responsive retirementTab" style={{ display: "block", maxHeight: "34vh", overflowY: "auto" }}>
                        <div className="table-responsive financialInformationTable">
                            {this.state.UserAgingAssests.length !== 0 &&
                                <Table bordered >
                                    <thead className="text-center align-middle">
                                        <tr>
                                            <th>Description of Retirement Assets</th>
                                            <th>Name of Institution</th>
                                            <th>Balance</th>
                                            <th>Owner</th>
                                            <th>Beneficiary</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.UserAgingAssests && this.state.UserAgingAssests.map((asset, i) => {
                                            const assetOwners=removeDuplicate(asset.assetOwners,'ownerUserId')
                                            return (
                                                <tr key={i}>
                                                    <td style={{ wordBreak: "break-word" }}>
                                                        {/* {asset.assetTypeName || "-"} */}
                                                        <OtherInfo othersCategoryId={3} othersMapNatureId={asset.userAgingAssetId} FieldName={asset.assetTypeName} userId={this.state.userId} />
                                                    </td>
                                                    <td className='text-center'>{$AHelper.capitalizeAllLetters(asset.nameOfInstitution || "-")}</td>
                                                    <td style={{ wordBreak: "break-word", textAlign:"center" }}>{asset?.balance !== null ? $AHelper.IncludeDollars(asset?.balance) : "-"}</td>
                                                    <td className='text-center'>{$AHelper.capitalizeAllLetters((assetOwners.length == 2) ? "Joint" : (assetOwners.length == 1) ? assetOwners[0].ownerUserName : "-")}</td>
                                                    <td className='text-center'>{$AHelper.capitalizeAllLetters((asset.assetBeneficiarys.length > 0) ? asset.assetBeneficiarys[0].beneficiaryUserName : "-")}</td>
                                                    <td style={{verticalAlign:"middle"}}>

                                                        <TableEditAndViewForDecease
                                                            key={i}
                                                            forUpdateValue={asset}
                                                            type='primary'
                                                            refrencePage='RetirementAssets'
                                                            actionType='Beneficiary'
                                                            handleUpdateFun={this.updateRetirement}
                                                            handleDeleteFun={this.deleteUserData}

                                                            isOwner={(assetOwners?.length == 2 || assetOwners?.length?.length == 0) ? false : true}
                                                            ownerUserId={assetOwners.length > 0 ? assetOwners[0].ownerUserId : ""}
                                                            userId={this.state.userId}
                                                            memberUserId={asset?.assetBeneficiarys.length > 0 ? asset?.assetBeneficiarys[0].beneficiaryUserId : ''}

                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </Table>
                            }
                        </div>
                    </Modal.Footer>
                </Modal>

            </>
        )
    }
}


const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RetirementAssets);