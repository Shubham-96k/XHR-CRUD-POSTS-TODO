const cl = console.log;

const posts = document.getElementById("postcontainer");
const showsidebar = document.getElementById("showsidebar");
const opensidebar = document.getElementById("opensidebar");
const hidesidebar = document.getElementById("hidesidebar");
const backdrop = document.getElementById("backdrop");
const addbtn = document.getElementById("addbtn");
const updatebtn = document.getElementById("updatebtn");

//#######Get Form Controls #########

const postform = document.getElementById("postform");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const useridControl = document.getElementById("userid");



//html 5 gives us some browser API 
//Called as webStorages, fetch,etc
//Before html 5 we are using XHR(XMLHttpRequest) in
//order to API call which is given by Javascript, it helps
//to transfer and get data communication betn browser and server



//will get dumy json data from backened 

let baseurl = `https://jsonplaceholder.typicode.com`;
        //here, it is a baseurl containing all form of data 

let posturl = `${baseurl}/posts`;
        //here, we get post content by giving end point posts will get post
        //data from base url

// ########## PATCH to form control ###########

const onEdit = eve => {
    let getid = eve.closest(".card").id;
    localStorage.setItem("editId", getid);
    let getobjurl = `${baseurl}/posts/${getid}`;//  we get url of that obj by giving params

    //we got objecturl need to request api in order to get obj by get method

    let xhr = new XMLHttpRequest();
    cl(xhr);
    xhr.open("GET",getobjurl,true);
    xhr.send();
    xhr.onload = function(){
        let getobj = JSON.parse(xhr.response);
        if(xhr.status === 200){
            onActive();
            titleControl.value = getobj.title;
            bodyControl.value = getobj.body;
            useridControl.value = getobj.userId;
            addbtn.classList.add("d-none");
            updatebtn.classList.remove("d-none");
        }else{
            alert("something went wrong !!!");
        }
    }   
}

const onUpdate = () => {
    let updateobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : useridControl.value,
    }
    let getid = JSON.parse(localStorage.getItem("editId"));
    let updateurl = `${baseurl}/posts/${getid}`;
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", updateurl, true);
    xhr.send(JSON.stringify(updateobj));
    xhr.onload = function(){
        if(xhr.status === 200){
            let getindex = postArray.findIndex(post => {
                return post.id === getid;
            });
            postArray[getindex].title = updateobj.title;
            postArray[getindex].body = updateobj.body;
            postArray[getindex].userId = updateobj.userId;
            templating(postArray);
            addbtn.classList.remove("d-none");
            updatebtn.classList.add("d-none");
            postform.reset();
            onActive(); 
            Swal.fire({
                position: "bottom-end",
                icon: "success",
                title: "Post Updated Successfully",
                timer: 1500
              });
        }else{
            alert("something went wrong !!!")
        }
    }
    
}

const onRemove = eve => {
    let getid = eve.closest(".card").id;
    let deleteurl = `${baseurl}/posts/${getid}`;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", deleteurl);
    xhr.send();
    xhr.onload = () => {
        if(xhr.status === 200){
            // cl(xhr.response);
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    timer : 1500
                  });
                  document.getElementById(getid).remove();
                }
              });
        }else{
            alert("something went wrong !!!")
        }
    }
}

// ######## TEMPLATING ###########

const templating = eve => {
    let result = " ";
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

    posts.innerHTML = result;
}

// now we have the data url need to do API call and get data for templating;

//########## POST METHOD ############

let postArray = [];
cl(postArray);

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

const createApiobj = eve => {
    let xhr = new XMLHttpRequest();//step 1 created instance or multiple obj
    xhr.open("POST", posturl, true);//this method send data to given url post method 
    //success status will be 201;
    
    xhr.send(JSON.stringify(eve));//through post method we called api and sended data
    //it will be available on payload once submitted if succesfull status will be 201 for post;
    //once it is successfull with status 201 in response will get that data/object unique id;

    xhr.onload = function(){
        if(xhr.status === 200 || xhr.status === 201){
            cl(xhr.response);//in response will get id for that object;
            eve.id = JSON.parse(xhr.response).id;
            postArray.push(eve);
            // templating(postArray);//here we are doing templating for 100 obj in order to add 1 obj
            addposttemp(eve)// here we created function which will add only one obj 
            onActive();
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Post has been Successfully added`,
                timer: 1500
              });
        }else{
            alert("something went wrong!!!")
        }
        postform.reset();
    }
}

const onAddPost = eve => {
    eve.preventDefault();
    let postobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : useridControl.value,
    }
    
    createApiobj(postobj);
}

//####### GET METHOD ###########
const geturl = () => {
    
// ########## STEPS : 

//1] create a instance/object;

let xhr = new XMLHttpRequest();//it is a construction which is used to create multiple object;

//2] configuration of API; using api method

    //syntax: xhr.open(method,url,true)
    //method represent the method we have to use to do task e.g get,post,put,patch,delete 
    //should always write in capital
    //url represet the url of data/object
    //true : it is by default true is asynchronous and false is synchronous


    xhr.open("GET", posturl, true);
    //here we get the posts data/object using open api method asynchronously here we call the api result will be
    //resolve / reject
    
    xhr.send();//always get response either solve and reject;

    xhr.onload = function(){  //result is onloading

        cl(xhr.status);//it gives the response if api is successfull as 200
        //while we send data(posts) and if it is successfull response as 201
        //404 if api is unsuccessfull it will throw error as 404
        // cl(xhr.statusText);
        cl(xhr.response); //if api is successfull will use xhr.response to get the data for functionality and templating,etc


        if(xhr.status === 200){ //here , if api is successfull then only next expression should execute
                postArray = JSON.parse(xhr.response);
                        // here, from backened or db or server the data will always come in stringify format
                        //and key is also stringified by using parse method we converted stringify to object;
                        //and here we stored that data in Array
            templating(postArray);
        }else{
            alert("something went wrong!!!")//if http request fail with status 404 the response 
            //msg will be given here
        }

    }
}
 
geturl();


const onActive = () => {
    opensidebar.classList.toggle("active");
    backdrop.classList.toggle("active");
}

postform.addEventListener("submit", onAddPost)
updatebtn.addEventListener("click", onUpdate)
showsidebar.addEventListener("click", onActive);
hidesidebar.addEventListener("click", onActive);
backdrop.addEventListener("click", onActive);