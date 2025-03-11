import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { createTestUser, getTestUser, removeUser } from "./test.util"
import bcrypt from "bcrypt"

describe("POST /api/users", () => {

    afterEach(async () => {
        await removeUser()
    })

    it("Should be register new user", async () => {
        const result = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "rahasia",
                name: "test"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined();
    })

    it("Should be reject if request is invalid", async () => {
        const result = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name: ""
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it("Should be reject if username already exist", async () => {
        let result = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "rahasia",
                name: "test"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "rahasia",
                name: "test"
            })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe("POST /api/users/login", () => {

    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeUser()
    })
    it("Should be login", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "rahasia"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
    })

    it("Should be reject login if request is invalid", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "",
                password: ""
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })

    it("Should be reject login if request password is invalid", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "salah"
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

    it("Should be reject login if request username is invalid", async () => {
        const result = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "salah",
                password: "rahasia"
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })

})

describe("GET /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeUser()
    })

    it("Should be get current user", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
    })

    it("Should be reject if token is invalid", async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set('Authorization', 'salah')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe("PATCH /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeUser()
    })

    it("Should update user", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', "test")
            .send({
                name: "jonathan",
                password: "rahasia lagi"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("jonathan")
        expect(result.body.data.username).toBe("test")

        const user = await getTestUser();

        expect(await bcrypt.compare("rahasia lagi", user.password)).toBe(true)
    })
    it("Should update user name only", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', "test")
            .send({
                name: "jonathan"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("jonathan")
        expect(result.body.data.username).toBe("test")
    })

    it("Should update user password only", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', "test")
            .send({
                password: "rahasia lagi"
            })
        const user = await getTestUser();
        expect(result.status).toBe(200)
        expect(await bcrypt.compare("rahasia lagi", user.password)).toBe(true)
    })

    it("Should reject if request is not valid", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set('Authorization', "salah")
            .send({})

        expect(result.status).toBe(401)
    })
})

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await createTestUser()
    })

    afterEach(async () => {
        await removeUser()
    })
    it("Should be logout", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "test");

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const user = await getTestUser();
        expect(user.token).toBeNull()
    })

    it("Should be reject logout if token is invalid", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "salah");

        expect(result.status).toBe(401)
    })
})