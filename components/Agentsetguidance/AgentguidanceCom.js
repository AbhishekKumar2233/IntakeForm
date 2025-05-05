import React, { useState, useEffect,useContext } from 'react'
import { $CommonServiceFn } from '../network/Service'
import { $Service_Url } from '../network/UrlPath'
import konsole from '../control/Konsole'
import { Table } from 'react-bootstrap'
import { $AHelper } from '../control/AHelper'
import { Modal } from 'react-bootstrap';
import ModalComponent from './ModalComponent.js';
import { AoAgenturl } from '../control/Constant';
import { globalContext } from '../../pages/_app'
import { SET_LOADER, FEEDBACK_TYPE } from '../Store/Actions/action'
import { connect } from 'react-redux'

const AgentguidanceCom = (props) => {
    console.log('props', props)

    //define state---------------------------------------------------------------------------
    const {setdata} = useContext(globalContext)
    const [primaryUserId, setprimaryUserid] = useState('')
    const [spouseUserId, setspouseUserid] = useState('')
    const [loggesuserId, setLoggeduserId] = useState('')

    const [RenderValue, setRenderValue] = useState(true);
    const [Rendermember, setRendermember] = useState("Primary");
    const [tokenForIframe, setTokenForIframe] = useState("");
    const [visible, setVisible] = useState(false);
    const [assignOptionsList, setAssignOptionsList] = useState([])
    const zIndex = { zIndex: "999999999999" }

    //useEffect---------------------------------------------------------------------------

    useEffect(() => {
        let primaryuserid = sessionStorage.getItem('SessPrimaryUserId')
        let spouseuserid = sessionStorage.getItem('spouseUserId')
        let logedInuserid = sessionStorage.getItem('loggedUserId')
        setprimaryUserid(primaryuserid)
        setspouseUserid(spouseuserid)
        setLoggeduserId(logedInuserid)

        getUserAgentListByUserId(props?.memberUserId,primaryuserid,spouseuserid)

    }, [props?.memberUserId])

    //useEffect fun call------------------------------------------------------------------
    const getUserAgentListByUserId = (userIdd,primaryuserid,spouseuserid) => {
        props.dispatchloader(true)
        $CommonServiceFn.InvokeCommonApi('GET', $Service_Url.getUserAgent + `?IsActive=true&UserId=${userIdd}`, '', (res, err) => {
            if (res) {
                konsole.log('getUserAgentres', res)
                let responseData = res.data.data.filter(d => d.agentUserId !== null).map((userAgent) => {
                    return {
                        fullName: userAgent.fullName,
                        relationWithMember: userAgent.relationWithMember,
                        legalDocName: userAgent.testSupportDocName == null && userAgent.testDocId == null ? userAgent.legalDocName + " & " + userAgent.agentRole : userAgent.testDocId == null
                            ? userAgent.testSupportDocName + " & " + userAgent.agentRole : userAgent.testSupportDocName == null ? userAgent.testDocName + " & " + userAgent.agentRole : "",
                        agentRank: userAgent.agentRank,
                        agentAcceptanceStatus: userAgent.agentAcceptanceStatus,
                        isUserActive: userAgent.isUserActive,
                        agentEmailId: userAgent.agentEmailId,
                        agentMobileNo: userAgent.agentMobileNo,
                        agentUserId: userAgent.agentUserId,
                        agentRankId: userAgent.agentRankId,
                        statusName: userAgent.statusName,
                        relationWithSpouse: userAgent.relationWithSpouse
                    };

                });
                responseData = (userIdd == spouseuserid) ? responseData.map((d) => { return (d.agentUserId == primaryuserid) ? { ...d, relationWithSpouse: "Spouse" } : d }) : responseData;
                // konsole.log("response my agent", userIdd,spouseUserId,userId,res,responseData);
                const uniqueArr = [...new Set(responseData.map(item => item.agentUserId))].map(name => { return responseData.find(item => item.agentUserId === name) });
                setAssignOptionsList(uniqueArr);
                konsole.log('responseDataresponseData',uniqueArr, responseData)

                props.dispatchloader(false)
            } else {
                konsole.log('getUserAgenterr', err)
                props.dispatchloader(false)
                // if (err.response.data.status == "404") {
                // setAssignOptionsList([]);
                // }
            }
        })

    }

    //Table Preview Fun------------------------------------------------------------------------
    useEffect(() => {
        const receiveMessage = (event) => {
          if (event.data === 'closeModal') {
            setVisible(false)
          }
        };
        window.addEventListener('message', receiveMessage);
        return () => {
          window.removeEventListener('message', receiveMessage);
        };
      }, []);

    const handlePreview = (agentObj) => {
        konsole.log("show agent", agentObj);
        let stateObj=$AHelper.getObjFromStorage('stateObj')
        let params = `appState=${stateObj.appState}&userId=${stateObj.userId}&roleId=${stateObj.roleId}&loggenInId=${stateObj.loggenInId}&agentUserId=${agentObj.agentUserId}`;

        konsole.log("asdasdasd", window.btoa(params));

        setTokenForIframe(`${AoAgenturl}?token=${window.btoa(params)}`);
        // setTokenForIframe(`http://localhost:3001?token=${window.btoa(params)}`);
        props.dispatchFeedback(false)
        setVisible(true)
    }
    const handleClosePreview = () => {
        konsole.log("hide modal");
        setTokenForIframe("");
        setVisible(false);
        props.dispatchFeedback(true)
    }
    //Table Column------------------------------------------------------------------------------
    const columns = [
        {
            dataField: 'fullName',
            text: 'Agent',
            align: 'center',
        },
        {
            dataField: 'relation',
            text: 'Relation',
            align: 'center',
            formatter: (cell, row) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
                    <span>{row.relationWithSpouse || row.relationWithMember}</span>
                </div>
            ),
        },
        {
            text: 'Action',
            align: 'center',
            formatter: (cell, row) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => handlePreview(row)}>
                    <button className='btn' style={{ backgroundColor: '#720C20', color: 'white' }}>Preview</button>
                </div>
            ),
        },
    ];

    return (
        <>
            {assignOptionsList?.length > 0 ? (
                <Table  bordered  responsive>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="text-center">
                                    {column.text}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {assignOptionsList.map((row, index) => (
                            <tr key={index}>
                                {columns.map((column, columnIndex) => (
                                    <td key={columnIndex} className={`text-center ${column.align}`}>
                                        {column.formatter ? column.formatter(row[column.dataField], row) : $AHelper.capitalizeAllLetters(row[column.dataField])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                (props?.showloader == false) && <h5>Your agents are not yet assigned. Please contact your legal team.</h5>
            )}

            {
                visible ===true &&
                <ModalComponent title="Agent Preview (The screen which you are viewing is just a preview of an Agent.)" visible={visible} onCancel={handleClosePreview} onOk={handleClosePreview}  zIndex={zIndex}>
                    {tokenForIframe !== "" && <iframe className='w-100' style={{height: `calc(100vh - 10rem)`}} src={tokenForIframe}></iframe>}
                </ModalComponent>
            }
            <button className="Save-Button mt-2"
                onClick={()=>props.setStepperNo(props.stepperNo-1)}
            >
                Back

            </button>
        </>
    )
}


const mapStateToProps = (state) => ({ ...state })
const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
    dispatchFeedback: (type) => {
        dispatch({ type: FEEDBACK_TYPE, payload: type })
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(AgentguidanceCom)