import { google } from 'googleapis'
import { getSensorData } from './manageSensor'
import { telegramSend } from './manageTelegram'

let _auth

const TOKEN = {
  access_token: process.env.GAS_ACCESS_TOKEN,
  refresh_token: process.env.GAS_REFRESH_TOKEN,
  scope:
    'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.projects',
  token_type: 'Bearer',
  expiry_date: process.env.GAS_EXPIRY_DATE,
}

const CREDENTIALS = {
  installed: {
    client_id: process.env.GAS_CLIENT_ID,
    project_id: process.env.GAS_PROJECT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: process.env.GAS_CLIENT_SECRET,
    redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
  },
}

const authorize = () => {
  const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  oAuth2Client.setCredentials(TOKEN)
  _auth = oAuth2Client
}

const callAppsScript = (parameters, callback) => {
  if (!_auth) authorize()
  const script = google.script({ version: 'v1', auth: _auth })

  script.scripts.run(
    {
      scriptId: process.env.GAS_SCRIPT_ID,
      resource: {
        function: process.env.GAS_FUNCTION_NAME,
        parameters,
        devMode: true,
      },
    },
    (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err)
        callback(false, err)
        return
      }

      if (res.error) {
        callback(false, res.error)
      } else {
        callback(true, res.data)
      }
    }
  )
}

const routineFunc = async () => {
  const data = await getSensorData()
  console.log(data)
  callAppsScript(data, (suc, res) => {
    if (!suc) telegramSend('ESP8266 Error')

    setTimeout(() => {
      routineFunc()
    }, 600000)
  })
}

export { routineFunc }
