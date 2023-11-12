import * as gamesService from '../services/gamesService.js';

async function getGames(req, res) {
  try {
    const games = await gamesService.getAllGames(req.query);
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getGameByID(req, res) {
  const { id } = req.params;

  try {
    const game = await gamesService.getGameByID(id);
    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game by ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createGame(req, res) {
  console.log("Cuerpo de la solicitud:", req.body);
  
    return gamesService.createGame(req.body)
    .then(function (game) {
      console.log("Juego creado:", game);
      res.status(201).json(game);
    })
    .catch(function (err) {
      console.error("Error al crear el juego:", err);
      res.status(500).json({ msg: err.msg });
    });
}

async function getGamesByEditionOrderedByScore(req, res) {
  const { edition } = req.params;

  try {
    const games = await gamesService.getGamesByEditionOrderedByScore(edition);
    res.status(200).json(games);
  } catch (error) {
    console.error('Error getting games by edition', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

async function getGameByGenre(req, res) {
  try {
    const genre = req.params.genre;
    const games = await gamesService.getGameByGenre(genre);
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener juegos por género' });
  }

}

async function updateGame(req, res) {
  try {
    const { id } = req.params;
    const updatedGame = req.body;

    const result = await gamesService.updateGame(id, updatedGame);

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteGame(req, res) {
  try {
    const { id } = req.params; 
    
    const result = await gamesService.deleteGame(id);

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}






export {
  getGames,
  getGameByID,
  createGame,
  getGamesByEditionOrderedByScore,
  getGameByGenre,
  updateGame,
  deleteGame
};







