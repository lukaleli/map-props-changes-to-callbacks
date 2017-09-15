import React, { Component } from 'react'

class OrderedTestComponent extends Component {
  static defaultProps = {
    event1: false,
    event2: false,
  }

  onEvent1() {}

  onEvent2() {}

  render() {
    return <div>Ordered callbacks test component</div>
  }
}

export default OrderedTestComponent
