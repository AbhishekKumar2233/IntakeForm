import { useState, createRef, useEffect } from 'react';
import Tophead from '../../components/paralLegalComponent/header/tophead';
import { useScreenshot } from 'use-react-screenshot';
import { connect } from 'react-redux';
import ParalegalList from '../../components/paralLegalComponent/ParalegalList/ParalegalList'
import Head from 'next/head';
import { $CommonServiceFn } from '../../components/network/Service';
import { $Service_Url } from '../../components/network/UrlPath';
import { accessToParalegal, logoutUrl } from '../../components/control/Constant';
import withAuth from '../../components/WithPermisson/withPermisson';
import CustomeIdleTimer from '../../components/TimerHandler/CustomeIdleTimer';




const Index = (props) => {
  const ref = createRef(null)
  const [image, takeScreenshot] = useScreenshot()
  const [validUser, setValidUser] = useState(false);
  const [enquiryShow, setEnquiryMemberShow] = useState(false)


  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
      const params = `${stateObj?.userId}/${stateObj?.appState}/${stateObj?.loggenInId}/${stateObj?.roleId}/`

      $CommonServiceFn.InvokeCommonApi("GET", $Service_Url.getAthenticatePath + params,
        "", (response, error) => {
          if (response) {
            console.log("authenticated");
            if (response.status == 200) {
              setValidUser(true);
            }
          }
          else if (error) {
            redirectToLogin(redirectToLogin)
          }
        })
    }

    return () => {
      isMounted = false;
    }
  }, [])


  const redirectToLogin = () => {
    window.location.replace(`${logoutUrl}Account/Signin?expired=true`);
  }



  const getImage = () => {
    takeScreenshot(ref.current)

  }
  return (
    <div ref={ref} className='bg-white'>
      <Head>
        <title>Aging Options</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      < div className={
        (props.showloader ? "overlay bg-white" : "")
      } >
        {props.showloader == true &&
          (
            <div className="spinner-border text-primary blockuiloader"
              id="spinner" role="status">
              <span className="sr-only"></span>
            </div>
          )}

        <CustomeIdleTimer />
        <Tophead getImage={getImage} image={image} page={enquiryShow ? 'Inquiry' : 'Paralegal'} />

        <div className=" p-4 " style={{
          zIndex: 0,
          // position: "fixed",
          width: "100%",
          // top: "34px",
          backgroundColor: "white"
        }}>

          <ParalegalList setEnquiryMemberShow={setEnquiryMemberShow} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state.main
});

export default withAuth(connect(mapStateToProps, "")(Index), accessToParalegal);
