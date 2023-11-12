import * as judgesService from './../services/judgesService.js'

async function getAllJudges(req, res) {
    try {
      const judges = await judgesService.getAlljudges(req.query);
      res.status(200).json(judges);
    } catch (error) {
      console.error('Error fetching judges', error);
      res.status(500).send('Internal Server Error');
    }
}

async function getJudgeByID(req, res) {
    const { id } = req.params;
    try {
      const judge = await judgesService.getJudgeByID(id);
      res.status(200).json(judge);
    } catch (error) {
      console.error('Error fetching judge by ID', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    getAllJudges,
    getJudgeByID,
}