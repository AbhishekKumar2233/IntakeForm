import React, {useState}from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { read, utils, writeFile } from 'xlsx';

const ConvertToExcel = (props) => {
    const {data,headings,pName} = props;
    const [heading,setHeadings] = useState([headings])
    const handleExport = (heading,movies,name) => {
        if(props.selectedCategoryIdParaList=="Total Prospect Members"){
            const wb = utils.book_new();
            const ws = utils.json_to_sheet([]);
            utils.sheet_add_aoa(ws, heading);
            utils.sheet_add_json(ws, movies, { origin: 'A2', skipHeader: true });
            utils.book_append_sheet(wb, ws, 'Report');
            writeFile(wb, name);
        }else{ 
          props.apiCallFun()
        }     
    }
    
  return (
    <>
    <div className='cursor-pointer' onClick={()=>handleExport(heading,data,pName)}>
     <OverlayTrigger placement='top' overlay={<Tooltip>Export Client</Tooltip>}>
     <div className="d-flex justify-content-center mb-auto mt-auto NewRegImg">
          <img  src="icons/ExportIcon.svg" className="cursor-pointer" alt='Export' /> 
        </div>
        </OverlayTrigger>
    </div>
    </>
    
  )
}

export default ConvertToExcel