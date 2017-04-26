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
    return db.createTable('table_rounds', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 11
        },
        game_table_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        deck_starting_user_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        round_no: {
            type: 'int',
            unsigned: true,
            notNull: false,
            length: 11
        },
        joker: {
            type: 'string',
            notNull: true,
            length: 2
        },
        status: {
            type: 'string',
            length: 50,
            defaultValue: 'Preparing',
            notNull: true
        },
        started_by: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
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
    return db.dropTable('table_rounds');
};

exports._meta = {
    "version": 1
};
