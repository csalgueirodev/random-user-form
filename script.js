const btn = document.querySelector("#btn-generator")
const progress = document.querySelector(".progress")
const span = document.querySelector(".progress > span")
const animationTime = 100;

fetchRandomUser();

btn.addEventListener("click", fetchRandomUser)

function fetchRandomUser() {
    fetch('https://randomuser.me/api/?inc=gender,name,dob,phone,picture,login,email,location')
        .then(response => response.json())
        .then(data => {
            const userData = apiToUserData(data.results[0]);
            Object.keys(userData).forEach(key => {
                setValueToInput(key, userData);
            });
            animateGrid();
        });
}

function animateGrid() {
    const divs = document.querySelectorAll(".grid > div")
    divs.forEach((element, i) => {
        element.style.display = 'none';
        setTimeout(function () {
            element.style.display = '';
            element.classList.add("animated", "fadeInUp");
        }, i * animationTime)
    });
}

function setValueToInput(key, userData) {
    const input = document.querySelector(`input[name=${key}]`)
    if (input != null) {
        if (input.getAttribute("type") === "radio") {
            const radios = [...document.querySelectorAll(`[name=${key}]`)]
            radios.forEach(r => {
                r.setAttribute("checked", false);
            })
            document.querySelector(`[name=${key}][value=${userData[key]}]`).checked = true
        } else {
            input.setAttribute("value", userData[key])
        }
    } else {
        if (key === "picture") {
            const img = document.querySelector(`.avatar > img`)
            img.setAttribute("src", userData[key])
        }
    }
}

function apiToUserData(randomuser) {
    let userData = {}
    Object.keys(randomuser).forEach(key => {
        switch (key) {
            case "name":
                userData[key] = `${randomuser[key].first} ${randomuser[key].last}`
                break
            case "location":
                userData["address"] = `${randomuser[key].street?.name} ${randomuser[key].street?.number}, ${randomuser[key].city}. ${randomuser[key].postcode} ${randomuser[key].country}`
                break
            case "dob":
                userData["age"] = randomuser[key].age;
                break
            case "login":
                userData["password"] = randomuser[key].password;
                userData["username"] = randomuser[key].username;
                break
            case "picture":
                userData[key] = randomuser[key].large;
                break;
            default:
                userData[key] = randomuser[key]
                break
        }
    });
    return userData
}