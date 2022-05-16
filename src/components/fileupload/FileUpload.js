import React, { Component } from 'react';

import { errorSwal } from '../../components/swal/Swal';
import Input from '../../components/input/Input';

import './style.css';

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileValue: null,
    };
  }

  /**
   * This function call when any attachment selected
   * @param event   this parameter get file event object
   */
  selectFile = (event) => {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (event.target.files) {
      if (acceptedImageTypes.includes(event.target.files[0].type)) {
        if (event.target.files[0].size <= 26214400) {
          let uploadFile = event.target.files[0];
          // let reader = new FileReader();
          // reader.readAsDataURL(uploadFile);
          // reader.onload = () => {
          //   let data = reader.result;

          this.props.onSetFile(uploadFile);
          // };
        } else {
          errorSwal('error', 'File size must be less than or equal to 25MB');
        }
      } else {
        errorSwal('error', 'Only .PNG, .JPEG, .JPG');
        this.setState({ fileValue: null });
      }
    }
  };

  render() {
    return (
      <>
        <label htmlFor="fileControl" className="file-label">
          {this.props.title}
        </label>
        <Input
          id="fileControl"
          type="file"
          name="document"
          className="d-none"
          value={this.state.fileValue}
          onChange={this.selectFile}
          accept=".jpeg, .png, .jpg"
        />
      </>
    );
  }
}

export default FileUpload;
