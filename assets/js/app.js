const cl = console.log;

const posts = document.getElementById("postcontainer");
const todo = document.getElementById("todocontainer");
const showsidebar = document.getElementById("showsidebar");
const opensidebar = document.getElementById("opensidebar");
const hidesidebar = document.getElementById("hidesidebar");
const backdrop = document.getElementById("backdrop");
const addbtn = document.getElementById("addbtn");
const updatebtn = document.getElementById("updatebtn");
const PostApi = document.getElementById("PostApi");
const ToDoApi = document.getElementById("ToDoApi");
const tbody = document.getElementById("tbody");
const statuss = document.getElementById("statuss");

//#######Get Form Controls #########

const postform = document.getElementById("postform");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const useridControl = document.getElementById("userid");

let array = [];
cl(array);

let baseurl = `https://jsonplaceholder.typicode.com`;
let posturl = `${baseurl}/posts`;
let todourl = `${baseurl}/todos`;

const templatingofPosts = eve => {
    let result = "<div class='col-md-8 offset-md-2 d-flex flex-column-reverse'>";
    eve.forEach(ele => {
        result += `
            <div class="card mb-2" id="${ele.id}">
                <div class="card-header bg-dark text-white">
                    ${ele.title}
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-outline-danger" onclick="onRemove(this)">Delete</button>
                </div>
            </div>
        `
    });
    result += `</div>`
    posts.innerHTML = result;
}

