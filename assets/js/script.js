// ? Grab references to the important DOM elements.
const timeDisplayEl = $('#time-display');
const projectDisplayEl = $('#project-display');
const projectFormEl = $('#project-form');
const projectNameInputEl = $('#project-name-input');
const projectTypeInputEl = $('#project-type-input');
const projectDateInputEl = $('#taskDueDate');
// Retrieve tasks and nextId from localStorage
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

function readProjectsFromStorage() {
    
    // TODO: Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
// Recall modal #projectModal
return { projects, nextId };

}

// ? Accepts an array of projects, stringifys them, and saves them in localStorage.
function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}
  
// Todo: create a function to generate a unique task id
// UUid

function generateTaskId() {
  return crypto.randomUUID();
}

// TODO: Create a new card element and add the classes `card`, `project-card`, `draggable`, and `my-3`. Also add a `data-project-id` attribute and set it to the project id.
function createProjectCard(project) {
  const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data-project-id', project.id);
  // TODO: Create a new card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
  const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
  // TODO: Create a new card body element and add the class `card-body`.
  const cardBody = $('<div>').addClass('card-body');
  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
  const cardDescription = $('<p>').addClass('card-text').text(project.type);
  // TODO: Create a new paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
  const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);
  // TODO: Create a new button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
  const cardDeleteBtn = $('<button>')
    .on('click', handleDeleteProject)
    .addClass('btn btn-delete-project')
    .text('Delete')
    .attr('data-project-id', project.id);
    // projectDisplayEl.on('click', '.btn-delete-project', handleDeleteProject);
  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (project.dueDate && project.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }
  
  // TODO: Append the card description, card due date, and card delete button to the card body.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  // TODO: Append the card header and card body to the card.
  taskCard.append(cardHeader, cardBody);
  // ? Return the card so it can be appended to the correct lane.
  return taskCard;
}

function printProjectData() {
  // const projects = readProjectsFromStorage();

  // ? Empty existing project cards out of the lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // ? Loop through projects and create project cards for each status
  for (let project of projects) {
    if (project.status === 'to-do') {
      todoList.append(createProjectCard(project));
    } else if (project.status === 'in-progress') {
      inProgressList.append(createProjectCard(project));
    } else if (project.status === 'done') {
      doneList.append(createProjectCard(project));
    }
  };

  // ? Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// ? Removes a project from local storage and prints the project data back to the page
function handleDeleteProject() {
  console.log('handleDeleteProject');
  const projectId = $(this).attr('data-project-id');
  const projects = readProjectsFromStorage();
  
// TODO: Loop through the projects array and remove the project with the matching id.
  console.log(projects);
    // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
  let allProjects = projects.projects.filter((project) => {
    if (project.id !== projectId) {
      return project;
    }
  });
  
    // ? We will use our helper function to save the projects to localStorage
    saveProjectsToStorage(allProjects);
  
    // ? Here we use our other function to print projects back to the screen
    printProjectData(allProjects);
    window.location.reload();
  }
  
  // ? Adds a project to local storage and prints the project data
  function handleProjectFormSubmit(event) {
    event.preventDefault();

    const projectDescriptionInputEl = $('#project-description-input');
    // TODO: Get the project name, type, and due date from the form
    const projectName = projectNameInputEl.val().trim();
    const projectDescription = projectDescriptionInputEl.val().trim();
    const projectDate = projectDateInputEl.val(); // yyyy-mm-dd format
  
    // ? Create a new project object with the data from the form
    const newProject = {
      name: projectName,
      description: projectDescription,
      dueDate: projectDate,
      status: 'to-do',
      id: generateTaskId(),
    };

    projects.push(newProject);
  
    // ? Save the updated projects array to localStorage
    saveProjectsToStorage(projects);
  
    // ? Print project data back to the screen
    printProjectData(projects);
  
    // TODO: Clear the form inputs
    projectNameInputEl.val('');
    projectTypeInputEl.val('');
    projectDateInputEl.val('');
  }
  
  // ? This function is called when a card is dropped into a lane. It updates the status of the project and saves it to localStorage. You can see this function is called in the `droppable` method below.
  function handleDrop(event, ui) {
    // ? Read projects from localStorage
    // const projects = readProjectsFromStorage();
  
    // ? Get the project id from the event
    const taskId = ui.draggable[0].dataset.projectId;
  
    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;
  
    for (let project of projects) {
      // ? Find the project card by the `id` and update the project status.
      if (project.id === taskId) {
        project.status = newStatus;
      }
    }
    // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
    localStorage.setItem('projects', JSON.stringify(projects));
    printProjectData(projects);
  }
  
  // ? Add event listener to the form element, listen for a submit event, and call the `handleProjectFormSubmit` function.
  projectFormEl.on('submit', handleProjectFormSubmit);
  
  // TODO: Add an event listener to listen for the delete buttons. Use event delegation to call the `handleDeleteProject` function.
  projectDisplayEl.on('click', '.btn-delete-project', handleDeleteProject);
  
  // ? When the document is ready, print the project data to the screen and make the lanes droppable. Also, initialize the date picker.
  $(document).ready(function () {
    // ? Print project data to the screen on page load if there is any
    printProjectData(projects);
  
    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });

    // ? Make lanes droppable
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
  });