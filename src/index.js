import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

const mapPropsChangeToCallbacks = (
  instance = {},
  mappings = {},
  prev = {},
  next = {},
) => {
  if (!instance) return
  Object.entries(mappings).forEach(([prop, rule]) => {
    if (rule(prev, next)) {
      if (instance[prop]) {
        instance[prop]()
      } else {
        throw new Error(
          `You forgot to declare ${prop} callback in your component class.`,
        )
      }
    }
  })
}

const withCallbacks = mappings => WrappedComponent => {
  class CallbackComponent extends Component {
    componentDidUpdate(prevProps) {
      mapPropsChangeToCallbacks(
        this.wrappedComponent,
        mappings,
        prevProps,
        this.props,
      )
    }

    render() {
      return (
        <WrappedComponent
          ref={ref => {
            this.wrappedComponent = ref
          }}
          {...this.props}
        />
      )
    }
  }

  return hoistNonReactStatics(CallbackComponent, WrappedComponent)
}

export default withCallbacks
