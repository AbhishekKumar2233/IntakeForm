import React, { useEffect, useId, useRef, useState } from 'react'
import SetUpHeader from '../../component/Layout/Header/SetUpHeader';
import { Col, Row, Table } from 'react-bootstrap'
import konsole from '../../components/control/Konsole';
import { $Service_Url } from '../../components/network/UrlPath';
import { $CommonServiceFn } from '../../components/network/Service';
import { useAppSelector } from '../../component/Hooks/useRedux';
import { selectShowLoader } from '../../component/Redux/Store/selectors';
import CustomLoader from '../../component/Custom/CustomLoader';
import { useLoader } from '../../component/utils/utils';
import AnnualAgreemetModal from '../../components/paralLegalComponent/Datatable/AnnualAgreemetModal';
import { isNotValidNullUndefile } from '../../components/Reusable/ReusableCom';
import AlertToaster from '../../components/control/AlertToaster';
import { logoutUrl } from '../../components/control/Constant';
import NonCrisisFeeAgreement from '../../components/paralLegalComponent/annualAgreement/NonCrisisFeeAgreement';

const newObjErr = () => ({ searchBar: "" });

const allusers = () => {
    const [rowsOfPage] = useState(40);
    const [searchValue, setSearchValue] = useState('');
    const [errMsg, setErrMsg] = useState(newObjErr());
    const [pageNumber, setPageNumber] = useState(1);
    const [lastPage, setLastPage] = useState(2);
    const [members, setMembers] = useState([]);
    const [searchInitiated, setSearchInitiated] = useState(false);
    const showLoader = useAppSelector(selectShowLoader);
    const [selectedMember, setSelectedMember] = useState(null);
    const [getusernumbers, setGetusernumbers] = useState(null)
    const [loginMemberDetails, setLoginMemberDetails] = useState('')
    const [getUserSubscription, setGetUserSubscription] = useState('')
    const [loginUserId, setLoginUserId] = useState(null);
    const [isAmaPayment, setIsPayment] = useState(false);
    const [isPaymentOrderId, setIsPaymentOrderId] = useState(null);
    const [isPaymentStatus, setIsPaymentStatus] = useState(null)
    const [subtenantDetails, setSubtenantDetails] = useState(null);
    const [param, setParam] = useState('')
    const [showModal, setShowModal] = useState({ AMA: false, NCFA: false });
    const tableRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sanitizedParam  = urlParams.get('username');

        const myParam = sanitizedParam?.split(/[^a-zA-Z0-9 ]/)[0];

        setParam(myParam);
        setSearchValue(myParam)
        
        if (typeof window !== "undefined") {
            const storedLoginUserId = sessionStorage.getItem("loggedUserId");
            const storedSubtenantDetails = sessionStorage.getItem("SubtenantId"); 
            setLoginUserId(storedLoginUserId);
            setSubtenantDetails(storedSubtenantDetails);
            const storedSelectedMember = sessionStorage.getItem("userIdClient");
            const SubtenantId = sessionStorage.getItem("SubtenantId")
            if (storedSelectedMember) {
                fetchUserSubscription(storedSelectedMember, SubtenantId);
            }
        }
        let authorization = sessionStorage.getItem('AuthToken');
        const redirectToLogin = (authenticated) => {
            if (!authenticated) {
                window.location.replace(`${logoutUrl}Account/Signin?expired=true`);
            }
        };
        if (!authorization) {
            redirectToLogin(false);
        } else {
            dataAuthenticate();
        }
    }, []);
    
    const dataAuthenticate = async () => {
        const stateObj = JSON.parse(sessionStorage.getItem('stateObj'));
        const { userId, appState, loggenInId, roleId } = stateObj || {};
        const params = `${userId}/${appState}/${loggenInId}/${roleId}/`;
        $CommonServiceFn.InvokeCommonApi("GET", `${$Service_Url.getAthenticatePath}${params}`, "",
            (response, error) => {
                if (response && response.status === 200) {
                    const responseData = response?.data?.data;
                    setLoginMemberDetails(responseData)
                } else {
                }
            }
        );
    };
    
    const fetchMembersData = (page) => {
        if(!isNotValidNullUndefile(searchValue)) return;
        useLoader(true)
        const inputData = {
            paraLegalId: loginUserId,
            pageNumber: page ? page : pageNumber,
            rowsOfPage: rowsOfPage,
            searchingText: searchValue,
            sortingCol: 'REGISTRATIONDATE',
            sortType: 'ASC',
            searchingCol: "NAME",
        };
        const userIdClient = sessionStorage.getItem('userIdClient');
        
        fetchApiData($Service_Url.getMembersByParalegalIdPathV2, inputData, (data) => {
            useLoader(false)
            // debugger
            if (data && Array.isArray(data?.clients) && data?.clients?.length) {
                if(page == "1") {
                    setMembers([...data?.clients]);
                } else setMembers([ ...members, ...data?.clients]);
                if(param && userIdClient) {
                    const matchingClient = data?.clients?.find(client => client?.memberId == userIdClient);
                    if (matchingClient) {
                        setSelectedMember(matchingClient);
                    } 
                    // setSelectedMember(data.clients[0])
                }
                setLastPage(pageNumber + 1);
            } else {
                if(page == "1") setMembers([]);
                setLastPage(pageNumber);
            }
        });
    };

    useEffect(() => {
        if (loginUserId && subtenantDetails) {
            if (pageNumber > 1) {
                fetchMembersData();
            }
            if(!isNotValidNullUndefile(getusernumbers)) getApiCall(`${$Service_Url.getparalegaluserdata}/${subtenantDetails}`, setGetusernumbers);
            if (param && loginUserId && subtenantDetails && selectedMember){
                handleViewDocuments() 
            }
        }
    }, [loginUserId, subtenantDetails, pageNumber]);

    useEffect(() => {
        if (selectedMember) {
            handleAmaPayment();
        }
    }, [selectedMember])
    
    const fetchApiData = (url, inputData, stateSetter) => {
        $CommonServiceFn.InvokeCommonApi('POST', url, inputData, (res, err) => {
            if (res) stateSetter(res?.data?.data);
            else stateSetter("err");
        });
    };

    const getApiCall = (url, stateSetter) => {
        $CommonServiceFn.InvokeCommonApi('GET', url, null, (res, err) => {
            if (res) stateSetter(res?.data?.data);
        });
    };

    const handleScroll = () => {
        const table = tableRef.current;
    
        if (table) {
            const { scrollHeight, scrollTop, clientHeight } = table;
            const remainingHeight = scrollHeight - scrollTop;
            const threshold = clientHeight + 100;
    
            if (remainingHeight <= threshold && lastPage > pageNumber) {
                setPageNumber(prevPage => {
                    const nextPage = prevPage + 1;
                    console.log("Loading next page:", nextPage, prevPage);
                    return nextPage;
                });
            }
        }
    };    

    useEffect(() => {
        const table = tableRef.current;
        console.log("Table ref:", table);
        if (table) {
            table.addEventListener('scroll', handleScroll);
            console.log("Scroll listener attached!");
        }
        return () => {
            if (table) {
                table.removeEventListener('scroll', handleScroll);
                console.log("Scroll listener removed.");
            }
        };
    }, [pageNumber, lastPage]);

    useEffect(() => {
        const table = tableRef.current;
        if (table && (pageNumber == 1)) {
            table.scrollTop = 0;
        }
    }, [members]);

    const handleViewDocuments = async (member) => {
        konsole.log(member, selectedMember, member, "sksdkdskdsdksdskdskddckxkcx")
        if (!param) {
            setSelectedMember(member);
        }        

        const username = member?.primaryEmailAddress?.toLowerCase()?.trim();
        const redirectUrl = `${ window.location.origin}/portal-signon/allusers?username=${username}`;
        konsole.log("redirectUrl", redirectUrl);
        window.history.pushState({ path: redirectUrl }, '', redirectUrl);
        const userIdClient = member?.memberId;
        sessionStorage.setItem('userIdClient', userIdClient);
        await fetchUserSubscription(userIdClient);
    };

    const fetchUserSubscription = async (userIdClient, SubtenantId) => {
        const userId = userIdClient || selectedMember?.memberId;
        const isActive = true;
        const subtenantDet = subtenantDetails || SubtenantId;
    
        useLoader(true);
    
        const fetchSubscriptionData = (subscriptionId, callback) => {
            $CommonServiceFn.InvokeCommonApi(
                "GET",
                `${$Service_Url.getUserSubscription}${subtenantDet}/${isActive}?SubscriptionId=${subscriptionId}&UserId=${userId}`,
                "",
                (res, error) => {
                    callback(res?.data?.data || null);
                }
            );
        };
    
        fetchSubscriptionData(1, (amaSubscription) => {
            fetchSubscriptionData(2, (feeAgreementSubscription) => {
                setGetUserSubscription({
                    amaSubscription,
                    feeAgreementSubscription
                });
                useLoader(false);
            });
        });
    };    
    
    useEffect(() => {

        const handlePopState = () => {
            window.location.href = `${ window.location.origin}/portal-signon/allusers`;
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleOrderIdAndStatus = (status, orderId) => {
        setIsPaymentStatus(status);
        setIsPaymentOrderId(orderId);
    };
    
    const handleAmaPayment = () => {

        const url = window.location.search;
        const manualOrderId = url.match(/OrderId=([^&]*)/) ? url.match(/OrderId=([^&]*)/)[1] : null;
        const queryParams = new URLSearchParams(url);
        const trxnStatus = queryParams.get('TrxnStatus');
        const orderId = manualOrderId;
        const userName = queryParams.get('username')
        const amaUserEmail = sessionStorage.getItem('searchItem') ?? selectedMember?.primaryEmailAddress;

        konsole.log("DetailsOfUserEmailamaUserEmailderId", userName, trxnStatus, orderId)
    
        if (isNotValidNullUndefile(orderId) && isNotValidNullUndefile(userName)) {
            if (trxnStatus !== 'SUCCESS') {
                AlertToaster.error("Payment failed. Please try again.");
            }
            handleOrderIdAndStatus(trxnStatus, orderId);
            setIsPayment(true);
            if (selectedMember && orderId && trxnStatus) {
                fetchUserSubscription()
            }
            const stateOfPayment = sessionStorage.getItem("stateOfPayment");
            toggleModal(stateOfPayment, true);
            
            const newURL = window.location.pathname + `?username=` + encodeURIComponent(selectedMember?.primaryEmailAddress)
            konsole.log("newURL", newURL)
            window.history.pushState({ path: newURL }, '', newURL);
            sessionStorage.setItem('searchItem', amaUserEmail);

        } else {
            handleOrderIdAndStatus(null, null);
            setIsPayment(false);
        }
    };

    const toggleModal = (type, state) => {
        setShowModal(prev => ({ ...prev, [type]: state }));
    };

    const showModalToggle = (type) => {
        setShowModal(prev => ({ ...prev, [type]: !prev[type] }));
    
        if (!showModal[type]) {
            fetchUserSubscription();
            sessionStorage.setItem('searchItem', selectedMember?.primaryEmailAddress);
            const newURL = `${window.location.pathname}?username=${encodeURIComponent(selectedMember?.primaryEmailAddress)}`;
            konsole.log("newURL", newURL);
            window.history.pushState({ path: newURL }, '', newURL);
        }
    };

    const renderAgreementRow = (title, subscriptionKey, modalType, ModalComponent) => {
        const subscription = getUserSubscription?.[subscriptionKey]?.[0] || {};
        const futureAuthorizeSubscriptionId = Number(subscription.futureAuthorizeSubscriptionId);
        const isSigned = isNotValidNullUndefile(subscription.orderId) || (isNaN(futureAuthorizeSubscriptionId) == false && futureAuthorizeSubscriptionId != 0);
        const date = isNotValidNullUndefile(subscription.updatedOn) && isSigned ? formatDate(subscription.updatedOn) : isNotValidNullUndefile(subscription.createdOn) && isSigned ? formatDate(subscription.createdOn) : 'Not Available';
    
        return (
            <tr className='mainPortalSignOnNoUnder'>
                <td className='ps-4 py-0 d-flex align-items-center' style={{ textOverflow: 'ellipsis', cursor: 'pointer' }} onClick={() => showModalToggle(modalType)}>
                    <img className='my-3 me-3' src='/icons/documentPortalSignOn.svg' alt="Document Icon" />
                    <span className='text-truncate'>{title}</span>
                </td>
                <td className='ps-4 py-0' style={{ textOverflow: 'ellipsis', verticalAlign: 'middle', cursor: 'pointer' }} onClick={() => showModalToggle(modalType)}>
                    {date}
                </td>
                <td className='ps-4 py-0 button' style={{ textOverflow: 'ellipsis', verticalAlign: 'middle' }}>
                    <button className={isSigned ? 'Signed ps-2 pe-3' : 'Unsigned ps-2 pe-3'} onClick={() => showModalToggle(modalType)} style={{ cursor: 'pointer' }}>
                        &#10003;&nbsp;&nbsp;{isSigned ? 'Signed' : 'Unsigned'}
                    </button>
                </td>
                {showModal[modalType] && (
                    <ModalComponent
                        dispatchloader={useLoader}
                        onClose={() => showModalToggle(modalType)}
                        isRefrencePage="portalSignOn"
                        loginUserId={loginUserId}
                        subtenantDetails={subtenantDetails}
                        subscriptionId={1}
                        clientData={selectedMember}
                        key={isAmaPayment}
                        isAmaPayment={isAmaPayment}
                        isPaymentStatus={isPaymentStatus} 
                        transactionStatus={isPaymentStatus}
                        isPaymentOrderId={isPaymentOrderId}
                        orderIDFromUrl={isPaymentOrderId}
                        setOrderIDFromUrl={setIsPaymentOrderId}
                        setTransactionStatus={setIsPaymentStatus}
                        showannualagreementmodal={showModal}
                        functionHandleorderIdNStatus={handleOrderIdAndStatus}
                        showannualagreementmodalfun={showModalToggle}
                        setshowannualagreementmodal={setShowModal}
                        isPortalSignOn={true}
                        callapidata={fetchUserSubscription}
                    />
                )}
            </tr>
        );
    };
    
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value?.trimStart());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    useEffect(() => {
        if (loginUserId && subtenantDetails) {
            fetchMembersData();
        }
    }, [loginUserId, subtenantDetails]);

    const handleToggleView = () => {
        setParam('');
        // setSearchValue('')
        setSelectedMember(null)
        const redirectUrl = `${ window.location.origin}/portal-signon/allusers`;
        window.history.pushState({ path: redirectUrl }, '', redirectUrl);
    }

    const handleSearch = () => {
        if(!isNotValidNullUndefile(searchValue)) {
            AlertToaster.error("Search input cannot be empty.");
            return;
        }

        setSearchInitiated(true);
        setPageNumber(1);
        fetchMembersData(1);

        document.getElementById('search')?.blur(); // to avoid unwated searched 
    };

    const handleSearchCross = () => {
        setSearchValue('');
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${month}/${day}/${year}`;
    }; 

    const tableBodyClass = members && members.length > 12 ? 'table-body-scrollable' : 'table-body-hidden';
    const userCount = getusernumbers?.activetedClientsIntake ? (getusernumbers?.activetedClientsIntake + getusernumbers?.activetedClientsLPO + getusernumbers?.inActivetedClientsIntake + getusernumbers?.inActivetedClientsLPO) : ". . . .";

    return (
        <>
        {showLoader && <CustomLoader />}
            <div id='PortalSignOn'>
                <Col>
                    <Row className='headerPortalSignOn'>
                        <SetUpHeader isPortalSignOn={true} />
                    </Row>
                    <Row className='profilePortalSignOn px-5'>
                        <Col>
                            <Row className='profilePortalSignOnBorder py-2'>
                                <Col xs={12} md={1} xl={1} className='profilePortalSignOnLeft'>
                                    <Row>
                                        <Col className='header_Icon d-flex align-items-center justify-content-center cursor-pointer'>
                                            <img src='/icons/ProfilebrandColor2.svg' alt="Profile Icon" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} md={11} xl={11} className='profilePortalSignOnRight d-flex flex-column justify-content-center'>
                                    <Row>
                                        {selectedMember ? (
                                            <p className='welcomeNote'>{selectedMember?.memberName?.toUpperCase()}</p>
                                        ) : (
                                            <p className='welcomeNote'>Welcome, <span style={{ textTransform: 'uppercase' }}>{loginMemberDetails?.memberName}</span></p>
                                        )}
                                    </Row>
                                    <Row>
                                        {selectedMember ? (
                                            <p className='welcomeMsg'>{selectedMember?.primaryEmailAddress}</p>
                                        ) : (
                                            <p className='welcomeMsg'>View portal users here.</p>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                            <Row className='profilePortalSignOnBorder border-0 pt-2'>
                                <Col xs={12} md={6} xl={8} className='profilePortalSignOnLeft d-flex align-items-center'>
                                    <Row>
                                        {selectedMember ? (
                                            <div className='container d-flex align-items-center'>
                                                <button style={{cursor:'pointer'}} onClick={handleToggleView} className="rotateImageButton">
                                                    <img src='/New/icons/Arrow-white.svg' alt="User Icon" className="icon m-0 rotateImage" />
                                                </button>
                                                <p className='headerNote ms-2'>All Documents <span>2</span></p>
                                            </div>
                                        ) : (
                                            <p className='headerNote'>All Users <span>{userCount}</span></p>
                                        )}
                                    </Row>
                                </Col>
                                {!selectedMember && (
                                <Col xs={12} md={6} xl={4} className='profilePortalSignOnRight'>
                                    <Row className='profilePortalSignOnSearch'>
                                        <div id='custom-input-search' className={errMsg ? "custom-input-search error-msg-focus" : "custom-input-search"}>
                                            <div className="input-container">
                                                    <input
                                                        errMsg=''
                                                        label=''
                                                        id='search'
                                                        placeholder='Search user...'
                                                        value={searchValue}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleSearchChange}
                                                    />
                                                <hr className={`searchDivider ${searchValue ? 'withSearch' : 'withoutSearch'}`} />
                                                {searchValue && (<img onClick={handleSearchCross} className="m-0 portalSignOnCrossIcon" style={{cursor:'pointer', marginRight: '8px'}} src="../icons/portalSignOnCrossIcon.svg" />)}
                                                <img onClick={handleSearch} className="m-0 portalSignOnSearchIcon" style={{cursor:'pointer'}} src="/New/icons/searchIconF.svg" />
                                            </div>
                                            {errMsg.searchBar && (
                                                <span className="err-msg-show">{errMsg.searchBar}</span> 
                                            )}
                                        </div>
                                    </Row>
                                </Col>)}
                            </Row>
                            <Row className='profilePortalSignOnBorder border-0 py-2'>
                                {selectedMember ? (
                                <Col className='portalSignOn'>
                                    <div className='portalSignOn-table' style={{ borderRadius: '10px' }}>
                                        <div className='table-responsive'>
                                            <div className='table-container' style={{ borderRadius: "10px" }}>
                                                <Table className='custom-table mb-0'>
                                                    <thead className='table-header' style={{ borderRadius: "10px" }}>
                                                        <tr className='headingPortalSignOn'>
                                                            <th title='Document Name' className='' style={{textOverflow: 'ellipsis', textAlign:'start', width:'33%', paddingLeft:'30px' }}>Document Name</th>
                                                            <th title='Last Updated on' className='' style={{textOverflow: 'ellipsis',textAlign:'center', width:'33%', paddingLeft:'0px' }}>Last Updated on</th>
                                                            <th title='Signed/Unsigned' className='' style={{textOverflow: 'ellipsis',textAlign:'end', width:'33%', paddingLeft:'0px' }}>Signed/Unsigned</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="portalSignOn-tableBody">
                                                        {renderAgreementRow('Annual Maintenance Agreement', 'amaSubscription', 'annualAgreement', AnnualAgreemetModal)}
                                                        {renderAgreementRow('Non-Crisis Fee Agreement', 'feeAgreementSubscription', 'feeAgreement', NonCrisisFeeAgreement)}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                ) : (
                                    <Col className='portalSignOn'>
                                    <div className={`portalSignOn-table ${(searchInitiated === false) ? 'dashedBorder' : ''}`} style={{ borderRadius: '10px'}}>
                                        <div className={`table-responsive ${tableBodyClass}`} style={{ borderRadius: '10px' }}>
                                            <div className='table-container' style={{ borderRadius: "10px" }}>
                                                {(searchInitiated === false) ? <>
                                                <div className='initialDiv'>
                                                    Use the search input above to find users by name or email
                                                </div>
                                                </> : <Table className='custom-table mb-0' >
                                                    <thead className='table-header' style={{ borderRadius: "10px" }}>
                                                        <tr className='headingPortalSignOn'>
                                                            <th title='Name' className='' style={{textOverflow: 'ellipsis', textAlign:'start',  paddingLeft:'30px' }}>Name</th>
                                                            <th title='Email' className='' style={{textOverflow: 'ellipsis',textAlign:'start',  paddingLeft:'30px' }}>Email</th>
                                                            <th title='Signed/Unsigned' className='' style={{textOverflow: 'ellipsis',textAlign:'end',  paddingLeft:'0px', paddingRight:'20px'}}>Signed/Unsigned</th>
                                                            <th title='' className='' style={{textOverflow: 'ellipsis',textAlign:'end',paddingLeft:'0px' }}></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`portalSignOn-tableBody ${tableBodyClass}`} ref={tableRef} style={{ display: 'block', maxHeight: '600px', overflowY: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                                                        { members && members.length > 0 ? ( members?.map((member) => (
                                                        <tr key={member?.loginUserId} className='mainPortalSignOn' onClick={() => handleViewDocuments(member)} style={{ cursor: 'pointer' }}>
                                                            <td className='ps-4 py-0 d-flex align-items-center' style={{textOverflow: 'ellipsis' }}>
                                                                <img className='my-3 me-3' src={member?.profileURL || '/icons/ProfilebrandColor2.svg'}  alt="Profile Icon" />
                                                                <span className='text-truncate' style={{ textTransform: 'uppercase' }}>{member?.spouseName ? `${member?.memberName} & ${member?.spouseName}` : member?.memberName}</span>
                                                            </td>
                                                            <td className='ps-4 py-0' style={{textOverflow: 'ellipsis', verticalAlign: 'middle' }}>{member?.primaryEmailAddress}</td>
                                                            <td className='ps-4 py-0 button' style={{ textOverflow: 'ellipsis', verticalAlign: 'middle' }}>{(isNotValidNullUndefile(member?.totalCost)) ? ( <button className='Signed ps-2 pe-3' style={{width:'110px', maxWidth:'110px'}}>&#10003;&nbsp;&nbsp;Signed</button> ) : ( <button className='Unsigned ps-2 pe-3'style={{width:'110px', maxWidth:'110px'}}>&#10003;&nbsp;&nbsp;Unsigned</button> )}</td>
                                                            <td className='ps-4 py-0' style={{textOverflow: 'ellipsis', verticalAlign: 'middle' }}><button >View Documents</button></td>
                                                        </tr>
                                                        ))
                                                    ) : (
                                                        <tr className='mainPortalSignOn'>
                                                            <td className='text-center py-3' colSpan="4" style={{ verticalAlign: 'middle', textDecoration:'none' }}>No data found</td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </Table>}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </div>
        </>
    )
}

export default allusers;