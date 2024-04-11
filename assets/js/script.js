$(document).ready(function () {
  const projectFormEl = $('#project-form');
  const projectNameInputEl = $('#project-name-input');
  const projectTypeInputEl = $('#project-type-input');
  const projectDateInputEl = $('#taskDueDate');

  function readProjectsFromStorage() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    return projects;
  }

  function saveProjectsToStorage(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  // Retrieve tasks and nextId from localStorage
  let taskList = JSON.parse(localStorage.getItem("tasks"));
  let nextId = JSON.parse(localStorage.getItem("nextId"));

  // Define the function using the UUID library
  function generateTaskId() {
    return uuid.v4(); // This generates a new UUID
  }
  // Now call the generateTaskId function and log its output to the console
  let taskId = generateTaskId(); // Call the function to get a UUID
  console.log(newTaskId); // Output the UUID to the console

  // Todo: create a function to create a task card
  
  function openProjectModal() {
    $('#projectModal').modal('show');
  }
  // Todo: create a function to render the task list and make cards draggable
  // Retrieve tasks , parse string , show the task
  function renderTaskList() {
    let task = document.querySelector("modal-content");
    let inputVal = document.getElementsByClassName("modal-form").value;
    task.innerHTML = inputVal;
  }

  function printProjectData() {
    const projects = readProjectsFromStorage();
    const todoList = $('#todo-cards');
    const inProgressList = $('#in-progress-cards');
    const doneList = $('#done-cards');
    projects.push(newProject);
    saveProjectsToStorage(projects);
    todoList.empty();
    inProgressList.empty();
    doneList.empty();

    for (let project of projects) {
      const card = createProjectCard(project);
      if (project.status === 'to-do') {
        todoList.append(card);
      } else if (project.status === 'in-progress') {
        inProgressList.append(card);
      } else if (project.status === 'done') {
        doneList.append(card);
      }
    }

    $('.draggable').draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (e) {
        const original = $(e.target).hasClass('ui-draggable')
          ? $(e.target)
          : $(e.target).closest('.ui-draggable');
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
    // Todo: create a function to handle adding a new task
    // localStorage

    localStorage.setItem('projects', JSON.stringify(projects));
    printProjectData();
  }

    // function handleAddTask(event){

    // }
      // Todo: create a function to handle deleting a task
      // listen for click , remove from local storage , prevent default
    function handleDeleteTask() {
      const projectId = $(this).attr('data-project-id');
      const projects = readProjectsFromStorage();
      const updatedProjects = projects.filter(project => project.id !== projectId);
      saveProjectsToStorage(updatedProjects);
      printProjectData();
    }
    
      // Todo: create a function to handle dropping a task into a new status lane
      // 
    function handleDrop(event, ui) {
      const projects = readProjectsFromStorage();
      const taskId = ui.draggable.data('project-id');
      const newStatus = event.target.id;

      for (let project of projects) {
        if (project.id === taskId) {
          project.status = newStatus;
        }
      }
    }
  
    projectFormEl.on('submit', handleProjectFormSubmit);
    $(document).on('click', '.delete', handleDeleteProject);
    $('#todo-cards, #in-progress-cards, #done-cards').on('click', '.delete', handleDeleteProject);
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });
  
      // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
      // $(document).ready(function)
  });