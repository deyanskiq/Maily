import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import SurveyField from './SurveyField'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import validateEmails from '../../utils/validateEmails'
import formFields from './formFields'

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
      <Field key={name} type="text" component={SurveyField} label={label} name={name} />
      )
    })

  }
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}
        >
        {this.renderFields()}
        <Link to="/surveys" className="red btn-flat white-text">
          Cancel
        </Link>
        <button type="submit" className="teal btn-flat right white-text">
        Submit
        <i className="material-icons right">done</i>
        </button>
      </form>
      </div>
    )
  }
}

function validate(values){
  const errors = {}

  errors.recipients = validateEmails(values.recipients || '')

  _.each(formFields, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })

  return errors
}
// surveyForm is unique name for the form because we can have many form in our app
export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm)