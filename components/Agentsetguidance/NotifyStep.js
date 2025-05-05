import React, { useState, useEffect, useContext } from 'react'
import { $CommonServiceFn } from '../network/Service'
import { $Service_Url } from '../network/UrlPath'
import konsole from '../control/Konsole'
import { Form, Row, Col } from 'react-bootstrap'
import Select from "react-select";
import { globalContext } from '../../pages/_app'
import { connect } from 'react-redux'
import { SET_LOADER } from '../Store/Actions/action';
import AlertToaster from '../control/AlertToaster'
import { $AHelper } from '../control/AHelper'
import { deceaseMemberStatusId } from '../Reusable/ReusableCom'
const NotifyStep = (props) => {
  let memberUserId = props.memberUserId
  const { setdata } = useContext(globalContext)
  const context = useContext(globalContext)

  //state define------------------------------------------------------------------------


  const [primaryUserId, setprimaryUserid] = useState('')
  const [spouseUserId, setspouseUserid] = useState('')
  const [loggesuserId, setLoggeduserId] = useState('')

  const [familyMemberId, setFamilyMemberId] = useState("");
  const [familyMemberName, setFamilyMemberName] = useState([]);
  konsole.log('familyMemberNamefamilyMemberName', familyMemberName)
  const [professionalUserId, setprofessionalUserId] = useState("");
  const [professionalUserName, setProfessionalUserName] = useState([]);
  konsole.log('professionalUserNameprofessionalUserName', professionalUserName)
  const [notifyMemId, setNotifyMemId] = useState("");
  const [notifyMemIdtext, setNotifyMemIdtext] = useState("");
  const [notifyMemId2, setNotifyMemId2] = useState("");
  const [notifyMemId2text, setNotifyMemId2text] = useState("");
  const [contactmapIdFamily, setcontactmapIdFamily] = useState([]);
  const [contactmapIdProfess, setcontactmapIdProfess] = useState([]);
  const [familyMemberGetapi, setFamilyMemberGetapi] = useState([]);
  const [professionalGetapi, setProfessionalGetapi] = useState([]);
  const [familycreated, setFamilycreated] = useState([]);
  const [value, setValue] = useState(1);
  const [value2, setValue2] = useState(1);
  const [curselected, setCurselected] = useState([]);
  const [famselected, setFamselected] = useState([]);
  const [emailfam, setEmailfam] = useState();
  const [textfam, setTextfam] = useState();
  const [emailpro, setEmailpro] = useState();
  const [textpro, setTextpro] = useState();

  const [professionalUsers, setProfessionalUser] = useState([]);
  const [familyMember, setFamilyMember] = useState([]);

  const [familyNoify, setFamilynotify] = useState('')
  const [professNoify, setProfessnotify] = useState('')
  const [sameForspouse,setSameforspouse] = useState(false);
  const [showSpouseCheck,setShowspouseCheck] = useState(true)
  //------------------------------------------------------------------------------------
  const options = [{ label: "Email", value: 1, }, { label: "Text", value: 2, },];

  //useEffecect--------------------------------------------------------------------------------------------
  konsole.log(props,"propspropspropsprops")
  useEffect(() => {
    let primaryuserid = sessionStorage.getItem('SessPrimaryUserId')
    let spouseuserid = sessionStorage.getItem('spouseUserId')
    let logedInuserid = sessionStorage.getItem('loggedUserId')
    setprimaryUserid(props.memberUserId)
    setspouseUserid(spouseuserid)
    setLoggeduserId(logedInuserid)
    let userDetailOfPrimary = JSON.parse(sessionStorage.getItem('userDetailOfPrimary'))
    konsole.log("iiiiiiiiiiiiiiiiiiiiiii", memberUserId, primaryuserid, userDetailOfPrimary?.memberName, userDetailOfPrimary?.spouseName)
    let userName = (memberUserId == primaryuserid) ? $AHelper.capitalizeAllLetters(userDetailOfPrimary?.memberName) : $AHelper.capitalizeAllLetters(userDetailOfPrimary?.spouseName)
    let illnessText = `We are sorry to report that ${userName}'s health condition is not well now.We join you in your prayers for a quick recovery of ${userName} health.`
    let eofText = `We are sorry to be the bearers of sad news, but ${userName}'s health condition is very serious. This is an intimation of this condition, we join you in your prayer for ${userName} and request you to give your valuable time to ${userName} Last moments.`
    let mentalhealthText = `We are writing to let you know that ${userName} is dealing with a mental illness, hence unable to make a rational decision. We are praying for a quick recovery. We will keep you updated.`
    let deathText = `We are sorry to be the bearers of sad news, but ${userName} passed away. This is an intimation mail and we wish you all the strength to cope with this tragic loss`

    let textmessage = (props.id == 1 ? illnessText : props.id == 2 ? eofText : props.id == 4 ? mentalhealthText : deathText)

    setFamilynotify(textmessage)

    setProfessnotify(textmessage)

    setFamilyMemberName()
    setFamselected()
    setProfessionalUserName()
    setCurselected()
    setFamselected()
    setEmailpro()
    setTextpro()
    setEmailfam()
    setTextfam()
    setNotifyMemId2()
    setNotifyMemId()

    //--------------------------------
    professionalapi(props.memberUserId,primaryuserid);
    familynotify1(props.memberUserId)
    familynotify2(props.memberUserId)
    professnotify1(props.memberUserId);
    professnotify2(props.memberUserId)
    familyMemberapi(primaryuserid);
    //-----------------------
  }, [props.memberUserId])


  // use Effct for Enmail and text


  //useEffect method api call -----------------------------------------------------------------------------
  const professionalapi = (userId,primaryuserId) => {
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getSearchProfessional + `?MemberUserId=${userId}&ProTypeId=&primaryUserId=${primaryuserId}`, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getProfessionalByUserIdres', res.data.data)
        let responseData = res.data.data
        setProfessionalUser(responseData);
        notifyCondition2(responseData, userId);
      } else {
        konsole.log("getProfessionalByUserIderr", err)
      }
    })
  };
  const notifyCondition2 = (professionallist, userId) => {
    var contactNatureId = 2;
    let notifyConditionId = props.id;
    props.dispatchloader(true)

    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyContact + userId + '/' + contactNatureId + '/' + notifyConditionId, '', (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyContact', res)
        var arr = [];
        var arr2 = [];
        var arr3 = [];
        var arr4 = [];
        for (let i = 0; i < res.data.data.length; i++) {
          arr3.push(res.data.data[i]);
          const userName = professionallist.filter((list) => {
            return list.professionalUserId == res.data.data[i].contactUserId;
          });
          if (userName.length > 0) {
            arr.push(userName[0].fName + " " + userName[0].lName);
          }
          arr2.push(res.data.data[i].contactMapId);
          arr4.push(res.data.data[i].contactUserId);
        }

        let responseData = res.data.data
        let newArray = []
        for (let [index, item] of responseData.entries()) {
          for (let i = 0; i < professionallist.length; i++) {
            if (professionallist[i].professionalUserId == item.contactUserId) {
              newArray.push({ ...professionallist[i], ...item })
            }
          }
        }

        setcontactmapIdProfess(arr2);
        setProfessionalUserName(newArray);
        setProfessionalGetapi(arr3);
        setShowspouseCheck(false)
      } else {
        konsole.log('getNotifyContact', err)
      }
    })
  }

  const familyMemberapi = (userId) => {
    konsole.log('useriduserid', userId)
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMembers + userId, '', (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getFamilyMembers', res)
        let spouseuserid = sessionStorage.getItem('spouseUserId')
        let dataFilter1 = $AHelper.deceasedNIncapacititedFilterFun(res?.data?.data)
        konsole.log('get family member data ', dataFilter1, res?.data?.data)
        if (memberUserId == spouseuserid) {
          props.dispatchloader(true)
          $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getFamilyMembers + spouseuserid, '', (response, err) => {
            let data = dataFilter1
            let responseData = $AHelper.deceasedNIncapacititedFilterFun(response?.data?.data)
            konsole.log('get family member data ', responseData, response?.data?.data)
            let spousedata = responseData?.filter((e) => { return e.userId == userId })
            data.unshift(spousedata)
            let familydata = data?.flat()?.filter((e) => { return e.userId != spouseuserid })
            konsole.log(familydata, data.flat(), memberUserId, responseData, responseData, "memberUserIdspouseUserIdfamilydata")
            setFamilyMember(familydata);
            notifyCondition(familydata, spouseuserid)
            props.dispatchloader(false)
          })
        } else {
          setFamilyMember(dataFilter1);
          notifyCondition(dataFilter1, userId);
        }
      } else {
        konsole.log('getFamilyMembers', err)
      }
    })
  };

  const notifyCondition = (familyList, userId) => {
    var contactNatureId = 1;
    let notifyConditionId = props.id;
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyContact + userId + '/' + contactNatureId + '/' + notifyConditionId, '', (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyContactfamily', res)
        let responseData = res.data.data
        konsole.log('responseData', responseData, familyList)
        let newArray = []
        for (let [index, item] of responseData.entries()) {
          for (let i = 0; i < familyList.length; i++) {
            if (familyList[i].userId == item.contactUserId) {
              newArray.push({ ...familyList[i], ...item })
            }
          }
        }
        konsole.log('newArraynewArray', newArray)

        var arr = [];
        var arr2 = [];
        var arr3 = [];
        var arr4 = [];
        konsole.log('arrarrarr', arr.flat(1))

        for (let i = 0; i < res.data.data.length; i++) {
          arr3.push(res.data.data[i]);
          const userName = familyList.filter((list) => {
            return list.userId == res.data.data[i].contactUserId;
          });
          const userName2 = familyList.filter((list) => {
            return list.userId !== res.data.data[i].contactUserId;
          });
          if (userName.length > 0) {
            let obj = [
              userName[0].fName + " " + userName[0].lName,
              userName[0]
            ]
            arr.push(...obj.flat(1));
          }
          arr4.push(res.data.data[i]);
        }

        setcontactmapIdFamily(arr2);
        setFamilyMemberName(newArray);
        setFamilyMemberGetapi(arr3);
        setShowspouseCheck(false)
      } else {
        konsole.log('getNotifyContactfamily', err)
      }
    })

  }
  const familynotify1 = (userId) => {
    var contactNatureId = 1;
    let notifyConditionId = props.id;
    let notifyTypeId = 1;
    setEmailfam();
    setTextfam();
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyMessage + userId + '/' + notifyTypeId + '/' + contactNatureId + '/' + notifyConditionId, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyMessage1', res)
        let responseData = res.data.data
        setEmailfam(responseData);
        setFamilycreated(responseData[0].createdOn);
        setNotifyMemId(responseData[0].notifyMemId);
      } else {
        konsole.log('getNotifyMessage1', err)
      }
    })


  }

  const familynotify2 = (userId) => {
    var contactNatureId = 1;
    let notifyConditionId = props.id;
    let notifyTypeId = 1;
    let createdOn1;
    let createdOn3;
    let createdOn2 = [];
    let notifyTypeId2 = 2;
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyMessage + userId + '/' + notifyTypeId2 + '/' + contactNatureId + '/' + notifyConditionId, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyMessage2', res)
        let responseData = res.data.data
        setTextfam(responseData);
        setNotifyMemIdtext(responseData[0].notifyMemId);
      } else {
        konsole.log('getNotifyMessage2', err)
      }
    })


  }

  const professnotify1 = (userId) => {
    var contactNatureId = 2;
    let notifyConditionId = props.id;

    let createdOn21;
    let createdOn22 = [];

    function createdon21(data) {
      var dataNew = [];
      dataNew.push(data);
      createdOn21 = dataNew;
      konsole.log("aaazzzsssxxxx2", memberUserId, dataNew);
    }
    let notifyTypeId = 1;
    console.log("Hiiiiiaaaaa")
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyMessage + userId + '/' + notifyTypeId + '/' + contactNatureId + '/' + notifyConditionId, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyMessagereserrprofessnotify1', res)
        let responseData = res.data?.data
        setEmailpro(responseData);
        createdon21(responseData[0]);
        setNotifyMemId2(responseData[0].notifyMemId);
      } else {
        konsole.log('getNotifyMessagereserrprofessnotify1', err)
      }
    })


  }

  const professnotify2 = (userId) => {
    var contactNatureId = 2;
    let notifyConditionId = props.id;
    let notifyTypeId = 2;
    props.dispatchloader(true)
    $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getNotifyMessage + userId + '/' + notifyTypeId + '/' + contactNatureId + '/' + notifyConditionId, "", (res, err) => {
      props.dispatchloader(false)
      if (res) {
        konsole.log('getNotifyMessagereserrprofessnotify2', res)
        let responseData = res.data?.data
        setTextpro(responseData);
        setNotifyMemId2text(responseData[0].notifyMemId);
      } else {
        konsole.log('getNotifyMessagereserrprofessnotify2', err)
      }
    })


  }


  //Multiselect-----------------------------------
  const [familyMemberMulti, setfamilyMemberMulti] = useState()

  const onChangeSelect = (e) => {
    konsole.log(e, "riuieurieureiui")
    setFamilyMemberName(e);

    setFamilyMemberId(e);
  };
  const onChangeSelectprofessional = (e) => {
    setProfessionalUserName(e)
    // setFamilyMemberId(e)
    setprofessionalUserId(e)
  }
  konsole.log('famselectedfamselected', famselected)
  const onChangefam = (e) => {
    if (e.target.checked) {
      setFamselected(oldArray => [...oldArray, parseInt(e.target.value)])
    } else if (famselected.includes(parseInt(e.target.value))) {
      var data = famselected.filter((d) => { return d != e.target.value })
      setFamselected(data)
    }
  };
  const onChangeprofess = (e) => {
    if (e.target.checked) {
      setCurselected(oldArray => [...oldArray, parseInt(e.target.value)])
    } else if (curselected.includes(parseInt(e.target.value))) {
      var data = curselected.filter((d) => { return d != e.target.value })
      setCurselected(data)
    }
  };
  //konsole---------------------------------------------------------
  konsole.log('familyMember', familyMember)
  useEffect(() => {
    setFamselected([]);
    if (emailfam && textfam) {
      function gfg_Run(date) {
        var Str =
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "/" +
          ("00" + date.getDate()).slice(-2) +
          "/" +
          date.getFullYear() +
          " " +
          ("00" + date.getHours()).slice(-2) +
          ":" +
          ("00" + date.getMinutes()).slice(-2) +
          ":" +
          ("00" + date.getSeconds()).slice(-3);

        return Str;
      }

      var t1 = gfg_Run(
        new Date(
          emailfam[0]?.updatedOn == "0001-01-01T00:00:00"
            ? emailfam[0]?.createdOn
            : emailfam[0]?.updatedOn
        )
      );
      var t2 = gfg_Run(
        new Date(
          textfam[0]?.updatedOn == "0001-01-01T00:00:00"
            ? textfam[0]?.createdOn
            : textfam[0]?.updatedOn
        )
      );

      konsole.log(t1 == t2, emailfam[0], textfam[0], familyMemberName, "familytimenew");
      if (familyMemberName?.length > 0) {
        if (t1 > t2) {
          setFamselected([1]);
          setFamilynotify(emailfam[0]?.notifyText);
        }

        if (t2 > t1) {
          setFamselected([2]);
          setFamilynotify(textfam[0]?.notifyText);
        }
        if (t1 == t2) {
          setFamselected([1, 2]);
          setFamilynotify(textfam[0]?.notifyText);
        }
      } else {
        setFamselected([]);
        setFamilynotify(textfam[0]?.notifyText);
      }
    } else if (emailfam && !textfam) {
      setFamselected([1]);
      setFamilynotify(emailfam[0]?.notifyText);
    } else if (textfam && !emailfam) {
      setFamselected([2]);
      setFamilynotify(textfam[0]?.notifyText);
    }
    konsole.log(famselected, emailfam, textfam, familyMemberName, "5784578458475j4")
  }, [emailfam, textfam, familyMemberName, props.memberUserId]);

  useEffect(() => {
    calltextemail()
  }, [emailpro, textpro, professionalUserName, props.memberUserId]);

  const calltextemail = () => {
    setCurselected([]);

    if (emailpro && textpro) {
      function gfg_Run(date) {
        var Str =
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "/" +
          ("00" + date.getDate()).slice(-2) +
          "/" +
          date.getFullYear() +
          " " +
          ("00" + date.getHours()).slice(-2) +
          ":" +
          ("00" + date.getMinutes()).slice(-2) +
          ":" +
          ("00" + date.getSeconds()).slice(-3);

        return Str;
      }

      var t1 = gfg_Run(
        new Date(
          emailpro[0]?.updatedOn == "0001-01-01T00:00:00"
            ? emailpro[0]?.createdOn
            : emailpro[0]?.updatedOn
        )
      );
      var t2 = gfg_Run(
        new Date(
          textpro[0]?.updatedOn == "0001-01-01T00:00:00"
            ? textpro[0]?.createdOn
            : textpro[0]?.updatedOn
        )
      );

      konsole.log(t1, t2, emailpro[0], textpro[0], professionalUserName, "professnew");
      if (professionalUserName?.length > 0) {
        if (t1 > t2) {
          setCurselected([1]);
          setProfessnotify(emailpro[0]?.notifyText);
        }

        if (t2 > t1) {
          setCurselected([2]);
          setProfessnotify(textpro[0]?.notifyText);
        }
        if (t1 == t2) {
          setCurselected([1, 2]);
          setProfessnotify(textpro[0]?.notifyText);
        }
      } else {
        setCurselected([]);
        setProfessnotify(textpro[0]?.notifyText);
      }
      konsole.log("professsss1");
    } else if (emailpro && !textpro) {
      setCurselected([1]);
      setProfessnotify(emailpro[0]?.notifyText);
      konsole.log("professsss2");
    } else if (textpro && !emailpro) {
      setCurselected([2]);
      setProfessnotify(textpro[0]?.notifyText);
      konsole.log("professsss3");
    }
  }

  function arr_diff(a1, a2) {
    var a = [],
      diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  }


  // save Information ---------------------------------------------------------------------------------------------------
  const onSavebtn = async () => {
    var dataObj1 = famselected.map((selectprof) => {
      if (selectprof == 1) {
        return {
          notifyMemId: notifyMemId ? notifyMemId : 0,
          primaryMemId: memberUserId,
          notifyTypeId: selectprof,
          contactNatureId: 1,
          notifyConditionId: props.id,
          notifyText: familyNoify,
          isActive: true,
          upsertedBy: loggesuserId,
        }
      }
      if (selectprof == 2) {
        return {
          notifyMemId: notifyMemIdtext ? notifyMemIdtext : 0,
          primaryMemId: memberUserId,
          notifyTypeId: selectprof,
          contactNatureId: 1,
          notifyConditionId: props.id,
          notifyText: familyNoify,
          isActive: true,
          upsertedBy: loggesuserId,
        }
      }


    });



    var dataObj2 = curselected.map((selectprof) => {
      konsole.log(selectprof, "selectprof");
      if (selectprof == 1) {
        return {
          notifyMemId: notifyMemId2 ? notifyMemId2 : 0,
          primaryMemId: memberUserId,
          notifyTypeId: selectprof,
          contactNatureId: 2,
          notifyConditionId: props.id,
          notifyText: professNoify,
          isActive: true,
          upsertedBy: loggesuserId,
        }
      }
      if (selectprof == 2) {
        return {
          notifyMemId: notifyMemId2text ? notifyMemId2text : 0,
          primaryMemId: memberUserId,
          notifyTypeId: selectprof,
          contactNatureId: 2,
          notifyConditionId: props.id,
          notifyText: professNoify,
          isActive: true,
          upsertedBy: loggesuserId,
        }
      }
    });

    const dataObj = [...dataObj1, ...dataObj2];

    konsole.log(dataObj, "dataObj");

    // professionalGetapi

    var arr;
    const contactdata = [];
    const contactdataprofess = [];
    const removearr = [];


    var arr = [];
    var arrgetid = [];
    var professuser = [];
    var professgetid = [];


    konsole.log("familyMemberUd", "familyMemberName", familyMemberName, "familyMemberGetapi", familyMemberGetapi);

    if (familyMemberId.length != 0) {
      familyMemberId.forEach((e) => {
        arr.push(e.value);
      });
    }

    if (familyMemberGetapi.length != 0) {
      familyMemberGetapi.forEach((e) => {
        arrgetid.push(e.contactUserId);
      });
    }

    if (professionalUserId.length != 0) {
      professionalUserId.forEach((e) => {
        professuser.push(e.value);
      });
    }
    if (professionalGetapi.length != 0) {
      professionalGetapi.forEach((e) => {
        professgetid.push(e.contactUserId);
      });
    }
    // const familygetuserid = arrgetid.contactUserId

    var removedId = arr_diff(arrgetid, arr);
    var removedIdProfess = arr_diff(professgetid, professuser);

    let removearray;




    if (familyMemberName?.length == 0 && famselected?.length == 0) {
      for (i = 0; i < familyMemberGetapi?.length; i++) {
        arr = [
          {
            contactMapId: familyMemberGetapi[i]?.contactMapId,
            primaryMemberId: memberUserId,
            contactNatureId: 1,
            contactUserId: familyMemberGetapi[i]?.contactUserId,
            notifyConditionId: props.id,
            contactStatus: false,
            upsertedBy: loggesuserId,
          },
        ];
        removearr.push(arr);
        konsole.log("arr", arr);
      }
    }

    if (professionalUserName?.length == 0 && curselected?.length == 0) {
      for (i = 0; i < professionalGetapi?.length; i++) {
        arr = [
          {
            contactMapId: professionalGetapi[i]?.contactMapId,
            primaryMemberId: memberUserId,
            contactNatureId: 1,
            contactUserId: professionalGetapi[i]?.relativeUserId,
            notifyConditionId: props.id,
            contactStatus: false,
            upsertedBy: loggesuserId,
          },
        ];
        removearr.push(arr);
        konsole.log("arr1", professionalGetapi, arr);
      }
    }

    if (removedId.length != 0 && familyMemberId.length != 0 && removedIdProfess.length != 0 && professionalUserId.length != 0) {
      for (var i = 0; i < removedId?.length; i++) {
        for (var x = 0; x < familyMemberGetapi?.length; x++) {
          if (removedId[i] == familyMemberGetapi[x]?.contactUserId) {
            arr = [
              {
                contactMapId: familyMemberGetapi[x]?.contactMapId,
                primaryMemberId: memberUserId,
                contactNatureId: 1,
                contactUserId: removedId[i],
                notifyConditionId: props.id,
                contactStatus: false,
                upsertedBy: loggesuserId,
              },
            ];
            removearr.push(arr);
          }
        }
      }
      for (var i = 0; i < removedIdProfess?.length; i++) {
        for (var x = 0; x < professionalGetapi?.length; x++) {
          if (removedIdProfess[i] == professionalGetapi[x]?.contactUserId) {
            // console.log(familyMemberGetapi[x].contactMapId,removedId[i],"new member")
            arr = [
              {
                contactMapId: professionalGetapi[x]?.contactMapId,
                primaryMemberId: memberUserId,
                contactNatureId: 2,
                contactUserId: removedIdProfess[i],
                notifyConditionId: props.id,
                contactStatus: false,
                upsertedBy: loggesuserId,
              },
            ];

            removearr.push(arr);
          }
          konsole.log(removearr, "removearr");
        }
      }
    } else if (removedId?.length != 0 && familyMemberId?.length != 0) {
      for (var i = 0; i < removedId?.length; i++) {
        for (var x = 0; x < familyMemberGetapi?.length; x++) {
          if (removedId[i] == familyMemberGetapi[x]?.contactUserId) {
            arr = [
              {
                contactMapId: familyMemberGetapi[x]?.contactMapId,
                primaryMemberId: memberUserId,
                contactNatureId: 1,
                contactUserId: removedId[i],
                notifyConditionId: props.id,
                contactStatus: false,
                upsertedBy: loggesuserId,
              },
            ];
            removearr.push(arr);
          }
          konsole.log(removearr, "removearr");
        }
      }
    } else if (removedIdProfess?.length != 0 && professionalUserId?.length != 0) {
      for (var i = 0; i < removedIdProfess?.length; i++) {
        for (var x = 0; x < professionalGetapi?.length; x++) {
          if (removedIdProfess[i] == professionalGetapi[x]?.contactUserId) {
            // console.log(familyMemberGetapi[x].contactMapId,removedId[i],"new member")
            arr = [
              {
                contactMapId: professionalGetapi[x]?.contactMapId,
                primaryMemberId: memberUserId,
                contactNatureId: 2,
                contactUserId: removedIdProfess[i],
                notifyConditionId: props.id,
                contactStatus: false,
                upsertedBy: loggesuserId,
              },
            ];

            removearr.push(arr);
          }
        }
      }
    } else {
      arr = [];
      removearr.push(arr);
    }



    if (familyMemberId?.length == 0 && professionalUserId?.length != 0) {
      for (var i = 0; i < (professionalUserId?.length || contactmapIdProfess?.length); i++) {
        arr = [
          {
            contactMapId: 0,
            primaryMemberId: memberUserId,
            contactNatureId: 2,
            contactUserId: professionalUserId[i]?.professionalUserId,
            notifyConditionId: props.id,
            contactStatus: true,
            upsertedBy: loggesuserId,
          },
        ];

        konsole.log(arr, professionalUserId, "arr2");
        contactdataprofess.push(arr);
        // console.log(contactdata, "arr2");
      }
    } else if (familyMemberId?.length != 0 && professionalUserId?.length == 0) {
      for (var i = 0; i < (familyMemberId?.length || contactmapIdFamily?.length); i++) {
        arr = [
          {
            contactMapId: 0,
            primaryMemberId: memberUserId,
            contactNatureId: 1,
            contactUserId: familyMemberId[i]?.userId,
            notifyConditionId: props.id,
            contactStatus: true,
            upsertedBy: loggesuserId,
          },
        ];
        contactdata.push(arr);
        // console.log(contactdata, "arr2");
      }
    } else if (familyMemberId?.length != 0 && professionalUserId?.length != 0) {
      for (var i = 0; i < (familyMemberId?.length || contactmapIdFamily?.length); i++) {
        arr = [
          {
            contactMapId: 0,
            primaryMemberId: memberUserId,
            contactNatureId: 1,
            contactUserId: familyMemberId[i]?.userId,
            notifyConditionId: props.id,
            contactStatus: true,
            upsertedBy: loggesuserId,
          },
        ];
        contactdata.push(arr);
        // console.log(contactdata, "arr2");
      }
      for (var i = 0; i < (professionalUserId?.length || contactmapIdProfess?.length); i++) {
        arr = [
          {
            contactMapId: 0,
            primaryMemberId: memberUserId,
            contactNatureId: 2,
            contactUserId: professionalUserId[i]?.professionalUserId,
            notifyConditionId: props.id,
            contactStatus: true,
            upsertedBy: loggesuserId,
          },
        ];

        contactdataprofess.push(arr);
        // console.log(contactdata, "arr2");
      }
    }

    // konsole.log("familyMemberUd", "familyMemberName", familyMemberName, "famselected", famselected, "arr", arr, "contactdata", contactdata);

    const familyArr = contactdata?.flat(1);
    const professArr = contactdataprofess?.flat(1);

    console.log("FlattenArrayPost", familyArr, professArr)

    let newArrfamily = familyArr.filter((e) => {
      return !familyMemberGetapi.some((object) => {
        return object?.contactUserId == e?.contactUserId;
      });
    });
    // console.log("newArrf", newArrfamily);
    let newArrContact = professArr?.filter((e) => {
      return !professionalGetapi?.some((object) => {
        return (
          object?.contactUserId == e?.contactUserId &&
          object?.contactNatureId == e?.contactNatureId
        );
      });
    });
    // console.log("professArr", professArr);

    console.log("FlattenArrayPost", newArrContact, newArrfamily)

    let postapidata = [...newArrfamily, ...newArrContact];
    console.log("newArrAll", postapidata);
    const FinalArr = [...removearr, ...postapidata];
    const FlattenArray = FinalArr?.flat(1);

    konsole.log("FlattenArray next", familyMemberName, famselected, professionalUserName, curselected);
    // calling the function
    // passing array argument

    if (familyMemberName?.length == 0 && famselected?.length != 0) {
      toasterAlert("Please Select From Friends and Family Contacts")
    } else if (familyMemberName?.length != undefined && familyMemberName?.length != 0 && famselected?.length == 0) {
      toasterAlert("Please select notify type");
    } else if (professionalUserName?.length == 0 && curselected?.length != 0) {
      toasterAlert("Please Select From Professional Contacts");
    } else if ((familyMemberName?.length != undefined && familyMemberName?.length != 0 && famselected?.length == 0) || (professionalUserName?.length != undefined && professionalUserName?.length != 0 && curselected?.length == 0)) {
      toasterAlert("Please select notify type");
    } else if (familyMemberName?.length > 0 && handleDataForSelectFamilyContact(familyMember, familyMemberName, 'Validate')?.length > 0) {
      toasterAlert("You need to remove deceased persons from the family and friends contact list.");
    } else {

      konsole.log('dataObjdataObjdataObjdataObj', dataObj)
      let dataObj2 = dataObj?.map((e)=>{return{...e,primaryMemId:spouseUserId}})
      let flattenArray2 = FlattenArray?.map((e)=>{return{...e,primaryMemberId:spouseUserId}})
      if(sameForspouse){
        props.dispatchloader(true)
        if(dataObj2?.length > 0){
        await callAPi($Service_Url.postNofityMessage, dataObj2);
        }
        if(flattenArray2?.length > 0){
        await callAPi($Service_Url.postcontactmap, flattenArray2);
        }
        props.dispatchloader(false)
        konsole.log(dataObj2,flattenArray2,"dataObj2dataObj2dataObj2dataObj2dataObj2")
      }
      props.dispatchloader(true)
      if(dataObj?.length > 0){
      await callAPi($Service_Url.postNofityMessage, dataObj);
      }

      if(FlattenArray?.length > 0){
      await callAPi($Service_Url.postcontactmap, FlattenArray);
      }
      props.dispatchloader(false)
      AlertToaster.success("Data saved successfully");
      props?.setStepperNo(props.stepperNo + 1)

      // window.location.reload(); 


    }
  };


  async function callAPi(url, postdata) {
    return await new Promise((resolve, reject) => {
      $CommonServiceFn.InvokeCommonApi("POST", url, postdata, ((res, err) => {
        if (res) {
          konsole.log(res, "contactres")
          resolve("done");
        } else {
          konsole.log(err, "constacterr")
          resolve("reject");
        }
      }))
    })
  }



  const handleDataForSelectFamilyContact = (data, familyMemberName, type) => {
    let _validFamilyMemberData = data?.filter(({ memberStatusId }) => memberStatusId != deceaseMemberStatusId)
    let deceasedMember = []
    if (familyMemberName?.length > 0) {
      const deceaseMembers = familyMemberName?.filter((secondUser) => !_validFamilyMemberData?.some((firstUser) => firstUser?.userId == secondUser?.userId));
      konsole.log('missingUsersmissingUsers', deceaseMembers)
      if (deceaseMembers?.length > 0) {
        _validFamilyMemberData = [..._validFamilyMemberData, ...deceaseMembers];
        deceasedMember = deceaseMembers;
      }
    }

    let returnValue = _validFamilyMemberData
    if (type == 'Validate') {
      returnValue = deceasedMember
    }
    konsole.log('_validFamilyMemberData_validFamilyMemberData', _validFamilyMemberData)
    return returnValue
  }


  //warining----------------------------------------------------------------
  function toasterAlert(text) {
    setdata({ open: true, text: text, type: "Warning" });
  }

  //konsole----------------------------------------------------------------
  konsole.log(familyMemberName, famselected, "familyMemberNamefamilyMemberName")
  konsole.log('familyMemberNamefamilyMemberName', familyMemberName)
  konsole.log('curselectedcurselected', curselected)
  return (
    <>
      <Form.Group as={Row} className="mb-3">
        <Row className="flex-column">
          <Col xs sm="12" lg="12" id="financialMoreInfo1">
            <div>
              <h5 className='mb-2'>Select From Friends and Family Contacts</h5>
              <div className="d-flex">
                <Select
                  styles={{ width: 250 }}
                  isMulti
                  name="colors"
                  options={handleDataForSelectFamilyContact(familyMember, familyMemberName, 'map').map((data, index) => ({
                    ...data,
                    value: data.userId,
                    label: $AHelper.capitalizeAllLetters(data?.fName + " " + data?.lName)
                  }))}
                  value={familyMemberName?.length > 0 && familyMemberName.map((data, index, array) => ({
                    ...data,
                    value: data.userId,
                    label: $AHelper.capitalizeAllLetters(data?.fName + " " + data?.lName)
                  }))}
                  className="guidance-multi-select"
                  classNamePrefix="select"
                  placeholder="Please Select Family Contact"
                  onChange={onChangeSelect}
                />
              </div>

            </div>

          </Col>
        </Row>
        <Row className="flex-column mt-4">
          <Col xs sm="12" lg="12" id="financialMoreInfo1">
            <div>
              <h5>This is the Email/Text that will go to the selected people. Please
                compose or edit.</h5>
              <div className="d-flex mt-2">
                {options.map((item, index) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={item.label}
                      value={item.value}
                      className="checkbox-with-space"
                      onChange={onChangefam}
                      checked={famselected.includes(item.value)}
                    />
                  )
                })}


              </div>

            </div>
            <div className="mt-2 border  border-dark">
              <label className="e-float-text e-label-top text-muted px-2">
                Dear User,
              </label>
              <Form.Control
                as="textarea"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                rows={4}
                value={familyNoify}
                onChange={(e) => setFamilynotify(e.target.value)}
              />

            </div>
          </Col>
        </Row>
        <Row className="flex-column mt-4">
          <Col xs sm="12" lg="12" id="financialMoreInfo1">
            <div>
              <h5 className='mb-2'>Select From Professional Contacts</h5>
              <div className="d-flex">
                <Select
                  styles={{ width: 250 }}
                  // defaultValue={professionalUserName}
                  // onChange={onChangeProfess}
                  isMulti
                  name="colors"
                  options={professionalUsers?.map((data, index) => ({
                    ...data,
                    value: data?.professionalUserId,
                    label: $AHelper.capitalizeAllLetters(data.fName + " " + data.lName)
                  }))}
                  value={professionalUserName?.length > 0 && professionalUserName.map((data, index, array) => ({
                    ...data,
                    value: data.professionalUserId,
                    label: $AHelper.capitalizeAllLetters(data?.fName + " " + data?.lName)
                  }))}
                  className="guidance-multi-select"
                  classNamePrefix="select"
                  placeholder="Please Select Professional Contact"
                  onChange={onChangeSelectprofessional}
                >

                </Select>
              </div>

            </div>

          </Col>
        </Row>
        <Row className="flex-column mt-4">
          <Col xs sm="12" lg="12" id="financialMoreInfo1">
            <div>
              <h5>  This is the Email/Text that will go to the selected people. Please
                compose or edit.</h5>
              <div className="d-flex mt-2">
                {/* {options.map((item, index) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={item.label}
                      value={item.value}
                      className="checkbox-with-space"
                      onChange={onChangeprofess}
                    // defaultValue={curselected}
                    checked={item.value==curselected}
                    />
                  )
                })} */}
                {options.map((item, index) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={item.label}
                      value={item.value}
                      className="checkbox-with-space"
                      onChange={onChangeprofess}
                      checked={curselected.includes(item.value)}
                    />
                  )
                })}

              </div>

            </div>
            <div className="mt-2 border  border-dark">
              <label className="e-float-text e-label-top text-muted px-2">
                Dear User,
              </label>
              <Form.Control
                as="textarea"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                rows={4}
                value={professNoify}
                onChange={(e) => setProfessnotify(e.target.value)}
              />

            </div>
          </Col>
        </Row>
      </Form.Group>
      {
                    memberUserId != spouseUserId && spouseUserId != 'null' && showSpouseCheck && <div className='w-50 d-flex gap-2 mt-2'>
                    <input type='checkbox' style={{width:'20px'}} value={sameForspouse} onChange={(e)=>{setSameforspouse(e.target.checked)}}  />
                    <h5>Add same details for Spouse</h5>
                    </div>
                  }
      <div className="Sava-Button-Div  d-flex flex-wrap justify-content-between">
        <button className="Save-Button mb-2" onClick={() => props?.setStepperNo(props.stepperNo - 1)}> Back </button>
        <button className="Save-Button" onClick={() => onSavebtn()}> Save & Proceed</button>
      </div>
    </>
  )
}

// export default NotifyStep
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => ({
  dispatchloader: (loader) =>
    dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotifyStep);