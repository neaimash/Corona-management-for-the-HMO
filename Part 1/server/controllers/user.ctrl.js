const connectToDatabase = require("../db").connectToDatabase;

// insert user
exports.insertUser = async (req, res) => {
    console.log("insert User")
    let user = req.body.user;
    console.log("user: " + user)
    //Server-side input checks
    if (user.name == "" || !(/^[a-zA-Zא-ת\s]+$/.test(user.name))) {
        res.status(404).json({ success: false });
        ; return
    }
    if (user.ID == "" || user.ID.length != 9) {
        res.status(404).json({ success: false });
        return
    }
    if (user.city == "" || !(/^[a-zA-Zא-ת\s]+$/.test(user.city))) {
        res.status(404).json({ success: false });
        return
    }
    if (user.street == "" || !(/^[a-zA-Zא-ת\s]+$/.test(user.street))) {
        res.status(404).json({ success: false });
        return
    }
    if (user.numberOfHouse == "") {
        res.status(404).json({ success: false });
        return
    }
    if (user.dateOfBirth == "" || new Date(user.dateOfBirth) > new Date()) {
        res.status(404).json({ success: false });
        return
    }
    if (user.mobilePhone == "" || user.mobilePhone.length !== 10 && !(/^[a-zA-Zא-ת]+$/.test(user.mobilePhone))) {
        res.status(404).json({ success: false });
        return
    }
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;

    const usersColl = await db.collection("users"); // users-collection name
    usersColl.insertOne(user, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    })
    res.status(201).json({ success: true });
};

// Get all the users and their details
exports.getUsers = async (req, res) => {
    console.log("get users")
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const usersColl = await db.collection("users"); // users-collection name
    let users = await usersColl.find({}).toArray()
    res.status(201).json(users);
};

// Get number of not vaccition users
exports.getNumber = async (req, res) => {
    console.log("get number users")
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const usersColl = await db.collection("users"); // users-collection name
    let users = await usersColl.find({
        vaccinationArray: [
            { date: '', producer: '' },
            { date: '', producer: '' },
            { date: '', producer: '' },
            { date: '', producer: '' }
        ]
    }).toArray()
    res.status(201).json(users.length);
};

// Get the dates from the last month
function get_all_dates(year, month) {
    let date = new Date(year, month, 1);
    let dates = [];
    let i = 0;
    while (date.getMonth() === month) {
        dates.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
        i = i + 1;
    }
    let uniqueDays = dates.filter((c, index) => {
        return dates.indexOf(c) === index;
    });
    return uniqueDays
}

// Get Active Users
exports.getActiveUsers = async (req, res) => {
    console.log("get number users")
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const usersColl = await db.collection("users"); // users-collection name
    let users = await usersColl.find({
    }).toArray()
    let dates = get_all_dates(new Date().getFullYear(), new Date().getMonth());
    console.log(dates)
    let array = []
    for (let user of users) {
        if (user.dateOfResult !== "") {
            for (let date of dates) {
                let number = 0;
                let index = 0;
                if (new Date(user.dateOfResult).getDate() == date && new Date(user.dateOfResult).getMonth() == new Date().getMonth()) {
                    index = array.length
                    number++
                    array.push({
                        date: date,
                        number: number
                    })
                }
                if (number !== 0) {
                    array[index] = {
                        date: date,
                        number: number
                    }
                }
            }
        }
    }
    let uniqueDays = array.map((obj, index) => {
        if(array.findIndex((item) => item.date === obj.date) !== index){
            array[array.indexOf(obj)].number++;
            array = array.splice(array.findIndex((item) => item.date === obj.date && item.number ==1) !== index, 1)
        }
        return array
    });
    console.log(uniqueDays)
    let newArray = uniqueDays[0].sort((a,b)=> {return a.date - b.date})
    res.status(201).json({ array: newArray, dates: dates });
};

// Get user by ID and his details
exports.getUserById = async (req, res) => {
    let ID = req.body.ID
    console.log("get user by id")
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const usersColl = await db.collection("users"); // users-collection name
    let users = await usersColl.find({ ID: ID }).toArray()
    res.status(201).json(users[0]);
};

// Get user by ID and his corona details
exports.getUserCoronaById = async (req, res) => {
    let ID = req.body.ID
    console.log("get user corona by id")
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const usersColl = await db.collection("users"); // users-collection name
    let users = await usersColl.find({ ID: ID }).toArray();

    let user = {
        vaccinationArray: users[0].vaccinationArray,
        dateOfResult: users[0].dateOfResult,
        dateOfRecovery: users[0].dateOfRecovery
    }
    res.status(201).json(user);
};