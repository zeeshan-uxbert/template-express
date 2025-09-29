import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true, index: true, required: true },
		passwordHash: { type: String, required: true },
	},
	{ timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);


