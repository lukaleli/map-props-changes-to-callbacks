import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

export const mapPropsChangeToCallbacks = (instance = {}, mappings = [], prev = {}, next = {}) => {
  if (!instance || !mappings.length) return
  let shouldSuppressAfter = false
  mappings.forEach(({ name, rule, suppressAfter }) => {
    if (shouldSuppressAfter) return
    if (!rule(prev, next)) return
    if (suppressAfter) {
      shouldSuppressAfter = true
    }
    if (name in instance) {
      instance[name]()
      if (suppressAfter) {
        shouldSuppressAfter = true
      }
    } else {
      throw new Error(`You forgot to declare ${name} in your component class.`)
    }
  })
}

const withOrderedCallbacks = mappings => (WrappedComponent) => {
  class CallbackComponent extends Component {
    componentDidUpdate(prevProps) {
      mapPropsChangeToCallbacks(this.wrappedComponent, mappings, prevProps, this.props)
    }

    render() {
      return (
        <WrappedComponent
          ref={(ref) => {
            this.wrappedComponent = ref
          }}
          {...this.props} />
      )
    }
  }

  return hoistNonReactStatics(CallbackComponent, WrappedComponent)
}

export default withOrderedCallbacks
