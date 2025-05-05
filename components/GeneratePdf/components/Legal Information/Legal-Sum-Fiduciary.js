import React, { Component } from "react";
import Router from "next/router";
import { Form,Table, Container } from "react-bootstrap";
import konsole from "../../../control/Konsole";
import { $CommonServiceFn } from "../../../network/Service";
import { $Service_Url } from "../../../network/UrlPath";
import { connect } from "react-redux";
import { SET_LOADER } from "../../../Store/Actions/action";
import { $postServiceFn } from "../../../network/Service";
import AlertToaster from "../../../control/AlertToaster";
import { $AHelper } from "../../../control/AHelper";

class FiduciarySum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryuserID: "",
      spouseUserID: "",
      primaryusername: "",
      spouseUsername: "",
      Fiduciarylist: [],
      Beneficiarylist: [],
      showType: "Fiduciary",
      listofuserid: "primary",
      spouseUserID: null,
      editfiduciarybeneficiary: false,
      edituserid: "",
      showEditpopup: false,
      totalArray: [],
    };
  }

  componentDidMount() {
    let primaryuserId = sessionStorage.getItem("SessPrimaryUserId");
    let spouseuserId = sessionStorage.getItem("spouseUserId");
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem("userDetailOfPrimary"));
    konsole.log(userDetailOfPrimary, "userDetailOfPrimary");
    this.setState({
      primaryuserID: primaryuserId,
      spouseUserID: spouseuserId,
      primaryusername: userDetailOfPrimary.memberName,
      spouseUsername: userDetailOfPrimary.spouseName,
    });

    this.FiduciaryList(primaryuserId);
    this.BeneficiaryByUserIdList(primaryuserId);
    this.SortList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.listofuserid != this.state.listofuserid || this.state.showEditpopup != this.state.editfiduciarybeneficiary) {
      let primaryuserID = sessionStorage.getItem("SessPrimaryUserId");
      this.FiduciaryList(primaryuserID);
      this.BeneficiaryByUserIdList(primaryuserID);

      this.setState({
        editfiduciarybeneficiary: false,
        showEditpopup: false,
      });
      this.SortList();
    }
  }

  callbackApiFunc = () => {
    let primaryuserID = sessionStorage.getItem("SessPrimaryUserId");
    let spouseUserID = sessionStorage.getItem("spouseUserId");
    konsole.log(this.state.listofuserid, "listofuserid");

    this.FiduciaryList(primaryuserID);
    this.BeneficiaryByUserIdList(primaryuserID);
    this.SortList();
  };

  FiduciaryList = (primaryuserID) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getFiduciaryDetailsByUserId + primaryuserID, "", (response) => {
      if (response) {
        let  responseData=$AHelper.deceasedNIncapacititedFilterFun(response?.data?.data?.fiduciaries)
        konsole.log("response of fiduciary list",responseData,response);
        this.setState({
          Fiduciarylist:responseData,
        });
        this.props.dispatchloader(false);
        this.SortList();
      }
    }
    );
  };

  BeneficiaryByUserIdList = (primaryuserID) => {
    this.props.dispatchloader(true);
    $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getBeneficiaryDetailsByUserId + primaryuserID, "", (response) => {
      if (response) {
        konsole.log(response, "response of getting beneficiary list");
        let  responseData=$AHelper.deceasedNIncapacititedFilterFun(response?.data?.data?.beneficiaries)
        this.setState({
          Beneficiarylist:responseData,
        });
        this.props.dispatchloader(false);
        this.SortList();
      }
    }
    );
  };

  SortList = async() => {
    const newArrayfid = this.state.Fiduciarylist.reduce((acc, curr) => {
      const { fiduciaryFullName, fiduciaryUserId, ...rest } = curr;
      acc.push({ memberName: fiduciaryFullName, userId: fiduciaryUserId, ...rest,});
      return acc;
    }, []);

    const newArrayben = this.state.Beneficiarylist.reduce((acc, curr) => {
      const { beneficiaryFullName, userRoleName, beneficiaryUserId, ...rest } = curr;
      acc.push({ memberName: beneficiaryFullName, userRolesName: userRoleName, userId: beneficiaryUserId, ...rest,});
      return acc;
    }, []);

    let finallist = [...newArrayfid, ...newArrayben];
    let shortfinallist = finallist.sort((a, b) => {return a.memberName.localeCompare(b.memberName);});

    function removeDuplicates(arr, prop) {
      return arr.filter((obj, pos, arr) => {
        return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
    let finaldata = removeDuplicates(shortfinallist, "userId");
    const foundIndex = finaldata.findIndex((item) => item.userId === this.state.primaryuserID);
    konsole.log("finaldata:", foundIndex, finaldata);
    if (foundIndex !== -1) {
      const primaryUser = finaldata.splice(foundIndex, 1)[0];
      finaldata.unshift(primaryUser);
    }
    if (this.state.spouseUserID && this.state.spouseUserID !== '') {
      let url = `${$Service_Url.postMemberRelationship}/${this.state.spouseUserID}?primaryUserId=${this.state.spouseUserID}`;
      let method = "GET";
      let results = await $postServiceFn.memberRelationshipAddPut(method, url);
      if (results) {
        let isBeneficiary= results?.data?.data?.isBeneficiary
        let isFiduciary= results?.data?.data?.isFiduciary
        konsole.log('isFiduciary:', isFiduciary, 'isBeneficiary:', isBeneficiary);
        if (isFiduciary === false && isBeneficiary === false) {
          finaldata = finaldata.filter((item) => item.userId !== this.state.primaryuserID);
        } else {
          finaldata[foundIndex]["userRolesName"] = (isBeneficiary === false && isFiduciary === true)? 'Fiduciary': (isBeneficiary === true && isFiduciary === false)? 'Beneficiary': 'Beneficiary and Fiduciary';
        }
      }
    }
    
    
    this.setState({
      totalArray: finaldata,
    });
  };


  filterFiduciaryList = (totalArray) => {
    let arr = [];
    arr = totalArray.filter(({ userId }) => userId !== this.state.primaryuserID)
    return arr
  }
  filterFiduciaryList2 = (totalArray) => {
    let arr = [];
    arr = totalArray.filter(({ userId }) => userId !== this.state.spouseUserID).map(d => (d.userId === this.state.primaryuserID) ? { ...d, rltnTypeWithSpouse: "Spouse" } : d);
    return arr
  }

  saveFidData()
  {
    AlertToaster.success("Data saved successfully");
    Router.push("./LegalInfo"); 
  }


  render() {
    // konsole.log("this.state.editfiduciarybeneficiary",this.state.editfiduciarybeneficiary)
    return (
      <div>
  
           {/* Primary Details */}

          { this.state?.primaryuserID && (this.state?.primaryuserID != "null") && <Container fluid className="info-details p-0 ">
          <div className="pt-2 px-3 f-details w-100" style={{ backgroundColor: "#ffffff" }}> 
              <div className="d-flex gap-2 pb-2 mt-3"> <img className="mt-0 mb-1" style={{width:"13px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(this.state.primaryusername)}</h5></div>

            <div className="mt-2 mb-3 FiduciaryBeneficiaryscroll h-100 financialInformationTableNew">
            {this.filterFiduciaryList(this.state.totalArray).length > 0 ? (
              <Table bordered className="h-60 vertical-scroll" style={{ backgroundColor: "#ffffff"}} >
                <thead style={{ position: "sticky" }}>
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterFiduciaryList(this.state.totalArray).map((item) => (
                    <tr>
                      <td className="text-center">{$AHelper.capitalizeAllLetters(item.memberName)}</td>
                      <td className="d-flex justify-content-around"> 
                      <div>Beneficiary</div>
                      <div>
                      <Form.Check className="form-check-smoke" type="checkbox" value={item?.userRolesName?.split(" ")[0] == 'Beneficiary'} checked={item.isBeneficiary == true ? true : false} disabled={item.isBeneficiary == true ? false : true}></Form.Check>
                      </div>
                      <div>Fiduciary</div>
                      <div>
                      <Form.Check className="form-check-smoke" type="checkbox" value={item?.userRolesName?.split(" ")[2] == 'Fiduciary'} checked={item.isFiduciary == true ? true : false} disabled={item.isFiduciary == true ? false : true}></Form.Check>
                      </div>  
                      </td>  
                      <td className="text-center">{item.memberRelationshipName}</td>
    
                    </tr>
                  ))}
                 
                </tbody>
              </Table>  
            ) :<p> (Not Provided)</p>}         
            </div>   
          </div>

          </Container>}
          
          {/* Spouse Details */}

        { this.state?.spouseUserID && (this.state?.spouseUserID != "null") &&  <Container fluid className="info-details p-0">
          <div className="pt-2 px-3 f-details w-100" style={{ backgroundColor: "#ffffff" }}>
              <div className="d-flex gap-2 pb-2 mt-3"> <img className="mt-0 mb-1" style={{width:"13px"}} src="/images/healthSumImg1.svg"/>
              <h5 className="healthPrimary">{$AHelper.capitalizeAllLetters(this.state.spouseUsername)}</h5></div> 
            <div className="mt-2 mb-3 FiduciaryBeneficiaryscroll h-100 financialInformationTableNew">
            {this.filterFiduciaryList2(this.state.totalArray).length > 0 ?(
              <Table bordered className="h-60 vertical-scroll" style={{ backgroundColor: "#ffffff"}} >
                <thead style={{ position: "sticky" }}>
                  <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterFiduciaryList2(this.state.totalArray).map((item) => (
                    <tr>
                      <td className="text-center">{$AHelper.capitalizeAllLetters(item.memberName)}</td>
                      <td className="d-flex justify-content-around"> 
                      <div>Beneficiary</div>
                      <div>
                      <Form.Check className="form-check-smoke" type="checkbox" value={item?.userRolesName?.split(" ")[0] == 'Beneficiary'} checked={item.isBeneficiary == true ? true : false} disabled={item.isBeneficiary == true ? false : true}></Form.Check>
                      </div>
                      <div>Fiduciary</div>
                      <div>
                      <Form.Check className="form-check-smoke" type="checkbox" value={item?.userRolesName?.split(" ")[2] == 'Fiduciary'} checked={item.isFiduciary == true ? true : false} disabled={item.isFiduciary == true ? false : true}></Form.Check>
                      </div>  
                      </td>  
                      <td className="text-center">{item.rltnTypeWithSpouse }</td>
    
                    </tr>
                  ))}
                 
                </tbody>
              </Table>  
            ) : <p>(Not Provided)</p>}         
            </div>   
          

          </div>
          </Container>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FiduciarySum);
