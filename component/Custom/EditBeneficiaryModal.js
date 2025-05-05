import { Col,Row,Modal} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {useState,useEffect,memo,useContext,useMemo} from "react"
import { selectorFinance } from "../Redux/Store/selectors"
import { $AHelper } from '../Helper/$AHelper';
import { $CommonServiceFn } from "../../components/network/Service"
import { $Service_Url } from "../../components/network/UrlPath";
import { useAppDispatch, useAppSelector } from '../Hooks/useRedux';
import { setHideCustomeSubSideBarState, useLoader } from '../utils/utils';
import { fetchRetirementNonRetirementData,fetchLifeInsByUserIdData, updateNonRetirementAssestsList, updateRetirementAssetsList, fetchXmlGenerater} from '../Redux/Reducers/financeSlice';
import { postApiCall, removeDuplicate,isNullUndefine,getApiCall,isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import usePrimaryUserId from '../Hooks/usePrimaryUserId';
import OtherInfo from "../../components/asssets/OtherInfo";
import { globalContext } from '../../pages/_app'
import { $getServiceFn } from "../../components/network/Service";
import konsole from '../../components/control/Konsole';
import AiModal from '../Finance-Information/Assets/RetirementNonRetirement.js/AiModal';
import { paralegalAttoryId ,demo } from '../../components/control/Constant';
import UploadedFileView from '../Common/File/UploadedFileView'
import { $ApiHelper } from '../Helper/$ApiHelper';
import AddRetirementNonRetirement from "../Finance-Information/Assets/RetirementNonRetirement.js/AddRetirementNonRetirement"
import LifeInsurance from "../Finance-Information/Assets/Life Insurance/LifeInsurance"
import { contentData } from '../Helper/$MsgHelper';
  

export default function EditBeneficiaryModal(props)
{
     const { closeEditModal, setEditCloseModal,viewEditModal,primaryUserId,fetchDataModalData } = props;
     const[UpdateModalState,setUpdateModalState]=useState(false);
     const financeData = useAppSelector(selectorFinance);
     const { nonRetirementAssetsList, retirementAssetsList, assetTypePreconditionTypeListForRetirement,assetTypePreconditionTypeListForNonRetirement, ownerTypeList, beneficiaryList } = financeData;
     const dispatch = useAppDispatch();
    //@@ Close Beneficiary letter Edit Modal
    const closeEditModalFun=()=>{
      setEditCloseModal(false)
      setUpdateModalState(false)
    }
    //@@ Edit Beneficiary letter Edit Modal
    const updateModalFun=()=>{
      setUpdateModalState(true)

    }

    const fetchData = async () => {
      useLoader(true);
      const _resultOf = await dispatch(fetchRetirementNonRetirementData({ userId: primaryUserId }));
      // konsole.log("_resultOf", _resultOf);
      useLoader(false);
      let retirementData = []
      let nonRetirementData = []
      if (_resultOf.payload == 'err') {
          retirementData = []
          nonRetirementData = []
      } else {
          nonRetirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "1")?.filter((v)=> v.assetBeneficiarys?.filter((e)=> e.beneficiaryUserId != ''));
          retirementData = _resultOf.payload?.filter((v, j) => v.agingAssetCatId == "2");
      }

      updateRetirementNonRetirementDetails('Fetch', 1, retirementData)
      updateRetirementNonRetirementDetails('Fetch', 2, nonRetirementData)
    }

    const updateRetirementNonRetirementDetails = (action, type, details) => {
        const updateList = type == 1 ? updateRetirementAssetsList : updateNonRetirementAssestsList;
        const assetList = type == 1 ? retirementAssetsList : nonRetirementAssetsList;
        if (action === 'Fetch') {
            dispatch(updateList(details));
        } 
    };
    // console.log("EditBeneficiaryModalviewEditModal",viewEditModal)
    return(
        <div id='custom-modal-container' className='custom-modal-container' style={{ zIndex: "100000" }}>
        <Modal show={closeEditModal} id='custom-modal-container3' className='useNewDesignSCSS searchModalWidth' aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body style={{padding:"19px 21px 15px 24px",overflow: "auto",minHeight: "80vh",height: "87vh"}}>
              
              {(viewEditModal?.condition=="Edit" && viewEditModal?.tableName== "Insurance Policies") ?
                <LifeInsurance 
                  viewEditModal={viewEditModal}
                  closeEditModal={closeEditModal}
                  setEditCloseModal={setEditCloseModal}
                  UpdateModalState={UpdateModalState}
                  setUpdateModalState={setUpdateModalState}
                  fetchDataModalData={fetchDataModalData}
                  modalLabel="Beneficiary-Modal"
                  
                />
                :
                <AddRetirementNonRetirement
                modalLabel="Beneficiary-Modal"
                startTabIndex={1}
                editInfo={viewEditModal?.tableData}
                actionType={"EDIT"}
                activeType={"ADDEDIT"}
                isRetirement={(viewEditModal?.tableName=="Non-Retirement")?false:true}
                memberUserID={viewEditModal?.tableData?.institutionUserId}
                contentData={contentData}
                closeEditModal={closeEditModal}
                setEditCloseModal={setEditCloseModal}
                UpdateModalState={UpdateModalState}
                setUpdateModalState={setUpdateModalState}
                updateRetirementNonRetirementDetails={updateRetirementNonRetirementDetails}
                fetchData={fetchData}
                fetchDataModalData={fetchDataModalData}
                
         /> 
              }
            </Modal.Body>
            <Modal.Footer >
            <div className='footer-btn w-100 justify-content-between border-0' >
                <button className='send' onClick={closeEditModalFun}>Close</button>
                <button className='send' onClick={updateModalFun}>Update</button>
            </div>
            </Modal.Footer>
        </Modal>
    </div>  
    )
}
