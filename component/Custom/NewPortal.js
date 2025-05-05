import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import konsole from "../../components/control/Konsole";

const NewPortal = forwardRef((props, ref) => {
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(false);
  const [messageObj, setmessageObj] = useState({type:"", title: "", description: ""});

  let timeOutId;

  useImperativeHandle(ref, () => ({setWarning}));

  useEffect(() => {
    return () => {
      clearInterval(timeOutId)
    }
  }, [])

  const setWarning = ( type, title, description, highZIndex ) => {
    if(!type || !title ) return;
    setDuration(3);
    setmessageObj({type, title, description, highZIndex});
    setVisible(true);

    callForClose();
  }

  const callForClose = () => {
    timeOutId = setTimeout(() => {
      closeWarning();
    }, 3000);
  }
    // timeOutId = setInterval(() => {
    //   if(duration == 1) closeWarning();
    //   setDuration(oldState => oldState - 1);
    // }, 1000)


  const closeWarning = () => {
    setmessageObj({});
    setVisible(false);
  }

 
  const imgUrl = (type) => {
    if (type === "warning") {
        return '/icons/warningIcon.svg';
    } else if (type === "successfully") {
        return '/icons/successfullyIcon.svg';
    } else if (type === "information") {
        return '/icons/informationIcon.svg';
      } else if (type === "physicianDelete") {
        return '/icons/PhysicainDltIcon_2.svg';
      } else if (type === "deletedSuccessfully") {
        return '/icons/PhysicainDltIcon_2.svg';
    } else {     
      return '';
    }
};


  const getClassName = ( type ) => {
    switch(type) {
      case "warning": return "toaster showInMiddle";
      case "successfully": return "toaster_S";
      case "information": return "toaster_Inf";
      case "deletedSuccessfully": return "toaster_Dlt";
      default: return "";  
    }
  }

  return (
    <>
        {visible && (
          <div id={messageObj?.type == "warning"? "blurBackground":""} style={messageObj?.highZIndex ? {zIndex: messageObj?.highZIndex} : {}}>
          <div className={`toaster ${getClassName(messageObj?.type)}`}>
          <div className="toaster_T">
            <div className="toaster-icon">
            <img className="mt-0" src={imgUrl(messageObj?.type)} alt="Icon" />
            </div>
            <div className="toaster-content">
              <p className="toaster-title">{messageObj?.title}</p>
            </div>
            <h4 className="toaster-close" onClick={closeWarning}>&times;</h4>
            </div>
            <h6 className="toaster-description">{messageObj?.description}</h6>
            {/* { messageObj?.type == "deletedSuccessfully" ?  <a className="Undo">Undo</a>: <h6 className="toaster-description">{messageObj?.description}</h6>} */}
            </div>
            </div>
          
        )} 
    </>
  );
});


export default NewPortal;
