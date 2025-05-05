import { use } from "express/lib/router";
import { useEffect, useState } from "react";
import { $AHelper } from "../../../../control/AHelper";
import konsole from "../../../../control/Konsole";
import OtherInfo from "../../../../asssets/OtherInfo";
import Other from "../../../../asssets/Other";
import { isNotValidNullUndefile } from "../../../../Reusable/ReusableCom";
import { uscurencyFormate } from "../../../../control/Constant";

const AssetsSum = (props) => {

  const spouseId = (props.spouseId !== undefined && props. spouseId !== '')? props.spouseId : '';
  const memberId = (props.memberId !== undefined && props.memberId !== '') ? props.memberId : '';
  const [userAgingAssests, setUserAgingAssests] = useState();
  const [retirementUserAgingAssests, setRetirementUserAgingAssests] = useState();
  const [realUserAgingAssests, setRealUserAgingAssests] = useState();
  const [businessInterestGetList, setBusinessInterestGetList] = useState();
  const[totalEstimatedMarketValue,setTotalEstimatedMarketValue]=useState(0)
  const [userLifeInsurence, setUserLifeInsurence] = useState();
  const [spouseLifeInsurence, setSpouseLifeInsurence] = useState();
  const [userAgingAssestsTotal, setUserAgingAssestsTotal] = useState(0);
  const [retirementUserAgingAssestsTotal, setRetirementUserAgingAssestsTotal] = useState(0);
  const [realUserAgingAssestsPurchasePriceTotal, setRealUserAgingAssestsPurchasePriceTotal] = useState(0);
  const [realUserAgingAssestsTotalValue, setRealUserAgingAssestsTotalValue] = useState(0);
  const [longTermCareInsurancePolicies, setLongTermCareInsurancePolicies] =useState([]);
  const [spouseLongTermInsurencePolicies, setSpouseLongTermInsurencePolicies] =useState([]);
  let userDetailOfPrimary=JSON.parse(sessionStorage.getItem("userDetailOfPrimary"))
  const api = props.api;
  useEffect(() => {
    if(memberId !== ''){
      api.GetUserAgingAsset(memberId).then((res) => {
        // konsole.log("agingAssedsssasasasts", res.data.data);    
        const getUserAgingAssets=res?.data?.data?.filter((v) => v.agingAssetCatId == "1")
        const retirementUserAgingAssests=res?.data?.data.filter((v) => v.agingAssetCatId == "2")
        const realUserAgingAssestsData=res?.data?.data.filter((v) => v.agingAssetCatId == "3")
        let totalSumofuserAgingAssets=getSumOfValues(getUserAgingAssets,"balance");
        let retirementUserAgingAssestsTotal=getSumOfValues(retirementUserAgingAssests,"balance");
        let realUserAgingAssestsPurchasePrice=getSumOfValues(realUserAgingAssestsData,"purchasePrice","Realproperty");
        let realUserAgingAssestsTotalValue=getSumOfValues(realUserAgingAssestsData,"value","Realproperty");
        setUserAgingAssests(getUserAgingAssets);
        setUserAgingAssestsTotal(totalSumofuserAgingAssets);
        setRetirementUserAgingAssests(retirementUserAgingAssests);
        setRetirementUserAgingAssestsTotal(retirementUserAgingAssestsTotal);
        setRealUserAgingAssestsPurchasePriceTotal(realUserAgingAssestsPurchasePrice)
        setRealUserAgingAssestsTotalValue(realUserAgingAssestsTotalValue)
        setRealUserAgingAssests(realUserAgingAssestsData);
      }).catch(error => konsole.log("apiError13", error));

      api.GetLifeInsuranceByUserId(memberId).then((res) => {
        konsole.log("lifInsurance", res);
        setUserLifeInsurence(res?.data?.data?.lifeInsurances);
      }).catch(error => konsole.log("apiError14", error));
      
      api.GetUserBusinessInterest(memberId, 0).then((res) => {

        const totalBuisnessInterest=res?.data?.data?.businessInterest;
        let totalEstimatedMarketValue=getSumOfValues(totalBuisnessInterest,"estimatedMarketValue");
        setTotalEstimatedMarketValue(totalEstimatedMarketValue)
        setBusinessInterestGetList(totalBuisnessInterest);
      }).catch(error => konsole.log("apiError15", error));

      api.GetUserLongTermIns(memberId, 0).then((res) => {
        const longtermInsurence=res?.data?.data?.longTermIns
        konsole.log("longterms",res);
        if(longtermInsurence.length > 0){
          setLongTermCareInsurancePolicies(longtermInsurence);
        }
      }).catch(error => konsole.log("apiError16", error));
    }

  }, [memberId]);


  function getSumOfValues(data,key,RealPeopertyUniqueKey) {
    if(RealPeopertyUniqueKey=="Realproperty")
    {
      const sum = data.reduce((accumulator, currentValue) => {
        
        if (currentValue?.isRealPropertys && currentValue?.isRealPropertys.length>0 ) {
          return accumulator + currentValue.isRealPropertys[0][key];
        } else {
          return accumulator;
        }
      }, 0);
      return sum;
    }
    else{
      const sum = data.reduce((accumulator, currentValue) => 
      accumulator + (parseFloat(currentValue[key]) || 0), 0);
    return sum;
    }
  }

  useEffect(()=>{
    if(spouseId !== ''){
      api.GetLifeInsuranceByUserId(spouseId).then((res) => {
        setSpouseLifeInsurence(res.data.data.lifeInsurances);
      }).catch(error => konsole.log("apiError17", error));
      api.GetUserLongTermIns(spouseId, 0).then((res) => {
        if (res.data.data.longTermIns.length > 0) {
          setSpouseLongTermInsurencePolicies(res.data.data.longTermIns);
        }
      }).catch((err) => konsole.log("adbvj", err));
    }
  },[spouseId])

  return (
    <div className="financialInformationTable">
      {/* <p className="Heading generate-pdf-main-color">Assets:</p> */}
      <ul className="pt-1 ps-3"><li className="head-2">Assets</li></ul> 
      <p className="p3 generate-pdf-main-color"> Non-Retirement Financial Assets :</p>
      <table className="container-fluid">

        <tr className="text-center">
          <th className="col-3 thd">Description of Property/Type of Account</th>
          <th className="col-3 thd">Institution Where Property is Held</th>
          <th className="thd">Value</th>
          <th className="thd">Owner</th>
          <th className="thd">Beneficiary</th>
        </tr>

        <tbody>
          {userAgingAssests &&
            userAgingAssests.map((asset, i) => {
              // konsole.log("asssssssss",asset)
              return (
                <tr key={i} className="text-center">
                  <td className="tdd"><OtherInfo key={i} othersCategoryId={3}  userId={props?.memberId} othersMapNatureId={asset?.userAgingAssetId}  FieldName={asset?.assetTypeName}/> </td>
                  <td className="tdd">{asset.nameOfInstitution || "-"}</td>
                  <td className="tdd">{ isNotValidNullUndefile(asset.balance) ? $AHelper.IncludeDollars(asset.balance) : "-"}</td>
                  <td className="tdd">{asset.assetOwners.length == 2 ? "Joint" : asset.assetOwners.length == 1 ? $AHelper.capitalizeAllLetters(asset.assetOwners[0].ownerUserName) : "-"}</td>
                  <td className="tdd">{asset.assetBeneficiarys.length > 0? $AHelper.capitalizeAllLetters(asset.assetBeneficiarys[0].beneficiaryUserName): "-"}
                  </td>
                </tr>
              );
            })}
        </tbody>
        <tr>
          <td colSpan="1" className="border-0"></td>
          <td className="text-center fw-bold p-1 tdd">TOTAL</td>
          <td className="fw-bold tdd">
            <div className="d-flex justify-content-center">$ {uscurencyFormate(userAgingAssestsTotal)}</div>
          </td>
          <td className="border-0"></td>
        </tr>
      </table>
      <br />
      <br />
      <p className="p3 generate-pdf-main-color">Retirement Financial Assets :</p>
      <table className="container-fluid">

        <tr className="text-center">
          <th className="col-3 thd">Description of Property/Type of Account</th>
          <th className="col-3 thd">Institution Where Property is Held</th>
          <th className="thd">Value</th>
          <th className="thd">Owner</th>
          <th className="thd">Beneficiary</th>
        </tr>

        <tbody>
          {retirementUserAgingAssests &&
            retirementUserAgingAssests.map((asset, i) => {
              return (
                <tr key={i} className="text-center">
                  <td className="tdd"> <OtherInfo key={i} othersCategoryId={3}  userId={props?.memberId} othersMapNatureId={asset?.userAgingAssetId}  FieldName={asset?.assetTypeName} />  </td>
                  <td className="tdd">{asset.nameOfInstitution || "-"}</td>
                  <td className="tdd">{isNotValidNullUndefile(asset.balance) ? $AHelper.IncludeDollars(asset.balance) : "-"}</td>
                  <td className="tdd">{asset.assetOwners.length == 2 ? "Joint" : asset.assetOwners.length == 1 ? $AHelper.capitalizeAllLetters(asset.assetOwners[0].ownerUserName) : "-"}</td>
                  <td className="tdd">{asset.assetBeneficiarys.length > 0? $AHelper.capitalizeAllLetters(asset.assetBeneficiarys[0].beneficiaryUserName): "-"}</td>
                </tr>
              );
            })}
        </tbody>
        <tr>
          <td colSpan="1" className="border-0"></td>
          <td className="text-center fw-bold p-1 tdd">TOTAL</td>
          <td className="fw-bold tdd"> <div className="d-flex justify-content-center">$ {uscurencyFormate(retirementUserAgingAssestsTotal)}</div></td>
          <td className="border-0"></td>
        </tr>
      </table>
      <br />
      <br />

      <p className="p3 generate-pdf-main-color">Real Estate:</p>
      <table className="container-fluid">
        <tr className="text-center">
          <th className="col-3 thd">Description of Property</th>
          <th className="thd">Purchase Date</th>
          <th className="thd">Purchase Price</th>
          <th className="thd">Today's Value</th>
          <th className="thd">Owner</th>
        </tr>
        <tbody>
          {realUserAgingAssests &&
            realUserAgingAssests.length > 0 &&
            realUserAgingAssests.map((asset, i) => {
              return (
                <tr key={i}>
                  <td className="tdd text-center"> <OtherInfo key={i} othersCategoryId={3}  userId={props?.memberId} othersMapNatureId={asset?.userAgingAssetId}  FieldName={asset?.assetTypeName} /> </td>
                  <td className="tdd text-center">
                    {(asset && asset.isRealPropertys != undefined && asset.isRealPropertys[0]?.purchaseDate == null) ? "-" :  $AHelper.getFormattedDate(asset.isRealPropertys[0]?.purchaseDate) || ""} </td>
                    
                  <td className="tdd text-center">{isNotValidNullUndefile(asset.isRealPropertys[0]?.purchasePrice) ? $AHelper.IncludeDollars(asset.isRealPropertys[0]?.purchasePrice) : "-"}</td>

                  <td className="tdd text-center"> {isNotValidNullUndefile(asset.isRealPropertys[0]?.value)  ? $AHelper.IncludeDollars(asset.isRealPropertys[0]?.value) : "-"}</td>
                  <td className="tdd text-center">{(asset && asset.assetOwners != undefined &&  asset.assetOwners.length == 2) ? "Joint" :  asset.assetOwners.length == 1 ? 
                   $AHelper.capitalizeAllLetters(asset.assetOwners[0]?.ownerUserName) : ""} </td>
                </tr>
              );
            })}
        </tbody>
        <tr>
          <td className="border-0"></td>
          <td className="text-center fw-bold p-1 tdd">TOTAL</td>
          <td className="fw-bold tdd">
            <div className="d-flex justify-content-center">$ {uscurencyFormate(realUserAgingAssestsPurchasePriceTotal)}</div>
            {/* <input type="text" className="w-75 ms-1 border-0"></input> */}
          </td>
          <td className="fw-bold tdd">
            <div className="d-flex justify-content-center">$ {uscurencyFormate(realUserAgingAssestsTotalValue)}</div>
          </td>
          <td className="border-0"></td>
        </tr>
      </table>
      <br />
      <br />

      <p className="p3 generate-pdf-main-color">Life Insurance:</p>
      <table className="container-fluid">
        <tr>
          <th className="col-4 border-0"></th>
          <th className="col-3 text-center grey thd">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</th>        
          {spouseId && <th className="col-3 text-center grey thd">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</th>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Insurance Company</td>
          <td className="tdd text-center"> {userLifeInsurence && userLifeInsurence.length > 0 ? (<OtherInfo othersCategoryId={12} othersMapNatureId={userLifeInsurence[0]?.userLifeInsuranceId} FieldName={$AHelper.capitalizeAllLetters(userLifeInsurence[0]?.insuranceCompany)} userId={props?.memberId}/>):"-"} </td>  
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? ( <OtherInfo  othersCategoryId={12}  othersMapNatureId={spouseLifeInsurence[0]?.userLifeInsuranceId }  FieldName={$AHelper.capitalizeAllLetters(spouseLifeInsurence[0]?.insuranceCompany)}  userId={props?.spouseId}/>
            ):"-"}
          </td>}
        </tr>

        <tr>
          <td className="ps-2 tdd">Type of Policy?</td>
          <td className="tdd text-center">{userLifeInsurence && userLifeInsurence.length > 0 ? ( <OtherInfo  othersCategoryId={23}  othersMapNatureId={userLifeInsurence[0]?.userLifeInsuranceId }  FieldName={userLifeInsurence[0]?.insuranceCompany}  userId={props?.memberId}/> ):"-"}</td>  
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? ( <OtherInfo  othersCategoryId={23}  othersMapNatureId={spouseLifeInsurence[0]?.userLifeInsuranceId }  FieldName={spouseLifeInsurence[0]?.insuranceCompany}  userId={props?.spouseId}/>):"-"}</td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Policy No</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence?.[0]?.additionalDetails.length > 0 ? (
              <input
                type="text"
                className="border-0 text-center"
                style={{width:"185px"}}
                value={userLifeInsurence[0]?.additionalDetails}
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence?.[0]?.additionalDetails.length > 0 ? (
              <input
                type="text"
                value={spouseLifeInsurence[0]?.additionalDetails}
                style={{width:"185px"}}
                className="border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          {/* <td className="ps-2 tdd">Type of Policy?</td> */}
          
            {/* <td className="tdd"  >
            {userLifeInsurence && userLifeInsurence.length > 0 && (<>
            <input type="checkbox" className="form-check-input mx-2" checked={(userLifeInsurence[0].policyTypeId == 1)}></input>Hybrid
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(userLifeInsurence[0].policyTypeId == 2)}></input>Traditional
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(userLifeInsurence[0].policyTypeId == 3)}></input>Universal Life
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(userLifeInsurence[0].policyTypeId == 4)}></input>Variable Life
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(userLifeInsurence[0].policyTypeId == 999999)}></input>Other
            </>)}
          </td> */}
          

            {/* {spouseId && <td className="tdd" >
          {spouseLifeInsurence && spouseLifeInsurence.length > 0 && (<>
            <input type="checkbox" className="form-check-input mx-2" checked={(spouseLifeInsurence[0].policyTypeId == 1)}></input>Hybrid
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(spouseLifeInsurence[0].policyTypeId == 2)}></input>Traditional
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(spouseLifeInsurence[0].policyTypeId == 3)}></input>Universal Life
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(spouseLifeInsurence[0].policyTypeId == 4)}></input>Variable Life
            <br />
            <input type="checkbox" className="form-check-input mx-2" checked={(spouseLifeInsurence[0].policyTypeId == 999999)}></input>Other
            </> )}
          </td>} */}
        </tr>
        <tr>
          <td className="ps-2 tdd">When was the policy started?</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={userLifeInsurence[0]?.policyStartDate == null ? " " :$AHelper.getFormattedDate(userLifeInsurence[0]?.policyStartDate)}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence?.length > 0 ? (
              <input
                type="text"
                value={isNotValidNullUndefile(spouseLifeInsurence[0]?.policyStartDate) ? $AHelper.getFormattedDate(spouseLifeInsurence[0]?.policyStartDate) : ""}
                className="border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">What is the premium amount?</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence?.length > 0 ? (
              <input
                type="text"
                value={isNotValidNullUndefile(userLifeInsurence[0]?.premium) && userLifeInsurence[0]?.premium != 0 ? $AHelper.IncludeDollars(userLifeInsurence[0].premium) : "-"}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={isNotValidNullUndefile(spouseLifeInsurence[0].premium) &&  spouseLifeInsurence[0]?.premium != 0  ? $AHelper.IncludeDollars(spouseLifeInsurence[0].premium) : "-"}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">If term insurance, when will it expire?</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={userLifeInsurence[0].policyExpiryDate == null ? " " : $AHelper.getFormattedDate(userLifeInsurence[0].policyExpiryDate)}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={spouseLifeInsurence[0].policyExpiryDate == null ? "" : $AHelper.getFormattedDate(spouseLifeInsurence[0].policyExpiryDate)}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Premium Frequency</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={(userLifeInsurence[0]?.premiumType)}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={(spouseLifeInsurence[0].premiumType)}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Death Benefits:</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence.length > 0 ? (
           
              <input
                type="text"
                value={userLifeInsurence[0].deathBenefits != null ? $AHelper.IncludeDollars(userLifeInsurence[0].deathBenefits)  : "-"}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={spouseLifeInsurence[0].deathBenefits != null ? $AHelper.IncludeDollars(spouseLifeInsurence[0].deathBenefits) : "-"}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Cash Value:</td>
          <td className="tdd text-center">
            {userLifeInsurence && userLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={isNotValidNullUndefile(userLifeInsurence[0]?.cashValue) && userLifeInsurence[0]?.cashValue != 0 ? $AHelper.IncludeDollars(userLifeInsurence[0]?.cashValue) :"-"}
                className="m-0 border-0 text-center "
              ></input>
            ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? (
              <input
                type="text"
                value={isNotValidNullUndefile(spouseLifeInsurence[0]?.cashValue) && spouseLifeInsurence[0]?.cashValue != 0 ? $AHelper.IncludeDollars(spouseLifeInsurence[0]?.cashValue) : "-  "}
                className="m-0 border-0 text-center"
              ></input>
            ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 tdd">Beneficiary:</td>
          <td className="tdd text-center">   
    {userLifeInsurence && userLifeInsurence.length > 0 ? userLifeInsurence[0].beneficiary.length > 0 &&   userLifeInsurence[0].beneficiary[0].beneficiaryUserId !== null && (
              // <input
              //   type="text"
              //   className="m-0 border-0 text-center"
              //   value={$AHelper.capitalizeAllLetters(userLifeInsurence[0].beneficiary[0].beneficiaryName)}
              //   ></input>
              <p>{$AHelper.capitalizeAllLetters(userLifeInsurence[0].beneficiary[0].beneficiaryName)}</p>
    ):"-"}
                </td>
    {spouseId && <td className="tdd text-center">
    {spouseLifeInsurence && spouseLifeInsurence.length > 0 ? spouseLifeInsurence[0].beneficiary.length > 0 &&   spouseLifeInsurence[0].beneficiary[0].beneficiaryUserId !== null && (
            // <input
            //   type="text"
            //   className="m-0 border-0 text-center"
            //   value={$AHelper.capitalizeAllLetters(spouseLifeInsurence[0].beneficiary[0].beneficiaryName)}
            // ></input>
            <p>{$AHelper.capitalizeAllLetters(spouseLifeInsurence[0].beneficiary[0].beneficiaryName)}</p>
            ):"-"}
         
            </td>}
        </tr>
      </table>
      
      <p className="p3 mt-5 generate-pdf-main-color">Business Interests:</p>
      <table className="container-fluid text-center">
        <tr>
          <th className="col-2 thd">Name of Business</th>
          <th className="col-2 thd">Description of Business</th>
          <th className="col-2 thd">Date Started</th>
          <th className="col-2 thd">
            Type of Business(Sole Prop. LLC, Corp., Partnership, etc.)
          </th>
          <th className="col-2 thd">Estimated Market Value</th>
          <th className="col-2 thd">Owner(s) and/or Co-owner(s)</th>
          <th className="col-2 thd">UBI Number</th>
          <th className="col-2 thd">Federal Tax ID Number</th>
        </tr>
        <tbody>
          {businessInterestGetList &&
            businessInterestGetList.map((b, index) => {
              return (
                <tr>
                  <td className="tdd">{$AHelper.capitalizeAllLetters(b.nameofBusiness || "-")}</td>
                  <td className="tdd">{b.descOfBusiness || "-"}</td>
                  <td className="tdd">{isNotValidNullUndefile(b.dateFunded) ? $AHelper.getFormattedDate(b.dateFunded):"-"}</td>                  
                  <td className="tdd"> <OtherInfo  othersCategoryId={30}  othersMapNatureId={b?.userBusinessInterestId }  FieldName={b?.businessType}  userId={props?.memberId}/> </td>
                  <td className="tdd">{(b.estimatedMarketValue) ? $AHelper.IncludeDollars(b.estimatedMarketValue): "-"}</td>
                  <td className="tdd">{$AHelper.capitalizeAllLetters(b.ownershipType || "-")}</td>
                  <td className="tdd">{b.additionalDetails || "-"}</td>
                  <td className="tdd">{b.taxIDNo || "-"}</td>
                </tr>
              );
            })}
        </tbody>
        <tr>
          <td className=" border-0" colSpan="3"></td>
          <td className="text-center fw-bold p-1 tdd">TOTAL</td>
          <td className="fw-bold tdd">
            $ {uscurencyFormate(totalEstimatedMarketValue)}
          </td>
          <td className="border-0"></td>
        </tr>
      </table>
      <div className=""></div>
      <p className="p3 mt-5 generate-pdf-main-color">Long-Term Care Insurance Policies:</p>
      <table className="container-fluid text-center">
        <tr>
          <th className="col-6 border-0"></th>
          <th className="col-3 text-center thd">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.memberName)}</th>
          {spouseId && <th className="col-3 text-center thd">{$AHelper.capitalizeAllLetters(userDetailOfPrimary.spouseName)}</th>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">Type of Policy:</td>
          <td className="tdd text-center">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <OtherInfo othersCategoryId={34} othersMapNatureId={longTermCareInsurancePolicies[0]?.userLongTermInsId } FieldName={longTermCareInsurancePolicies[0]?.insType} userId={props?.memberId}/>
              ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (<OtherInfo othersCategoryId={34} othersMapNatureId={spouseLongTermInsurencePolicies[0]?.userLongTermInsId } FieldName={spouseLongTermInsurencePolicies[0]?.insType} userId={props?.spouseId}/>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="ps-2 text-start tdd">Date Policy Started:</td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input type="type" className="m-0 border-0 text-center" value={isNotValidNullUndefile (longTermCareInsurancePolicies[0]?.policyStartDate) ? $AHelper.getFormattedDate(longTermCareInsurancePolicies[0]?.policyStartDate) : " "}></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value = {spouseLongTermInsurencePolicies[0].policyStartDate ?
        $AHelper.getFormattedDate(spouseLongTermInsurencePolicies[0].policyStartDate) :
        " "}

                ></input>
              ):"-"}
          </td>}
        </tr>

        <tr>
          <td className="tdd ps-2 text-start">Insurance Provider:</td>
          <td className="tdd text-center">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ?(<OtherInfo othersCategoryId={12} othersMapNatureId={longTermCareInsurancePolicies[0]?.userLongTermInsId } FieldName={longTermCareInsurancePolicies[0]?.insCompany} userId={props?.memberId}/>
              ):"-"}
          </td>
          {spouseId && <td className="tdd text-center">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (<OtherInfo othersCategoryId={12} othersMapNatureId={spouseLongTermInsurencePolicies[0]?.userLongTermInsId } FieldName={spouseLongTermInsurencePolicies[0]?.insCompany} userId={props?.spouseId}/>
              ):"-"}
          </td>}
        </tr>

        <tr>
          <td className="tdd ps-2 text-start">
            Daily Benefit Amount - Nursing Home:
          </td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(longTermCareInsurancePolicies[0]?.dailyBenefitNHSetting) ? $AHelper.IncludeDollars(longTermCareInsurancePolicies[0]?.dailyBenefitNHSetting):"-"}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(spouseLongTermInsurencePolicies[0]?.dailyBenefitNHSetting) ? $AHelper.IncludeDollars(spouseLongTermInsurencePolicies[0]?.dailyBenefitNHSetting):"-"}
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">
            Daily Benefit Amount - Personal Residence:
          </td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(longTermCareInsurancePolicies[0]?.dailyBenefitOtherThanNH) ? $AHelper.IncludeDollars(longTermCareInsurancePolicies[0]?.dailyBenefitOtherThanNH) :"-"}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(spouseLongTermInsurencePolicies[0].dailyBenefitOtherThanNH) ? $AHelper.IncludeDollars(spouseLongTermInsurencePolicies[0].dailyBenefitOtherThanNH) :"-"}
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">Elimination Period:</td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(longTermCareInsurancePolicies[0].eliminationPeriod)}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={spouseLongTermInsurencePolicies[0].eliminationPeriod}
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">Number of Years Benefits Will Continue:</td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(longTermCareInsurancePolicies[0].maxBenefitYears)}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={spouseLongTermInsurencePolicies[0].maxBenefitYears}
                ></input>
              ): "-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">
            Maximum Lifetime Benefits
          </td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(longTermCareInsurancePolicies[0]?.maxLifeBenefits) ? $AHelper.IncludeDollars(longTermCareInsurancePolicies[0].maxLifeBenefits):"-"}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(spouseLongTermInsurencePolicies[0]?.maxLifeBenefits) ? $AHelper.IncludeDollars(spouseLongTermInsurencePolicies[0].maxLifeBenefits):"-"}
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">Premium(s):</td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(longTermCareInsurancePolicies[0].premiumFrequency)}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(spouseLongTermInsurencePolicies[0].premiumFrequency)}
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">
            When was the last premium increase?
          </td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0  ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(longTermCareInsurancePolicies[0].lastTimePremiumIncrease) ? $AHelper.getFormattedDate(longTermCareInsurancePolicies[0].lastTimePremiumIncrease):" "}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={isNotValidNullUndefile(spouseLongTermInsurencePolicies[0].lastTimePremiumIncrease) ? $AHelper.getFormattedDate(spouseLongTermInsurencePolicies[0].lastTimePremiumIncrease) : " " }
                ></input>
              ):"-"}
          </td>}
        </tr>
        <tr>
          <td className="tdd ps-2 text-start">
            Does the plan have an inflation rider?
          </td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <p className="text-start ps-2 text-center">{longTermCareInsurancePolicies[0].planWithInflationRider == "true" ? "Yes" : "No"}</p>
              
              ):"-"}
          </td>
          {konsole.log(spouseLongTermInsurencePolicies[0],"asasasaas")}
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <p className="text-start ps-2 text-center">{spouseLongTermInsurencePolicies[0].planWithInflationRider == "true" ? "Yes" : "No"}</p>
              ):"-"}
          </td>}
        </tr>
        
        <tr>
          <td className="tdd ps-2 text-start">Policy No.</td>
          <td className="tdd">
            {longTermCareInsurancePolicies &&
              longTermCareInsurancePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(longTermCareInsurancePolicies[0].additionalDetails)}
                ></input>
              ):"-"}
          </td>
          {spouseId && <td className="tdd">
            {spouseLongTermInsurencePolicies &&
              spouseLongTermInsurencePolicies.length > 0 ? (
                <input
                  type="type"
                  className="m-0 border-0 text-center"
                  value={(spouseLongTermInsurencePolicies[0].additionalDetails)}
                ></input>
              ):"-"}
          </td>}
        </tr>
      </table>
    </div>
  );
};

export default AssetsSum;
