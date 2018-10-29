import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import SurveyField from './SurveyField'
import _ from 'lodash'
import { Link } from 'react-router-dom'

const FIELDS = [
  { label: 'Survey Title', name: 'title', noValueError: 'Provide a survey name'},
  { label: 'Subject Line', name: 'subject', noValueError: 'Provide a survey subject'},
  { label: 'Email Body', name: 'body', noValueError: 'Provide a email body'},
  { label : 'Recipient List', name: 'emails', noValueError: 'Provide emails'}
]
class SurveyForm extends Component {
  renderFields() {
    return _.map(FIELDS, ({ label, name }) => {
      return (
      <Field key={name} type="text" component={SurveyField} label={label} name={name} />
      )
    })

  }
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(values => console.log(values))}
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

  _.each(FIELDS, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  return errors

}
export default reduxForm({
  validate: validate,
  form: 'surveyForm'
})(SurveyForm)