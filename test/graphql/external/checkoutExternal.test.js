const request = require('supertest');
const { expect, use } = require('chai');

describe('Testes API GRAPHQL de Checkout e Pagamento de produtos', () => {
    
    before(async () => {
        const loginUser = require('../fixture/requisicoes/login/loginUser.json');
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send(loginUser);

        token = resposta.body.data.login.token;
    });

    it('Validar sucesso de pagamento com boleto', async () => {
        const reqBoleto = require('../fixture/requisicoes/checkout/createPagtoWithBoleto.json');
        const respostaSucessoBoleto = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(reqBoleto);

        expect(respostaSucessoBoleto.status).to.equal(200);
        expect(respostaSucessoBoleto.body).to.have.property('data');
        expect(respostaSucessoBoleto.body.data.checkout).to.include({ paymentMethod: 'boleto' });
    });

    it('Validar sucesso de pagamento com cartão', async () => {
        const reqCartao = require('../fixture/requisicoes/checkout/createPagtoWithCartao.json');
        const respostaSucessoCartao = await request('http://localhost:4000')
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send(reqCartao);

        expect(respostaSucessoCartao.status).to.equal(200);
        expect(respostaSucessoCartao.body).to.have.property('data');
        expect(respostaSucessoCartao.body.data.checkout).to.include({ paymentMethod: 'credit_card' });
        const respostaEsperada = require('../fixture/respostas/pagamentos/validarPagamentoComCartao.json');
        expect(respostaSucessoCartao.body.data.checkout).to.deep.equal(respostaEsperada.data.checkout);
    });

    const testesDeErrosDeNegocio = require('../fixture/requisicoes/checkout/createCheckoutWithError.json'); 
    testesDeErrosDeNegocio.forEach(teste => {
        it(`Testando a regra relacionada a ${teste.nomeDoTeste}`, async () => {
            const respostaCheckout = await request('http://localhost:4000')
                .post('/graphql')
                .set('Authorization', `Bearer ${token}`)
                .send(teste.createCheckout);

            expect(respostaCheckout.status).to.equal(200);
            expect(respostaCheckout.body.errors[0].message).to.equal(teste.mensagemEsperada);
        });
    });

});