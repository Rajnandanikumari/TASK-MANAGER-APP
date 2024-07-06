//DOM -Document object Model
import {TASK_OPERATIONS} from '../data/services/task-operation.js';
import { doAjax } from '../data/services/ajax.js';
window.addEventListener('load',init);

function init(){
    bindEvents();
    showCount();
    disableButtons();
    clearAll()
}

function disableButtons(){
    document.querySelector('#remove').setAttribute('disabled',true);
    document.querySelector('#update').setAttribute('disabled',true);
}

function bindEvents(){
    //Register an Event
    document.getElementById('add').addEventListener('click',addTask);
    document.querySelector('#remove').addEventListener('click',deleteForever);
    document.querySelector('#save').addEventListener('click',save);
    document.querySelector('#load').addEventListener('click',load);
    document.querySelector('#update').addEventListener('click',update);
    document.querySelector('#load-from-server').addEventListener('click',loadFromServer);
    document.querySelector('#clear-all').addEventListener('click',clearAll);

  }

  function clearAll(){
    document.querySelector('#total').innerText = '';
    document.querySelector('#mark').innerText = '';
    document.querySelector('#unmark').innerText = '';
    document.querySelector('#tasks').innerHTML = '';
    for(let field of fields){
      document.querySelector(`#${field}`).value = '';
      
     }
  }
  
  async function loadFromServer(){
    try{
    const result =  await doAjax();
    console.log(result);
    console.log('Result of Task Json is',result['tasks']);
    TASK_OPERATIONS.tasks = result['tasks'];
    console.log(result);
    printTaskTable(TASK_OPERATIONS.tasks);
    showCount();
    }
    catch(err){
       alert("Some Error");
       console.log(err);
    }
  }
  function update(){
     for(let field of fields){
          taskObject[field] = document.querySelector(`#${field}`).value;
     } 
     printTaskTable(TASK_OPERATIONS.getTasks());
     showCount();

  }
  function save(){
    if(window.localStorage){
    const tasks =  TASK_OPERATIONS.getTasks();
    localStorage.tasks = JSON.stringify(tasks);
    //Object to JSON string Convert serialization
     alert("Data Store.....");
    }
    else{
      alert("Outdated Browser No Support of localstorage...")
    }
  }

  function load(){
    if(window.localStorage){
      if(localStorage.tasks){
      const tasks =  JSON.parse(localStorage.tasks) //Deserialzation
      
      printTaskTable(tasks);
      showCount();
      }
      else{
        alert("No Data to Load....");
      }
      
    }
    else{
      alert("Outdated Browser No Support of localStorage...")
    }
  }


function deleteForever(){
  const tasks =  TASK_OPERATIONS.remove();
   printTaskTable(tasks);
   showCount();  //showcount isliye hai kyuki after delection of required data ye data ko uodate kr deta hai
   document.querySelector('#remove').setAttribute('disabled',true);
}

function printTaskTable(tasks){  //bche huye record ko print krane ke liye print task table ka use huaa hai
  document.querySelector('#tasks').innerHTML = ''; //deleted data ke jgh blank kr dega in html taki sare bche value print ho 
 // tasks.forEach(taskObject=>printTask(taskObject));
  tasks.forEach(printTask);
}

const fields=['id','name','desc','date','color','url']  //it is use to access the outside the function becouse we want to access outside the function

 function addTask(){
   // console.log('Add Task Call');
  // let id = document.querySelector('#id').value;
  
  const taskObject = {}; //Object literal
  for(let field of fields){
   let fieldValue = document.querySelector(`#${field}`).value;
   taskObject[field] = fieldValue;
  }
  TASK_OPERATIONS.add(taskObject);
   console.log('Task Object',taskObject);
   printTask(taskObject);
   showCount();
   clearFields();
  }
  let taskObject ; 
  function edit(){
      const icon = this;
      console.log("log3",icon);
      const taskId = icon.getAttribute('task-id');
      console.log("log2",taskId);
      const taskObject =  TASK_OPERATIONS.search(taskId);
      console.log("Log1",taskObject);
      if(taskObject){
        for(let key in taskObject){
          if(key === 'isMarked'){
            continue;
          }
          document.querySelector(`#${key}`).value = taskObject[key];
        }
        document.querySelector('#update').disabled=false; //disable ko false krega tbhi to jis pencile pr click krege to print hoga screen
       }
       
  }

  function toggleDelete(){ //markdelet//
    //this hold current calling object reference
   console.log('Toggle Delete ', this);
    let icon = this;
    const tr = icon.parentNode.parentNode;  //parentnode parentnode mean td ke under tr,
   const taskId = icon.getAttribute('task-id');
   TASK_OPERATIONS.toggleMark(taskId); //yha taskid call kr ke delete operation kr rhe hai.
  // console.log(tr,taskId);
      //tr.className = 'table-danger'; //phle use hota tha
   tr.classList.toggle('table-danger'); //introduce in ES6/html5
   showCount();
   const enableOrDisabled = TASK_OPERATIONS.getMarkCount()>0?false:true;
  // document.querySelector('#remove').disabled = enabledOrDisabled;
 // }
   const button =  document.getElementById('remove')
   if(!enableOrDisabled){
    button.removeAttribute('disabled')
   }
   else{
    button.setAttribute('disabled',true);
   }
  }
  function createImage(url){
    const imageTag = document.createElement('img');
    imageTag.src = url;
    imageTag.className = 'size';
    return imageTag;
  }

  function showColor(color){
    const divTag = document.createElement('div');
    divTag.style = "width:100px; height:50px; height:100px;background-color:"+color;
    return divTag;
  }

  function createIcon(className,fn,taskId){ //icon not use directly in html because we create icon dynamically
    //<i class="fa-regular fa-pen"></i>//
    //<i class="fa-solid fa-trash"></i>//
    console.log("loh4",taskId);
    const iconTag = document.createElement('i'); //<i></i> //hrer we get icone tag
    iconTag.className = `fa-solid ${className} me-2 hand`; //calling for first icon
    iconTag.addEventListener('click',fn);  //icon for dusterbin functionally they call.
    iconTag.setAttribute('task-id',taskId);
    return iconTag;
  }

  function clearFields(){
       for(let field of fields){
        document.querySelector(`#${field}`).value = ''; 
       }
       document.querySelector('#id').focus();
  }
 
  //this function is used to print a single task
  function printTask(taskObject){
    const tbody = document.querySelector('#tasks');
    const tr = tbody.insertRow();
   for(let key in taskObject){
    if(key === 'isMarked'){
      continue; //skip the current iteration
    }
    let td = tr.insertCell();
    if(key === 'url'){
      td.appendChild(createImage(taskObject[key]));
      continue;
    }
    else if(key === 'color'){
      td.appendChild(showColor(taskObject[key]));
      continue;
    }
   td.innerText = taskObject[key];
   }
  let td = tr.insertCell();
  td.appendChild(createIcon('fa-pen',edit,taskObject.id));
  td.appendChild(createIcon('fa-trash',toggleDelete, taskObject.id));
  }

  function showCount(){
    document.querySelector('#total').innerText = TASK_OPERATIONS.getSize();
    document.querySelector('#mark').innerText = TASK_OPERATIONS.getMarkCount();
    document.querySelector('#unmark').innerText = TASK_OPERATIONS.getUnMarkCount();
}
