import React from 'react'

import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import withOrderedCallbacks from '../withOrderedCallbacks'
import OrderedTestComponent from './OrderedTestComponent'

const mappings = [
  {
    name: 'onEvent1',
    rule: (prev, next) => !prev.event1 && next.event1,
  },
  {
    name: 'onEvent2',
    rule: (prev, next) => !prev.event2 && next.event2,
  },
]

const suppressedMappings = [
  {
    name: 'onEvent1',
    rule: (prev, next) => !prev.event1 && next.event1,
    suppressAfter: true,
  },
  {
    name: 'onEvent2',
    rule: (prev, next) => !prev.event2 && next.event2,
  },
]

describe('withOrderedCallback', () => {
  let event1Spy
  let event2Spy

  before(() => {
    event1Spy = sinon.spy(OrderedTestComponent.prototype, 'onEvent1')
    event2Spy = sinon.spy(OrderedTestComponent.prototype, 'onEvent2')
  })

  afterEach(() => {
    event1Spy.reset()
    event2Spy.reset()
  })

  it('calls callback methods only once in order they were specified', () => {
    const WrappedComponent = withOrderedCallbacks(mappings)(OrderedTestComponent)
    const wrapper = mount(<WrappedComponent />)
    wrapper.setProps({ event1: true, event2: true })
    expect(OrderedTestComponent.prototype.onEvent1.calledOnce).to.equal(true)
    expect(OrderedTestComponent.prototype.onEvent2.calledOnce).to.equal(true)
    sinon.assert.callOrder(event1Spy, event2Spy)
  })

  it('suppress other callbacks', () => {
    const WrappedComponent = withOrderedCallbacks(suppressedMappings)(OrderedTestComponent)
    const wrapper = mount(<WrappedComponent />)
    wrapper.setProps({ event1: true, event2: true })
    sinon.assert.calledOnce(event1Spy)
    sinon.assert.notCalled(event2Spy)
  })
})
