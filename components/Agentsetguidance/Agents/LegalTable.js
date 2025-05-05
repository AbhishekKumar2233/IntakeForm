import React, { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import konsole from "../../control/Konsole";


export default function LegalTable({ dataSource, Rendermember }) {
  const [tabledata, setTabledata] = useState(dataSource)
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("userLoggedInDetail"))
    if (Rendermember == "Spouse") {
      let filterdatas = dataSource?.filter((e) => {
        return e.relationWithMember != "Spouse";
      }).map(d => (d.agentUserId === userId) ? { ...d, relationWithSpouse: "Spouse" } : d);

      setTabledata(
        filterdatas.sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
      konsole.log("fileteedd", filterdatas, userId);
    } else {
      setTabledata(
        dataSource.sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
    }
  }, [dataSource]);

  useEffect(()=>{
    mergeCells()
  })

  const handleChange = (pagination) => {
    setPaginationInfo(pagination);
  };

  function mergeCells() {
  if(tabledata?.length > 0){
    let db = document.getElementById("databody");
    let dbRows = db?.rows;
    let lastValue = "";
    let lastCounter = 1;
    let lastRow = 0;
    for (let i = 0; i < dbRows?.length; i++) {
      let thisValue = dbRows[i]?.cells[0]?.innerHTML;
      konsole.log(thisValue,"yrueyn")
      if (thisValue == lastValue) {
        lastCounter++;
        dbRows[lastRow].cells[0].rowSpan = lastCounter;
        dbRows[i].cells[0].style.display = "none";
      } else {
        dbRows[i].cells[0].style.display = "table-cell";
        lastValue = thisValue;
        lastCounter = 1;
        lastRow = i;
      }
    }
  }
}
function SortTable(arrayOfObjects){
  const groupedObjects = {};

for (const obj of arrayOfObjects) {
  const key = obj.legalDocName;
  if (!groupedObjects[key]) {
    groupedObjects[key] = [];
  }
  groupedObjects[key].push(obj)
}


  const groupedArray = Object.values(groupedObjects)
  let sortArray = []
  for(let i = 0 ; i<groupedArray.length;i++){
    let newArray = groupedArray[i].reduce((result, obj) => {
      const key = obj.agentRankId;
      (result[key] = result[key] || []).push(obj);
      return result;
    }, []);
    sortArray.push(newArray.flat(1))
  }

const groupedArray2 = Object.values(sortArray).flat(1);

const resultArray = sortArray.flat(1)
konsole.log(groupedArray2,groupedArray,sortArray.flat(1),resultArray,"sortArray")
  return resultArray
}

  return (
    <div className="App">
      <div className="mt-3 FiduciaryBeneficiaryscroll mb-3" style={{ borderTop: "1px solid #ced4da" }}>
        <Table bordered  style={{ backgroundColor: "#ffffff"}} >
          <thead className="sticky-top bg-light border" style={{ top: "-2px",zIndex:0 }}>
            <tr>
              <th>Document</th>
              <th>Role</th>
              <th>Order</th>
              <th>Agent</th>

              <th>Status</th>
            </tr>
          </thead>
          <tbody id="databody">
            {/* {tabledata
              .sort((a, b) => a.legalDocName.localeCompare(b.legalDocName))
              .sort((a, b) => a.agentRankId - b.agentRankId)
              .map((item, index) => ( */}
              {konsole.log(tabledata,"tabledata")}
            {SortTable(tabledata).sort((a, b) => {
                    return a.legalDocId - b.legalDocId;
              }).map((item, index) => (
              <tr>
                <td className="agent-td-span-tag">{item.legalDocName}</td>
                <td className="agent-td-span-tag">{item.agentRole}</td>
                <td className="agent-td-span-tag">{item.fullName}</td>
                <td className="agent-td-span-tag">{item.agentRank}</td>
                {/* <td className="agent-td-span-tag">{Rendermember == "Spouse" && (item?.relationWithSpouse != null || item?.relationWithSpouse != undefined) ? item.relationWithSpouse : item.relationWithMember}</td> */}
                <td className="">{item.statusName == "Accepted" ? (
                  <span className="statusbtn" style={{ color: "#117800" }}>{item.statusName}</span>
                ) : item.statusName == "Pending" ? (<span className="statusbtn" style={{ color: "#DD7819" }}>{item.statusName}</span>
                ) : item.statusName == "Declined" ? (<span className="statusbtn" style={{ color: "#d2222d" }}>{item.statusName}</span>
                ) : (<span className="statusbtn" style={{ color: "#DD7819" }}>Pending</span>
                )}</td>
              </tr>
            ))}

          </tbody>
        </Table>
      </div>
    </div>
  );
}
