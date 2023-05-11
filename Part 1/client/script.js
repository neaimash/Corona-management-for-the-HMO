/*
 The submitUser function is an event listener for the submit button on the form. It first retrieves all the user inputs from the form fields, validates them, and stores them in an object called user. The user object is then sent to the server using the fetch API with the POST method.
 */
async function submitUser() {
    let name = document.getElementById('name').value;
    let ID = document.getElementById('ID').value;
    let city = document.getElementById('city').value;
    let street = document.getElementById('street').value;
    let numberOfHouse = document.getElementById('numberOfHouse').value;
    let dateOfBirth = document.getElementById('dateOfBirth').value;
    let phone = document.getElementById('phone').value;
    let mobilePhone = document.getElementById('mobilePhone').value;
    let date1 = document.getElementById('date1').value;
    let producer1 = document.getElementById('date1Producer').value;
    let date2 = document.getElementById('date2').value;
    let producer2 = document.getElementById('date2Producer').value;
    let date3 = document.getElementById('date3').value;
    let producer3 = document.getElementById('date3Producer').value;
    let date4 = document.getElementById('date4').value;
    let producer4 = document.getElementById('date4Producer').value;
    let dateOfResult = document.getElementById('dateOfResult').value;
    let dateOfRecovery = document.getElementById('dateOfRecovery').value;
    let image = document.getElementById("img").value;
    console.log(image)
    //Client-side input tests
    if (name == "" || !(/^[A-Za-zא-ת]{1,}\s[A-Za-zא-ת]{1,}$/.test(name))) {
        alert("Please enter correct name")
        return
    }
    if (ID == "" || ID.length != 9) {
        alert("Please enter correct ID")
        return
    }
    if (city == "" || !(/^[a-zA-Zא-ת\s]+$/.test(city))) {
        alert("Please enter correct city")
        return
    }
    if (street == "" || !(/^[a-zA-Zא-ת\s]+$/.test(street))) {
        alert("Please enter correct street")
        return
    }
    if (numberOfHouse == "") {
        alert("Please enter correct number of house")
        return
    }
    if (dateOfBirth == "" || new Date(dateOfBirth) > new Date()) {
        alert("Please enter correct date of birth")
        return
    }
    if (mobilePhone == "" || mobilePhone.length !== 10 && !(/^[a-zA-Zא-ת]+$/.test(mobilePhone))) {
        alert("Please enter correct mobile phone")
        return
    }

    let user = {
        name: name,
        ID: ID,
        city: city,
        street: street,
        numberOfHouse: numberOfHouse,
        phone: phone,
        mobilePhone: mobilePhone,
        vaccinationArray: [
            {
                date: date1,
                producer: producer1
            },
            {
                date: date2,
                producer: producer2
            },
            {
                date: date3,
                producer: producer3
            },
            {
                date: date4,
                producer: producer4
            }
        ],
        dateOfResult: dateOfResult,
        dateOfRecovery: dateOfRecovery,
        image: image
    }

    console.log(user)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "token = 33",
        },
        body: JSON.stringify({ user: user }),
    };
    try {
        const response = await fetch("http://localhost:4000/api/insertUser", options);
        const result = await response.json();
        console.log(result)
    } catch (error) {
        console.log(error)
    }
    //Returns the input fields to be empty
    document.getElementById('name').value = "";
    document.getElementById('ID').value = "";
    document.getElementById('city').value = "";
    document.getElementById('street').value = "";
    document.getElementById('numberOfHouse').value = "";
    document.getElementById('dateOfBirth').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('mobilePhone').value = "";
    document.getElementById('date1').value = "";
    document.getElementById('date1Producer').value = "";
    document.getElementById('date2').value = "";
    document.getElementById('date2Producer').value = "";
    document.getElementById('date3').value = "";
    document.getElementById('date3Producer').value = "";
    document.getElementById('date4').value = "";
    document.getElementById('date4Producer').value = "";
    document.getElementById('dateOfResult').value = "";
    document.getElementById('dateOfRecovery').value = "";
    document.getElementById("img").value = "";
}
/*
 The onFileSelected function is an event listener for when a user selects an image file to upload. It reads the file and displays it on the page.
 */
const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
        let newImage = document.createElement("img");
        newImage.className = "addImage"
        newImage.src = e.target.result;
        document.getElementById("imageDiv").append(newImage)
    };
};

window.addEventListener("load", () => {
    let inputFile = document.getElementById("img");
    inputFile.addEventListener("change", (e) => {
        onFileSelected(e)
    })
})
//A retrieval function that brings all users and their details in a table.
async function getAllUsers() {
    try {
        const response = await fetch("http://localhost:4000/api/getUsers");
        const result = await response.json();
        console.log(result)
        if (result) {
            document.getElementById("table").style.display = "block";
            for (let i = 0; i < result.length; i++) {
                //The createTable function is then called for each user object to create a new row in a table with the user's details.
                createTable(result[i])
            }
        }
    } catch (error) {
        console.log(error)
    }
}

