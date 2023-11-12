import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db('parcial1_ledesma_nayla');
const judgesCollection = db.collection('judges');

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

async function getAlljudges(filter = {}) {
    try {
      await client.connect();
      const filterMongo = filterQueryToMongo(filter)
      return judgesCollection.find(filterMongo).toArray()
    } catch (error) {
      console.error('Error fetching judges', error);
      throw error; 
    } 
}


async function getJudgeByID(id) {
  try {
      await client.connect();
      const judge = await judgesCollection.findOne({ _id: new ObjectId(id) });
      return judge;
  } catch (error) {
      console.error('Error getting judge by ID', error);
      throw error;
  } 
}
export {
    getAlljudges,
    getJudgeByID,
}