// import * as fs from 'fs'
// import * as path from 'path'
// import * as axios from 'axios'
// import * as FormData from 'form-data'

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const files = fs.readdirSync('./tests/files/')

for (const file of files) {
  console.log(file)
  const stream = fs.createReadStream(path.resolve('./tests/files/', file))
  const form = new FormData()
  form.append('uploadFile', stream)

  const config = {
    headers: { ...form.getHeaders() }
  }

  const url = 'http://localhost:3000/upload/test/here/' + file
  axios.post(url, form, config).then(() => {
    console.log('[Post] ' + url)
  })
}
