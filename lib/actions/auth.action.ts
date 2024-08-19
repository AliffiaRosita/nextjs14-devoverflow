'use server';
import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import auth from '../firebase/firebase.auth';
import { NewCreateUserParams, NewGoogleCreateUserParams } from './shared.types';
import { generateOTP } from '../otp.generator';
import { sendEmail } from '../nodemailer';
import jwt from 'jsonwebtoken';
import RefreshToken from '@/database/refresh.token.model';

export const signUp = async (userData: NewCreateUserParams) => {
    try {
        connectToDatabase();
        const defaultImage = process.env.NEXT_DEFAULT_PICTURE;

        await userExists(userData.email);

        const firebaseResponse = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password,
        );

        const newUser = await User.create({
            username: userData.email.split('@')[0],
            email: userData.email,
            firebaseId: firebaseResponse.user.uid,
            picture: defaultImage,
        });

        await sendOTP(newUser.email);

        return newUser;
    } catch (error: any) {
        console.log(error);
        if (error.code === 'auth/email-already-in-use')
            throw new Error('Email already exist');
        throw new Error(error.message || 'Failed to sign up');
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        connectToDatabase();

        const response = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );

        if (!response) throw new Error('User not found');

        await isUserVerified(email);

        const existingUser = await User.findOne({ email });

        const accessToken = createAccessToken(existingUser.firebaseId);
        const refreshToken = await createAndSaveRefreshToken(
            existingUser.firebaseId,
        );

        return { data: existingUser, accessToken, refreshToken };
    } catch (error: any) {
        console.log(error);
        if (error.code === 'auth/invalid-credential')
            throw new Error('Wrong email or password');

        if (error.code === 'auth/too-many-requests')
            throw new Error(
                'You have too many failed login attempts. Try again later!',
            );

        throw new Error(error.message || 'Failed to sign up');
    }
};

export const googleSignUp = async (userData: NewGoogleCreateUserParams) => {
    try {
        connectToDatabase();
        const defaultImage = process.env.NEXT_DEFAULT_PICTURE;
        const existingUser = await userExists(userData.email);

        if (!existingUser) {
            const newGoogleUser = new User({
                name: userData.name,
                username: userData.email.split('@')[0],
                email: userData.email,
                googleId: userData.googleId,
                picture: defaultImage,
                isEmailVerified: true,
            });

            const userSave = await newGoogleUser.save();

            return userSave;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Failed to sign up');
    }
};

export const googleSignIn = async (googleId: string, email: string) => {
    try {
        connectToDatabase();
        const existingUser = await User.findOne({
            $or: [{ googleId }, { email }],
        });

        if (!existingUser) throw new Error('User not found');

        const accessToken = createAccessToken(existingUser.firebaseId);
        const refreshToken = await createAndSaveRefreshToken(
            existingUser.firebaseId,
        );

        return {data: existingUser, accessToken, refreshToken}
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Failed to sign up');
    }
};

const createAccessToken = (userId: string) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret)
        throw new Error('Access token secret is not defined');

    return jwt.sign({ id: userId }, accessTokenSecret, { expiresIn: '5m' });
};

const createAndSaveRefreshToken = async (firebaseId: string) => {
    try {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret)
            throw new Error('Refresh token secret is not defined');

        const refreshToken = jwt.sign({ id: firebaseId }, refreshTokenSecret, {
            expiresIn: '30d',
        });

        const newRefreshToken = new RefreshToken({
            firebaseId,
            refreshToken,
        });

        await newRefreshToken.save();

        return refreshToken;
    } catch (error: any) {
        console.log(error);
        throw new Error(
            error.message || 'Failed to create and save refresh token',
        );
    }
};

export const verifyEmail = async (email: string, otp: number) => {
    try {
        connectToDatabase();

        const user = await User.findOne({ email, OTPCode: otp });
        if (!user) throw new Error('Invalid OTP');

        user.isEmailVerified = true;
        user.OTPCode = '';

        await user.save();

        return true;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Failed to verify email');
    }
};

export const userExists = async (email: string) => {
    try {
        connectToDatabase();

        const user = await User.findOne({ email });
        if (user) throw new Error('Email already exist');

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const isUserVerified = async (email: string) => {
    try {
        connectToDatabase();

        const user = await User.findOne({ email });
        if (user.isEmailVerified === false)
            throw new Error('Email is not verified');

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const sendOTP = async (email: string): Promise<string> => {
    try {
        const otp = generateOTP(6);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { OTPCode: otp },
            { new: true, upsert: true },
        );

        if (!updatedUser) throw new Error('User not found');

        await sendEmail(
            email,
            'OTP verification code',
            `Your OTP code.`,
            'Use the following OTP code to complete your verification:',
            `<h2>${otp}</h2>`,
            'This code is valid for 10 minutes. Please do not share it with anyone.',
            `If you didn't request this code, please ignore this email.`,
            `${new Date().getFullYear().toString()}`,
        );

        return otp;
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Failed to send OTP');
    }
};
