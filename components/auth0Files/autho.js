
import { demo } from '../control/Constant';
import auth0 from 'auth0-js'


import { auth0Cred, auth0CredDev,lagecyauth0Cred  } from './auth0Cred';

function auth0Config() {
    const auth0CredLocal =  (demo)? auth0CredDev: auth0Cred; 
    let auth0Config = new auth0.WebAuth({
        domain: auth0CredLocal.domain,
        clientID: auth0CredLocal.clientId,
        responseType: auth0CredLocal.responseType,
        redirectUri: window.location.origin,
        scope: auth0CredLocal.scope
    });

    return auth0Config;
}

function auth0Config_Legacy() {

    let auth0Config_Legacy = new auth0.WebAuth({
        domain:lagecyauth0Cred.domain,
        clientID:lagecyauth0Cred?.clientID,
        responseType:lagecyauth0Cred?.responseType,
        redirectUri:lagecyauth0Cred?.redirectUri,
        scope:lagecyauth0Cred?.scope
    })

    return auth0Config_Legacy;
}

export { auth0Config, auth0Config_Legacy}
