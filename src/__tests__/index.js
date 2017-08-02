import React from 'react'

import { shallow, mount, render } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import withCallbacks from '../index'
import TestComponent from './TestComponent'

describe('withCallback', () => {
  let mappings
  beforeEach(() => {
    mappings = {
      onUploadStart: (prev, next) => !prev.isUploading && next.isUploading,
      onUploadEnd: (prev, next) => prev.isUploading && !next.isUploading,
    }
  })

  it('calls onUploadStart when isUploading prop changes from false to true', () => {
    sinon.spy(TestComponent.prototype, 'onUploadStart')
    const WrappedComponent = withCallbacks(mappings)(TestComponent)
    const wrapper = mount(<WrappedComponent />)
    wrapper.setProps({ isUploading: true })
    expect(TestComponent.prototype.onUploadStart.calledOnce).to.equal(true)
  })

  it('calls onUploadEnd when isUploading prop changes from true to false', () => {
    sinon.spy(TestComponent.prototype, 'onUploadEnd')
    const WrappedComponent = withCallbacks(mappings)(TestComponent)
    const wrapper = mount(<WrappedComponent isUploading={true} />)
    wrapper.setProps({ isUploading: false })
    expect(TestComponent.prototype.onUploadEnd.calledOnce).to.equal(true)
  })
})
