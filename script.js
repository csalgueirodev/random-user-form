const btn = document.querySelector("#btn-generator")
const progress = document.querySelector(".progress")
const span = document.querySelector(".progress > span")

fetchRandomUser();

btn.addEventListener("click", fetchRandomUser)

function animateGrid() {
    const divs = document.querySelectorAll(".grid > div")
    divs.forEach((element, i) => {
        element.classList.add("animated", "fadeInUp");
        console.log(element)
        element.style.display = 'none';
        setTimeout(function () {
            element.style.display = '';
        }, i * 50)
    });

}
function fetchRandomUser() {
    fetch('https://randomuser.me/api/?inc=gender,name,dob,phone,picture,login,email,location')
        .then(response => response.json())
        .then(data => {
            const randomuser = data.results[0];

            let userData = {};
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
            animateGrid();
            Object.keys(userData).forEach(key => {
                const input = document.querySelector(`input[name=${key}]`)
                console.log(input)
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
            });
        }).catch(function (err) {
            console.log('Fetch problem: ' + err.message);
        });
}