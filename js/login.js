const BASE_URL = 'https://msmovieapp.herokuapp.com';
var tagArray = [];
function switchForm(className, e) {
	e.preventDefault();
	const allForm = document.querySelectorAll('form');
	const form = document.querySelector(`form.${className}`);

	allForm.forEach(item=> {
		item.classList.remove('active');
	})
	form.classList.add('active');
}
const registerPassword = document.querySelector('form.register #password');
const registerConfirmPassword = document.querySelector('form.register #confirm-pass');

registerPassword.addEventListener('input', function () {
	registerConfirmPassword.pattern = `${this.value}`;
})
function nextForm(current ,className, e) {
	//e.preventDefault();
     var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const allForm = document.querySelectorAll('form');
    const currentForm = document.querySelector(`form.${current}`);
	const form = document.querySelector(`form.${className}`);
    var email = currentForm.querySelector("#email").value;
   var password =  currentForm.querySelector("#password").value;
   var confirmPassword = currentForm.querySelector("#confirm-pass").value;
   if(password.length>0 &&  password == confirmPassword && email.match(validRegex)){
       e.preventDefault();
	allForm.forEach(item=> {
		item.classList.remove('active');
	})
	form.classList.add('active');}
}
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
inputBox.onkeyup = async(e)=>{
    let userData = e.target.value; //user enetered data
    let arr = [];
    if(tagArray.indexOf(userData)!== -1)return;
    if(userData){
       var result = await fetchTags(userData);
       searchWrapper.classList.add("active");
       if(!result){
        showSuggestions([`<li>No results found</li>`]);
       return;
       }
       var list = result.map((tag)=>(`<li>${tag}</li>`))
       showSuggestions(list);
       
       // showSuggestions([`<li>a</li>`,`<li>b</li>`]);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}
function select(element){
    const tagGroup = document.querySelector(".tag-group");
    let list='' ;
    let selectData = element.textContent;

    tagArray.push(selectData);
    tagArray.map((tag)=>{
       list+= `<span class= "tag">${tag} <div class='bx bx-minus-circle bx-flip-vertical' style='color:#fdfafa'  onclick="remove(this)"></div></span>`
    })
    searchWrapper.classList.remove("active");
    tagGroup.innerHTML = list;
}
function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    }else{
      listData = list.join('');
    }
    suggBox.innerHTML = listData;
}
function remove(el) {
    
    var element = el.parentElement;
    var data = element.textContent;
    var index =tagArray.indexOf(data);
    tagArray.splice(tagArray.indexOf(data),1);
    element.remove();
   // showSuggestions(tagArray);
  }
 async function fetchTags(userdata){

      var result = await fetch(`${BASE_URL}/movies/search/tags/${userdata}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        
    }).then((res) => res.json()) 
    if (result.status === 'success') {
        // everythign went fine
        return (result.tags);
    } else {
        alert(result.errorMessage)
        
    }

}
  async function  register(e){
      e.preventDefault()
    var registerForm = document.querySelector(`form.register`);
    
	
    var email = registerForm.querySelector("#email").value;
   var password =  registerForm.querySelector("#password").value;
   var agegroup  =  registerForm.querySelector("#age").value;

   var result = await fetch(`${BASE_URL}/movies/auth/signup/`,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userdata:{email:email,
    password:password,
    preferences:tagArray,
    agegroup:agegroup

}
    })
}).then((res) => res.json()) 
if (result.status === 'success') {
    // everythign went fine
    alert(result.message)
    switchForm('login',e);
} else {
    alert(result.errorMessage)
    
}
   



  }
  async function login(e){
    e.preventDefault()
    var registerForm = document.querySelector(`form.login`);
    
	
    var email = registerForm.querySelector("#email").value;
   var password =  registerForm.querySelector("#password").value;

   var result = await fetch(`${BASE_URL}/movies/auth/login?email=${email}&password=${password}`,{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
}).then((res) => res.json()) 
if (result.status === 'success') {
    // everythign went fine
    localStorage.setItem('token',result.token);
    window.location.replace("movies.html");
  //  alert(result.token)
   // switchForm('login',e);
} else {
    alert(result.errorMessage)
    
}
  }