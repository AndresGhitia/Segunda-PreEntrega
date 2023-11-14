import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserDao } from '../src/dao/mongo/user.mongo.js';
import { expect } from 'chai';
import supertest from 'supertest';

dotenv.config();

const requester = supertest('http://localhost:8080');

mongoose.connect(process.env.MONGO)

describe('Sessions testing', () => {
    describe('DAO Testing', () => {
        before(() => {
            this.usersDao = new UserDao()
        })
        it('The dao must be able to obtain a user by id from the database', async () => {
            const result = await this.usersDao.getUserById('6522f8daafdbc1c4daff23a7')
            expect(result).to.have.property('_id')
            expect(result).to.have.property('email')
        }).timeout(5000)
        it('The dao must be able to add a user to the database and delete it', async () => {
            const objectId = new mongoose.Types.ObjectId('6522fbdd06a1db68288afccf')
            const user = {
                first_name: 'Test user',
                last_name: 'This is a user created by a test file',
                date_of_birth: '2023-08-21',
                email: 'test@email.com',
                password: 'test',
                cart: objectId,
                role: 'user'
            }

            const result = await this.usersDao.addUser(user)
            expect(result).to.be.an('object')
            expect(result).to.have.property('_id')
            
            const resultDelete = await this.usersDao.deleteUser(result._id)
            expect(resultDelete).to.be.an('object')
            expect(resultDelete).to.have.property('_id')
        })
    })
    describe('Router testing', () => {
        it('The POST register endpoint must create a user in the database correctly', async () => {
            const objectId = new mongoose.Types.ObjectId('6522fbdd06a1db68288afccf')
            const uniqueEmail = `test${Date.now()}@email.com`; 
            const user = {
                first_name: 'Test user',
                last_name: 'This is a user created by a test file',
                date_of_birth: '2023-11-11',
                email: uniqueEmail,
                password: 'test',
                cart: objectId,
                role: 'user',
            };
            
            const res = await requester.post(`/api/sessions/register`).send(user)
            expect(res.statusCode).to.equal(200)
            expect(res.body.payload.result).to.have.property('_id')
        })
        it('The POST login endpoint must log in with a user account correctly and then logout', async () => {
            const login =   {
                email: "adminCoder@coder.com",
                password: "adminCod3r123"
            }
            
            const res = await requester.post(`/api/sessions/login`).send(login)
            expect(res.statusCode).to.equal(200)
            expect(res.body.payload).to.have.property('access_token')
            
            const resLogout = await requester.get('/api/sessions/logout')
            expect(resLogout.statusCode).to.equal(200)
        })
    })
})