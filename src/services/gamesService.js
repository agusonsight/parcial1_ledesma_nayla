import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('parcial1_ledesma_nayla');
const gamesCollection = db.collection('games');
const votesCollection = db.collection("votes");

function filterQueryToMongo(filter) {
  const filterMongo = {};

  for (const field in filter) {
    if (isNaN(filter[field])) {
      filterMongo[field] = filter[field];
    } else {
      filterMongo[field] = parseInt(filter[field]);
    }
  }

  return filterMongo;
}


async function getAllGames(filter = {}) {
  try {
    await client.connect();
    const filterMongo = filterQueryToMongo(filter)
    return gamesCollection.find(filterMongo).toArray()
  } catch (error) {
    console.error('Error fetching games', error);
    throw error;  
  } 
}

async function getGameByID(id) {
  try {
      await client.connect();
      const game = await gamesCollection.findOne({ _id: new ObjectId(id) }).toArray();
      console.log('Datos recibidos en getGameByID:', game);
      return game;
  } catch (error) {
      console.error('Error fetching game by ID', error);
      throw error;
  } finally {
      await client.close();
  }
}



async function getGamesByEditionOrderedByScore(edition) {
  try {
    const votes = await votesCollection.find({}).toArray();

    const gamesWithScores = {};

    votes.forEach(vote => {
      const gameId = vote.gameId;
      const totalScore = Object.values(vote.points).reduce((acc, curr) => acc + curr, 0);

      if (!gamesWithScores[gameId]) {
        gamesWithScores[gameId] = {
          totalScore: 0,
          count: 0,
        };
      }

      gamesWithScores[gameId].totalScore += totalScore;
      gamesWithScores[gameId].count += 1;
    });

    const games = Object.keys(gamesWithScores).map(gameId => {
      const averageScore = gamesWithScores[gameId].totalScore / gamesWithScores[gameId].count;

      return {
        gameId,
        averageScore,
      };
    });

    const sortedGames = games.sort((a, b) => b.averageScore - a.averageScore);

    return sortedGames;
  } catch (error) {
    throw error;
  }
}

async function getGameByGenre() {
  try {
    const gamesCollection = db.collection('games');
    const games = await gamesCollection.find({ genre: genre }).toArray();
    return games;
  } catch (error) {
    throw new Error('Error al obtener juegos por género');
  }
}


async function createGame(game) {
  await client.connect();
 
  const newGame = { _id: new ObjectId(), ...game }
  await gamesCollection.insertOne(newGame, {forceServerObjectId: true})


  return newGame;
}

async function updateGame(id, updatedGame) {
  try {
    const gamesCollection = db.collection('games');
    const result = await gamesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedGame });

    if (result.modifiedCount === 0) {
      throw new Error('No se encontró el juego para actualizar');
    }

    return { success: true, message: 'Juego actualizado correctamente' };
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar el juego');
  }
}

async function deleteGame(id) {
  try {
    const gamesCollection = db.collection('games');
    const result = await gamesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error('No se encontró el juego para eliminar');
    }

    return { success: true, message: 'Juego eliminado correctamente' };
  } catch (error) {
    console.error(error);
    throw new Error('Error al eliminar el juego');
  }
}

export {
  getAllGames,
  getGameByID,
  createGame,
  getGamesByEditionOrderedByScore,
  getGameByGenre,
  updateGame,
  deleteGame

};

