import supertest from "supertest"
import {web} from "../src/application/web.js"
import {
    createManyTestContact,
    createTestContact,
    createTestUser,
    getTestContact,
    removeAllTestContact,
    removeUser
} from "./test.util.js"

describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeUser()
    })
    it("Should be create new contact", async () => {
        const result = await supertest(web)
                                .post('/api/contacts')
                                .set('Authorization', 'test')
                                .send({
                                    first_name: "test",
                                    last_name: "test",
                                    email: "test@gmail.com",
                                    phone: "081283331221"
                                })
        expect(result.status).toBe(200)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.first_name).toBe("test")
        expect(result.body.data.last_name).toBe("test")
        expect(result.body.data.email).toBe("test@gmail.com")
        expect(result.body.data.phone).toBe("081283331221")
    })

    it("Should be reject if request is not valid", async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: "",
                last_name: "",
                email: "",
                phone: "081283331221593784294587329304785"
            })
        expect(result.status).toBe(400)
        expect(result.errors).toBeDefined()
    })
})

describe("GET /api/contacts/:id", () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be return contact details", async () => {
        const contact = await getTestContact()
        const result = await supertest(web)
            .get('/api/contacts/' + contact.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data.id).toBe(contact.id)
        expect(result.body.data.first_name).toBe(contact.first_name)
    })

    it("Should be return 404 if contact id is not found", async () => {
        const contact = await getTestContact()
        const result = await supertest(web)
            .get('/api/contacts/' + contact.id + 1)
            .set('Authorization', 'test')

        expect(result.status).toBe(404)
    })
})

describe('PUT /api/contacts/:id', () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeUser()
    })
    it("Should be update contact details", async () => {
        const contact = await getTestContact()
        console.log(JSON.stringify(contact.id))
        const result = await supertest(web)
            .put("/api/contacts/" + contact.id)
            .set('Authorization', 'test')
            .send({
                first_name: "test updated",
                last_name: "test updated",
                email: "emailUpdated@gmail.com",
                phone: "1234567890"
            })
        console.log(result.body)
        expect(result.status).toBe(200)
    })

    it("Should be reject if request is invalid", async () => {
        const contact = await getTestContact()
        console.log(JSON.stringify(contact.id))
        const result = await supertest(web)
            .put("/api/contacts/" + contact.id)
            .set('Authorization', 'test')
            .send({
                first_name: "",
                last_name: "",
                email: "",
                phone: ""
            })
        console.log(result.body)
        expect(result.status).toBe(400)
    })

    it("Should be reject if contact is not found", async () => {
        const contact = await getTestContact()
        console.log(JSON.stringify(contact.id))
        const result = await supertest(web)
            .put("/api/contacts/" + contact.id + 1)
            .set('Authorization', 'test')
            .send({
                first_name: "test updated",
                last_name: "test updated",
                email: "emailUpdated@gmail.com",
                phone: "1234567890"
            })
        console.log(result.body)
        expect(result.status).toBe(404)
    })
});

describe('DELETE /api/contacts/:id', () => {
    beforeEach(async () => {
        await createTestUser()
        await createTestContact()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be remove contacts", async () => {
        let contact = await getTestContact()

        const result = await supertest(web)
            .delete("/api/contacts/" + contact.id)
            .set('Authorization', 'test')

        console.log(result.body)

        expect(result.body.data).toBe("OK")
        expect(result.status).toBe(200)

        contact = await getTestContact()
        expect(contact).toBe(null)
    })

    it("Should be failed if contact is not found", async () => {
        const contact = await getTestContact()

        const result = await supertest(web)
            .delete("/api/contacts/" + (contact.id + 1))
            .set('Authorization', 'test')

        console.log(result.body)

        expect(result.status).toBe(404)

    })
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser()
        await createManyTestContact()
    })

    afterEach(async () => {
        await removeAllTestContact()
        await removeUser()
    })

    it("Should be search without parameter", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test')
        console.log(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("Should be search to page 2", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                page: 2
            })
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it("Should be search using name", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: 'test 1'
            })
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it("Should be search using email", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: 'test1@gmail.com'
            })
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(1)
    })

    it("Should be search using phone", async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: '12345678908'
            })
            .set('Authorization', 'test')

        console.log(result.body)
        expect(result.status).toBe(200)
        expect(result.body.data.length).toBe(1)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(1)
    })
})