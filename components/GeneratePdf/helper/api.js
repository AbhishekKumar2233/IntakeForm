import axios from "axios";
//import { getCookie } from "./utils";
import { ABaseUrl } from '../../control/Constant'

export default class Api {
  constructor() {
    this.api_token = sessionStorage.getItem("AuthToken") || "";
    this.client = null;
    this.api_url = ABaseUrl;
    // this.userId="ad9480fe-9576-4c12-87ae-a0a5a217ec87"
    // this.spouseId="4d6d0730-4e3d-452b-a434-7e4d5010d6f8"
  }
  init = () => {
    //this.api_token = getCookie("ACCESS_TOKEN");
    let headers = {
      Accept: "application/json",
    };
    if (this.api_token) {
      headers.Authorization = `Bearer ${this.api_token}`;
    }
    this.client = axios?.create({
      baseURL: this.api_url,
      timeout: 50000,
      headers: headers,
    });
    return this.client;
  };
  getMember = (id) => {
    return this.init().get(`/api/Member/${id}`);
  } 

  getAddressByUserId(id){
    return this.init().get(`/api/Address/get-address-by-userid/${id}`);
  }

  GetFamilyMembersByParentId(parentId){
    return this.init().get(`/api/Member/GetFamilyMembersByParentId/${parentId}`)
  }

  GetFamilyMembersByUserId(userId){
    return this.init().get(`/api/Member/get-FamilyMembers-by-userid/${userId}`)
  }

  GetAddressByUserId(userId){
    return this.init().get(`/api/Address/get-address-by-userid/${userId}`)
  }

  Country(){
    return this.init().get(`/api/Country`)
  }

  AddressType(){
    return this.init().get(`/api/AddressType`)
  }

  GetContactByUserid(user_id){
    return this.init().get(`/api/Contact/get-contact-by-userid/${user_id}`)
  }

  GetPrimaryCareMembersByPrimaryUserId(PrimaryUserId){
    return this.init().get(`/api/PrimaryCare/get-primarycaremembers-by-primaryuserid/${PrimaryUserId}`)
  }

  GetUserInsuranceByUserid(userId){
    return this.init().get(`/api/UserInsurance/get-UserInsurance-by-userid/${userId}`)
  }
  UserMedHistoryByMedHisType(userId,relationshipIds){
    return this.init().get(`/api/UserMedHistory/get-UserMedHistory-by-medhisttype/${userId}/${relationshipIds}`)
  }
  GetOccupationByUserId(user_id){
    return this.init().get(`/api/Occupation/get-occupation-by-userid/${user_id}`)
  }
  GetUserSubject(userid,categoryid,topicId,subjectId){
    return this.init().get(`/api/Subject/get-user-subject/${userid}/${categoryid}/${topicId}/${subjectId}`)
  } 
  GetUserAgingAsset(id){
    return this.init().get(`/api/UserAgingAsset/get-UserAgingAsset-by-userid/${id}`)
  }
  GetUserBusinessInterest(id,instrestId){
    return this.init().get(`/api/UserBusinessInterest/get-UserBusinessInterest/${id}`)
  }
  GetLifeInsuranceByUserId(id){
  return this.init().get(`/api/LifeInsurance/get-life-insurance/${id}`)
  }
  GetUserLongTermIns(userId,userLongTermInsId)
  {
    return this.init().get(`/api/UserLongTermIns/${userId}?userLongTermInsId=${userLongTermInsId}`)
  }
  GetUserLiability(userId,userLiabilityId){
  return this.init().get(`/api/UserLiability/${userId}/${userLiabilityId}`)
  }
  GetUserByUserId(memberId){
    return this.init().get(`/api/User/GetUserByUserId/${memberId}`)
  }
  GetSubjectForFormLabelId(id){
    return this.init().post(`/api/Subject/get-subject-for-form-label-id`,[id])
  }
  GetSearchProfessionals(MemberUserId,ProSerDescId,ProSerUserId,EmailId,MobileNo,Name){
    return this.init().get(`/api/2/ProfessionalUser/getMemberProfessionals`,{
      params: {
        MemberUserId: MemberUserId,
        ProTypeId:ProSerDescId,
        ProSerUserId:ProSerUserId,
        EmailId:EmailId,
        MobileNo:MobileNo,
        Name:Name,
        PrimaryUserId: sessionStorage.getItem("SessPrimaryUserId")
      }
    })
  }
  GetVeteranByUserId(userId){
    return this.init().get(`/api/Veteran/get-veteran-by-userid/${userId}`)
  }
  getSpecialityType(){
    return this.init().get(`/api/SpecialityType`);
  }
  getBloodTypes() {
    return this.init().get('/api/BloodType');
  }
  
}