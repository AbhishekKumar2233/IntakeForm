
import '../styles/globals.scss'
import '../styles/AppleLogin.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { demo } from '../components/control/Constant';
import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
// import { store } from '../components/Store/store'
import { store } from '../component/Redux/Store/store';
import { ToastContainer } from 'react-toastify';
import { Portal } from "../components/Portal"
import { auth0CredDev,auth0Cred} from '../components/auth0Files/auth0Cred';
import TosterComponent from '../components/TosterComponent';
import konsole from '../components/control/Konsole';
import Router, { useRouter } from 'next/router';
import NewPortal from '../component/Custom/NewPortal';
 
 
// SETUP DESIGN CSS
 
import '../component/Layout/setuplayout.scss';
import '../component/Custom/customcomponent.scss';
import '../component/Personal-Information/personalinformation.scss'
import '../component/Family-Information/familyinformation.scss';
import '../component/Health-Information/healthinformation.scss';
import '../component/Housing-Information/housinginformation.scss';
import '../component/Finance-Information/FinanceInformation.scss';
import '../component/Common/Professional-Usefuls/ProfessionalCSS.scss';
import '../component/Common/common.scss'
import '../component/Finance-Information/Income/Income.scss';
import '../component/Activation-Form/ActivationForm.scss'
import '../component/Common/common.scss';
import '../component/Finance-Information/FinanceInformation.scss'
import '../component/Legal-Information/legalinformation.scss'
import '../component/Finance-Information/Income/Income.scss';
import '../component/Feedback/Feedback.scss';
import '../component/Emergency/emergency.scss';
import '../component/Agent/Agentguidance.scss';
import '../component/ToolBox/toolbox.scss';
import '../component/Academy-Information/AcademyInformation.scss';
 
import { ConfirmationToaster } from '../component/Custom/ConfirmationToaster';
import { useLoader } from '../component/utils/utils';
 
export const globalContext = createContext()
 
 
const usePreviousRoute = () => {
  const { asPath } = useRouter();
 
  const ref = useRef(null);
 
  useEffect(() => {
    ref.current = asPath;
  }, [asPath]);
 
  return ref.current;
};

const initialState = { open: false, text: "", type: "", tittle:"", btnType: 0 }


let returnValue;
function MyApp({ Component, pageProps }) {
  const [data, setdata] = useState(initialState)
  const [toasterData, settoasterData] = useState(initialState)
  const [confirmyes, setConfirmyes] = useState(false);
  const [NotifyMessageCount, setNotifyMessageCount] = useState(null)
  const [isBool, setIsbool] = useState(false)
  const [pageCategoryId, setPageCategoryId] = useState(null)
  const [pageTypeId, setPageTypeId] = useState(null)
  const [pageSubTypeId, setPageSubTypeId] = useState(null)
 
  const previousRoute = usePreviousRoute();
  const warningRef = useRef();

  useEffect(() => {
    const handleStart = ( url ) => {
      konsole.log("bdsjkbdkjbkj-start" , url)
      if(url?.includes("setup-dashboard")) useLoader(true);
    }
    const handleComplete = ( url ) => {
      konsole.log("bdsjkbdkjbkj-complete" , url)
      if(url?.includes("setup-dashboard")) useLoader(false);
    }

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      // Router.events.off("routeChangeError", handleComplete);
    };
  }, []);
 
  const onConfirm = () => {
    returnValue(true);
    closeConfirm();
  };
 
  const onCancel = () => {
    returnValue(false);
    closeConfirm();
  };
  
  const onCustomResp = ( customvalue ) => {
    returnValue(customvalue);
    closeConfirm()
  }

  const confirm = (open, text, type, btnType, btnOptions ) => {
    setdata({
      open: open,
      text: text,
      type: type,
      btnType: btnType || 0,
      btnOptions: btnOptions ?? []
    })
    return new Promise((res, rej) => {
      returnValue = res
    });
  };

 

  const newConfirm = (open, text, type, tittle, btnType) => {
    settoasterData({
      open: open,
      text: text,
      type: type,
      tittle: tittle,
      btnType: btnType || 0
    })
    return new Promise((res, rej) => {
      returnValue = res
    });
  };
 
  const closeConfirm = () => {
    setdata(initialState)
    settoasterData(initialState)
  };
 
  const setWarning = ( type, title, description, highZIndex ) => {
    warningRef?.current?.setWarning?.(type, title, description, highZIndex);
    konsole.log(type, title, description,warningRef.current,"refrefrefref")
  }
 
  // const setConfirmation = ( type, title, description ) => {
  //   konsole.log("setConfirmation",returnTrue)
  //   confirmationRef?.current?.setConfirmation?.(type, title, description);
  //   return returnTrue;
  // }
 
  const auth0CredLocal =  (demo)? auth0CredDev: auth0Cred
 
 
  return (
    <Provider store={store}>
      <Auth0Provider
        domain={auth0CredLocal.domain}
        clientId={auth0CredLocal.clientId}
        redirectUri={typeof window !== 'undefined' && window.location.origin}
      >
        <globalContext.Provider value={{ data, setdata, settoasterData, confirmyes, setConfirmyes, onCustomResp, returnValue, confirm, newConfirm, previousRoute, NotifyMessageCount, setNotifyMessageCount, setIsbool, isBool,pageCategoryId, setPageCategoryId,pageTypeId, setPageTypeId,pageSubTypeId,setPageSubTypeId, setWarning }} >
          <Portal open={data.open} btnType={data.btnType} text={data.text} type={data.type} onConfirm={onConfirm} confirm={confirm} onCancel={onCancel} closeConfirm={closeConfirm} />
          <NewPortal ref={warningRef}/>
          <ConfirmationToaster open={toasterData.open} btnType={toasterData.btnType} text={toasterData.text} type={toasterData.type} tittle={toasterData.tittle} onConfirm={onConfirm} confirm={newConfirm} onCancel={onCancel} closeConfirm={closeConfirm} />
          <ToastContainer theme="colored" />
          <Component {...pageProps} />
        </globalContext.Provider>
      </Auth0Provider>
    </Provider>
  );
 
}
 
export default MyApp
 
 