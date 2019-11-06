const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/


const UsersService = {
  hasUserWithUsername(db, user_email) {
    return db('posy_users')
      .where({ user_email })
      .first()
      .then(user => !!user)
  }, 
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('posy_users')
      .returning('*')
      .then(([user]) => user)
  },

    validatePassword(password) {
      if (password.length < 8) {
        return 'Password must be longer than 8 characters'
      }
      if (password.length > 72) {
        return 'Password must be less than 72 characters'
      }
      if(password.startsWith(' ') || password.endsWith(' ')) {
        return 'Password must not start or end with empty spaces'
      }
      return null
    },
    hashPassword(password) {
      return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
      return {
        id: user.id,
        user_name: xss(user.user_name),
        user_email: xss(user.user_email), 
        date_created: new Date(user.date_created),
      }
    },
  }
  
  module.exports = UsersService