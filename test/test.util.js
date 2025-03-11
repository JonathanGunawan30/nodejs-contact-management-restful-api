import { prismaClient } from "../src/application/database.js"
import bcrypt from 'bcrypt'

export const removeUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    })
}

export const removeAllTestContact = async () => {
    return prismaClient.contact.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestContact = async () => {
    return prismaClient.contact.create({
        data: {
            first_name: "test",
            last_name: "test",
            email: "test@gmail.com",
            phone: "1234567890",
            username: "test"
        }
    })
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: 'test'
        }
    })
}

export const createManyTestContact = async () => {
    for (let i = 0; i < 15; i ++) {
        await prismaClient.contact.create({
            data: {
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `1234567890${i}`,
                username: `test`
            }
        })
    }
}

export const removeAddressContactById = async (contactId) => {
    return prismaClient.address.deleteMany({
        where: {
            contact_id: contactId
        }
    })
}

export const removeAllAddressContact = async () => {
    return prismaClient.address.deleteMany({})
}

export const createTestAddress = async () => {
    const contact = await getTestContact()
    return prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'Jalan belum ada',
            city: 'Kota belum ada',
            province: 'Provinsi belum ada',
            country: 'Negara belum ada',
            postal_code: '12345'
        }
    })
}

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "test"
            }
        }
    })
}