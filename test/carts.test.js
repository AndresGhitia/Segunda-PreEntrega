import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CartDao } from '../src/dao/mongo/cart.mongo.js';
import { expect } from 'chai';
import supertest from 'supertest';

dotenv.config();

const requester = supertest('http://localhost:8080');

mongoose.connect(process.env.MONGO)

describe('Carts testing', () => {
    describe('DAO Testing', () => {
        before(() => {
            this.cartsDao = new CartDao()
        })
        it('The dao must be able to create a cart', async () => {
            const result = await this.cartsDao.createCart()
            expect(result).to.have.property('_id')
        }).timeout(5000)
    })
    describe('Router Testing', () => {
        it('The POST endpoint must create a cart in the database correctly', async () => {
            const res = await requester.post(`/api/carts/`)
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.have.property('payload')
            expect(res.body.payload).to.have.property('createdCart')
            expect(res.body.payload.createdCart).to.have.property('products')
        })
        it('The GET by id endpoint must fetch a cart from the database correctly', async () => {
            const cid = '64dad1b2610d7dac7dd8c7bf'
            const res = await requester.get(`/api/carts/${cid}`)
            expect(res.statusCode).to.equal(200)
            expect(res.body.payload.products).to.be.an('array')
        })
        it('The PUT endpoint must update the quantity of a product in the cart correctly', async () => {
            const cid = '64dad1b2610d7dac7dd8c7bf'
            const pid = '64d956a3b0e254dde2beadfe'
            const res = await requester.put(`/api/carts/${cid}/products/${pid}`).send({quantity: 25})
            expect(res.statusCode).to.equal(200)
        })
    })
})