const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      user_email: 'testing@gmail.com',
      user_password: 'password'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      user_email: 'testing2@gmail.com',
      user_password: 'password'
    },
    {
      id: 3,
      user_name: 'test-user-3',
      user_email: 'testing3@gmail.com',
      user_password: 'password'
    },
    {
      id: 4,
      user_name: 'test-user-4',
      user_email: 'testing4@gmail.com',
      user_password: 'password'
    },
  ]
}

function makeLogsArray() {
  return [
    {
      id: 1,
      log_name: 'First test thing!',
      log_date: '1/1/2020',
      log_entry: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      log_name: 'Second test thing!',
      log_date: '12/2/2019',
      log_entry: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 3,
      log_name: 'Third test thing!',
      log_date: '2/14/2020',
      log_entry: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 4,
      log_name: 'Fourth test thing!',
      log_date: '1/2/2020',
      log_entry: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    }
  ]
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user_name => ({
    ...user_name,
    user_password: bcrypt.hashSync(user_name.user_password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('logs_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}


function seedLogsTables(db, users, logs=[]) {
  
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('logs').insert(logs)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('posy_logs_id_seq', ?)`,
      [logs[logs.length - 1].id],
    )
  })
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
         algorithm: 'HS256',
       })
       return `Bearer ${token}`
   }
  
function makeLogsFixtures() {
  const testUsers = makeUsersArray()
  const testLogs = makeLogsArray()
  return { testUsers, testLogs }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    logs,
    users
  RESTART IDENTITY CASCADE`
  )
}

function seedMaliciousLog(db, user, log) {
  return db
    .into('users')
    .insert([user])
    .then(() =>
      db
        .into('logs')
        .insert([log])
    )
}

module.exports = {
  makeUsersArray,
  makeLogsArray,
  makeLogsFixtures,
  cleanTables,
  seedUsers,
  seedLogsTables,
  seedMaliciousLog,
  makeAuthHeader,

}