const LocalStrategy = require('passport-local').Strategy

const DB = require('../core/my_db/DB')

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })

  passport.use(new LocalStrategy(
    (username, password, done) => {
      DB.pool.query(
        'SELECT * FROM `users` WHERE `name` = ? AND `pass` = ?',
        [username, password],
        (err, r) => {
          if (err) throw err
          if (r.length === 1) {
            return done(null, r[0])
          }
          return done(null, false, {message: 'Incorrect Login or password'})
        }
      )
    }))
}