# map-props-changes-to-callbacks

React's HOC utility to easily map props changes in a component to the specified callbacks.

### Why?

There are some cases when we need to do something when some particular prop change occurs in our component
, eg. `isLoading` prop changes its value from `false` to `true` and vice versa. Wouldn't it be great if we could easily map these transitions to well-named callbacks like this:

```javascript
// isLoading: false => true
onLoadingStart() {
  // do something when loading starts
}

// isLoading: true => false
onLoadingEnd() {
  // do something when loading ends
}
```

Well, `map-props-changes-to-callbacks` does exactly that.

## Installation

`npm i map-props-changes-to-callbacks -S`

## Import package

With ES2015:

`import { withCallbacks, withOrderedCallbacks } from 'map-props-changes-to-callbacks'`

With ES5:

```javascript
var withCallbacks = require('map-props-changes-to-callbacks').withCallbacks
var withOrderedCallbacks = require('map-props-changes-to-callbacks').withOrderedCallbacks
```

## Usage


### withCallbacks

`withCallbacks` HOC is useful when you don't care about the callbacks execution order. Also it will fire every callback that matched provided rule on every props change.

```javascript
import React, { Component } from 'react'  
import { connect } from 'react-redux'  
import { compose } from 'redux'  
import { withCallbacks } from 'map-props-changes-to-callbacks'

class MyComponent extends Component {  
  onUploadStart() {
    console.log('onUploadStart')
  }

  onUploadEnd() {
    console.log('onUploadEnd')
  }

  onUploadError() {
    console.log('onUploadError')
  }
}

/**
  Mappings is an object where
  keys are callbacks names and values are
  functions accepting previous and next props
  and returning true or false to tell the HOC 
  to call callback method.
**/
const mappings = {  
  onUploadStart: (prev, next) => !prev.isUploading && next.isUploading,
  onUploadEnd: (prev, next) => prev.isUploading && !next.isUploading,
  onUploadError: (prev, next) => !prev.error && next.error,
}
const enhance = compose(  
  connect( ({ documents }) => ({isUploading: documents.isUploading, error: documents.error}) ),
  withCallbacks(mappings)
)

export default enhance(MyComponent)  
```

### withOrderedCallbacks

`withOrderedCallbacks` is useful when you want your callbacks to be called in specified order. Also, you can suppress further callbacks execution on specific props change if you provide `suppressAfter` option. Mappings, unlike as in in `withCallbacks` HOC, are provided in a form of array of objects. Remember that the order of objects in the array defines an order of execution!

```javascript
import React, { Component } from 'react'  
import { connect } from 'react-redux'  
import { compose } from 'redux'  
import { withOrderedCallbacks } from 'map-props-changes-to-callbacks'

class MyComponent extends Component {  
  onUploadStart() {
    console.log('onUploadStart')
  }

  onUploadEnd() {
    console.log('onUploadEnd')
  }

  onUploadError() {
    console.log('onUploadError')
  }
}

/**
  Mappings is an array of objects with following properties:
  
  name (String)           -> name of the callback
  rule (Function)         -> predicate describing when to call this function
  suppressAfter (boolean) -> if set to true will suppress next callbacks
                            specified in the mappings array from execution (OPTIONAL)
  
**/


/**
  In this case every time when the onUploadEnd rule is be true
  onUploadError (and any other callback specified AFTER the onUploadEnd) 
  will not be called, because suppressAfter option is set to true for onUploadEnd
**/
const mappings = [
  {
    name: 'onUploadStart',
    rule: (prev, next) => !prev.isUploading && next.isUploading,
  },
  {
    name: 'onUploadEnd',
    rule: (prev, next) => prev.isUploading && !next.isUploading,
    suppressAfter: true,
  },
  {
    name: 'onUploadError',
    rule: (prev, next) => !prev.error && next.error,
  }
]

const enhance = compose(  
  connect( ({ documents }) => ({isUploading: documents.isUploading, error: documents.error}) ),
  withOrderedCallbacks(mappings)
)

export default enhance(MyComponent)  
```

**IMPORTANT NOTE**

If you're composing multiple HOCs with `compose` utility from the `redux` library make sure that `map-props-changes-to-callbacks` comes **as the outermost in the chain**. Otherwise callback mappings won't work!

