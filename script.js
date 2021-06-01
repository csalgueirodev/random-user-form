const API_URL = 'https://randomuser.me/api/?inc=gender,name,dob,phone,picture,login,email,location';
const btn = document.querySelector("#btn-generator")
const togglePassword = document.querySelector("#togglePassword")
const progress = document.querySelector(".progress")
const cardTitle = document.querySelector(".card-title")
const span = document.querySelector(".progress > span")
const title = document.querySelector(".card-title > h1")
const animationTime = 200;
let animateInputs = false;

fetchRandomUser();
animateText(title);
animateText(btn);

togglePassword.addEventListener("click", e => {
    const togglePasswordButton = e.target;
    const input = e.target.closest("div").querySelector("input[name='password']");
    if (input.type === "password") {
        input.setAttribute("type", "text")
        togglePasswordButton.textContent = "Hide"
    } else {
        input.setAttribute("type", "password")
        togglePasswordButton.textContent = "Reveal"
    }
    input
})
btn.addEventListener("mousedown", createRipple)
btn.addEventListener("click", fetchRandomUser)

function fetchRandomUser() {
    progress.classList.add("show")
    cardTitle.style.background = `url(https://picsum.photos/500/300?t=${+ new Date()})`
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            progress.classList.remove("show")

            const userData = apiToUserData(data.results[0])
            Object.keys(userData).forEach(key => {
                setValueToInput(key, userData)
            })
            animateGrid()
            animateInputs = !animateInputs
        })
}

function animateGrid() {
    const divs = document.querySelectorAll(".grid > div")
    divs.forEach((el, idx) => {
        (function (element, i) {
            element.style.display = 'none'
            return setTimeout(function () {
                element.style.display = ''
                element.classList.add("animated", "fadeInUp")

                animateText(element.querySelector("label"));
            }, i * (animationTime / 2))
        }(el, idx))
    })
}


function animateText(element) {
    const stringText = element.textContent
    element.textContent = ""
    const arrayText = stringText.split("")
    let text = "";
    for (let i = 0; i < arrayText.length; i++) {
        (function (idx) {
            return setTimeout(function () {
                text += arrayText[i]
                element.textContent = text
            }, idx * (animationTime / 2))
        }(i))
    }
}

function animateInputValue(input, value) {
    const arrayText = value.toString().split("")
    let text = "";

    arrayText.forEach((el, idx) => {
        (function (i) {
            return setTimeout(function () {
                text += arrayText[i]
                input.setAttribute("value", text)
            }, i * (animationTime / 4))
        }(idx))
    })
}

function setValueToInput(key, userData) {
    const input = document.querySelector(`input[name=${key}]`)
    if (input != null) {
        if (input.getAttribute("type") === "radio") {
            const radios = document.querySelectorAll(`[name=${key}]`)
            document.querySelector(`[name=${key}][value=${userData[key]}]`).checked = true
        } else {
            if (animateInputs) {
                animateInputValue(input, userData[key])
            } else {
                input.setAttribute("value", userData[key])
            }
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
                userData["age"] = randomuser[key].age
                break
            case "login":
                userData["password"] = randomuser[key].password
                userData["username"] = randomuser[key].username
                break
            case "picture":
                userData[key] = randomuser[key].large;
                break;
            default:
                userData[key] = randomuser[key]
                break
        }
    })
    return userData
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    button.appendChild(circle);

    setTimeout(() => circle.remove(), 800)
}