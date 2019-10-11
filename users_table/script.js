let users = [
    {
        id: 1,
        name: 'Cristiano',
        surname: 'Ronaldo',
        age: 34,
        retired: false,
    },
    {
        id: 2,
        name: 'Didier',
        surname: 'Drogba',
        age: 41,
        retired: true,
    },
    {
        id: 3,
        name: 'Arjen',
        surname: 'Robben',
        age: 35,
        retired: true,
    },
    {
        id: 4,
        name: 'Joao',
        surname: 'Felix',
        age: 19,
        retired: false,
    },
    {
        id: 5,
        name: 'Kylian',
        surname: 'Mbappe',
        age: 20,
        retired: false,
    },
   
];
 
/**
 * For the needs of the task I assume that users list is always non-empty
 * and every object in the users list has at least 5 keys (id, name, surname, age, retired)
 * with given values.
 */
 
const keys = Object.keys(users[0]);
let table = document.getElementsByTagName("table")[0];
let form = document.getElementsByTagName("form")[0];
let saveBtn = document.getElementsByClassName("save-btn")[0];
let trs = [];
let headersPlaced = false;
let selectedID = -1;
let EmptyFieldException = {};
let NaNException = {};
 
function createCell(tr, cellValue) {
    let element = headersPlaced ? document.createElement("td") : document.createElement("th");
 
    if (typeof(cellValue) === "boolean") {
        cellValue = cellValue === true ? "Yes" : "No";
    } else {
        cellValue = String(cellValue);
    }
   
    element.innerHTML = headersPlaced ? cellValue : cellValue.toUpperCase();
    tr.appendChild(element);
}
 
function createRow(cellValues) {
    let tr = document.createElement("tr");
 
    cellValues.forEach(cellValue => {
        createCell(tr, cellValue);
    });
 
    table.appendChild(tr);
}
 
/**
 * Dynamic creating html table.
 */
 
function createTable() {
    createRow(keys);
    headersPlaced = true;
 
    users.forEach(user => {
        createRow(Object.values(user));
    });    
}
 
function generateLabel(name) {
    let label = document.createElement("label");
    label.setAttribute("for", name);
    label.innerHTML = `${name.toUpperCase()}: `;
    form.appendChild(label);
}
 
function generateInput(name) {
    let input = document.createElement("input");
    input.classList.add("form-input");
    input.setAttribute("id", name);
 
    if (typeof(users[0][name]) === "boolean") {
        input.setAttribute("type", "checkbox");
    } else {
        input.classList.add("form-text");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", `New ${name}...`);
    }
 
    form.appendChild(input);
}
 
/**
 * Dynamic generating html form.
 */
 
function generateForm() {
    const fieldsNames = keys.slice(1);
 
    fieldsNames.forEach(name => {
        generateLabel(name);
        generateInput(name);
    });
 
    fieldsNames.filter(name => document.getElementById(name)
        .getAttribute("type") === "text")
        .forEach((name, index, arr) => {
            let inputElement = document.getElementById(name);
 
            inputElement.addEventListener("keyup", () => {
                if (event.keyCode === 13) {
                    if (index < arr.length-1) {
                        document.getElementById(arr[index+1]).focus();
                    }
                    else {
                        document.getElementsByClassName("save-btn")[0].click();
                    }
                }
            });
    });
}
 
/**
 * Updating html table and users list by adding EventListener to save button.
 */
 
saveBtn.addEventListener("click", () => {
    if (selectedID !== -1) {
        let userToEdit = users[selectedID];
        let tdsToEdit = trs[selectedID].childNodes;
 
        try {
            keys.slice(1).forEach((key, index) => {
                let inputElement = document.getElementById(key);
                let inputElementType= inputElement.getAttribute("type");
               
                if (inputElementType === "text") {
                    if (inputElement.value === "") {
                        throw EmptyFieldException;
                    }
 
                    let inputElementValue = inputElement.value;
                    if (typeof(users[0][key]) === "number") {
                        if (isNaN(parseInt(inputElementValue))) {
                            throw NaNException;
                        }
 
                        userToEdit[key] = parseInt(inputElementValue);
                    } else {
                        userToEdit[key] = inputElementValue;
                    }
 
                    tdsToEdit[++index].innerHTML = inputElement.value;
                } else {
                    userToEdit[key] = inputElement.checked;
                    tdsToEdit[++index].innerHTML = inputElement.checked ? "Yes" : "No";
                }
 
                trs[selectedID].classList.remove("selected");
            });
 
            keys.slice(1).forEach(key => {
                let inputElement = document.getElementById(key);
                inputElement.getAttribute("type") === "text" ? inputElement.value = "" : inputElement.checked = false;
            });
        } catch(e) {
            if (e === EmptyFieldException) {
                alert("None of the fields can be empty!");
            } else if (e === NaNException) {
                alert("Field AGE must be number!");
            } else {
                throw e;
            }
        }
    } else {
        alert("Firstly choose user to edit!");
    }
});
 
/**
 * IIFE which create initial html view and add EventListener processing data from html table to form.
 */
 
(function() {
    createTable();
    generateForm();
 
    trs = [...document.getElementsByTagName("tr")].slice(1);
    trs.forEach((tr, index) => {
        const tds = tr.childNodes;
        let trClassList = tr.classList;
 
        tr.addEventListener("click", () => {
            if (selectedID !== -1 && !trClassList.contains("selected")) {
                trs[selectedID].classList.remove("selected");
            }
           
            if (trClassList.contains("selected")) {
                keys.slice(1).forEach(key => {
                    let inputElement = document.getElementById(key);
                    inputElement.getAttribute("type") === "text" ? inputElement.value = "" : inputElement.checked = false;
                });
 
                trClassList.remove("selected")
            } else {
                selectedID = index;
                keys.slice(1).forEach((key, index) => {
                    let inputElement = document.getElementById(key);
 
                    if (inputElement.getAttribute("type") === "text") {
                        inputElement.value = tds[++index].innerHTML;
                    } else {
                        inputElement.checked = tds[++index].innerHTML === "Yes" ? true : false;
                    }
                });
 
                trClassList.add("selected");
            }
        });
    });
})();