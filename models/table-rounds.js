var db = require('../middleware/database.js');
var _ = require('underscore');
var core = require('../middleware/core.js');
var DECK = require('../middleware/decks.js');
var tableName = 'table_rounds';

module.exports = {
    startRound: function (gameTableId, currentUserId, success, failure, callback) {
        db.query('Select t.* from ' + tableName + ' t where t.status in ("Preparing", "Started") and t.game_table_id ="' + gameTableId + '"').then(
            function (data) {
                if (data.length > 0) {
                    success({"message": "Game Round: " + data[0].status, "roundState": "Exists"});
                } else {
                    // Check if the user can create game
                    db.query('Select t.user_id as table_owner_id, t.max_players as max_players, t.status as table_status, ' +
                        '(select count(user_id) from table_users where table_users.game_table_id = "' + gameTableId + '") as users_count ' +
                        'FROM game_tables t WHERE t.id = "' + gameTableId + '"').then(function (results) {
                        var result = results[0];
                        if (result.users_count >= 2 && (result.users_count === result.max_players || result.table_owner_id === currentUserId)) {
                            success({"message": "Game Round: Preparing", "roundState": "Preparing"});
                            db.query('select * from table_users where game_table_id = ' + gameTableId).then(
                                function (gamePlayers) {
                                    db.query('select count(id) as round_count from table_rounds where game_table_id=' + gameTableId).then(function (tableRounds) {
                                        var roundCount = tableRounds[0].round_count + 1;
                                        createRound({
                                            gameTableId: gameTableId,
                                            currentUserId: currentUserId,
                                            roundCount: roundCount,
                                            players: {
                                                count: result.users_count,
                                                playerInfo: gamePlayers
                                            }
                                        }, callback);
                                    }, function (err) {
                                        failure(err);
                                    });
                                },
                                function (err) {
                                    failure(err);
                                }
                            );
                        }
                        else {
                            success({"message": "Not enough players to start the game", "roundState": "Invalid"});
                        }
                    }, function (err) {
                        failure(err);
                    });
                    // start the game
                }
            }, function (err) {
                failure(err);
            }
        );
    },

    getRoundInfo: function (gameTableId, currentUserId, success, failure) {
        db.query('select * from table_rounds tr, round_snapshot rs where rs.initial_deck="0" and tr.status="Started" and tr.id=rs.table_round_id and tr.game_table_id="' + gameTableId + '"').then(
            function (data) {
                var roundInfo = data[0];
                roundInfo.players_deck = JSON.parse(roundInfo.players_deck);
                roundInfo.player_deck = JSON.stringify(roundInfo.players_deck[currentUserId]);
                roundInfo = _.pick(roundInfo, 'player_deck', 'open_deck', 'joker', 'card_position');
                db.query('select tu.user_id, tu.position, u.first_name from table_users tu , users u where u.id = tu.user_id and tu.game_table_id="' + gameTableId + '"').then(
                    function (data) {
                        roundInfo.players = data;
                        success(roundInfo);
                    }, function (err) {
                        failure(err);
                    }
                );
            }, function (err) {
                failure(err);
            }
        );
    }
};

function createRound(gameInfo, callback) {
    db.update("UPDATE game_tables SET ? where id=?", [{status: "Started"}, gameInfo.gameTableId]).then(function (data) {
        var tableRound = {
            game_table_id: gameInfo.gameTableId,
            status: "Preparing",
            started_by: gameInfo.currentUserId,
            round_no: gameInfo.roundCount
        };
        db.insert("INSERT INTO table_rounds SET ?", tableRound).then(function (data) {
            var roundId = data.insertId;
            var deckCount = (gameInfo.players.count / 2) + (gameInfo.players.count % 2);
            var closedDeck = [];
            var openDeck = [];
            var joker;
            var tmpPlayersDeck = [];
            var playersDeck = {};
            for (var i = 0; i < deckCount; i++) {
                closedDeck = closedDeck.concat(DECK);
            }
            closedDeck = core.shuffle(closedDeck);

            // Distribute the cards
            for (i = 0; i < 13; i++) {
                for (var j = 0; j < gameInfo.players.count; j++) {
                    if (typeof tmpPlayersDeck[j] === 'undefined') {
                        tmpPlayersDeck[j] = [];
                    }
                    tmpPlayersDeck[j].push(closedDeck.pop());
                }
            }
            openDeck.push(closedDeck.pop());
            joker = closedDeck.pop();

            // Assign positions to players
            if (gameInfo.players.playerInfo[0].position === 0) {
                for (i = 0; i < gameInfo.players.count; i++) {
                    gameInfo.players.playerInfo[i].position = i + 1;
                }
            }

            // Assign distributed cards to players
            var startingPosition = (gameInfo.roundCount % gameInfo.players.count);
            var startingPerson = gameInfo.players.playerInfo[startingPosition].user_id;
            for (i = 0; i < gameInfo.players.count; i++) {
                j = (startingPosition + i) % gameInfo.players.count;
                playersDeck[gameInfo.players.playerInfo[j].user_id] = tmpPlayersDeck[i];
            }

            // Preparation completed save to DB
            var snapshot = {
                table_round_id: roundId,
                initial_deck: true,
                closed_deck: JSON.stringify(closedDeck),
                open_deck: JSON.stringify(openDeck),
                players_deck: JSON.stringify(playersDeck),
                card_position: startingPerson
            };
            db.insert("insert into round_snapshot set ?", snapshot).then(
                function (data) {
                    snapshot.initial_deck = false;
                    db.insert("insert into round_snapshot set ?", snapshot).then(
                        function (data) {
                            tableRound.deck_starting_user_id = startingPerson;
                            tableRound.joker = joker;
                            tableRound.status = "Started";
                            db.update("UPDATE table_rounds SET ? where id=?", [tableRound, roundId]).then(
                                function (data) {
                                    for (i = 0; i < gameInfo.players.count; i++) {
                                        db.update("UPDATE table_users SET position=? where user_id=? and game_table_id=?", [gameInfo.players.playerInfo[i].position, gameInfo.players.playerInfo[i].user_id, gameInfo.gameTableId]).then(
                                            function (data) {
                                                // positions updated
                                            }, function (err) {
                                                console.log(err);
                                            }
                                        );
                                    }
                                    callback(data);
                                }, function (err) {
                                    console.log(err);
                                }
                            );
                        }, function (err) {
                            console.log(err);
                        }
                    );
                }, function (err) {
                    console.log(err);
                }
            );
        }, function (err) {
            console.log(err);
        });
    }, function (err) {
        console.log(err);
    });

}
