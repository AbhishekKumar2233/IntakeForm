import React, { useEffect, useState, useCallback } from 'react'
import { Modal, Button, Form, Row, Col, Table, Card, Container } from "react-bootstrap";
import konsole from '../../control/Konsole';
import { $AHelper } from '../../control/AHelper';
import { getApiCall, isNotValidNullUndefile } from '../../Reusable/ReusableCom';
import { $Service_Url } from '../../network/UrlPath';

const FiduciaryAssignmentLegalDocCe = ({ list, returnLegalocJson, jsonObj }) => {

  konsole.log("listlist", list, JSON.stringify(list))
  konsole.log("jsonObjjsonObj", jsonObj)
  const primaryMemberName = jsonObj?.userName;
  const spouseName = jsonObj?.spouse?.personName

  const memoizedReturnLegalDoc = useCallback(() => returnLegalocJson(list, ''), [list]);
  const [legalDocList, setLegalDocList] = useState([]);
  const [fiduciarySRankList, setFiduciarySRankList] = useState([]);

  useEffect(() => {
    fetchApi()
  }, [list])

  const fetchApi = async () => {
    const _resultfiduciarySRankList = await getApiCall('GET', $Service_Url.getFiduciarySRank, setFiduciarySRankList);
    console.log("_resultfiduciarySRankList", _resultfiduciarySRankList)
    const _resultlegalDocList = await getApiCall('GET', $Service_Url.getLegalType, '');
    console.log('_resultlegalDocList', _resultlegalDocList);
    const _resultlegalDocListList = memoizedReturnLegalDoc().map((item) => {
      const legalDocName = _resultlegalDocList.find((legalDoc) => legalDoc.value == item.legalDocTypeId);
      return { ...item, label: legalDocName ? legalDocName.label : '' };
    });
    console.log("_resultlegalDocListList", _resultlegalDocListList)
    setLegalDocList(_resultlegalDocListList)

  };


  console.log('memoizedReturnLegalDoc', legalDocList, primaryMemberName)
  return (
    <>

      <Row>
        {(legalDocList.length > 0) && <>
          <p className='fw-bold'>Legal Documents</p>
          <div className='m-1'>
            <Table bordered className="table-responsive ">
              <thead>
                <tr>
                  <th>Documents</th>
                  <th>Date Executed</th>
                </tr>
              </thead>

              <tbody className="my-4">
                {legalDocList.map((item, index) => {
                  return <>
                    <tr key={index} >
                      <td style={{ wordBreak: "break-word" }}>
                        {item?.label}
                      </td>
                      <td>
                        {isNotValidNullUndefile(item.dateExecuted) &&
                          $AHelper.getFormattedDate(l.dateExecuted)}
                      </td>
                    </tr>
                  </>
                })}
              </tbody>
            </Table>
          </div>
        </>}
      </Row>

      {list.length > 0 && <>
        <hr />
        <Row>
          <p className='fw-bold'>Fiduciary Assesment</p>
          <div className='m-1'>
            <Table bordered className="table-responsive ">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Agent Name</th>
                </tr>
              </thead>

              {legalDocList.map((item, index) => {
                return <>
                  <p className='mt-2 fw-bold'>Document :- {item.label}</p>
                  <tbody>
                   <b>Primary Member :- </b>{primaryMemberName}
                    {list.filter((j) => j.legalDocId == item.legalDocTypeId && j?.userName == primaryMemberName).map((i, d) => (
                      <tr key={d}>
                        <td>{fiduciarySRankList.find((k) => k.value == i.sRankId)?.desc}</td>
                        {/* <td>{i.legalDocId}</td> */}
                        <td>{i.agentName}</td>
                      </tr>
                    ))}
                    {(isNotValidNullUndefile(spouseName)) && <>
                      <b>Spouse :- </b>{spouseName}
                      {list.filter((j) => j.legalDocId == item?.legalDocTypeId && j?.userName == spouseName)?.map((i, d) => (
                        <tr key={d}>
                          <td>{fiduciarySRankList.find((k) => k.value == i.sRankId)?.desc}</td>
                          {/* <td>{i.legalDocId}</td> */}
                          <td>{i.agentName}</td>
                        </tr>
                      ))}
                    </>
                    }
                  </tbody>
                </>
              })}



            </Table>
          </div>

        </Row>

      </>}
    </>
  )
}

export default FiduciaryAssignmentLegalDocCe
