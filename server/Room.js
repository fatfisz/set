const { Table } = require('./Table');

exports.Room = class Room {
  constructor() {
    this.table = new Table();
  }
};
