const mysql = require('mysql2')

class DB {
  constructor() {
    this.pool = null
  }
  setOptions(options) {
    this.pool = mysql.createPool(options)
  }
}

module.exports = new DB()