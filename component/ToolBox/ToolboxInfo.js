import React, { useMemo, useState } from 'react';
import { $sideBarToolBox } from '../Helper/Constant';
import { Modal, Button } from "react-bootstrap";

const ToolboxInfo = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [showEstatePlanning, setShowEstatePlanning] = useState(false);

  const financeArrTile = [
    { imageSrc: "TaxTile.png", title: "Tax", subtitle: "CREATE", isCommingSoon: true, id: 'TB05' },
  ];
  const housingArrTile = [
    { id: 'TB06', imageSrc: "EstateTile.png", title: "Estate Planning", subtitle: "CREATE", isCommingSoon: false, },
  ];

  const handleTiles = (item) => {
    console.log('Selected tile:', item);
    if (item.id == 'TB06') {
      setShowEstatePlanning(true);
      return;
    }
    setSelectedTile(item);
  };

  const selectedTileDisplay = useMemo(() => {
    if (!selectedTile) return [];
    const id = selectedTile.id;
    return id === 'TB03' ? financeArrTile : id === 'TB02' ? housingArrTile : [];
  }, [selectedTile]);

  const renderTile = (item, index) => {
    const pointerEvents = item.isCommingSoon ? "none" : "cursor";
    const imgSrc = `/New/newIcons/${item.imageSrc}`;

    return (
      <div key={index} className="card shadow-lg p-0 toolbox_tiles_main-card" style={{ backgroundColor: "#CD9A27", pointerEvents }} onClick={() => handleTiles(item)}>
        <a style={{ textDecoration: "none" }}>
          <div className="card-body toolbox_tiles_inner-CardBody justify-content-center">
            <div className="d-flex justify-content-center">
              <img src={imgSrc} alt={item.title} className="img-fluid cardimg" />
            </div>
            <h5 className="toolbox_tiles_card-title text-center mt-3">{item.title}</h5>
          </div>
          {item.isCommingSoon && <div className="coming-soon1 mt-2"><span>COMING SOON</span></div>}
          <div className="text-center pt-2 bottom-card-tittle">{item.subtitle}</div>
        </a>
      </div>
    );
  };

  return (
    <div className='tool-box-info p-5 background-Image-Div-ToolBox' id='tool-box-info'>
      <div className="col d-flex justify-content-evenly align-items-start flex-wrap">
        {$sideBarToolBox?.length > 0 && $sideBarToolBox.map((item, index) => (
          <div key={'e' + index}>
            {renderTile(item, index)}
          </div>
        ))}

        {selectedTileDisplay.length > 0 && (
          <Modal show={!!selectedTile} size={'md'} backdrop="static" id='custom-modal-container2' className='useNewDesignSCSS' style={{ background: "rgba(0,0,0,0.6)" }} aria-labelledby="contained-modal-title-vcenter" centered onHide={() => setSelectedTile(null)}>
            <div className="background-Image-Div-ToolBox">
              <Modal.Header style={{ border: 'none' }} closeButton />
              <Modal.Body style={{ padding: '0' }}>
                <div className="col d-flex justify-content-evenly align-items-start flex-wrap">
                  {selectedTileDisplay.map((item, index) => (
                    <div key={'modal' + index}>
                      {renderTile(item, index)}
                    </div>
                  ))}
                </div>
                {/*  for Estate planning confirnmation  */}
                <EstatePlanningModal showEstatePlanning={showEstatePlanning} setShowEstatePlanning={setShowEstatePlanning} />
              </Modal.Body>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

const EstatePlanningModal = ({ showEstatePlanning, setShowEstatePlanning }) => {
  const continueToRegister = () => {
    window.open("http://register.virtualestateplanningsystem.com/?t=2d32f28b-38a8-443b-9203-4a5e0b3949c9", "_blank");
  };
  return (
    <>
      <Modal show={showEstatePlanning} onHide={() => setShowEstatePlanning(false)} size="lg" centered backdrop={false} style={{ background: "rgba(0,0,0,0.6)" }}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modalTitleText">YOU ARE LEAVING THE SITE</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBodyText">
          If you click the “Continue” button, you will leave the AgingOptions
          website. This is a link to a third-party site. We do not control
          third-party sites in any way, and you acknowledge and agree that we
          are not responsible or liable for the content, availability,
          functions, accuracy, legality, appropriateness, advertising,
          products, information, use of user information, security or privacy
          policies and practices, or any other aspect or materials of any
          third-party site. Please be aware that the security and privacy
          policies on third-party sites may be different than AgingOptions
          policies, so please read third-party privacy and security policies
          closely. In no event shall we be liable, directly or indirectly, to
          anyone for any damage or loss caused or alleged to be caused by or
          in connection with the use of or reliance on any content, goods or
          services available on or through any third-party Site.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => continueToRegister()}> {" "} Continue</Button>
          <Button variant="primary" onClick={() => setShowEstatePlanning(false)}> {" "} Go Back</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default ToolboxInfo;
