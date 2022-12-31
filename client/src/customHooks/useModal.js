import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const useModal = (Component,show, handleClose) => {
  return <Modal show={show} onHide={handleClose}>{Component}</Modal>;
};
