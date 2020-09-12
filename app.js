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
const { prompt } = require("inquirer");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
let employeeData;
let employeeList = [];

function gatherEmployeeData() {
    inquirer.prompt(questions).then(function (answers) {
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

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const questions = ([
    {
        type: "list",
        name: "Selected",
        message: "What would you like to do?\n",
        choices: [
            "Add an Employee",
            // "Remove an Employee",
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

// gatherData();
gatherEmployeeData();