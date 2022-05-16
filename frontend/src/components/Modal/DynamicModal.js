import React, { Component } from "react";
import { Modal, Container } from "react-bootstrap";

import './style.css';

class DynamicModal extends Component {
  constructor() {
    super();
    this.state = {
      isModalOpen: false
    };
  }

  hideShowModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    return (
      <>
        <Modal show={this.props.isHidden} onHide={this.props.onClose} size={this.props.size} >
        <Modal.Header className="d-flex jusify-content-between mt-5">
            <Modal.Title className="modalTitle">{this.props.title}</Modal.Title> 
            <i id="close_icon" className="fas fa-times"  onClick={this.props.onClose}></i>
        </Modal.Header>
        
        <Modal.Body>
            <Container >
                {this.props.children}               
            </Container>
        </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default DynamicModal;
