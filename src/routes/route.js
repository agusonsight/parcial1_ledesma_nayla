import express from 'express';
import * as gamesController from '../controllers/gameController.js';
import * as judgesController from '../controllers/judgesController.js';
import * as voteController from '../controllers/voteController.js';

const route = express.Router();
route.get('/games', gamesController.getGames);
route.get('/games/:id', gamesController.getGameByID);
route.get('/games/:genre', gamesController.getGameByGenre);
route.post('/games' , gamesController.createGame);
route.put('/games/:id', gamesController.updateGame);
route.delete('/games/:id', gamesController.deleteGame);
route.get('/games/scores/:edition', gamesController.getGamesByEditionOrderedByScore);
route.get('/judges',    judgesController.getAllJudges);
route.get('/judges/:id' , judgesController.getJudgeByID);
route.get('/votes' , voteController.getVotes);
route.post('/votes' , voteController.createVote);
route.get('/votes/judge/:judgeId', voteController.getVotesByJudgeId);
route.get('/votes/game/:gameId', voteController.getGameAverageScoresById);
route.get('/votes/judge-by-game/:gameId' , voteController.getJudgeByGame);

export default route;