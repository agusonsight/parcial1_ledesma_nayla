import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("parcial1_ledesma_nayla");
const votesCollection = db.collection("votes");
const judgesCollection = db.collection("judges");
const gamesCollection = db.collection("games");

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

async function getAllVotes(filter = {}) {
  try {
    await client.connect();
    const filterMongo = filterQueryToMongo(filter);
    return votesCollection.find(filterMongo).toArray();
  } catch (error) {
    console.error("Error fetching votes", error);
    throw error;
  }
}

//CREAR VOTO///

async function getJudgeIdById(judgeId) {
  try {
    const judge = await judgesCollection.findOne({ id: judgeId });
    return judge ? judge._id : null;
  } catch (error) {
    console.error("Error getting judge ID by ID", error);
    throw error;
  }
}

async function getGameIdById(gameId) {
  try {
    const game = await gamesCollection.findOne({ id: gameId });
    return game ? game._id : null;
  } catch (error) {
    console.error("Error getting game ID by ID", error);
    throw error;
  }
}

async function registerVote(judgeId, gameId, points) {
  try {
    await client.connect();

    const judge = await getJudgeIdById(judgeId);
    const game = await getGameIdById(gameId);

    if (!judge || !game) {
      throw new Error(
        `Judge or game not found with IDs ${judgeId} and ${gameId}`
      );
    }
    const totalPoints = Object.values(points).reduce(
      (acc, curr) => acc + curr,
      0
    );

    const vote = {
      judgeId: new ObjectId(judge),
      gameId: new ObjectId(game),
      points: points,
      finalScore: totalPoints,
    };

    await votesCollection.insertOne(vote);

    return vote;
  } catch (error) {
    console.error("Error registering vote", error);
    throw error;
  } finally {
    await client.close();
  }
}
// PROMEDIO POR ID DE JUEGOS /////

async function getGameAverageScoresById(gameId) {
  try {
    const vote = await votesCollection.findOne({
      gameId: new ObjectId(gameId),
    });

    if (!vote) {
      throw new Error("No se encontraron votos para el gameId proporcionado");
    }
    const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });

    if (!game) {
      throw new Error("No se encontró un juego para el gameId proporcionado");
    }
    const averageScores = {};
    const categories = Object.keys(vote.points);

    categories.forEach((category) => {
      const totalPoints = vote.points[category];
      const averageScore = totalPoints / categories.length;
      averageScores[category] = averageScore;
    });

    vote.finalScore = categories.reduce(
      (acc, category) => acc + vote.points[category],
      0
    );
    vote.averageScores = averageScores;
    return { vote, game };
  } catch (error) {
    throw error;
  }
}

///VOTOS POR JUEZ ID///

async function getVotesByJudgeId(judgeId) {
  try {
    const votes = await votesCollection
      .find({ judgeId: new ObjectId(judgeId) })
      .toArray();
    const votesDetails = await Promise.all(
      votes.map(async (vote) => {
        const game = await gamesCollection.findOne({ _id: vote.gameId });
        if (!game) {
          return null;
        }

        return {
          gameId: vote.gameId,
          gameName: game.name,
          points: vote.points,
        };
      })
    );

    const filteredVotes = votesDetails.filter((vote) => vote !== null);

    return filteredVotes;
  } catch (error) {
    throw error;
  }
}
/// DATOS DEL JUEZ MEDIANTE EL ID DEL JEUGO ////

async function getJudgesAndPointsByGameId(gameId) {
  const vote = await votesCollection.findOne({ gameId: new ObjectId(gameId) });
  if (!vote) {
    throw new Error("No se encontraron votos para el gameId proporcionado");
  }

  const judgeId = new ObjectId(vote.judgeId);
  const judge = await judgesCollection.findOne({ _id: judgeId });

  if (!judge) {
    throw new Error("No se encontró un juez con el judgeId proporcionado");
  }

  return { vote, judge };
}

export {
  registerVote,
  getGameIdById,
  getAllVotes,
  getGameAverageScoresById,
  getVotesByJudgeId,
  getJudgesAndPointsByGameId,
};
