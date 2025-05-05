import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { $getServiceFn, $CommonServiceFn } from "./network/Service";
import { $Service_Url } from "./network/UrlPath";
import konsole from "./control/Konsole";
import { useEffect } from "react";

const Successormodal = (props) => {
  const [successorListData, setSuccessorListData] = useState([]);
  const [successorData, setSuccessorData] = useState([]);
  const [successorData1, setSuccessorData1] = useState([]);
  const [successorData2, setSuccessorData2] = useState([]);
  const [successorName, setsuccessorName] = useState([]);
  const [allAgentRankId, setAllAgentRankId] = useState();
  const [successorSelectedValue2, setSuccessorSelectedValue2] = useState([]);
  const [successorSelectedValue3, setSuccessorSelectedValue3] = useState([]);
  const [successorSelectedValue4, setSuccessorSelectedValue4] = useState([]);
  const [successorSelectedValue5, setSuccessorSelectedValue5] = useState([]);
  const [agentRankId, setAgentRankId] = useState([]);
  const [userIdData, setUserIdData] = useState("");
  const [fields, setFields] = useState([]);
  const [update, setUpdate] = useState(false);
  const [dataLength, setDataLength] = useState();
  konsole.log("abab", props);

  konsole.log("props.getSuccessorData", props.getSuccessorData);
  konsole.log("props.postfileId", props.postfileId);
  konsole.log("allAgentRankId", allAgentRankId);
  konsole.log("fieldsfieldsfieldsfields", fields);
  useEffect(() => {
    let userId = sessionStorage.getItem("SessPrimaryUserId");
    // const userId = "7aeea162-1200-4bb8-b53b-e7e3013a0f28";
    if (props.getSuccessorData.length !== 0) {
      let mapAllAgentRankId = props.getSuccessorData.map((data)=>{
        return data?.agentRankId
      })
      setAllAgentRankId(mapAllAgentRankId)
      setDataLength(props.getSuccessorData.length);
      DynamicData(props.getSuccessorData);
      props.setfileId(props.getSuccessorData[0]?.fileId);
      props.setRoleId(props.getSuccessorData[0]?.agentRoleId);
    }
    // else {
      
    //   props.setfileId("");
    // }
    setUserIdData(userId);
    runFiduciaryDataList(userId);
    // konsole.log("loggedUserId",userid)
  }, []);

  const runFiduciaryDataList = (userIdValue) => {
    $CommonServiceFn.InvokeCommonApi(
      "GET",
      $Service_Url.getFiduciaryforAssigment + userIdValue,
      $getServiceFn,
      (response) => {
        if (response) {
          konsole.log("fiduciaryList", response.data.data);
          setSuccessorListData(response.data.data);
        } else if (err) {
          konsole.log("ErrorData", err);
        }
      }
    );
  };

  const SuccessorValue = (e) => {
    let eventName = e.target.name;
    let eventValue = e.target.value;
    konsole.log("SuccessorValue", e.target.value);
    konsole.log("SuccessorValue", e.target.name);

    // setsuccessorName([...successorName, eventName])
    setSuccessorData([...successorData, eventValue]);
    let filterName = successorListData.filter((items) => {
      return items.value == eventValue;
    });
    setSuccessorData1([...successorData1, filterName[0].label]);
    setSuccessorData2([...successorData2, filterName[0].relationWithUser]);

    // if (eventName == "1st Successor") {
    //     setAgentRankId([...agentRankId, 7])
    //     setsuccessorName([...successorName, eventName])
    //     setSuccessorData([...successorData, eventValue])
    //     {

    //         if (props.getFilterDataFromPrimaryAgent <= 0) {

    //             let filterName = successorListData.filter((items) => {
    //                 return items.value == eventValue
    //             })
    //             konsole.log("filterName", filterName[0].label)
    //             setSuccessorData1([...successorData1, filterName[0].label])
    //             setSuccessorData2([...successorData2, filterName[0].relationWithUser])

    //             let filteredList = successorListData.filter((filList) => {
    //                 return filList.value !== eventValue
    //             });
    //             setSuccessorSelectedValue1(filteredList)

    //         } else {

    //             let filterName = props.getFilterDataFromPrimaryAgent.filter((items) => {
    //                 return items.value == eventValue
    //             })
    //             konsole.log("filterName", filterName[0].label)
    //             setSuccessorData1([...successorData1, filterName[0].label])
    //             setSuccessorData2([...successorData2, filterName[0].relationWithUser])

    //             let filteredList = props.getFilterDataFromPrimaryAgent.filter((filList) => {
    //                 return filList.value !== eventValue
    //             });
    //             setSuccessorSelectedValue1(filteredList)

    //         }
    //     }

    // }
    // if (eventName == "2nd Successor") {

    //     let filterName = successorListData.filter((items) => {
    //         return items.value == eventValue
    //     })
    //     setSuccessorData2([...successorData2, filterName[0].relationWithUser])
    //     setSuccessorData1([...successorData1, filterName[0].label])
    //     setAgentRankId([...agentRankId, 8])
    //     setsuccessorName([...successorName, eventName])
    //     setSuccessorData([...successorData, eventValue])

    //     let filteredList = successorSelectedValue1.filter((filList) => {
    //         return filList.value !== eventValue
    //     });

    //     setSuccessorSelectedValue2(filteredList)

    // }
    // if (eventName == "3rd Successor") {

    //     let filterName = successorListData.filter((items) => {
    //         return items.value == eventValue
    //     })

    //     setSuccessorData1([...successorData1, filterName[0].label])
    //     setSuccessorData2([...successorData2, filterName[0].relationWithUser])
    //     setsuccessorName([...successorName, eventName])

    //     setSuccessorData([...successorData, eventValue])
    //     setAgentRankId([...agentRankId, 9])

    //     let filteredList = successorSelectedValue2.filter((filList) => {
    //         return filList.value !== eventValue
    //     });
    //     setSuccessorSelectedValue3(filteredList)

    // }
    // if (eventName == "4th Successor") {

    //     let filterName = successorListData.filter((items) => {
    //         return items.value == eventValue
    //     })

    //     setSuccessorData1([...successorData1, filterName[0].label])
    //     setSuccessorData2([...successorData2, filterName[0].relationWithUser])
    //     setsuccessorName([...successorName, eventName])

    //     setSuccessorData([...successorData, eventValue])
    //     setAgentRankId([...agentRankId, 10])
    //     let filteredList = successorSelectedValue3.filter((filList) => {
    //         return filList.value !== eventValue
    //     });
    //     setSuccessorSelectedValue4(filteredList)

    // }
    // if (eventName == "5th Successor") {

    //     let filterName = successorListData.filter((items) => {
    //         return items.value == eventValue
    //     })

    //     setSuccessorData1([...successorData1, filterName[0].label])
    //     setSuccessorData2([...successorData2, filterName[0].relationWithUser])
    //     setsuccessorName([...successorName, eventName])

    //     setSuccessorData([...successorData, eventValue])
    //     setAgentRankId([...agentRankId, 11])
    //     let filteredList = successorSelectedValue4.filter((filList) => {
    //         return filList.value !== eventValue
    //     });
    //     setSuccessorSelectedValue5(filteredList)

    // }
  };


  const filterDataForAgentId = (agentId) =>{
    return props.getSuccessorData.filter((x)=>x?.agentRankId == agentId)[0]?.agentId
  }

  const agentUpsertApi = () => {

    let successorDataForBind = [];

    for (let i = 0; i < fields.length; i++) {
      successorDataForBind.push({
        noOfSuccessor: successorName[i],
        fullName: fields[i]?.label,
        relationWithMember: fields[i]?.relationWithUser,
      });
    }

    konsole.log("successorDataForBind", successorDataForBind);

    props.setGetSuccessorData(successorDataForBind);
    props.setNewGetSuccessorData(successorDataForBind);




    konsole.log("agentUpsertApiagentUpsertApi", fields)
    let apiUpsertData = [];
    
    if(props.getSuccessorData.length !== 0){

      


      let mapsaveEditDataJson = props.getSuccessorData.map((data)=>{
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
          memberUserId: userIdData,
          agentRoleId: props.postRoleId,
          agentRankId: filterDataForAgentRankId[0]?.agentRankId,
        agentAcceptanceStatus: false,
        agentActiveStatus: true,
        fileId: props.postfileId,
        legalDocId: props.postLegalDocId,
        testDocId: props.posttestDocId,
        testSupportDocId: props.postTestSupportDocId,
        upsertedBy: userIdData,
      })
    }
    


    konsole.log("apiUpsertDataapiUpsertData", apiUpsertData)
    
    // ......................... Removed UserId ....................................................................................................

    
    for(let i = 0; i < RemovedUserId.length; i++){
      let filterDataForRemoved = props.getSuccessorData.filter((x)=>{
        return x.agentUserId ==  RemovedUserId[i]
      })

      apiUpsertData.push({
        agentId: filterDataForRemoved[0]?.agentId,
        agentUserId: RemovedUserId[i],
        memberUserId: userIdData,
        agentRoleId: props.postRoleId,
        agentRankId: filterDataForRemoved[0]?.agentRankId,
      agentAcceptanceStatus: false,
      agentActiveStatus: false,
      fileId: filterDataForRemoved[0]?.fileId,
      legalDocId: props.postLegalDocId,
      testDocId: props.posttestDocId,
      testSupportDocId: props.postTestSupportDocId,
      upsertedBy: userIdData,
    })
  }
  


  konsole.log("apiUpsertDataapiUpsertDataRe", apiUpsertData)
  
  
  // ........................... Repeated UserID .......................................................
  
  for(let i = 0; i < RepeatedUserId.length; i++){
    let filterDataForRemoved = props.getSuccessorData.filter((x)=>{
      return x.agentUserId ==  RepeatedUserId[i]
    })
    let filterDataForAgentRankId = fields.filter((x)=>{
      return x?.value == RepeatedUserId[i]
    })

    apiUpsertData.push({
      agentId: filterDataForRemoved[0]?.agentId,
      agentUserId: RepeatedUserId[i],
      memberUserId: userIdData,
      agentRoleId: props.postRoleId,
      agentRankId: filterDataForAgentRankId[0]?.agentRankId,
    agentAcceptanceStatus: false,
    agentActiveStatus: true,
    fileId: props.postfileId,
    legalDocId: props.postLegalDocId,
    testDocId: props.posttestDocId,
    testSupportDocId: props.postTestSupportDocId,
    upsertedBy: userIdData,
  })
}



konsole.log("apiUpsertDataapiUpsertDataRep", apiUpsertData)


    }else{

      
    for (let i = 0; i < fields.length; i++) {
      apiUpsertData.push({
        agentId: allAgentRankId?.includes(agentRankId[i]) ? filterDataForAgentId(agentRankId[i]) : 0,
        agentUserId: fields[i]?.value,
        memberUserId: userIdData,
        agentRoleId: props.postRoleId,
        agentRankId: agentRankId[i],
        agentAcceptanceStatus: false,
        agentActiveStatus: true,
        fileId: props.postfileId,
        legalDocId: props.postLegalDocId,
        testDocId: props.posttestDocId,
        testSupportDocId: props.postTestSupportDocId,
        upsertedBy: userIdData,
      });
    }
konsole.log("apiUpsertDataapiUpsertData",apiUpsertData)
}
    props.setGetSuccessorApiData(apiUpsertData);
    props.setJsonOpreator("SuccessorData");

    props.handleShowSuccessor();



  };

  // const RunPostAPi = (dataApi) => {
  //     $CommonServiceFn.InvokeCommonApi("POST", $Service_Url.postAgentUpsert,
  //         dataApi, (response) => {
  //             konsole.log("upsertt", response)
  //             if (response) {
  //                 props.handleShowSuccessor();
  //             }

  //         })
  // }

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

  const flterreturndata = (e, index) => {
    let valuedata = e.target.value;
    // let filterdata=returndata.filter((v)=>{
    //   return v.value !== valuedata
    // })
    konsole.log("index", index);
    setAgentRankId([...agentRankId, index + 7]);

    let fieldsValue = fields;
    fieldsValue[index].value = e.target.value;
    
    setUpdate(!update);
    // ....................................................................................................
    let eventValue = e.target.value;
    konsole.log("SuccessorValue", e.target.value);
    konsole.log("SuccessorValue", e.target.name);
    
    // setsuccessorName([...successorName, eventName])
    setSuccessorData([...successorData, eventValue]);
    let filterName = successorListData.filter((items) => {
      return items.value == eventValue;
    });
    setSuccessorData1([...successorData1, filterName[0].label]);
    setSuccessorData2([...successorData2, filterName[0].relationWithUser]);
    fieldsValue[index].label = filterName[0].label;
    fieldsValue[index].relationWithUser = filterName[0].relationWithUser;
    fieldsValue[index].agentRankId = index+7;
    setFields(fieldsValue);
    konsole.log("fileds2", fieldsValue);
    // setReturndata(filterdata)
  };

  const DynamicData1 = (coAgentLength) => {
    let eventvalue = props?.getSuccessorData;
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
  const [saveEditDataJson, setSaveEditDataJson] = useState([])
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
        arr.push(createjsonfunction(eventvalue[i]));
      }
    } else {
      for (let i = 0; i < fixValue.length; i++) {
        konsole.log("array object", createjsonfunction());
        arr.push(createjsonfunction(fixValue[i]));
      }
    }
    setFields(arr);
    setSaveEditDataJson(arr)
    // setsuccessorName(arr)
  };

  konsole.log("ArrayData", fields);

  const createjsonfunction = (apiData) => {
    return {
      value: apiData?.agentUserId,
      relationWithUser: apiData?.relationWithMember,
      label: apiData?.fullName,
      agentRankId: apiData?.agentRankId
    };
  };

  return (
    <>
      <Modal show={props.show} centered onHide={props.handleShowSuccessor} backdrop="static">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Successor Agents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className=" d-flex justify-content-start ">
              {/* <p className="p-2 fs-5 " id="btnData">No of Successor <span className='ms-5 border px-4 p-1 '> 05 </span> </p> */}
              <label className="p-2 fs-5 my-2">No of Successor: </label>
              <input
                type="text"
                placeholder=""
                defaultValue={dataLength}
                className="DynamicFields px-5 my-2 w-25"
                style={{ border: "1px solid #751521" }}
                onKeyUp={(props?.getSuccessorData > 0)? DynamicData : DynamicData1}
              />
            </div>
            <div className="d-flex flex-sm-column">
              {/* {
                                fields.map((item) => {
                                    return (
                                        <>
                                            <div>

                                                <p className="p-2">{item} successor</p>

                                                <select className='w-75  border'onChange={(e)=> flterreturndata(e, index)} style={{ color: "#751521", width: "20px" }}>
                                                    <option >
                                                        Choose Successor</option>
                                                    {
                                                        successorListData.map((items) => {

                                                            return (
                                                                <option value={items.value}>{items.label}-{items.relationWithUser} </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </>
                                    )
                                })
                            } */}

              {/* ......................................... */}

              {fields.map((item, index) => {
                let filtereddata;
                if (props.filterData.length <= 0) {
                  filtereddata = successorListData.filter((v) => {
                    let query = true;
                    if (generateQuery(v.value, index) !== "") {
                      query = eval(generateQuery(v.value, index));
                      konsole.log("query", query);
                    }
                    return query;
                  });
                } else {
                  filtereddata = props.filterData.filter((v) => {
                    let query = true;
                    if (generateQuery(v.value, index) !== "") {
                      query = eval(generateQuery(v.value, index));
                      konsole.log("query", query);
                    }
                    return query;
                  });
                }

                konsole.log("query filtered", filtereddata);
                // props.setFilterData(filtereddata)
                // setprimarySelectedValue6(filtereddata)

                return (
                  <>
                    <div>
                      <p className="p-2">Successor{" "}{index + 1} </p>

                      <select
                        className="w-75  border"
                        //  onChange={filteredFidList}
                        value={item.value}
                        onChange={(e) => flterreturndata(e, index)}
                        style={{ color: "#751521", width: "20px" }}
                      >
                        <option>Choose Successor</option>
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
            {/* ....................................................................................................... */}
            {/* </div>
                        <div className=" d-flex justify-content-start ">
                            <p className="p-2 fs-5 ">1st successor</p>
                            <div className="p-2 w-75 ">
                                <select className='w-100  border' name='1st Successor' onChange={SuccessorValue} style={{ color: "#751521" }}>
                                    <option value="Choose Successor" >Choose Successor</option>
                                    {props.getFilterDataFromPrimaryAgent <= 0 ?

                                        successorListData.map((items) => {
                                            konsole.log("FilterDataConsole", items)
                                            konsole.log("FilterDataConsolewww ", successorSelectedValue1)
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser} </option>
                                            )
                                        }) :
                                        props.getFilterDataFromPrimaryAgent.map((items) => {
                                            konsole.log("FilterDataConsole", items)
                                            konsole.log("FilterDataConsolewww ", successorSelectedValue1)
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser}</option>
                                            )
                                        })

                                    }


                                </select>
                            </div>
                        </div>
                        <div className=" d-flex justify-content-start ">
                            <p className="p-2 fs-5 ">2nd successor</p>
                            <div className="p-2 w-75 ">
                                <select className='w-100  border' name='2nd Successor' onChange={SuccessorValue} style={{ color: "#751521" }}>
                                    <option value="Choose Successor" >Choose Successor</option>
                                    {
                                        successorSelectedValue1.map((items) => {
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className=" d-flex justify-content-start ">
                            <p className="p-2 fs-5 ">3rd successor</p>
                            <div className="p-2 w-75 ">
                                <select className='w-100  border' name='3rd Successor' onChange={SuccessorValue} style={{ color: "#751521" }}>
                                    <option value="Choose Successor" >Choose Successor</option>
                                    {
                                        successorSelectedValue2.map((items) => {
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className=" d-flex justify-content-start ">
                            <p className="p-2 fs-5 ">4th successor</p>
                            <div className="p-2 w-75 ">
                                <select className='w-100  border' name='4th Successor' onChange={SuccessorValue} style={{ color: "#751521" }}>
                                    <option value="Choose Successor" >Choose Successor</option>
                                    {
                                        successorSelectedValue3.map((items) => {
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className=" d-flex justify-content-start ">
                            <p className="p-2 fs-5 ">5th successor</p>
                            <div className="p-2 w-75 ">
                                <select className='w-100  border' name='5th Successor' onChange={SuccessorValue} style={{ color: "#751521" }}>
                                    <option value="Choose Successor" >Choose Successor</option>
                                    {
                                        successorSelectedValue4.map((items) => {
                                            return (
                                                <option value={items.value}>{items.label
                                                }-{items.relationWithUser}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div> */}

            {/* ....................................................................................................... */}

            <div className="d-flex justify-content-center text-center mt-2">
              {/* {/ <Button className='btn btn-primary  w-25 text-center' onClick={props.handleShowSuccessor}> /} */}
              <Button
                className="btn btn-primary  w-25 text-center"
                onClick={agentUpsertApi}
              >
                SAVE
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Successormodal;
