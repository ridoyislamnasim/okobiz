import { NotFoundError } from '../../utils/errors.js';
import BaseService from '../base/base.service.js';
import bcrypt from "bcryptjs";

import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import authRepository from './auth.repository.js';

class AuthService extends BaseService {
    #repository;
    constructor(repository, serviceName) {
        super(repository, serviceName);
        this.#repository = repository;
    }
    async getUserById(userId, session) {
        // 
        console.log('userId',userId);
        const user = await this.#repository.getUserById(userId, session);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    async authUserSingUp(payload, session) {
        const {name,email, password} = payload;
        if (!name ||!email ||!password) {
            throw new Error('name, email and password are required');
        }
        console.log('payload',payload);
        const auth = await this.#repository.getAuthByEmail(email);
        if (auth) throw new Error('Email already exists');
        const hashedPassword = await bcrypt.hash(String(password), 10);
        payload.password = hashedPassword;
        const authData = await this.#repository.authUserSingUp(payload, session);
        return authData;  
    }

    async authUserSingIn(payload, files, session) {
        const { email, password } = payload;
        const auth = await this.#repository.getAuthByEmail(email);
        if (!auth) throw new NotFoundError('unauthorized access');
        const isPasswordMatch = await bcrypt.compare(String(password), auth?.password );
        if (!isPasswordMatch) throw new NotFoundError('unauthorized access');
        const user_info_encrypted = {
            id: auth?._id || null,
            name: auth?.name|| null,
            email: auth?.email || null,
            amount: auth?.amount || null
        };

        const accessToken = generateAccessToken({ userInfo: { user_info_encrypted } });
        const refreshToken = generateRefreshToken({ userInfo: { user_info_encrypted } });

        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
            user: user_info_encrypted,
        };
    }


}

export default new AuthService(authRepository, 'auth');
