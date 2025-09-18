const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();


describe('Testes API REST de Checkout e Pagamento de produtos', () => {
    before(async () => {
        const postLogin = require('../fixture/requisicoes/login/postLogin.json');
        const respostaLogin = await request('http://localhost:3000')
            .post('/api/users/login')
            .send(postLogin);
        expect(respostaLogin.status).to.equal(200);
        expect(respostaLogin.body.token).to.be.a('string');
        token = respostaLogin.body.token;
    });

    it('Validar pagamento com boleto', async () => {
        const postPagtoWithBoleto = require('../fixture/requisicoes/checkout/postPagtoWithBoleto.json');
        const resposta = await request('http://localhost:3000')
            .post('/api/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send(postPagtoWithBoleto);
        expect(resposta.status).to.equal(200);
        const respostaEsperada = require('../fixture/respostas/valoresValidosSucessoBoleto.json');
        expect(resposta.body).to.deep.equal(respostaEsperada);
    });

    it('Validar pagamento com cartao', async () => {
        const postPagtoWithCartao = require('../fixture/requisicoes/checkout/postPagtoWithCartao.json');
        const resposta = await request('http://localhost:3000')
            .post('/api/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send(postPagtoWithCartao);
        expect(resposta.status).to.equal(200);
        const respostaEsperada = require('../fixture/respostas/valoresValidosSucessoCartao.json');
        expect(resposta.body).to.deep.equal(respostaEsperada);
    });
});