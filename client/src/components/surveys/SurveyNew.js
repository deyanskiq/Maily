import React, { Component } from 'react'
import SurveyForm from './SurveyForm'
import { reduxForm } from 'redux-form'
import SurveyFormReview from './SurveyFormReview'

class SurveyNew extends Component {
  // equal to:
  // constructor(props) { super(props); this.state = { showFormReview: false}}

  state = { showFormReview: false }

  renderContent() {
    if(this.state.showFormReview) {
      return <SurveyFormReview
      onCancel={() => this.setState({ showFormReview: false }) } />
    }
    return <SurveyForm
      onSurveySubmit={() => this.setState({showFormReview: true} )}
    />
  }
  render() {
    return (
      <div>
      {this.renderContent()}
      </div>
    )
  }
}
// this is some kind of hack to clear the input values when use some button different than next
// because we do not specify destroyOnUnmount: false the input fields are being cleared
export default reduxForm({
  form: 'surveyForm'
})(SurveyNew)