import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connect() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('yourDatabaseName').collection('examSchedules');
}

export async function insertExamSchedules(dataArray) {
  const collection = await connect();
  const result = await collection.insertMany(dataArray);
  return result;
}

export async function findExamSchedule({ normalizedCode, examType, academicYear, semester }) {
  const collection = await connect();
  return collection.findOne({ normalizedCode, examType, academicYear, semester });
}

export async function closeConnection() {
  await client.close();
}

export async function checkSchedulesInDB(classCode, examSem, academicYear) {
  const collection = await connect();
  return collection.find({ 
    classCode: classCode, 
    examSem: examSem, 
    academicYear: academicYear 
  }).toArray();
}
