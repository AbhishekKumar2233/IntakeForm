import React, { useState ,useRef,useContext} from 'react';
import { connect } from 'react-redux';
import { globalContext } from '../../../pages/_app';
import { SET_LOADER } from '../../Store/Actions/action';
import konsole from '../../control/Konsole'

const FileUpload = (props) => {
    const {setdata} =useContext(globalContext)
    const [data, setData] = useState([]);
    const wrapperRef = useRef(null);

    const [fileName, setFileName] = useState("")

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = ($event) => {
        const newFile = $event.target.files[0];
        props.dispatchloader(true);
        konsole.log("newFile.type",newFile.type)
        if (props.refrencePage === 'ImportXml') {
            if (newFile.type === "text/xml") {
                setFileName(newFile.name);
                props.setFileList(newFile);
                props.dispatchloader(false);
                konsole.log("type", newFile);
            } else {
                props.dispatchloader(false);
                toasterShowMsg(`${newFile.name} is not an XML File`, 'Warning');
            }
        } else {
            if (newFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || newFile.type === 'text/csv') {
                setFileName(newFile.name);
                props.setFileList(newFile);
                konsole.log("type", newFile);
                props.dispatchloader(false);
            } else {
                props.dispatchloader(false);
                toasterShowMsg(`${newFile.name} is not an Excel or CSV File`, 'Warning');
            }
        }
       
    }

    const toasterShowMsg = (message, type) => {
        setdata({
            open: true,
            text: message,
            type: type,
        })
      }
    
  return (
    <>
        <div
            ref={wrapperRef}
            className="drop-file-input"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="drop-file-input__label">
                <img src="fileUpload.svg" alt="" />
                <p style={{color:"black"}}>{fileName ===""? "Drag & Drop your files here":fileName}</p>
            </div>
            <input type="file" value="" onChange={onFileDrop}/>
        </div>    
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
    dispatchloader: (loader) =>
        dispatch({ type: SET_LOADER, payload: loader }),
});

export default connect("", mapDispatchToProps)(FileUpload)