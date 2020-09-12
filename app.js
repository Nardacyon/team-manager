//extended employee classes
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

//npm dependencies *MAKE SURE TO INSTALL THEM*
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

//render gathered information 
const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

//output folder path
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

let employeeList = [];

function gatherEmployeeData() {
    inquirer.prompt(questions).then(function (answers) {

        if (answers.Selected === "Exit") return;
        createEmployeeObject(answers);
        inquirer.prompt([
            {
                type: "confirm",
                name: "confirmation",
                message: "Would you like to continue editing?\n",
                default: true
            }
        ]).then(function (res) {
            if (res.confirmation) {
                gatherEmployeeData();
            } else {
                createMarkdown();
            }
        });
    });
}

function createEmployeeObject(answers) {
    let role = answers.role;
    switch (role) {
        case "Engineer":
            let newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
            employeeList.push(newEngineer);
            break;
        case "Intern":
            let newIntern = new Intern(answers.name, answers.id, answers.email, answers.school);
            employeeList.push(newIntern);
            break;
        case "Manager":
            let newManager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            employeeList.push(newManager);
            break;
    }
}

async function createMarkdown() {
    try {
        const getHTML = await render(employeeList);
        createHTML(getHTML);
    } catch (err) {
        console.log(err);
    }
}

function createHTML(getHTML) {
    fs.writeFile(outputPath, getHTML, function (err) {
        if (err) console.log(err);
    });
}

const questions = ([
    {
        type: "list",
        name: "Selected",
        message: "What would you like to do?\n",
        choices: [
            "Add an Employee",
            "Exit"
        ]
    },
    {
        type: "input",
        name: "name",
        message: "What is the employee's name?\n",
        when: (answers) => answers.Selected === "Add an Employee"
    },
    {
        type: "input",
        name: "id",
        message: "What is the employee's numeric ID?\n",
        when: (answers) => answers.Selected === "Add an Employee"
    },
    {
        type: "input",
        name: "email",
        message: "What is the employee's email address?\n",
        when: (answers) => answers.Selected === "Add an Employee"
    },
    {
        type: "list",
        name: "role",
        message: "What is the employee's role?\n",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        when: (answers) => answers.Selected === "Add an Employee"
    },
    //Engineer specific
    {
        type: "input",
        name: "github",
        message: "What is their GitHub username?\n",
        when: (answers) => answers.role === "Engineer"
    },
    //Intern specific
    {
        type: "input",
        name: "school",
        message: "What school is the intern currently attending?\n",
        when: (answers) => answers.role === "Intern"
    },
    //Manager specific
    {
        type: "input",
        name: "officeNumber",
        message: "What is the manager's office number?\n",
        when: (answers) => answers.role === "Manager"
        // validate 
    },
    {
        type: "input",
        name: "team",
        message: "What team does this employee operate in?\n",
        when: (answers) => answers.Selected === "Add an Employee"
    },
]);

gatherEmployeeData();