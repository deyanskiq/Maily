import React from 'react'

export default({ input, label, meta: { error, touched } }) => {
    return (
      // {...input} is equal to onBlur={input.onBlur} onChange={input.onChange} ;
      // we get all the props and pass them inside our field (<input />) redux form will
      // automatically watch for any changes ( any types of Events ) for us. We don't have to
      // manually wire them up.
      <div>
        <label>{label}</label>
        <input {...input} style={{ marginBottom: '5PX' }}/>
        <div className="red-text" style={{  marginBottom: '20px'}}>
          { touched && error }
        </div>
      </div>
    )
}
