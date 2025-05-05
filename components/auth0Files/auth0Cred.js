
export const auth0CredDev =  {
  "domain": "betalogin.agingoptions.com",
  "clientId": "tkY2Hy2NIjjncPBN4b4KYmEQ5P6CpMJu",
  "clientSecret": "gsqE4xjDcIiLR3FU3tasBoNu1E2dIfBAWUwz9o6Gic54YJ3rdvUoUnr3_1v2-mjA",
  "callbackUrl": "http://localhost:3000",
  "realm": "Username-Password-Authentication",
  // "apiAudience": "https://betalogin.agingoptions.com/api/v2/",
  "apiAudience": "https://aostg.us.auth0.com/api/v2/",
  "scope": "openid profile email offline_access",
  "responseType": "token id_token",
  "responseMode": "form_post"
}

// Production
export const auth0Cred = {
  "domain": "login.agingoptions.com",
  "clientId": "FAxHNQMLuCSwVC1upmi102fnmdilj2OF",
  "callbackUrl": "http://localhost:3000",
  "clientSecret":"b1qzsji8uO5bTmSYG9VrU1A-W7DlrqbuFN2DGlv_AZopQuooDhvi59OJDok1XjOR",
  "realm": "Username-Password-Authentication",
  // "apiAudience": "https://login.agingoptions.com/api/v2/",
  "apiAudience": "https://agingoptions-sso.us.auth0.com/api/v2/",
  "scope": "openid profile email offline_access",
  "responseType": "token id_token",
  "responseMode": "form_post"
}
export const lagecyauth0Cred = {
  "domain": "login.agingoptions.com",
  "clientID": "FAxHNQMLuCSwVC1upmi102fnmdilj2OF",
  "responseType": "token id_token",
  "redirectUri": "https://www.agingoptions.com/login?redirectUrl=agingoptions.com/MyPortal/",
  "scope": "openid profile email offline_access"
}