function createTable(element) {
    const tr = document.createElement('tr');
    const name = document.createElement('td');
    name.innerHTML = element.name;
    const ID = document.createElement('td');
    ID.innerHTML = element.ID;
    const city = document.createElement('td');
    city.innerHTML = element.city;
    const street = document.createElement('td');
    street.innerHTML = element.street;
    const numberOfHouse = document.createElement('td');
    numberOfHouse.innerHTML = element.numberOfHouse;
    const phone = document.createElement('td');
    phone.innerHTML = element.phone;
    const mobilePhone = document.createElement('td');
    mobilePhone.innerHTML = element.mobilePhone;
    tr.append(name, ID, city, street, numberOfHouse, phone, mobilePhone)
    for (let i = 0; i < element.vaccinationArray.length; i++) {
        const date = document.createElement('td');
        date.innerHTML = element.vaccinationArray[i].date;
        const dateProducer = document.createElement('td');
        dateProducer.innerHTML = element.vaccinationArray[i].producer;
        tr.append(date, dateProducer);
    }
    const dateOfResult = document.createElement('td');
    dateOfResult.innerHTML = element.dateOfResult;
    const dateOfRecovery = document.createElement('td');
    dateOfRecovery.innerHTML = element.dateOfRecovery;
    tr.append(dateOfResult, dateOfRecovery);
    const tbody = document.getElementById('tbody');
    tbody.append(tr)
}
//A retrieval function that fetches details of a specific user.
async function getUserDetails() {
    let ID = document.getElementById('userID').value;
    const userDetails = document.getElementById('userDetails');
    userDetails.innerHTML = "";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "token = 33",
        },
        body: JSON.stringify({ ID: ID }),
    };
    try {
        const response = await fetch("http://localhost:4000/api/getUserById", options);
        const result = await response.json();
        console.log(result)
        drawUser(result)
    } catch (error) {
        console.log(error)
    }
}


function drawUser(element) {
    const div = document.createElement("div");
    const name = document.createElement("h5");
    name.innerHTML = "Name: " + element.name;
    const ID = document.createElement("h5");
    ID.innerHTML = "ID: " + element.ID;
    const city = document.createElement("h5");
    city.innerHTML = "City: " + element.city;
    const street = document.createElement("h5");
    street.innerHTML = "Street: " + element.street;
    const numberOfHouse = document.createElement("h5");
    numberOfHouse.innerHTML = "Number of house: " + element.numberOfHouse;
    const phone = document.createElement('h5');
    phone.innerHTML = "Phone: " + element.phone;
    const mobilePhone = document.createElement('h5');
    mobilePhone.innerHTML = "Mobile phone: " + element.mobilePhone;
    div.append(name, ID, city, street, numberOfHouse, phone, mobilePhone)
    for (let i = 0; i < element.vaccinationArray.length; i++) {
        const date = document.createElement('h5');
        date.innerHTML = "Date of vaccination: " + element.vaccinationArray[i].date;
        const dateProducer = document.createElement('h5');
        dateProducer.innerHTML = "Producer: " + element.vaccinationArray[i].producer;
        div.append(date, dateProducer);
    }
    const dateOfResult = document.createElement('h5');
    dateOfResult.innerHTML = "Date of result: " + element.dateOfResult;
    const dateOfRecovery = document.createElement('h5');
    dateOfRecovery.innerHTML = "Date of recovery: " + element.dateOfRecovery;
    div.append(dateOfResult, dateOfRecovery);
    const userDetails = document.getElementById('userDetails');
    userDetails.append(div)
}

//A retrieval function that brings corona details of a specific user.
async function getCoronaDetails() {
    const userDetails = document.getElementById('userDetails');
    userDetails.innerHTML = "";
    let ID = document.getElementById('userID').value;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "token = 33",
        },
        body: JSON.stringify({ ID: ID }),
    };
    try {
        const response = await fetch("http://localhost:4000/api/getUserCoronaById", options);
        const result = await response.json();
        console.log(result)
        drawCoronaUser(result)
    } catch (error) {
        console.log(error)
    }
}

function drawCoronaUser(element) {
    const div = document.createElement("div");
    for (let i = 0; i < element.vaccinationArray.length; i++) {
        const date = document.createElement('h5');
        date.innerHTML = "Date of vaccination: " + element.vaccinationArray[i].date;
        const dateProducer = document.createElement('h5');
        dateProducer.innerHTML = "Producer: " + element.vaccinationArray[i].producer;
        div.append(date, dateProducer);
    }
    const dateOfResult = document.createElement('h5');
    dateOfResult.innerHTML = element.dateOfResult;
    const dateOfRecovery = document.createElement('h5');
    dateOfRecovery.innerHTML = element.dateOfRecovery;
    div.append(dateOfResult, dateOfRecovery);
    const userDetails = document.getElementById('userDetails');
    userDetails.append(div)
}

// get number of not vaccition users
async function getNumber() {
    document.getElementById("numberOfUsers").innerHTML = ""
    try {
        const response = await fetch("http://localhost:4000/api/getNumber");
        const result = await response.json();
        console.log(result)
        document.getElementById("numberOfUsers").innerHTML = "The number of members are not vaccition is: " + result
    } catch (error) {
        console.log(error)
    }
}

async function getActiveUsers() {
    document.getElementById("myChart").style.display = "block";
    let xValues = [];
    let yValues = [];
    try {
        const response = await fetch("http://localhost:4000/api/getActiveUsers");
        const result = await response.json();
        console.log(result)
        for (let i = 0; i < result.dates.length; i++) {
            xValues.push(result.dates[i]) // X axis 
            let element;
            for (let j = 0; j < result.array.length; j++) {
                if (result.array[j].date == result.dates[i]) {
                    console.log(result.array[j] ,i , result.dates[i])
                    element = result.array[j];
                } 
            }
            // console.log(index)
            if(element) yValues.push(element.number) // Y axis
            else yValues.push(0)
        }
    } catch (error) {
        console.log(error)
    }

    console.log(yValues)
    console.log(xValues)

    new Chart("myChart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{ ticks: { min: 0, max: 30 } }],
            }
        }
    });
}