import mongoose from 'mongoose';

export async function connectMongoose() {
	const uri = process.env.MONGO_URI;
	await mongoose.connect(uri);
	return mongoose;
}


