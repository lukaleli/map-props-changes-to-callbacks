# map-props-changes-to-callbacks

*React's HOC utility to easily map props changes in a component to the specified callbacks.*

### Why?
There are some cases when we need do something when some particular prop change occur in our component
, eg. `isLoading` prop changes from `false` to `true` and vice versa. Wouldn't it be great if we could easily map these transitions to well-named callbacks like this:

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

`import withCallbacks from 'map-props-changes-to-callbacks'`

With ES5:

`var withCallbacks = require('map-props-changes-to-callbacks').default`

## Usage

```javascript
import React, { Component } from 'react'  
import { connect } from 'react-redux'  
import { compose } from 'redux'  
import withCallbacks from 'map-props-changes-to-callbacks'

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
  Specify mappings which is an object where
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

**IMPORTANT NOTE**
If you're composing multiple HOCs with `compose` utility from `redux` library make sure that `map-props-changes-to-callbacks` comes **as the outermost in the chain**. Otherwise callback mappings won't work!

