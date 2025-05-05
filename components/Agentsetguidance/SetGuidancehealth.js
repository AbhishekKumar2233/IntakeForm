import React, { useState,useContext } from 'react'
import Router from 'next/router';
import { $AHelper } from '../control/AHelper'
import konsole from '../control/Konsole';
import { Breadcrumb, Row, Col, Form } from 'react-bootstrap';
import Illness from './Illness';
import Mentalhealth from './Mentalhealth.js';
import Endoflife from './Endoflife.js';
import Death from './Death.js';
import { globalContext } from '../../pages/_app.js';
import { useEffect } from 'react';

const SetGuidancehealth = () => {
  konsole.log('memberdetailsmemberdetails', memberdetails)
  //-state define--------------------------------------------------------------------------------------
  const {setPageCategoryId,setPageSubTypeId,pageTypeId,pageSubTypeId} = useContext(globalContext)
  const [primaryUserId, setprimaryUserid] = useState('')
  const [spouseUserId, setspouseUserid] = useState('')
  const [loggesuserId, setLoggeduserId] = useState('')
  const [btntype, setbtntype] = useState('Illness')
  const [radioSelect, setRadioSelect] = useState('1');




  //---------session storage info--------------------------------------------------------------------------------------------------------------------

  const memberdetails = $AHelper.getObjFromStorage("userDetailOfPrimary");
  konsole.log('memberdetails', memberdetails)

  // prediefinefunctio--------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    let primaryuserid = sessionStorage.getItem('SessPrimaryUserId')
    let spouseuserid = sessionStorage.getItem('spouseUserId')
    let logedInuserid = sessionStorage.getItem('loggedUserId')
    setprimaryUserid(primaryuserid)
    setspouseUserid(spouseuserid)
    setLoggeduserId(logedInuserid)
    handleSessLastPath();
  }, [])

  const handleSessLastPath = () => {
    let lastPath = sessionStorage.getItem('lastPath')

    if(lastPath?.includes("2") && radioSelect != 2) setRadioSelect("2");
    if(pageSubTypeId == null){
      setPageSubTypeId(1)
    }
  
    if(lastPath?.includes("illness")) setbtntype("Illness");
    else if(lastPath?.includes("mental")) setbtntype("Mental");
    sessionStorage.removeItem("lastPath");
  }

  const handlebtn = (type) => {
    setbtntype(type)
    if(type == "Illness"){
      setPageSubTypeId(1)
    }else if(type == "Mental"){
      setPageSubTypeId(2)
    }else if(type == "Endoflife"){
      setPageSubTypeId(3)
    }else if(type == "Death"){
      setPageSubTypeId(4)
    }
  }
  const handleOptionChange = (event) => {
    setRadioSelect(event.target.value);
  };

  //konsole----------------------------------------------------------------------------------------------------------------------------------------------
  konsole.log('radioSelectradioSelect', radioSelect)
  konsole.log('btntype')
  //----------------------------------------------------------------------------------------------------------------------------------------------------
  const memberId = (radioSelect == 2) ? spouseUserId : primaryUserId;
  const activeUser = (radioSelect == 2) ? "2" : "1";
  return (
    <>
      <div style={{ display: 'flex',flexWrap:"wrap" }} className='mt-2' >
        <button className={`guidance-btn-click${(btntype === 'Illness') ? '-select' : ''}`} onClick={() => handlebtn('Illness')}> Illness </button>
        <button className={`guidance-btn-click${(btntype === 'Mental') ? '-select' : ''}`} onClick={() => handlebtn('Mental')}> Mental health </button>
        <button className={`guidance-btn-click${(btntype === 'Endoflife') ? '-select' : ''}`} onClick={() => handlebtn('Endoflife')}> End of life </button>
        <button className={`guidance-btn-click${(btntype === 'Death') ? '-select' : ''}`} onClick={() => handlebtn('Death')}> Death </button>
      </div>

      <div className="d-flex mt-3 ms-3">
        <div className="form-check">
          <input className="form-check-input " type="radio" id="first-option" name="radioOptions" value="1" checked={radioSelect === '1'} onChange={handleOptionChange} />
          <label className="form-check-label ms-2 setRadio" for="first-option">
            {$AHelper.capitalizeAllLetters(memberdetails?.memberName)}
          </label>
        </div>

        {memberdetails.spouseName !== null &&
          <div className="form-check  illnessRadio">
            <input className="form-check-input" type="radio" id="second-option" name="radioOptions" value="2" checked={radioSelect === '2'} onChange={handleOptionChange} />
            <label className="form-check-label ms-2 setRadio" for="second-option">
              {$AHelper.capitalizeAllLetters(memberdetails?.spouseName)}
            </label>
          </div>
        }
      </div>

      {(btntype == 'Illness') ? <Illness memberId={memberId} activeUser={activeUser}/>
        : (btntype == 'Mental') ? <Mentalhealth memberId={memberId} activeUser={activeUser}/>
          : (btntype == 'Endoflife') ? <Endoflife memberId={memberId} />
            : <Death memberId={memberId} />}




    </>
  )
}

export default SetGuidancehealth