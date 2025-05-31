import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

const client = new MongoClient(uri);
let isConnected = false;

export async function connect() {
  try {
    if (!isConnected) {
      console.log('Connecting to MongoDB...');
      await client.connect();
      isConnected = true;
      console.log('Connected to MongoDB successfully');
    }
    return client.db('yourDatabaseName').collection('examSchedules');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

export async function insertExamSchedules(dataArray) {
  try {
    console.log('Inserting exam schedules:', dataArray.length, 'records');
    const collection = await connect();
    const result = await collection.insertMany(dataArray);
    console.log('Insert result:', result.insertedCount, 'documents inserted');
    return result;
  } catch (error) {
    console.error('Error inserting exam schedules:', error);
    throw error;
  }
}

export async function findExamSchedule({ normalizedCode, examType, academicYear, semester }) {
  try {
    const collection = await connect();
    const result = await collection.findOne({ normalizedCode, examType, academicYear, semester });
    console.log('Find exam schedule result:', result ? 'Found' : 'Not found');
    return result;
  } catch (error) {
    console.error('Error finding exam schedule:', error);
    throw error;
  }
}

export async function checkSchedulesInDB(classCode, examSem, academicYear) {
  try {
    console.log('Checking schedules in DB:', { classCode, examSem, academicYear });
    const collection = await connect();
    
    // Build query object dynamically
    const query = {};
    if (classCode) query.classCode = classCode;
    if (examSem) query.examSem = examSem;
    if (academicYear) query.academicYear = academicYear;
    
    console.log('Query:', query);
    const result = await collection.find(query).toArray();
    console.log('Check schedules result:', result.length, 'documents found');
    return result;
  } catch (error) {
    console.error('Error checking schedules in DB:', error);
    throw error;
  }
}

export async function closeConnection() {
  try {
    if (isConnected) {
      await client.close();
      isConnected = false;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing MongoDB connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing MongoDB connection...');
  await closeConnection();
  process.exit(0);
});