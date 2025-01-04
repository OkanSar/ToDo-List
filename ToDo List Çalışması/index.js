



const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");


let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter){
    let liTag = "";
    if(todos){
        todos.forEach((todo, id)=>{
            let tamamlanmis = todo.status == "tamamlanmis" ? "checked":
            "";
            if(filter == todo.status || filter == "hepsi"){
                liTag += `<li class="task">
                <label for="${id}">
                    <input onclick= "updateStatus(this)"
                    type="checkbox" id="${id}" ${tamamlanmis}>
                    <p class="${tamamlanmis}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'>
                        <i class="fa-solid fa-pen"></i>
                        Düzenle</li>
                        <li onclick='deleteTask(${id}, "${filter}")'><i class="fa-solid
                        fa-trash"></i>
                        Sil</li>
                    </ul>
                </div>
                </li>`;
            }
        });
    }

    taskBox.innerHTML = liTag || `<span>Herhangi bir görevin yok</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") :
    clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") 
    : taskBox.classList.remove("overflow");
}
showTodo("hepsi");
 
function showMenu(selectedTask){
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click",e =>{
        if(e.target.tagName != "I" || e.target != selectedTask){
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "tamamlanmis";
    }
    else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "bekleyen";
    }
    localStorage.setItem("todo-list",JSON.stringify(todos));
}

function editTask(taskId, textName){
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter){
    isEditTask = false;
    todos.splice(deleteId,1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", ()=>{
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

taskInput.addEventListener("keyup",e =>{
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask){
        if(!isEditTask){
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "bekleyen"};
            todos.push(taskInfo);
        }
        else{
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});