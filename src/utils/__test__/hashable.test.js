const { hashable } = require('../hashable')

const sample1 = {
    "id": "0002",
    "type": "donut",
    "name": "Raised",
    "ppu": 0.55,
    "batters":
    {
        "batter":
            [
                { "id": "1001", "type": "Regular" },
                { "type": "Large", "id": "0001" }
            ]
    },
    "topping":
        [
            { "id": "5001", "type": "None" },
            { "type": "Glazed", "id": "5002" },
            { "id": "5005", "type": "Sugar" },
            { "id": "5003", "type": "Chocolate", "aaa": "boss" },
            { "id": "5004", "type": "Maple" }
        ]
}

const arraySorted1 = {
    "id": "0002",
    "type": "donut",
    "name": "Raised",
    "ppu": 0.55,
    "batters":
    {
        "batter":
            [
                { "type": "Large", "id": "0001" },
                { "id": "1001", "type": "Regular" }
            ]
    },
    "topping":
        [
            { "id": "5001", "type": "None" },
            { "type": "Glazed", "id": "5002" },
            { "id": "5003", "type": "Chocolate", "aaa": "boss" },
            { "id": "5004", "type": "Maple" },
            { "id": "5005", "type": "Sugar" }
        ]
}

const allSorted1 = {
    "batters":
    {
        "batter":
            [
                { "id": "0001", "type": "Large" },
                { "id": "1001", "type": "Regular" }
            ]
    },
    "id": "0002",
    "name": "Raised",
    "ppu": 0.55,
    "topping":
        [
            { "id": "5001", "type": "None" },
            { "id": "5002", "type": "Glazed" },
            { "aaa": "boss", "id": "5003", "type": "Chocolate" },
            { "id": "5004", "type": "Maple" },
            { "id": "5005", "type": "Sugar" }
        ],
    "type": "donut",
}

const sample2 = {
    "_id": "5973782bdb9a930533b05cb2",
    "isActive": true,
    "balance": "$1,446.35",
    "age": 32,
    "eyeColor": "green",
    "name": "Logan Keller",
    "gender": "male",
    "company": "ARTIQ",
    "email": "logankeller@artiq.com",
    "phone": "+1 (952) 533-2258",
    "friends": [
        {
            "id": 2,
            "name": "Carol Martin"
        },
        {
            "name": "Colon Salazar",
            "id": 0,
        },
        {
            "id": 1,
            "name": "French Mcneil"
        }
    ],
    "favoriteFruit": "banana"
}

const allSorted2 = {
    "_id": "5973782bdb9a930533b05cb2",
    "age": 32,
    "balance": "$1,446.35",
    "company": "ARTIQ",
    "email": "logankeller@artiq.com",
    "eyeColor": "green",
    "favoriteFruit": "banana",
    "friends": [
        {
            "id": 0,
            "name": "Colon Salazar"
        },
        {
            "id": 1,
            "name": "French Mcneil"
        },
        {
            "id": 2,
            "name": "Carol Martin"
        }
    ],
    "gender": "male",
    "isActive": true,
    "name": "Logan Keller",
    "phone": "+1 (952) 533-2258"
}

describe('hashable returns the desired sorted JSON', () => {
    it('hashable sorts array only for sample JSON 1', () => {
        expect(JSON.stringify(hashable(sample1))).toBe(JSON.stringify(arraySorted1))
    })
    
    it('hashable sorts array and object for sample JSON 1', () => {
        expect(JSON.stringify(hashable(sample1, { sortObject: true }))).toBe(JSON.stringify(allSorted1))
    })

    it('hashable sorts array and object for sample JSON 2', () => {
        expect(JSON.stringify(hashable(sample2, { sortObject: true }))).toBe(JSON.stringify(allSorted2))
    })
})
