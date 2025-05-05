import { useEffect, useState } from "react";
import konsole from "../../../components/control/Konsole";
import Assignselectshow from "./Assignselectshow";
import {
  $CommonServiceFn,
  $getServiceFn,
} from "../../../components/network/Service";
import { $Service_Url } from "../../../components/network/UrlPath";

const Assignselectlegal = () => {
  const [documentList, setdocumentList] = useState([]);
  const [DocumentId, setDocumentId] = useState("");
  const[selectlabelname,setSelectLabelName]=useState('');
  const [legalDocOwnershipName, setlegalDocOwnerShipName] = useState("")
  const [checkedDocName, setCheckedDocName] = useState(false)

  useEffect(() => {
    legalDocumentList();
  }, []);

  const legalDocumentList = ( ) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getLegalDocuments,
      $getServiceFn,
      (response) => {
        if (response) {
          konsole.log("DocumentList", response.data.data);
          setdocumentList(response.data.data);
        }
      }
    );
  };

  const legalDocId = (e,index) => {
     konsole.log("DocumentId",e.target.value)
     konsole.log("Name",e.target.value,index)

     let filterdata=documentList.filter((value)=>{
        return value.legalDocId == e.target.value
     })
     setSelectLabelName(filterdata[0].legalDocName)
     konsole.log("legalROleName",filterdata[0].ownershipName)
     setlegalDocOwnerShipName(filterdata[0].ownershipName)
     setDocumentId(e.target.value)
     setCheckedDocName(true)
    }
    konsole.log("Doc",DocumentId)
    konsole.log('selectlabelname',selectlabelname)

    const docDetails = {
        docId : DocumentId,
        docName : selectlabelname,
        ownershipName : legalDocOwnershipName,
        checkRight : checkedDocName,
    }
  return (
    <>
      <div className="container-fluid bg-white m-0 p-0 ">
        <div className="d-flex justify-content-start pt-3">
          <p className="ms-4 fs-4 ps-2"> Select Application Legel Documents</p>
          <div className="ps-2 w-50  h-25">
            <select className="w-100  border fs-5" style={{ color: "#751521" }} onChange={legalDocId} defaultValue="none">
              {documentList.map((item, index) => {
                return (
                  <option className="text-secondary" value={item.legalDocId} >
                    {item.legalDocName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <hr />

      <Assignselectshow docId={DocumentId} docName = {selectlabelname} ownershipName={legalDocOwnershipName} documentDetails={docDetails}/>
    </>
  );
};

export default Assignselectlegal;
