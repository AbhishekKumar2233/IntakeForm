import React from 'react';
import { Modal } from 'react-bootstrap';

export default function ModalComponent(props) {
  return (
    <>
              <style jsx global>{`
          .modal-open .modal-backdrop.show {
            opacity: 0.7;
          }
          .modal-dialog {
            margin: 1.75rem auto;
          }
        `}</style>
        <Modal
      show={props.visible}
      onHide={props.onCancel}
      size="xl"
      centered
      className="my-modal-class"
      style={props?.zIndex}
      backdrop="static"
      enforceFocus={false} 
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal> 
    </>
  );
}
