'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable('game_tables', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 11
        },
        user_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        table_type: {
            type: 'string',
            length: 50,
            notNull: true
        },
        game_type: {
            type: 'string',
            length: 50,
            notNull: true
        },
        bet: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        max_players: {
            type: 'smallint',
            unsigned: true,
            notNull: true,
            length: 4
        },
        status: {
            type: 'string',
            length: 50,
            defaultValue: 'Waiting',
            notNull: true
        },
        created_on: {
            type: 'datetime',
            notNull: false
        },
        updated_on: {
            type: 'timestamp',
            defaultValue: 'CURRENT_TIMESTAMP',
            notNull: true
        }
    });
};

exports.down = function (db) {
    return db.dropTable('game_tables');
};

exports._meta = {
    "version": 1
};
