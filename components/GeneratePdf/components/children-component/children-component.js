import { useEffect, useState } from "react";
import ChildrenAndFamilyMember from "./form-children-and-family-member/form-children-and-family-member";
import Api from "../../helper/api";
import konsole from "../../../control/Konsole";


const ChildrenComp = ({primaryUserId}) => {

    const [me,setMe]=useState();
    const api = new Api();
    const userId=primaryUserId !== undefined? primaryUserId : '';

    

    useEffect(()=>{
      if(userId !== undefined && userId !== ""){
        api.GetFamilyMembersByParentId(userId)
          .then((res) => {
            setMe(res.data.data[0])
          }).catch(error => {
            console.log(error);
          })
      }
    },[])

  return (
    (
//  && api &&

    <div className="container-fluid ">
      {(me && me.children && me.children.length > 0 && me.children[0].relationshipName !== "Spouse" && me.children[0].children.length > 0) &&
        <>
          <div className="pageBreakAfter"></div>
          <div className="title d-flex justify-content-center">
            <h1 class="h4 fw-bold generate-pdf-main-color">Children and Immediate Family Members</h1>
          </div>
          <div>
            <p className="para-p1">
              Please provide the following information for each of your children,
              including those from previous marriages. If you do not have children,
              please provide the information of your closest family members,
              particularly if you intend them to be beneficiaries or fiduciaries.
            </p>
          </div>
        </>
      }
      {
        // familyMembers.map((data)=>{
        //   <ChildrenAndFamilyMember></ChildrenAndFamilyMember>

        // })
      }

      {
          me && me.children && me.children.length > 0 && me.children[0].relationshipName == "Spouse" && me.children[0].children.map((member) => (
          member  && <ChildrenAndFamilyMember api={api} spouse={me} familyMembers={member} key={member.userId}></ChildrenAndFamilyMember>
        ))
      }

        {
          me && me.children && me.children.length > 0 && me.children[0].relationshipName !== "Spouse" && me.children.map((member) => (
            member && <ChildrenAndFamilyMember api={api} spouse={me} familyMembers={member} key={member.userId}></ChildrenAndFamilyMember>
          ))
        }

      <div className="paddTop">
        {
          me && me.children && me.children.length > 0 && me.children[0].children.length > 3 && (
          <p className="small text-center">
            If you have more than four children, please provide their information on
            an additional sheet of paper. Feel free to call our office if you prefer
            an additional form.
          </p>
          )
        }
      </div>
    </div>
    )
  );
};

export default ChildrenComp;
