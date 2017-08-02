// @flow

import React, { Component } from 'react'
import withCallbacks from '../index'

class TestComponent extends Component {
  static defaultProps = {
    isUploading: false,
  }

  onUploadStart() {}

  onUploadEnd() {}

  render() {
    return <div>Testing component</div>
  }
}

export default TestComponent
