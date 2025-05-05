 import React, {forwardRef,useEffect,useState} from 'react';
import { $AHelper } from '../../Helper/$AHelper';
import { Form, Col, Row, Button } from 'react-bootstrap';
import {useAppDispatch} from '../../Hooks/useRedux';
import { fetchOccupationData } from '../../Redux/Reducers/apiSlice';
import { CustomRadioAndCheckBox, CustomTextarea2,CustomNumInput, CustomSelect } from '../../Custom/CustomComponent';
import konsole from '../../../components/control/Konsole';
import { useLoader } from '../../utils/utils';
import usePrimaryUserId from '../../Hooks/usePrimaryUserId';


const LifeStyle = forwardRef((props,ref) => {
    const [isWorking, setIsWorking] = useState('')
    const {isPrimaryMemberMaritalStatus} = usePrimaryUserId()
    const dispatch = useAppDispatch();
    const startingTabIndex = props?.startTabIndex ?? 0;

    let currentTabIndex = startingTabIndex;

    const getNextTabIndex = () => {
        return currentTabIndex++;
    };


     useEffect(() => {
        fetchSavedData(props?.userId)
     }, [props?.userId])
     

      //////////////////////occupation
      const fetchSavedData = async (userId) => {
        useLoader(true)
        const _resultOfOcupation = await dispatch(fetchOccupationData({ userId }));
        if(_resultOfOcupation !== 'err' && _resultOfOcupation?.payload.length > 0){
            setIsWorking(_resultOfOcupation?.payload[0]?.isWorking)
        }       
        useLoader(false)
    };

     //////////  create a json for drink
     const  JSONObj = ( userId, userSubjectDataId, responseId, responseValue, subjectId,labelId) => {
        return {
          userId: userId,
          userSubjectDataId: userSubjectDataId == null ? 0 : userSubjectDataId,
          responseId: responseId,
          subResponseData: responseValue,
          subjectId: subjectId,
          labelId:labelId
        };
     };

     /////////// handle all input and checkbox and radio inputs data
     const handleChange = (e,item,index,name,lable) => {
        const eventId = item?.responseId;
        const eventValue = item?.response;
        let textAreaValue;
        
        if(e.target?.type == "textarea"){
            textAreaValue = e.target.value
            props?.setFormlabelData(prevState => ({
                ...prevState,
                [lable]: {
                    ...prevState[lable],
                    response: prevState[lable].response.map(item => ({
                        ...item,
                        response : e?.target?.value
                    }))
                }
            }));

        }
        if(e?.target?.type == "checkbox"){
            let updatedResponses  = props?.formlabelData[lable].response?.map((ele) => ({
                ...ele,
                checked: (ele.responseId == eventId) ? (e?.target?.checked) : false
                // checked: e.target.checked
            })) || []

           
            props?.setFormlabelData(prevState => ({
                ...prevState,
                [lable]: {
                    ...prevState[lable],
                    response: updatedResponses
                }
            }));
         
        }
    
     
        if(name == "habit"){
            props?.setuserDetails((prevState) => ({...prevState,habit1: eventValue == "Regularly exercise" ? true : false}));
            props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                habit: {
                    ...prevState.habit, // Spread the existing habit state
                    userSubjectDataId: props?.formlabelData?.label103?.userSubjectDataId ? props?.formlabelData?.label103?.userSubjectDataId : 0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: props?.formlabelData.label103 && props?.formlabelData.label103.questionId,
                    labelId: 103
                },
            }));        
        } else if (name == "healthy") {
            props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                healthy: {
                    ...prevState.healthy, // Spread the existing habit state
                    userSubjectDataId: props?.formlabelData?.label102?.userSubjectDataId ? props?.formlabelData?.label102?.userSubjectDataId : 0,
                    responseId: eventId,
                    subResponseData: eventValue,
                    subjectId: props?.formlabelData.label102 && props?.formlabelData.label102.questionId,
                    labelId: 102
                },
            }));  
        } else if (name == "weekExerciseId") {
            let weekId = props?.formlabelData.label104.response.filter((fil, index) => {return fil.responseId == e?.value})[0];       
            props?.setuserDetails((prevState) => ({...prevState,weekExerciseValue: weekId?.responseId ?? null}));
            props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                weekExerciseId: {
                  ...prevState.weekExerciseId, // Spread the existing habit state
                  userSubjectDataId: props?.formlabelData.label104?.userSubjectDataId ? props?.formlabelData.label104.userSubjectDataId : 0,
                  responseId: weekId?.responseId ?? null,
                  subjectId: props?.formlabelData.label104 && props?.formlabelData.label104.questionId,
                  labelId:104
                },
            }));  
        } else if (name == "exerciseDescribe") {
        props?.setuserDetails((prevState) => ({
                    ...prevState, // Spread the existing primaryState
                    exerciseDescribe: {
                      ...prevState.exerciseDescribe, // Spread the existing habit state
                      userSubjectDataId: props?.formlabelData?.label196?.userSubjectDataId ? props?.formlabelData?.label196?.userSubjectDataId  : 0,
                      responseId: eventId,
                      subResponseData :textAreaValue,
                      subjectId: props?.formlabelData.label196 &&  props?.formlabelData.label196.questionId,
                      labelId:196
                    },
        }));        
        } else if (name == "eatingHabit") {
           props?.setuserDetails((prevState) => ({
                    ...prevState, // Spread the existing primaryState
                    eatingHabitScale: {
                      ...prevState.eatingHabitScale, // Spread the existing habit state
                      userSubjectDataId: props?.formlabelData?.label1042?.userSubjectDataId ? props?.formlabelData?.label1042?.userSubjectDataId  : 0,
                      responseId: eventId,
                      subResponseData :textAreaValue,
                      subjectId: props?.formlabelData.label1042 &&  props?.formlabelData.label1042.questionId,
                      labelId:1042
                    },
            }));   
        } else if (name == "long") {
            props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                long: {
                  ...prevState.long, // Spread the existing habit state
                  userSubjectDataId: props?.formlabelData?.label105?.userSubjectDataId ? props?.formlabelData?.label105?.userSubjectDataId  : 0,
                  responseId: eventId,
                  subResponseData :textAreaValue,
                  subjectId: props?.formlabelData.label105 &&  props?.formlabelData.label105.questionId,
                  labelId:105
                },
            }));
        } else if (name == "checkup") {
             props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                checkup: {
                  ...prevState.checkup, // Spread the existing habit state
                  userSubjectDataId: props?.formlabelData?.label107?.userSubjectDataId ? props?.formlabelData?.label107?.userSubjectDataId  : 0,
                  responseId: eventId,
                  subResponseData: eventValue,
                  subjectId: props?.formlabelData.label107 &&  props?.formlabelData.label107.questionId,
                  labelId:107
                },
            }));  
        } else if (name == "worry") {
        props?.setuserDetails((prevState) => ({...prevState,worryAboutHealth: eventValue == "Yes" ? true : false}));
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            worry: {
              ...prevState.worry, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label108?.userSubjectDataId ? props?.formlabelData?.label108?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData: eventValue,
              subjectId: props?.formlabelData.label108 &&  props?.formlabelData.label108.questionId,
              labelId:108
            },
        }));  
        } else if (name == "socially"){
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            socially: {
              ...prevState.socially, // Spread the existing habit state
                userSubjectDataId: props?.formlabelData?.label109?.userSubjectDataId ? props?.formlabelData?.label109?.userSubjectDataId  : 0,
                responseId: eventId,
                subResponseData :textAreaValue,
                subjectId: props?.formlabelData.label109 &&  props?.formlabelData.label109.questionId,
                labelId:109
            },
        }));
        } else if (name == "worryHealth") {
           props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            worryHealth: {
              ...prevState.worryHealth, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label949?.userSubjectDataId ? props?.formlabelData?.label949?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData :textAreaValue,
              subjectId: props?.formlabelData.label949 &&  props?.formlabelData.label949.questionId,
              labelId:949
            },
        }));
        } else if (name == "purpose") {
         props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            purpose: {
              ...prevState.purpose, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label110?.userSubjectDataId ? props?.formlabelData?.label110?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData :textAreaValue,
              subjectId: props?.formlabelData.label110 &&  props?.formlabelData.label110.questionId,
              labelId:110
            },
        }));
        } else if (name == "quitSmoke") {
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            quitSmoke: {
              ...prevState.quitSmoke, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label1036?.userSubjectDataId ? props?.formlabelData?.label1036?.userSubjectDataId  : 0,
            responseId: eventId,
            subResponseData : textAreaValue,
            subjectId: props?.formlabelData.label1036 &&  props?.formlabelData.label1036.questionId,
            labelId:1036
            },
        }));
        } else if (name == "drug") {
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            drug: {
              ...prevState.drug, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label111?.userSubjectDataId ? props?.formlabelData?.label111?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData: eventValue,
              subjectId: props?.formlabelData.label111 &&  props?.formlabelData.label111.questionId,
              labelId:111
            },
        }));
        props?.setuserDetails((prevState) => ({...prevState,isDrugs: eventValue}));
        
        } else if (name == "smoke") {  
             props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                smoke: {
                  ...prevState.smoke, // Spread the existing habit state
                  userSubjectDataId: props?.formlabelData?.label112?.userSubjectDataId ? props?.formlabelData?.label112?.userSubjectDataId  : 0,
                  responseId: eventId,
                  subResponseData: eventValue,
                  subjectId: props?.formlabelData.label112 &&  props?.formlabelData.label112.questionId,
                  labelId:112
                },
            }));  
            props?.setuserDetails((prevState) => ({...prevState,isSmoke: eventValue}));
            
        } else if (name == "everSmoke") {
            props?.setuserDetails((prevState) => ({...prevState,isEverSmoked: eventValue}));             
            props?.setuserDetails((prevState) => ({
                ...prevState, // Spread the existing primaryState
                everSmoke: {
                  ...prevState.everSmoke, // Spread the existing habit state
                  userSubjectDataId: props?.formlabelData?.label1035?.userSubjectDataId ? props?.formlabelData?.label1035?.userSubjectDataId  : 0,
                  responseId: eventId,
                  subResponseData: eventValue,
                  subjectId: props?.formlabelData.label1035 &&  props?.formlabelData.label1035.questionId,
                  labelId:1035
                },
            }));    
        } else if (name == "alcohol") {
          props?.setuserDetails((prevState) => ({...prevState,alcohol1: eventValue == "Yes" ? true : false}));
          props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            alcohol: {
              ...prevState.alcohol, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label113?.userSubjectDataId ? props?.formlabelData?.label113?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData: eventValue,
              subjectId: props?.formlabelData.label113 &&  props?.formlabelData.label113.questionId,
              labelId:113
            },
        }));  
        } else if (name == "beer") {

          const userSubjectDataId = item?.userSubjectDataId ? item?.userSubjectDataId  : 0;
          const indexOfbeer = index;
          const eventChecked = e.target.checked;
          const questionId = props?.formlabelData.label195?.questionId ? props?.formlabelData?.label195?.questionId: null;
          let labelResponseList = props?.formlabelData.label195;
          let beerRelatedObj = props?.userDetails?.beer;
          let beerRelatedObjFilter = props?.userDetails?.beer?.filter((filt) => filt.responseId !== eventId);

        const isUserSubjectDataIdValid = $AHelper.$isNotNullUndefine(userSubjectDataId);

                    if (isUserSubjectDataIdValid) {
                        if (eventChecked) {
                            beerRelatedObj = [
                                ...beerRelatedObjFilter,
                                JSONObj(props?.userId, userSubjectDataId, eventId, eventValue, questionId, 195)
                            ];
                        } else {
                            beerRelatedObj = [
                                ...beerRelatedObjFilter,
                                JSONObj(props?.userId, userSubjectDataId, eventId, null, questionId, 195)
                            ];
                        }
                    } else if (!isUserSubjectDataIdValid && eventChecked === false) {
                        beerRelatedObj = props.beer.filter(filt => filt.responseId !== eventId);
                    }

                    // Assuming indexOfbeer is defined and used for updating labelResponseList
                    if (indexOfbeer >= 0) {
                        labelResponseList.response[indexOfbeer].checked = eventChecked;
                    }      
                     
          props?.setuserDetails((prevState) => ({...prevState,beer: beerRelatedObj}));
 
          props?.setFormlabelData({
            ...props?.formlabelData,
            labelResponseList: labelResponseList
          });
        } else if (name == "drinks") {
            props?.setFormlabelData(prevState => ({
                ...prevState,
                [lable]: {
                    ...prevState[lable],
                    response: prevState[lable].response.map(item => ({
                        ...item,
                        response : e
                    }))
                }
            }));
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            drinks: {
              ...prevState.drinks, // Spread the existing habit state
                userSubjectDataId: props?.formlabelData?.label194?.userSubjectDataId ? props?.formlabelData?.label194?.userSubjectDataId  : 0,
                responseId: eventId,
                subResponseData: e,
                subjectId: props?.formlabelData.label194 &&  props?.formlabelData.label194.questionId,
                labelId:194
            },
        }));  
        
        } else if (name == "naturalHabitId") {
          let natureId = props?.formlabelData.label106.response.filter((fil, index) => {  return fil.responseId == e?.value})[0];
        props?.setuserDetails((prevState) => ({...prevState,naturalHabitIdSave: natureId?.responseId ?? null}));        
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            naturalHabitId: {
              ...prevState.naturalHabitId, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData.label106?.userSubjectDataId ? props?.formlabelData.label106.userSubjectDataId : 0,
              responseId: natureId?.responseId ?? null,
              subjectId: props?.formlabelData.label106 && props?.formlabelData.label106.questionId,
              labelId:106
            },
        }));  




        } else if(name == "drugsName"){
        props?.setuserDetails((prevState) => ({
            ...prevState, // Spread the existing primaryState
            drugsName: {
              ...prevState.drugsName, // Spread the existing habit state
              userSubjectDataId: props?.formlabelData?.label1038?.userSubjectDataId ? props?.formlabelData?.label1038?.userSubjectDataId  : 0,
              responseId: eventId,
              subResponseData : textAreaValue,
              subjectId: props?.formlabelData.label1038 &&  props?.formlabelData.label1038.questionId,
              labelId:1038
            },
        }));  

     }};


      /////////  costum function for all text area
     const _questionAndAnswerTextArea = (lable,formLabelDatawithlabel, name, withlabel,placeholder, startTabIndex) => {

    const startingTabIndex = startTabIndex ?? 0;
    let currentTabIndex = startingTabIndex;

    const getNextTabIndex = () => {
        return currentTabIndex++;
    };


            return (
            <>
            <Row className="mb-4 mt-3" >
                {formLabelDatawithlabel && formLabelDatawithlabel?.response?.map((item, index) => {
                return <>
                <div className={`${props.isPersonalMedical ? "custom-input-field full-width ms-3" : "custom-input-field full-width ms-3"}`} id={'label' + formLabelDatawithlabel?.response}>
                    <p className={`${props.isPersonalMedical ? "custom-input-field full-width mb-2" : "custom-input-field full-width mb-2"}`}>{lable}</p>
                    <Col className={`${(props?.step == '2' )? 'pe-3' : 'pe-4'}`} xs={12} md={12} style={{ backgroundColor: "#dee2e642", borderRadius: "8px", padding: "12px 14px" ,width:"fit-content"}}>
                    <CustomTextarea2
                        tabIndex={getNextTabIndex()}
                        key={index}
                        value={item?.response}
                        id={item?.responseId}
                        onChange={(e) => handleChange(e,item,"",name,withlabel)}
                        placeholder={placeholder}
                    />
                    </Col>
                </div>
                </>
            })}
            </Row>
            </>
            )    
        }  
     ///////// costm function for all radio buttons 
     const _questionAndAnswerRadio = (formLabelDatawithlabel, name, withlabel, startTabIndex) => {

        const startingTabIndex = startTabIndex ?? 0;
        let currentTabIndex = startingTabIndex;
    
        const getNextTabIndex = () => {
            return currentTabIndex++;
        };
            return (
            <>
            <Row className="mt-0 ms-1 mb-2">
                            <Col xs={12} md={12}>
                                <CustomRadioAndCheckBox
                                    tabIndex = {getNextTabIndex()}
                                    label = ""                                    
                                    type="checkbox"                                 
                                    value={formLabelDatawithlabel?.response?.filter((ele)=>ele?.checked)}
                                    id={withlabel}
                                    name={name}
                                    onChange={(e,item,index) => handleChange(e,item,index,name,withlabel)}
                                    placeholder={formLabelDatawithlabel && withlabel !== "label103" && formLabelDatawithlabel?.question}   
                                    options={formLabelDatawithlabel?.response.map((ele) => ele)}
                                     />
                            </Col>
                        </Row>
            
            </>
            )
     }
     const len = isPrimaryMemberMaritalStatus ? 9 : 5
     const _questionAndAnswerDropDown = (formLabelDatawithlabel,name,withlabel,value, startTabIndex) => {

        const startingTabIndex = startTabIndex ?? 0;
        let currentTabIndex = startingTabIndex;
    
        const getNextTabIndex = () => {
            return currentTabIndex++;
        };
            return (
            <>
                    <Row className="mt-0 mb-2 ms-2" id='lifeStyleSelect'>
                        <Col xs={len} xl={len} md={len} className='ps-2'> 

                            <CustomSelect
                                isPersonalMedical
                                tabIndex={getNextTabIndex()}
                                isError=""
                                // label={formLabelDatawithlabel?.question}
                                placeholder={"Select"}
                                options={formLabelDatawithlabel?.response?.map((ele) => ({ label: ele?.response, value: ele?.responseId }))}
                                onChange={(e) => handleChange(e, "", "", name)}
                                value={value}
                                name={name}
                                isDisable=""
                                id={withlabel}
                            />
                        </Col>
                    </Row>
            
            </>
            )
     }



   

     return (
        <>
            <Row id='contactDetails' className=' aspectRatio1AllCheckBox'>
                {props?.lifestylePlaceholder &&
                    <Col xs={12} xl={3} className=''>
                        <div className="heading-of-sub-side-links-3">{props?.lifestylePlaceholder}</div>
                    </Col>
                }
                {konsole.log(props,"sdjsjdajdaiDAHDKHSDJKSADADJK")}
                {props?.step == 1 ? <>
                     <Col className='p-0'>
                         <div className='ms-1 spacingBottom' style={{ marginTop: "11px" }}>
                             {_questionAndAnswerRadio(props?.formlabelData?.label102, 'healthy', 'label102')}
                         </div>

                         <Row className=" ms-1">
                             <Col xs={12} md={12} className='mt-0 ms-1 pt-2 pb-2'>
                                 <label>{props?.formlabelData.label103 && props?.formlabelData?.label103?.question}</label>                                
                             </Col>
                         </Row>

                         {_questionAndAnswerRadio(props?.formlabelData?.label103,'habit', 'label103')}
                         <div className='ms-2'>
                         <label className="p-0 fw-bold description">{props?.userDetails?.habit1 && props?.formlabelData.label104 && props?.formlabelData?.label104?.question}</label>
                         </div>
                         {props?.userDetails?.habit1 && props?.formlabelData.label104 &&                                                
                         _questionAndAnswerDropDown(props?.formlabelData?.label104,"weekExerciseId","label104",props?.userDetails?.weekExerciseValue)}
                         {_questionAndAnswerTextArea("", props?.formlabelData?.label196, 'exerciseDescribe', 'label196', "Describe")}
                         {props?.userDetails?.habit1 && _questionAndAnswerTextArea(props?.formlabelData.label105?.question, props?.formlabelData?.label105, 'long', 'label105', "Describe")}

                         <div className='ms-1' >{_questionAndAnswerRadio(props?.formlabelData?.label108, 'worry', 'label108')}</div>
                         {(props?.userDetails?.worryAboutHealth == true) && _questionAndAnswerTextArea(props?.formlabelData.label949?.question, props?.formlabelData?.label949, 'worryHealth', 'label949', "Describe")}
                         <div className='ms-1'>{_questionAndAnswerRadio(props?.formlabelData?.label107, 'checkup', 'label107')}</div>

                         <Row className="spacingBottom" style={{ marginLeft: "7px" }}>
                             <Col className="pt-2 pb-2 mb-3">
                                 <div className="d-flex justify-content-start align-items-start ">
                                     <h6 className=" p-0 fw-bold description">Tell us about your Nutrition habits (Things like portion control,less sugar,water intake, avoid sugar drinks , less red meat, vegetables and fruits, etc.)</h6>                                   
                                  </div>                   
                         </Col>
                         </Row>
                         <div className='ms-3'>
                         <label className="pe-5 fw-bold description">{props?.formlabelData.label106 && props?.formlabelData?.label106?.question}</label>
                         </div>
                         {_questionAndAnswerDropDown(props?.formlabelData?.label106,"naturalHabitId","label106",props?.userDetails?.naturalHabitIdSave)}   

                         {(props?.userDetails?.naturalHabitIdSave < 197 && props?.userDetails?.naturalHabitIdSave >= 185) && <div className='ms-1'>{_questionAndAnswerTextArea(props?.formlabelData.label1042?.question, props?.formlabelData?.label1042, 'eatingHabit', 'label1042', "Describe")}</div>}
                     </Col>



                </> : props?.step == 2 ? <>
                    <Col >
                    <div className='' style={{marginTop:"11px"}}>
                        {_questionAndAnswerRadio(props?.formlabelData?.label111, 'drug', 'label111')}
                    </div>    
                        {props?.userDetails?.isDrugs == "Yes" &&  _questionAndAnswerTextArea(props?.formlabelData?.label1038?.question,props?.formlabelData?.label1038,'drugsName','label1038',"Enter drugs....")}
                        {_questionAndAnswerRadio(props?.formlabelData?.label112, 'smoke', 'label112')}
                        {props?.userDetails?.isSmoke == "No" &&  _questionAndAnswerRadio(props?.formlabelData?.label1035, 'everSmoke', 'label1035')}                    
                        {props?.userDetails?.isEverSmoked == "Yes" && props?.userDetails?.isSmoke == "No" &&
                         _questionAndAnswerTextArea(props?.formlabelData?.label1036?.question,props?.formlabelData?.label1036,'quitSmoke','label1036',"Describe")}
                        {_questionAndAnswerRadio(props?.formlabelData?.label113, 'alcohol', 'label113')}
                        
                         {props?.userDetails?.alcohol1 == true && 
                         <div className='ms-1 pb-2 spacingBottom' style={{ backgroundColor: "#dee2e642", borderRadius: "8px"}}>
                            <Row className="p-3">
                            <div className="custom-input-field" id={'label' + props?.formlabelData?.label194}>
                                <p>{props?.formlabelData?.label194?.question}</p>
                                <Col xs={12} md={6} lg={5}>

                                    {props?.formlabelData?.label194 && props?.formlabelData?.label194?.response?.map((item, index) => {
                                     return <>                                     
                                     <CustomNumInput
                                      tabIndex={()=>getNextTabIndex()} 
                                      type="text"
                                      value={item?.response}
                                      id={"drinks"}                                     
                                      onChange={(e) => handleChange(e,item,"","drinks","label194")}
                                      placeholder={"Enter number...."} />
                                </>
                            })}
                                </Col>
                            </div>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={12} md={12} className='ms-4'>
                                    <CustomRadioAndCheckBox
                                        tabIndex={getNextTabIndex()}
                                        placeholder={props?.formlabelData.label195 && props?.formlabelData?.label195?.question}
                                        name='beer'
                                        type="checkbox"
                                        options={props?.formlabelData?.label195?.response.map((ele) => ele)}
                                        onChange={(e,item,index) => handleChange(e,item,index,"beer","label195")}
                                        placeholderConstant="showCheckboxDesign"
                                        />
                                </Col>
                            </Row>
                        </div>
                       }
                       
                    </Col>

                </> : <>
                     <Col xs={12} xl={props?.lifestylePlaceholder ? 9 : 9}>
                     <div className='' style={{marginTop:"11px"}}>
                        {_questionAndAnswerTextArea(props?.formlabelData?.label109?.question,props?.formlabelData?.label109, 'socially', 'label109',"Describe.........")}
                    </div>    
                  
                    {isWorking == true && _questionAndAnswerTextArea(props?.formlabelData?.label110?.question,props?.formlabelData?.label110, 'purpose', 'label110',"Describe.........")}
                    </Col>
                </>}



            </Row>
        </>
    )
});

export default React.memo(LifeStyle)