import React, { useEffect, useState } from 'react';
import ActivationForm from '../component/Activation-Form/ActivationForm';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import { SET_LOADER } from '../components/Store/Actions/action';
import { Container } from 'react-bootstrap';
import konsole from '../components/control/Konsole';
import { logoutUrl } from '../components/control/Constant';
import CustomeIdleTimer from '../components/TimerHandler/CustomeIdleTimer';

const Activationform = ({ showloader, dispatchloader }) => {
  const [loginUserDetail, setloginUserDetail] = useState('');
  const [authorization, setauthorization] = useState('');
  const [activationform, setActivationform] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      let loginUserDetail = sessionStorage.getItem('userDetailOfPrimary');
      let authorization = sessionStorage.getItem('AuthToken');
      redirectToLogin(authorization);
      setloginUserDetail(JSON.parse(loginUserDetail));
      setauthorization(authorization);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let activationformm = sessionStorage.getItem('activateform');
    console.log('activationformmactivationformm',activationformm,Boolean(activationformm))
    // setActivationform(activationformm);
    if (activationformm == 'true') {
      dashBoardRoute();
    }
  }, []);

  const redirectToLogin = (authenicate) => {
    if (!authenicate) {
      window.location.replace(`${logoutUrl}Account/Signin?expired=true`);
    }
  };

  const dashBoardRoute = () => {
    // sessionStorage.setItem('activateform', true);
    Router.push({
      pathname: './dashboard',
      search: '?query=',
    });
  };

  return (
    <>
      <Head>
        <title>Aging Options</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

<CustomeIdleTimer />
      {authorization ? (
        <div className={showloader ? 'overlay' : ''}>
          {showloader && (
            <div className="spinner-border text-primary blockuiloader" id="spinner" role="status">
              <span className="sr-only"></span>
            </div>
          )}

           <ActivationForm />
        </div>
      ) : (
        <Container></Container>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({ ...state.main });

const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) => dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activationform);
