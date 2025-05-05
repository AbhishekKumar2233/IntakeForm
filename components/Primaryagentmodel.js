import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { set } from "react-hook-form";
import konsole from "./control/Konsole";
import {
  $CommonServiceFn,
  $getServiceFn,
  $postServiceFn,
} from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import { connectAdvanced } from "react-redux";

const Primaryagentmodel = (props) => {
  const [soloCo, setsoloCo] = useState("solo");
  const [soloCoGetAPiStatus, setsoloCoGetAPiStatus] = useState("");
  const [inputField, setInputField] = useState();
  const [SelectName, setSelectName] = useState("");
  const [FiduciaryList, setFiduciaryList] = useState([]);
  const [primaryAgentValue, setprimaryAgentValue] = useState("");
  const [userId, setuserId] = useState("");
  const [UpsertedBy, setUpsertedBy] = useState("");
  const [agentRankId, setagentRankId] = useState("");
  const [getApiPrimaryData, setgetApiPrimaryData] = useState();
  const [primarySelectedValue1, setprimarySelectedValue1] = useState([]);
  const [primarySelectedValue2, setprimarySelectedValue2] = useState([]);
  const [primarySelectedValue3, setprimarySelectedValue3] = useState([]);
  const [primarySelectedValue4, setprimarySelectedValue4] = useState([]);
  const [primarySelectedValue5, setprimarySelectedValue5] = useState([]);
  const [primarySelectedValue6, setprimarySelectedValue6] = useState([]);
  const [primaryAgentName, setprimaryAgentName] = useState([]);
  const [relationWithUser, setRelationWithUser] = useState([]);
  const [primaryAgentRank, setPrimaryAgentRank] = useState([]);
  const [returndata, setReturndata] = useState([]);
  const [fields, setFields] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateField, setUpdateField] = useState();
  const [CoApiDataPrimary, setCoApiDataPrimary] = useState([]);
  const [CoApiDataCoAgent, setCoApiDataCoAgent] = useState([]);
  const [allAgentRankIdData, setAllAgentRankIdData] = useState([]);
  const [allAgentRankId, setAllAgentRankId] = useState();

  konsole.log("abab", props);
  konsole.log(
    "postroleId",
    props.selectedSolo,
    props.postTestSupportDocId,
    props.saveUserAgent,
    props.saveAgentCard,
    props.postRoleId
  );
  konsole.log("getUserAgentPropsData", props.getUserAgent);
  konsole.log("props.postfileId", props.postfileId);
  konsole.log("fieldsfields", fields);
  konsole.log("allAgentRankIdDataallAgentRankIdData", allAgentRankIdData);

  useEffect(()=>{
    fiduciaryList();
    if(props.getUserAgent.length !== 0){
      if(props.getUserAgent[0]?.agentRankId == 1){
        setsoloCo("solo")
        setsoloCoGetAPiStatus("solo")
        setUpdateField(props.getUserAgent[0]?.agentUserId);
        props.setfileId(props.getUserAgent[0]?.fileId)
        props.setRoleId(props.getUserAgent[0]?.agentRoleId)

        setprimaryAgentValue([{
          primary: "Primary",
          value: props.getUserAgent[0]?.agentUserId,
          fullName: props.getUserAgent[0]?.fullName,
          relationWithMember: props.getUserAgent[0]?.relationWithMember
        }]);
        setgetApiPrimaryData([{
          primary: "Primary",
          value: props.getUserAgent[0]?.agentUserId,
          fullName: props.getUserAgent[0]?.fullName,
          relationWithMember: props.getUserAgent[0]?.relationWithMember,
          agentId: props.getUserAgent[0]?.agentId
        }]);
      }else{
        setsoloCo("co")
        setsoloCoGetAPiStatus("co")
        let mapAllAgentRankId = props.getUserAgent.map((data)=>{
          return data?.agentRankId
        })
        setInputField(mapAllAgentRankId.length)
        konsole.log("mapAllAgentRankIdmapAllAgentRankId",mapAllAgentRankId)
        // setAllAgentRankId(mapAllAgentRankId)
        // setDataLength(props.getUserAgent.length);
        DynamicData(props.getUserAgent);
        props.setfileId(props.getUserAgent[0]?.fileId);
        props.setRoleId(props.getUserAgent[0]?.agentRoleId);
        
      }
    }


  },[])

  // useEffect(() => {
  //   fiduciaryList();
  //   if (props.getUserAgent.length == 1) {
  //     setUpdateField(props.getUserAgent[0]?.agentUserId);
  //     props.setfileId(props.getUserAgent[0]?.fileId)
  //     props.setRoleId(props.getUserAgent[0]?.agentRoleId)
  //     setprimaryAgentValue([{
  //       primary: "Primary",
  //       value: props.getUserAgent[0]?.agentUserId,
  //       fullName: props.getUserAgent[0]?.fullName,
  //       relationWithMember: props.getUserAgent[0]?.relationWithMember
  //     }]);
  //     setgetApiPrimaryData([{
  //       primary: "Primary",
  //       value: props.getUserAgent[0]?.agentUserId,
  //       fullName: props.getUserAgent[0]?.fullName,
  //       relationWithMember: props.getUserAgent[0]?.relationWithMember,
  //       agentId: props.getUserAgent[0]?.agentId
  //     }]);
  //   } else if (props.getUserAgent.length > 1) {
  //     let mapAllAgentRankId = props.getUserAgent.map((x)=>{
  //       return x?.agentRankId
  //     })
  //     setAllAgentRankIdData(mapAllAgentRankId)
  //     konsole.log("mapAllAgentRankId",mapAllAgentRankId)
  //     let coAgentLength = props.getUserAgent.length - 1;
  //     setsoloCo("co");
  //     let filterDataGetApi = props.getUserAgent.filter((x) => {
  //       return x.agentRank == "Primary";
  //     });
  //     setCoApiDataPrimary(filterDataGetApi);
  //     setprimaryAgentValue([{
  //       primary: "Primary",
  //       value: filterDataGetApi[0]?.agentUserId,
  //       fullName: filterDataGetApi[0]?.fullName,
  //       relationWithMember: filterDataGetApi[0]?.relationWithMember
  //     }]);
  //     setgetApiPrimaryData([{
  //       primary: "Primary",
  //       value: filterDataGetApi[0]?.agentUserId,
  //       fullName: filterDataGetApi[0]?.fullName,
  //       relationWithMember: filterDataGetApi[0]?.relationWithMember
  //     }]);
  //     setCoApiDataCoAgent(filterDataGetApi[0]?.agentUserId)
  //     props.setRoleId(props.getUserAgent[0]?.agentRoleId)
  //     props.setfileId(props.getUserAgent[0]?.fileId)
  //     // editFilterFunction(filterDataGetApi);

  //     let filterDataGetApi1 = props.getUserAgent.filter((x) => {
  //       return x.agentRank !== "Primary";
  //     });
  //     // setCoApiDataCoAgent(filterDataGetApi1);
  //     konsole.log(
  //       "filterDataGetApifilterDataGetApi",
  //       filterDataGetApi[0]?.agentUserId
  //     );
  //     konsole.log("filterDataGetApifilterDataGetApi", filterDataGetApi1);
  //     // setUpdateField1(props.getUserAgent);
  //     // setInputField(props.getUserAgent.length - 1);
  //     konsole.log("coAgentLengthcoAgentLength", coAgentLength);
  //     DynamicData(filterDataGetApi1);
  //   }
  //   // else{
  //   //   props.setfileId("")
  //   // }
  // }, []);
  // konsole.log("CoApiDataPrimaryCoApiDataPrimary", CoApiDataPrimary);

  const editFilterFunction = (data, getAPIData) => {
    konsole.log("datafafafa", data);
    konsole.log("datafafafa", getAPIData);
    let filterData = getAPIData.filter((v) => {
      return v.value !== data[0]?.agentUserId;
    });
    konsole.log("datafafafaadasdsa", filterData);
    setReturndata(filterData);
  };

  const solocochecked = (e) => {
    setsoloCo(e.target.value);
    konsole.log("aaa", e.target.value);
    setRelationWithUser([]);
    setprimaryAgentName([]);
    setprimaryAgentValue([])
    setCoApiDataCoAgent([])
  };

  const fiduciaryList = () => {
    const userId = sessionStorage.getItem("SessPrimaryUserId");
    const loggedUserId = sessionStorage.getItem("loggedUserId");
    // const userId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28"
    // const loggedUserId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28";
    setuserId(userId);
    setUpsertedBy(loggedUserId);
    konsole.log("useId", userId);
    konsole.log("useIdll", loggedUserId);
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFiduciaryList + userId,
      $getServiceFn,
      (response) => {
        if (response) {
          konsole.log("fiduciaryList", response.data.data);
          let responseData = response.data.data;
          if (props.getUserAgent.length > 0) {
            let filterDataGetApi = props.getUserAgent.filter((x) => {
              return x.agentRank == "Primary";
            });
            konsole.log("filterDataGetApiResponse", props.getUserAgent);
            konsole.log("filterDataGetApiResponse", filterDataGetApi);
            editFilterFunction(filterDataGetApi, responseData);
          }
          setFiduciaryList(response.data.data);
        }
      }
    );
  };


  const filterDataForAgentId = (agentId) =>{
    return props.getUserAgent.filter((x)=>x?.agentRankId == agentId)[0]?.agentId
  }



  konsole.log("primaryAgentNameprimaryAgentName",primaryAgentName)
  // konsole.log("primaryAgentValueprimaryAgentValue",primaryAgentValue[0]?.value)


  const agentUpsertApi = () => {

    const apiUpsertData = [];

    let primaryAgentDataBind = [];

    if(props.getUserAgent.length !== 0){

      konsole.log("getApiPrimaryDatagetApiPrimaryData",getApiPrimaryData)

      if(getApiPrimaryData?.value !== primaryAgentValue[0]?.value && soloCo == soloCoGetAPiStatus){

// .................. Removed UserId .......................................

        apiUpsertData.push({
          agentId: getApiPrimaryData[0]?.agentId,
          agentUserId: getApiPrimaryData[0]?.value,
          memberUserId: userId,
          agentRoleId: props.postRoleId ,
          agentRankId: 1,
          agentAcceptanceStatus: false,
          agentActiveStatus: false,
          fileId: props.postfileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        });

      

      
// ................. New UserID .....................................................
apiUpsertData.push({
  agentId:  0,
  agentUserId: primaryAgentValue[0]?.value,
  memberUserId: userId,
  agentRoleId: props.postRoleId ,
  agentRankId: 1,
  agentAcceptanceStatus: false,
  agentActiveStatus: true,
  fileId: props.postfileId,
  legalDocId: props.postLegalDocId,
  testDocId: props.posttestDocId,
  testSupportDocId: props.postTestSupportDocId,
  upsertedBy: UpsertedBy,
});

primaryAgentDataBind.push(
  {
    fullName: primaryAgentValue[0]?.fullName,
    relationWithMember: primaryAgentValue[0]?.relationWithMember,
    agentRankId: 1
  }
)

      }else if(props.getUserAgent[0]?.agentRankId != 1 && soloCo == soloCoGetAPiStatus){



        let mapsaveEditDataJson = props.getUserAgent.map((data)=>{
          return data?.agentUserId
        })
        let mapFieldsData = fields.map((data)=>{
          return data?.value
        })
  
  
        let NewUserId = mapFieldsData
               .filter(x => !mapsaveEditDataJson.includes(x))
               .concat(mapFieldsData.filter(x => !mapFieldsData.includes(x))); // new userID
  
  let RemovedUserId = mapsaveEditDataJson.filter(x => !mapFieldsData.includes(x)); // removed userId
  
  let RepeatedUserId = mapsaveEditDataJson.filter(x => mapFieldsData.includes(x)); // repeated userId
  
  konsole.log("mapsaveEditDataJsonmapsaveEditDataJson",NewUserId)
  konsole.log("mapsaveEditDataJsonmapsaveEditDataJson",RemovedUserId)
  konsole.log("mapsaveEditDataJsonmapsaveEditDataJson",RepeatedUserId)
  
  
  
        konsole.log("mapFieldsDatamapFieldsData", mapsaveEditDataJson)
        konsole.log("mapFieldsDatamapFieldsData", mapFieldsData)
  
  // ............................. New UserId.................................................................................
        
        for(let i = 0; i < NewUserId.length; i++){
          let filterDataForAgentRankId = fields.filter((x)=>{
            return x?.value == NewUserId[i]
          })
          apiUpsertData.push({
            agentId: 0,
            agentUserId: filterDataForAgentRankId[0]?.value,
            memberUserId: userId,
            agentRoleId: props.postRoleId,
            agentRankId: filterDataForAgentRankId[0]?.agentRankId,
          agentAcceptanceStatus: false,
          agentActiveStatus: true,
          fileId: props.postfileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        })
      }
      
  
  
      konsole.log("apiUpsertDataapiUpsertData", apiUpsertData)
      
      // ......................... Removed UserId ....................................................................................................
  
      
      for(let i = 0; i < RemovedUserId.length; i++){
        let filterDataForRemoved = props.getUserAgent.filter((x)=>{
          return x.agentUserId ==  RemovedUserId[i]
        })
  
        apiUpsertData.push({
          agentId: filterDataForRemoved[0]?.agentId,
          agentUserId: RemovedUserId[i],
          memberUserId: userId,
          agentRoleId: props.postRoleId,
          agentRankId: filterDataForRemoved[0]?.agentRankId,
        agentAcceptanceStatus: false,
        agentActiveStatus: false,
        fileId: filterDataForRemoved[0]?.fileId,
        legalDocId: props.postLegalDocId,
        testDocId: props.posttestDocId,
        testSupportDocId: props.postTestSupportDocId,
        upsertedBy: UpsertedBy,
      })
    }
    
  
  
    konsole.log("apiUpsertDataapiUpsertDataRe", apiUpsertData)
    
    
    // ........................... Repeated UserID .......................................................
    
    for(let i = 0; i < RepeatedUserId.length; i++){
      let filterDataForRemoved = props.getUserAgent.filter((x)=>{
        return x.agentUserId ==  RepeatedUserId[i]
      })
      let filterDataForAgentRankId = fields.filter((x)=>{
        return x?.value == RepeatedUserId[i]
      })
  
      apiUpsertData.push({
        agentId: filterDataForRemoved[0]?.agentId,
        agentUserId: RepeatedUserId[i],
        memberUserId: userId,
        agentRoleId: props.postRoleId,
        agentRankId: filterDataForAgentRankId[0]?.agentRankId,
      agentAcceptanceStatus: false,
      agentActiveStatus: true,
      fileId: props.postfileId,
      legalDocId: props.postLegalDocId,
      testDocId: props.posttestDocId,
      testSupportDocId: props.postTestSupportDocId,
      upsertedBy: UpsertedBy,
    })
  }
  
  
  
  konsole.log("apiUpsertDataapiUpsertDataRep", apiUpsertData)

  for(let i = 0; i < fields.length; i++){

    
    primaryAgentDataBind.push(
      
      {
        fullName: fields[i]?.label,
      relationWithMember: fields[i]?.relationWithUser,
      agentRankId: fields[i]?.agentRankId
    }
  )

      }




      }else if(props.getUserAgent[0]?.agentRankId == 1 && soloCo != soloCoGetAPiStatus){


        apiUpsertData.push({
          agentId: getApiPrimaryData[0]?.agentId,
          agentUserId: getApiPrimaryData[0]?.value,
          memberUserId: userId,
          agentRoleId: props.postRoleId ,
          agentRankId: 1,
          agentAcceptanceStatus: false,
          agentActiveStatus: false,
          fileId: props.postfileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        });

        for(let i = 0; i <fields.length; i++){

          
          
          apiUpsertData.push({
          agentId: 0,
          agentUserId: fields[i]?.value,
          memberUserId: userId,
          agentRoleId: props.postRoleId,
          agentRankId: fields[i]?.agentRankId,
        agentAcceptanceStatus: false,
        agentActiveStatus: true,
        fileId: props.postfileId,
        legalDocId: props.postLegalDocId,
        testDocId: props.posttestDocId,
        testSupportDocId: props.postTestSupportDocId,
        upsertedBy: UpsertedBy,
      })


      primaryAgentDataBind.push(
      
        {
          fullName: fields[i]?.label,
        relationWithMember: fields[i]?.relationWithUser,
        agentRankId: fields[i]?.agentRankId
      }
    )
      
      
    }





      }else if(props.getUserAgent[0]?.agentRankId != 1 && soloCo != soloCoGetAPiStatus){


        apiUpsertData.push({
          agentId:  0,
          agentUserId: primaryAgentValue[0]?.value,
          memberUserId: userId,
          agentRoleId: props.postRoleId ,
          agentRankId: 1,
          agentAcceptanceStatus: false,
          agentActiveStatus: true,
          fileId: props.postfileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        });

        primaryAgentDataBind.push(
          {
            fullName: primaryAgentValue[0]?.fullName,
            relationWithMember: primaryAgentValue[0]?.relationWithMember,
            agentRankId: 1
          }
        )


        for(let i = 0; i < props.getUserAgent.length; i++){
          apiUpsertData.push({
            agentId: props.getUserAgent[i]?.agentId,
            agentUserId: props.getUserAgent[i]?.agentUserId,
            memberUserId: userId,
            agentRoleId: props.postRoleId,
            agentRankId: props.getUserAgent[i]?.agentRankId,
          agentAcceptanceStatus: false,
          agentActiveStatus: false,
          fileId: props.getUserAgent[i]?.fileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        })
        }




      }



    }else{




      if(soloCo == "solo"){

        primaryAgentDataBind.push(
          {
            fullName: primaryAgentValue[0]?.fullName,
            relationWithMember: primaryAgentValue[0]?.relationWithMember,
            agentRankId: 1
          }
        )



        apiUpsertData.push({
          agentId:  0,
          agentUserId: primaryAgentValue[0]?.value,
          memberUserId: userId,
          agentRoleId: props.postRoleId ,
          agentRankId: 1,
          agentAcceptanceStatus: false,
          agentActiveStatus: true,
          fileId: props.postfileId,
          legalDocId: props.postLegalDocId,
          testDocId: props.posttestDocId,
          testSupportDocId: props.postTestSupportDocId,
          upsertedBy: UpsertedBy,
        });




      }else{



        for (let i = 0; i < fields.length; i++) {
          apiUpsertData.push({
            agentId: 0,
            agentUserId: fields[i]?.value,
            memberUserId: userId,
            agentRoleId: props.postRoleId ,
            agentRankId: fields[i]?.agentRankId,
            agentAcceptanceStatus: false,
            agentActiveStatus: true,
            fileId: props.postfileId,
            legalDocId: props.postLegalDocId,
            testDocId: props.posttestDocId,
            testSupportDocId: props.postTestSupportDocId,
            upsertedBy: UpsertedBy,
          });
          
          primaryAgentDataBind.push(

              {
                fullName: fields[i]?.label,
                relationWithMember: fields[i]?.relationWithUser,
                agentRankId: fields[i]?.agentRankId
              }
            )
          
        }
      }
    

    

    // for (let i = 0; i < primaryAgentName.length; i++) {
    //   primaryAgentDataBind.push({
    //     primaryAgentRank: "Primary",
    //     fullName: primaryAgentName[i],
    //     relationWithMember: relationWithUser[i],
    //   });
    // }
    // konsole.log("primaryAgentRank[j]", primaryAgentRank);

    // for (let j = 0; j < primaryAgentRank.length; j++) {
    //   primaryAgentDataBind[j + 1].primaryAgentRank = primaryAgentRank[j];
    //   konsole.log("primaryAgentRank[j]", primaryAgentRank[j]);
    // }

    // konsole.log("primaryAgentDataBind", primaryAgentDataBind);

    


    
    // primaryAgentRank: primaryAgentRank[i],
    // ..................................................
    
    // for (let i = 0; i < primaryAgentValue.length; i++) {
    //   apiUpsertData.push({
    //     agentId: allAgentRankIdData?.includes(agentRankId[i]) ? filterDataForAgentId(agentRankId[i]) : 0,
    //     agentUserId: primaryAgentValue[i]?.value,
    //     memberUserId: userId,
    //     agentRoleId: props.postRoleId ,
    //     agentRankId: 1,
    //     agentAcceptanceStatus: false,
    //     agentActiveStatus: true,
    //     fileId: props.postfileId,
    //     legalDocId: props.postLegalDocId,
    //     testDocId: props.posttestDocId,
    //     testSupportDocId: props.postTestSupportDocId,
    //     upsertedBy: UpsertedBy,
    //   });
    // }
    // for (let i = 0; i < fields.length; i++) {
    //   apiUpsertData.push({
    //     agentId: allAgentRankIdData?.includes(agentRankId[i]) ? filterDataForAgentId(agentRankId[i]) : 0,
    //     agentUserId: fields[i]?.value,
    //     memberUserId: userId,
    //     agentRoleId: props.postRoleId ,
    //     agentRankId: agentRankId[i],
    //     agentAcceptanceStatus: false,
    //     agentActiveStatus: true,
    //     fileId: props.postfileId,
    //     legalDocId: props.postLegalDocId,
    //     testDocId: props.posttestDocId,
    //     testSupportDocId: props.postTestSupportDocId,
    //     upsertedBy: UpsertedBy,
    //   });
      
    //   primaryAgentDataBind.push({
    //     fullName: fields[i]?.label,
    //     relationWithMember: fields[i]?.relationWithUser,
    //   })
    // }
    
  }
        props.saveAgentCard(primaryAgentDataBind);
        props.setNewGetUserAgent(primaryAgentDataBind);
    // let newapiUpsertData = apiUpsertData.filter((v,i,a)=>a.findIndex(v2=>(v2.agentRankId===v.agentRankId))===i)
    konsole.log("primaryAgentDataBindprimaryAgentDataBind", primaryAgentDataBind);
    konsole.log("apiUpsertData", apiUpsertData);
    // konsole.log("apiUpsertData", newapiUpsertData);
    
    props.setGetPrimaryAgentData(apiUpsertData);
    props.setJsonOpreator("PrimaryData");

    // if (SelectName == "primary") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue1)
    // } else if (SelectName == "coAgent1") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue2)

    // } else if (SelectName == "coAgent2") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue3)

    // } else if (SelectName == "coAgent3") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue4)

    // } else if (SelectName == "coAgent4") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue5)

    // } else if (SelectName == "coAgent5") {
    //   props.setGetFilterDataFromPrimaryAgent(primarySelectedValue6)

    // } else {
    //   props.setGetFilterDataFromPrimaryAgent(FiduciaryList)

    // }

    props.handleShowAgent();

  

    // $CommonServiceFn.InvokeCommonApi(
    //   "POST",
    //   $Service_Url.postAgentUpsert,
    //   apiUpsertData,
    //   (response) => {
    //     if (response) {
    //       konsole.log("upsertt", response);
    //       props.saveAgentCard(response.data.data);
    // props.handleShowAgent();
    //     }
    //     //  else {
    //     //   alert(Msg.ErrorMsg);
    //     // }
    //   }
    // );
    // props.saveUserAgent();
  };

  const [primarySelectedValue, setPrimarySelectedValue] = useState("")
  const filteredFidList = (e) => {
    // setCoApiDataCoAgent([])
    let indexValue = Number(e.target.getAttribute("data-tag"));

    // setagentRankId([...agentRankId, indexValue]);

    // setprimaryAgentValue(e.target.value);
    const selectedFid = e.target.value;
    const selectedName = e.target.name;
    konsole.log("selectedFidselectedFid", selectedFid);
    setSelectName(selectedName);
    setCoApiDataCoAgent(selectedFid)
    if (props.getUserAgent.length == 1) {
      // setUpdateField(props.getUserAgent[0]?.agentUserId);
      // props.setfileId(props.getUserAgent[0]?.fileId)
      // props.setRoleId(props.getUserAgent[0]?.agentRoleId)
      setUpdateField(selectedFid)
    } 

    let filterName = FiduciaryList.filter((items) => {
      return items.value == selectedFid;
    });
    setRelationWithUser([...relationWithUser, filterName[0].relationWithUser]);
    setprimaryAgentName([...primaryAgentName, filterName[0].label]);

    let primaryAgentAllData = {
      
    }
    setprimaryAgentValue([{
      primary: "Primary",
      value: selectedFid,
      fullName: filterName[0]?.label,
      relationWithMember: filterName[0]?.relationWithUser
    }]);


    // setprimaryAgentValue([...primaryAgentValue, selectedFid]);

    let filterDataRemaing = FiduciaryList.filter((v) => {
      return v.value !== selectedFid;
    });
    setReturndata(filterDataRemaing);
    props.setFilterData(filterDataRemaing);

    konsole.log("filterDataRemaing", filterDataRemaing);

  
  };



  const DynamicData = (coAgentLength) => {
    let eventvalue = coAgentLength;
    let eventInputValue = coAgentLength?.target?.value;
    let fixValue = eventvalue;
    if (eventInputValue !== undefined) {
      fixValue = eventInputValue;
    }

    konsole.log("fixValuefixValue", fixValue);

    let arr = [];
    if (eventInputValue !== undefined) {
      for (let i = 0; i < fixValue; i++) {
        konsole.log("array object", createjsonfunction());
        arr.push(createjsonfunction());
      }
    } else {
      for (let i = 0; i < fixValue.length; i++) {
        konsole.log("array object", createjsonfunction());
        arr.push(createjsonfunction(fixValue[i]));
      }
    }
    setFields(arr);
    // setPrimaryAgentRank(arr);

    // setsuccessorName(arr)
  };

  konsole.log("ArrayData", primaryAgentRank);

  const flterreturndata = (e, index, filtereddata) => {


    konsole.log("flterreturndataflterreturndata", e)
    konsole.log("flterreturndataflterreturndata", index)
    konsole.log("flterreturndataflterreturndata", filtereddata)
    
    
    
    let valuedata = e.target.value;
    let datafilter = filtereddata.filter((v) => {
      return v.value !== e.target.value;
    });
    props.setFilterData(datafilter);
    
    // props.setPrimaryFilterData(datafilter)
    konsole.log("index", index);
    setagentRankId([...agentRankId, index + 2]);
    
    let fieldsValue = fields;
    konsole.log("fileds2", fieldsValue);
    fieldsValue[index].value = e.target.value;
    
    setUpdate(!update);
    
    // .................................................................................................................
    const selectedFid = e.target.value;
    const selectedName = e.target.name;
    konsole.log("filtereddata", e.target.value);
    setSelectName(selectedName);
    
    let filterName = FiduciaryList.filter((items) => {
      return items.value == selectedFid;
    });
    setRelationWithUser([...relationWithUser, filterName[0].relationWithUser]);
    setprimaryAgentName([...primaryAgentName, filterName[0].label]);
    // setprimaryAgentValue([...primaryAgentValue, selectedFid]);
    fieldsValue[index].label = filterName[0].label;
    fieldsValue[index].relationWithUser = filterName[0].relationWithUser;
    fieldsValue[index].agentRankId = index+2;
    setFields(fieldsValue);
    // setReturndata(filterdata)
  };
  const createjsonfunction = (apiData) => {
    return {
      value: apiData?.agentUserId,
      relationWithUser: apiData?.relationWithMember,
      label: apiData?.fullName,
      agentRankId: apiData?.agentRankId
    };
  };

  konsole.log("fileds", fields);
  
  const generateQuery = (userId, index) => {
    let value = "";
    const length = fields.length;

    for (let i = 1; i <= length; i++) {
      if (fields[i - 1].value !== null) {
        if (index !== i - 1) {
          // if(fields[i].value !== null){
            value += `"${userId}"!=="${fields[i - 1].value}"`;
          // }
          konsole.log("avavav", i, length, length - 3);
          if (i <= length) {
            value += "&&";
          } else {
            value = value;
          }
        }
      }
    }
    konsole.log("returndata", value.slice(0, -2));
    return value.slice(0, -2);
  };


  const DynamicData1 = (coAgentLength) => {
    let eventvalue = props.getUserAgent;
    let eventInputValue = coAgentLength?.target?.value;
    

    // konsole.log("fixValuefixValue", fixValue);

    let arr = [];
   
      for (let i = 0; i < eventInputValue; i++) {
        konsole.log("array object", createjsonfunction());
        arr.push(createjsonfunction(eventvalue[i]));
      }
   
    setFields(arr);
    // setsuccessorName(arr)
  };



  
  konsole.log("primarySelectedValue6", agentRankId);
  konsole.log("returndatareturndata", returndata);
  konsole.log("SelectNameSelectName", SelectName);
  // konsole.log("relationWithUserrelationWithUser", relationWithUser)
  // konsole.log("relationWithUserrelationWithUser", primaryAgentName)
  konsole.log("relationWithUserrelationWithUser", primaryAgentValue)
  
  return (
    <>
      <Modal show={props.show} centered onHide={props.handleShowAgent} backdrop="static">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Primary Agents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-check-inline ">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                value="solo"
                defaultChecked={props.selectedSolo == "solo" ? true : false}
                onChange={solocochecked}
                />
              <label className="ms-3 fs-4">Sole</label>
            </div>
            <div className="form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                value="co"
                defaultChecked={props.selectedSolo == "co" ? true : false}
                onChange={solocochecked}
                />

              <label className="ms-3 fs-4">Co</label>
            </div>
          </div>

          {soloCo == "solo" ? (
            <div className="d-flex justify-content-start mt-4">
              <p className="p-2 fs-5 "> Primary</p>
              <div className="p-2 w-75 ">
                <select
                  className="w-100  border "
                  style={{ color: "#751521" }}
                  onChange={(e) => filteredFidList(e)}
                  data-tag="1"
                  name="primary"
                  value={updateField}
                >
                  <option
                    value=
                      // updateField?.fullName !== undefined &&
                      // updateField?.fullName !== null &&
                      // updateField?.fullName !== ""
                      //   ? `${updateField?.agentUserId}`
                      //   : 
                        "-1"
                    
                  >
                    {" "}
                    {/* {updateField?.fullName !== undefined &&
                    updateField?.fullName !== null &&
                    updateField?.fullName !== ""
                      ? `${updateField?.fullName}-${updateField?.relationWithMember}`
                      : */}
                       Select Primary Agent
                      {/* // } */}
                  </option>
                  {FiduciaryList.map((fidList, index) => {
                    return (
                      <option className="text-secondary" value={fidList.value}>
                        {fidList.label}-{fidList.relationWithUser}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          ) : soloCo == "co" ? (
            <>
              
              <div className=" d-flex justify-content-start ">
                {/* <p className="p-2 fs-5 ">
                  No of Co-agents{" "}
                  <span className="ms-5 border px-4 p-1 "> 05 </span>{" "}
                </p> */}
                <label className="p-2 fs-5 my-2">No of Co-agents: </label>
                <input
                  type="text"
                  placeholder=""
                  className="DynamicFields px-5 my-2 w-25 "
                  defaultValue={inputField}
                  style={{ border: "1px solid #751521" }}
                  onKeyUp={(props.getUserAgent[0]?.agentRankId == 1)? DynamicData : DynamicData1}
                />
              </div>
              {/* ................................................................................................................. */}

              <div className="d-flex flex-sm-column">
                {fields.map((item, index) => {
                  let filtereddata = FiduciaryList.filter((v) => {
                    let query = true;
                    if (generateQuery(v.value, index) !== "") {
                      query = eval(generateQuery(v.value, index));
                      konsole.log("query", query);
                    }
                    return query;
                  });
                  konsole.log("query filtered", filtereddata);
                  // props.setFilterData(filtereddata)
                  // setprimarySelectedValue6(filtereddata)

                  return (
                    <>
                      <div>
                        <p className="p-2">Co-agent{index + 1} </p>

                        <select
                          className="w-75  border"
                          //  onChange={filteredFidList}
                          value={item.value}
                          onChange={(e) =>
                            flterreturndata(e, index, filtereddata)
                          }
                          style={{ color: "#751521", width: "20px" }}
                        >
                          <option>Choose Co-agent</option>
                          {filtereddata.map((ite, index) => {
                            return (
                              <option value={ite.value} key={index}>
                                {ite.label}-{ite.relationWithUser}{" "}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </>
                  );
                })}
              </div>

              {/* ................................................................................................................. */}
              {/* <div className=" d-flex justify-content-start ">
                <p className="p-2 fs-5 ">Co-agent - 1</p>
                <div className="p-2 w-75 ">
                  <select
                    className="w-100  border "
                    style={{ color: "#751521" }}
                    onChange={filteredFidList}
                    name="coAgent1"
                  >
                    <option value="1">Co-agent - 1</option>
                    {primarySelectedValue1.map((fidList, index) => {
                      return (
                        <option
                          className="text-secondary"
                          value={fidList.value}
                          key={fidList.label}
                        >
                          {fidList.label}-{fidList.relationWithUser}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className=" d-flex justify-content-start ">
                <p className="p-2 fs-5 ">Co-agent - 2</p>
                <div className="p-2 w-75 ">
                  <select
                    className="w-100  border "
                    style={{ color: "#751521" }}
                    onChange={filteredFidList}
                    name="coAgent2"
                  >
                    <option value="1">Co-agent - 2</option>
                    {primarySelectedValue2.map((fidList, index) => {
                      return (
                        <option
                          className="text-secondary"
                          value={fidList.value}
                          key={fidList.label}
                        >
                          {fidList.label}-{fidList.relationWithUser}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className=" d-flex justify-content-start ">
                <p className="p-2 fs-5 ">Co-agent - 3</p>
                <div className="p-2 w-75 ">
                  <select
                    className="w-100  border "
                    style={{ color: "#751521" }}
                    onChange={filteredFidList}
                    name="coAgent3"
                  >
                    <option value="1">Co-agent - 3</option>
                    {primarySelectedValue3.map((fidList, index) => {
                      return (
                        <option
                          className="text-secondary"
                          value={fidList.value}
                          key={fidList.label}
                        >
                          {fidList.label}-{fidList.relationWithUser}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className=" d-flex justify-content-start ">
                <p className="p-2 fs-5 ">Co-agent - 4</p>
                <div className="p-2 w-75 ">
                  <select
                    className="w-100  border "
                    style={{ color: "#751521" }}
                    onChange={filteredFidList}
                    name="coAgent4"
                  >
                    <option value="1">Co-agent - 4</option>
                    {primarySelectedValue4.map((fidList, index) => {
                      return (
                        <option
                          className="text-secondary"
                          value={fidList.value}
                          key={fidList.label}
                        >
                          {fidList.label}-{fidList.relationWithUser}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className=" d-flex justify-content-start ">
                <p className="p-2 fs-5 ">Co-agent - 5</p>
                <div className="p-2 w-75 ">
                  <select
                    className="w-100  border "
                    style={{ color: "#751521" }}
                    onChange={filteredFidList}
                    name="coAgent5"
                  >
                    <option value="1">Co-agent - 5</option>
                    {primarySelectedValue5.map((fidList, index) => {
                      return (
                        <option
                          className="text-secondary"
                          value={fidList.value}
                          key={fidList.label}
                        >
                          {fidList.label}-{fidList.relationWithUser}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div> */}
            </>
          ) : null}
          <div className="d-flex justify-content-center text-center mt-2">
            <Button
              className="btn btn-primary  w-25 text-center"
              //  onClick={props.handleShowAgent}
              onClick={agentUpsertApi}
            >
              SAVE
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Primaryagentmodel;
