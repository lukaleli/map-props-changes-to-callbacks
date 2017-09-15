import React, { Component } from 'react'

class TestComponent extends Component {
  static defaultProps = {
    isUploading: false,
  }

  onUploadStart() {}

  onUploadEnd() {}

  render() {
    return <div>Callbacks test component</div>
  }
}

export default TestComponent
