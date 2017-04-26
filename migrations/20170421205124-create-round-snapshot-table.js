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
    return db.createTable('round_snapshot', {
        id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
            length: 11
        },
        table_round_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        initial_deck: {
            type: 'boolean',
            notNull: true,
            defaultValue: false
        },
        closed_deck: {
            type: 'longtext',
            notNull: false
        },
        open_deck: {
            type: 'longtext',
            notNull: false
        },
        players_deck: {
            type: 'longtext',
            notNull: false
        },
        card_position: {
            type: 'int',
            unsigned: true,
            notNull: true,
            length: 11
        },
        picked_card: {
            type: 'string',
            notNull: false,
            length: 4
        },
        card_picked_from: {
            type: 'string',
            notNull: false,
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
    return db.dropTable('round_snapshot');
};

exports._meta = {
    "version": 1
};
