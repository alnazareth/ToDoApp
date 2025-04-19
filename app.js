$(document).ready(function () {
  let tasks = [];

  // Cargar tareas al iniciar
  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      renderTasks();
    }
  }

  // Guardar tareas en localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Renderizar tareas en el DOM
let currentFilter = 'all'; // Filtro por defecto

// Filtrar tareas por estado
function renderTasks(filter = $('#search').val()) {
  $('#task-list').empty();
  tasks.forEach((task, index) => {
    const taskClass = task.completed ? 'completed' : '';
    
    // Aplicar filtro de búsqueda
    if (filter && !task.text.toLowerCase().includes(filter.toLowerCase())) {
      return;
    }

    // Aplicar filtro visual
    if (currentFilter === 'completed' && !task.completed) return;
    if (currentFilter === 'pending' && task.completed) return;

    const taskItem = $(`<li class="task-item ${taskClass}" data-index="${index}">
                          <span>${task.text}</span>
                          <button class="edit">✏️</button>
                          <button class="delete">🗑️</button>
                        </li>`);

    taskItem.find('span').click(function () {
      task.completed = !task.completed;
      saveTasks();
      renderTasks($('#search').val());
    });

    taskItem.find('.delete').click(function () {
      swal({
        title: "Are you sure?",
        text: "This task will be permanently deleted.",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks($('#search').val());
          swal("Task successfully deleted", { icon: "success" });
        }
      });
    });

    taskItem.find('.edit').click(function () {
      swal({
        text: "Edit task:",
        content: {
          element: "input",
          attributes: {
            placeholder: "Write the new description",
            value: task.text
          },
        },
        buttons: ["Cancel", "Save"],
      })
      .then((newText) => {
        if (newText) {
          task.text = newText;
          saveTasks();
          renderTasks($('#search').val());
        }
      });
    });

    $('#task-list').append(taskItem);
  });
}

  // Agregar nueva tarea
  $('#add-task').click(function () {
    const taskText = $('#task-input').val().trim();
    if (taskText !== '') {
   //   tasks.push({ text: taskText, completed: false });
      tasks.push({ text: taskText, completed: false, image: null });

      saveTasks();
      renderTasks();
      $('#task-input').val('');
    }
  });

  // Eliminar tarea
  $('#task-list').on('click', '.delete-btn', function () {
    const index = $(this).parent().data('index');
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  // Marcar como completada
  $('#task-list').on('click', 'span', function () {
    const index = $(this).parent().data('index');
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  });


// Cambiar modo claro/oscuro
function setDarkMode(isDark) {
  if (isDark) {
    $('body').addClass('dark-mode');
    $('#toggle-mode').text('☀️ light mode');
  } else {
    $('body').removeClass('dark-mode');
    $('#toggle-mode').text('🌙 Dark mode');
  }
  localStorage.setItem('darkMode', isDark);
}

// Cargar preferencia de modo
const savedMode = localStorage.getItem('darkMode');
setDarkMode(savedMode === 'true');

// Botón de toggle
$('#toggle-mode').click(function () {
  const isDark = !$('body').hasClass('dark-mode');
  setDarkMode(isDark);
});


$('#task-list').sortable({
  update: function () {
    const newTasks = [];
    $('#task-list .task-item').each(function () {
      const index = $(this).data('index');
      newTasks.push(tasks[index]);
    });
    tasks = newTasks;
    saveTasks();
    renderTasks(); // Se vuelve a renderizar para que los data-index queden correctos
  }
});


$('#toggle-all').click(function () {
  const allCompleted = tasks.every(task => task.completed);
  tasks.forEach(task => task.completed = !allCompleted);
  saveTasks();
  renderTasks();
});

$('#search').on('input', function () {
  const searchText = $(this).val();
  renderTasks(searchText);
});

// Botones de filtro
$('#filters').on('click', '.filter-btn', function () {
  currentFilter = $(this).data('filter');
  renderTasks($('#search').val());

  // Marcar botón activo (estilo visual)
  $('.filter-btn').removeClass('active');
  $(this).addClass('active');
});


  // Cargar al iniciar
  loadTasks();


});
