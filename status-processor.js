const http = require('http')

const block0_date = 1576264417000
const slot_duration = 2000
const slots_per_epoch = 43200
const epoch_duration = slot_duration * slots_per_epoch

const max_tolerated_block_age = 5 * 60 // 5 minutes

const getSlotDate = epochDotSlot => {
  const [epoch, slot] = epochDotSlot.split('.').map(a => parseInt(a))
  const epochTs = block0_date + epoch * epoch_duration
  return new Date(epochTs + slot * slot_duration)
}

const getBlockAgeSecs = epochDotSlot => (new Date().getTime() - getSlotDate(epochDotSlot).getTime()) / 1000

const getStats = () => new Promise((resolve, reject) => http.get({
  hostname: 'localhost',
  port: 3100,
  path: '/api/v0/node/stats',
  agent: false,
}, res => {
  let data = ''
  res.on('data', chunk => { data += chunk })
  res.on('end', () => Promise.resolve(data).then(JSON.parse).then(resolve, reject))
}).on('error', reject))

getStats()
  .then(s => {
    if (!s.lastBlockDate) throw new Error(JSON.stringify(s))
    const age = getBlockAgeSecs(s.lastBlockDate)
    const action = age > max_tolerated_block_age ? 'REBOOT' : 'OK'
    return  `${action} ${s.lastBlockHash} ${s.lastBlockDate} age=${Math.floor(age)}`
  })
  .catch(err => err)
  .then(msg => console.log(`${new Date().toISOString()} ${msg}`))
