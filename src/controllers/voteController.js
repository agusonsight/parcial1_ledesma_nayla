import { ObjectId } from 'mongodb';
import * as votesService from '../services/votesService.js';

async function getVotes(req, res) {
  try {
    const votes = await votesService.getAllVotes(req.query);
    res.status(200).json(votes);
  } catch (error) {
    console.error('Error fetching games', error);
    res.status(500).send('Internal Server Error');
  }
}

async function createVote(req, res) {
  const { judgeId, gameId, points } = req.body;

  try {
    const vote = await votesService.registerVote(judgeId, gameId, points);
    res.status(201).json(vote);
  } catch (error) {
    console.error('Error creating vote', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function getGameAverageScoresById(req, res) {
  const { gameId } = req.params;

  try {
    const result = await votesService.getGameAverageScoresById(gameId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getGameAverageScoresById', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getVotesByJudgeId(req, res) {
  const { judgeId } = req.params;
  try {
    const votes = await votesService.getVotesByJudgeId(judgeId);
    res.status(200).json({ votes });
  } catch (error) {
    console.error('Error getting votes by judge ID', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function getJudgeByGame(req, res) {
  const { gameId } = req.params;
  try {
    const judgesAndPoints = await votesService.getJudgesAndPointsByGameId(gameId);
    res.status(200).json(judgesAndPoints);
  } catch (error) {
    console.error('Error getting judges and points by game ID', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}







export { 
  createVote,
  getVotes,
  getGameAverageScoresById,
  getVotesByJudgeId,
  getJudgeByGame,
};









