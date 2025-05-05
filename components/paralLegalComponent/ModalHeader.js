import React,{useEffect,useState} from 'react'

import { $CommonServiceFn } from '../../components/network/Service';
import { $Service_Url } from '../../components/network/UrlPath';
import konsole from '../../components/control/Konsole';
import { connect } from 'react-redux';
import { SET_LOADER } from '../Store/Actions/action';
import { $AHelper } from '../control/AHelper';
import { isNotValidNullUndefile } from '../Reusable/ReusableCom';

const ModalHeader = (props) => {
    const [ logoUrl, setLogoUrl ] = useState(null);
    useEffect(()=>{
        userLogo();
    },[])

    const userLogo=()=>{
      const subtenantId = sessionStorage.getItem("SubtenantId");
      const subtenantLogoUrl = $AHelper.getCookie("subtenantLogoUrl");
      // const userId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28"
      // const loggedUserId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28";
  
      if(isNotValidNullUndefile(subtenantLogoUrl) && subtenantLogoUrl != 'undefined'){
        setLogoUrl(subtenantLogoUrl);
        return;
      }
  
      let subtenantObj = {
        subtenantId: subtenantId
      }
      konsole.log("useId", subtenantId);
      props.dispatchloader(true);
      $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.getSubtenantDetails, subtenantObj,
        (response) => {
          if (response) {
            props.dispatchloader(false);
            konsole.log("fiduciaryList", response.data);
            setLogoUrl(response.data.data[0].subtenantLogoUrl)
            $AHelper.setCookie("subtenantLogoUrl", response.data.data[0].subtenantLogoUrl)
            sessionStorage.setItem("subtenantName",response.data.data[0].subtenantName)
          }
        }
      );
    };
          

            konsole.log("logoUrl",logoUrl)
  return (
    <div class="mb-2 bg-light">
    <div class="row">
      <div class="m-auto col-4 d-flex universalHeaderOptions justify-content-center">
        <img
          class="mt-1"
          src={logoUrl}
          alt="brand logo"
          style={{mixBlendMode: "multiply"}}
        />
      </div>
    </div>
  </div>
  )
}

const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader })
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHeader)