import supertest from "supertest";
import {
    createTestAddress,
    createTestContact,
    createTestUser, getTestAddress,
    getTestContact, removeAddressContactById, removeAllAddressContact,
    removeAllTestContact,
    removeUser
} from "./test.util.js";
import {web} from "../src/application/web.js";

describe("POST /api/contact/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllAddressContact()
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be create new contact address", async () => {
        let contactId = await getTestContact()
        contactId = contactId.id
        const result = await supertest(web)
            .post(`/api/contacts/${contactId}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jalan belum ada',
                city: 'Kota belum ada',
                province: 'Provinsi belum ada',
                country: 'Negara belum ada',
                postal_code: '12345'
            })
        console.log(result.body)
        expect(result.status).toBe(200)
    })

    it("Should be reject if request is invalid", async () => {
        let contactId = await getTestContact()
        contactId = contactId.id
        const result = await supertest(web)
            .post(`/api/contacts/${contactId}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jalan belum ada',
                city: 'Kota belum ada',
                province: 'Provinsi belum ada',
                country: '',
                postal_code: ''
            })
        console.log(result.body)
        expect(result.status).toBe(400)
    })

    it("Should be reject if contact is not found", async () => {
        let contactId = await getTestContact()
        contactId = contactId.id + 1
        const result = await supertest(web)
            .post(`/api/contacts/${contactId}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jalan belum ada',
                city: 'Kota belum ada',
                province: 'Provinsi belum ada',
                country: '',
                postal_code: ''
            })
        console.log(result.body)
        expect(result.status).toBe(404)
    })
})

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })

    afterEach(async () => {
        await removeAllAddressContact()
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be get contact address data", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id)
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
    })

    it("Should be reject if contact is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + "/addresses/" + testAddress.id)
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(404)
    })

    it("Should be reject if address is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id + 1)
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(404)
    })
})

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })

    afterEach(async () => {
        await removeAllAddressContact()
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be update address", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", 'test')
            .send({
                street: 'Jalan belum ada UPDATED',
                city: 'Kota belum ada UPDATED',
                province: 'Provinsi belum ada UPDATED',
                country: 'Negara UPDATED',
                postal_code: '11111'
            })

        console.log(result.body)
        expect(result.status).toBe(200)
    })

    it("Should be reject if request is not valid", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", 'test')
            .send({
                street: 'Jalan belum ada UPDATED',
                city: 'Kota belum ada UPDATED',
                province: 'Provinsi belum ada UPDATED',
                country: '',
                postal_code: ''
            })

        console.log(result.body)
        expect(result.status).toBe(400)
    })

    it("Should be reject if address is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id + 1)
            .set("Authorization", 'test')
            .send({
                street: 'Jalan belum ada UPDATED',
                city: 'Kota belum ada UPDATED',
                province: 'Provinsi belum ada UPDATED',
                country: 'Negara UPDATED',
                postal_code: '11111'
            })

        console.log(result.body)
        expect(result.status).toBe(404)
    })

    it("Should be reject if contact is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + 1 + "/addresses/" + testAddress.id)
            .set("Authorization", 'test')
            .send({
                street: 'Jalan belum ada UPDATED',
                city: 'Kota belum ada UPDATED',
                province: 'Provinsi belum ada UPDATED',
                country: 'Negara UPDATED',
                postal_code: '11111'
            })

        console.log(result.body)
        expect(result.status).toBe(404)
    })
})

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })

    afterEach(async () => {
        await removeAllAddressContact()
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be remove address", async () => {
        const testContact = await getTestContact()
        let testAddress = await getTestAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", 'test')

        console.log(result.body)
        expect(result.status).toBe(200)

        testAddress = await getTestAddress()
        expect(testAddress).toBeNull()
    })

    it("Should be failed remove if contact id is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1 + "/addresses/" + testAddress.id)
            .set("Authorization", 'test')

        console.log(result.body)
        expect(result.status).toBe(404)
    })

    it("Should be failed remove if address id is not found", async () => {
        const testContact = await getTestContact()
        const testAddress = await getTestAddress()

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + "/addresses/" + testAddress.id + 1)
            .set("Authorization", 'test')

        console.log(result.body)
        expect(result.status).toBe(404)
    })
})

describe("GET /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
        await createTestAddress()
    })

    afterEach(async () => {
        await removeAllAddressContact()
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be list addresses", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + "/addresses")
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
    })

    it("Should be reject if contact is not found", async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + "/addresses")
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(404)
    })

})