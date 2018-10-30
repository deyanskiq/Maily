const _ = require('lodash')
const Path = require('path-parser').default
const { URL } = require('url')
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')
const Survey = mongoose.model('surveys')
const path = new Path('/api/surveys/:surveyId/:choice')
module.exports = app => {
  // 'select' removes all recipients from the result of the query to be lighter
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false })

    res.send(surveys)
  })

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!')
  })
  // compact return only object, excudes undefined ones;
  // $elemMatch try to match to two parameters ( email and responded)
  // $inc increase value by one; [choice] is key interpolation (runtime replace with 'yes' or 'no')
  // recipients.$.responded -> return that specific repicient that upper query have found)
  // exec() needs to be call to actually execute this entire query to the database

  app.post('/api/surveys/webhooks', (req, res) => {
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = path.test(new URL(url).pathname)
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice }
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false },
          },
        }, {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date(),
        }).exec()
      })
      .value()
    res.send({})
  })

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body

    const survey = new Survey({
      title,
      subject,
      body,
      // equal to map(email => { return { email: email.trim() }})
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    })

    const mailer = new Mailer(survey, surveyTemplate(survey))

    try {
      await mailer.send()
      await survey.save()
      req.user.credits -= 1
      const user = await req.user.save()

      // necessary to update the header in the frond-end
      res.send(user)
    } catch (err) {
      res.status(422).send(err)
    }
  })
}