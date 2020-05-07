const { Players } = require('./Players');
const { Table } = require('./Table');

exports.Room = class Room {
  constructor() {
    this.players = new Players();
    this.table = new Table();
  }
};