const templatingoftodo = eve => {
    let result = "";
    eve.forEach((ele,i) => {
        result += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${ele.title}</td>
                    <td>${ele.userId}</td>
                    <td>${ele.completed ? 'Complete' : 'Incomplete'}</td>
                </tr>
        `
    })
    tbody.innerHTML = result;
}

const addposttemp = eve => {
    let card = document.createElement("div");
    card.className = "card mb-2";
    card.id = eve.id;
    card.innerHTML = `
            <div class="card-header bg-dark text-white">
                ${eve.title}
            </div>
            <div class="card-body">
                <p>${eve.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-outline-danger" onclick="onRemove(this)">Delete</button>
            </div>
    `
    posts.append(card);
}

const makeApiCall = ((methodname, apiUrl) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodname, apiUrl);
    xhr.send();
    xhr.onload = () => {
    if(xhr.status >= 200 || xhr.status <= 299 && xhr.readyState === 4){
        // cl(xhr.response);
        let data = JSON.parse(xhr.response);
        if(methodname === "GET" && apiUrl === posturl){
            array = JSON.parse(xhr.response);
            templatingofPosts(data);
            todo.classList.add("d-none");
            posts.classList.remove("d-none");
        }else if(methodname === "GET" && apiUrl === todourl){
            array = JSON.parse(xhr.response);
            templatingoftodo(data);
            posts.classList.add("d-none");
            todo.classList.remove("d-none");
        }
    }else{
        alert(`something Went wrong !!!`);
    }
}
})


const onSelect = (eve) => {
    let getval = eve.target.value;
    let tr = [...document.querySelectorAll("#tbody tr")];
    tr.forEach(eve => eve.classList.add("d-none"));
    tr.forEach(eve => {
        if(eve.lastElementChild.innerHTML === getval){
            eve.classList.remove("d-none");
        }else if(getval === "All"){
            eve.classList.remove("d-none");
        }
    })
}

const onPostApiCall = () => {
    makeApiCall("GET", posturl);
    showsidebar.classList.remove("d-none");
}

const onTodoApiCall = () => {
    makeApiCall("GET", todourl);
    showsidebar.classList.add("d-none");
}

const onActive = () => {
    opensidebar.classList.toggle("active");
    backdrop.classList.toggle("active");
}

// postform.addEventListener("submit", onAddPost);
// updatebtn.addEventListener("click", onUpdate)
showsidebar.addEventListener("click", onActive);
hidesidebar.addEventListener("click", onActive);
backdrop.addEventListener("click", onActive);
PostApi.addEventListener("click", onPostApiCall);
ToDoApi.addEventListener("click", onTodoApiCall);
statuss.addEventListener("change", onSelect);


// const onEdit = eve => {
//     let getid = eve.closest(".card").id;
//     localStorage.setItem("editId", getid);
//     let getobjurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     cl(xhr);
//     xhr.open("GET",getobjurl,true);
//     xhr.send();
//     xhr.onload = function(){
//         let getobj = JSON.parse(xhr.response);
//         if(xhr.status === 200){
//             onActive();
//             titleControl.value = getobj.title;
//             bodyControl.value = getobj.body;
//             useridControl.value = getobj.userId;
//             addbtn.classList.add("d-none");
//             updatebtn.classList.remove("d-none");
//         }else{
//             alert("something went wrong !!!");
//         }
//     }   
// }

// const onUpdate = () => {
//     let updateobj = {
//         title : titleControl.value,
//         body : bodyControl.value,
//         userId : useridControl.value,
//     }
//     let getid = JSON.parse(localStorage.getItem("editId"));
//     let updateurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     xhr.open("PATCH", updateurl, true);
//     xhr.send(JSON.stringify(updateobj));
//     xhr.onload = function(){
//         if(xhr.status === 200){
//             let getindex = postArray.findIndex(post => {
//                 return post.id === getid;
//             });
//             postArray[getindex].title = updateobj.title;
//             postArray[getindex].body = updateobj.body;
//             postArray[getindex].userId = updateobj.userId;
//             templating(postArray);
//             addbtn.classList.remove("d-none");
//             updatebtn.classList.add("d-none");
//             postform.reset();
//             onActive(); 
//             Swal.fire({
//                 position: "bottom-end",
//                 icon: "success",
//                 title: "Post Updated Successfully",
//                 timer: 1500
//               });
//         }else{
//             alert("something went wrong !!!")
//         }
//     }
    
// }

// const onRemove = eve => {
//     let getid = eve.closest(".card").id;
//     let deleteurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     xhr.open("DELETE", deleteurl);
//     xhr.send();
//     xhr.onload = () => {
//         if(xhr.status === 200){
//             Swal.fire({
//                 title: "Are you sure?",
//                 text: "You won't be able to revert this!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, delete it!"
//               }).then((result) => {
//                 if (result.isConfirmed) {
//                   Swal.fire({
//                     title: "Deleted!",
//                     text: "Your file has been deleted.",
//                     icon: "success",
//                     timer : 1500
//                   });
//                   document.getElementById(getid).remove();
//                 }
//               });
//         }else{
//             alert("something went wrong !!!")
//         }
//     }
// }

// const createApiobj = eve => {
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", posturl, true); 
//     xhr.send(JSON.stringify(eve));
//     xhr.onload = function(){
//         if(xhr.status === 200 || xhr.status === 201){
//             cl(xhr.response);
//             eve.id = JSON.parse(xhr.response).id;
//             postArray.push(eve);
//             addposttemp(eve)
//             onActive();
//             Swal.fire({
//                 position: "center",
//                 icon: "success",
//                 title: `Post has been Successfully added`,
//                 timer: 1500
//               });
//         }else{
//             alert("something went wrong!!!")
//         }
//         postform.reset();
//     }
// }

// const onAddPost = eve => {
//     eve.preventDefault();
//     let postobj = {
//         title : titleControl.value,
//         body : bodyControl.value,
//         userId : useridControl.value,
//     }
//     createApiobj(postobj);
// }

// const geturl = () => {
// let xhr = new XMLHttpRequest();
//     xhr.open("GET", posturl, true);
//     xhr.send();
//     xhr.onload = function(){
//         cl(xhr.status);
//         cl(xhr.response);
//         if(xhr.status === 200){ 
//             postArray = JSON.parse(xhr.response);            
//             templating(postArray);
//         }else{
//             alert("something went wrong!!!")
//         }

//     }
// }
 
// geturl();