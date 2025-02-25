const nav=document.querySelector(".navbar__menu");
const ul=document.getElementById("navbar__list");

const navbar= ()=>{
  let close=document.createElement("button");
    close.innerHTML="X";
    close.setAttribute("onclick",`show("#navbar__list")`);
    close.classList.add("off");
    for(let i=1;i<6;i++){
    let n=`Section ${i}`;
    let c=`section${i}`;
    let a =`<a class="menu__link" id="${c}" href="#${c}" "></a>`;
    let li=document.createElement("li");
    li.setAttribute('class',`nav__item ${c}`);
    ul.appendChild(li);
    let s = document.querySelector(`.${c}`);
    s.innerHTML=a;
    };
    let a =document.querySelector("#section1");
    a.innerHTML = `Home`;
    a.setAttribute("href","#");
    a =document.querySelector("#section2");
    a.innerHTML = `About `;  
    a.setAttribute("href","#about")
    a =document.querySelector("#section3");
    a.innerHTML = "Game";  
    a.setAttribute("href","HTML/game.html");
    li=document.querySelector("li.section4");
    li.classList.add("dropdown");
    li.classList.add("nav-item");
    a =document.querySelector("#section4");
    li.innerHTML = `<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Projects
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#java">Java</a></li>
            <li><a class="dropdown-item" href="#js">Java-Script</a></li>
            <li><a class="dropdown-item" href="#php">PHP </a></li>
            <li><a class="dropdown-item" href="#ai">Artificial Intelligent</a></li>
            <li><a class="dropdown-item" href="#nojs">Node JS <i class="fa-brands fa-node" style="color: #63E6BE;"></i></a></li>
            <li><a class="dropdown-item" href="#html">HTML & CSS</a></li>
            <li><a class="dropdown-item" href="#graph">Graphics</a></li>
          </ul>`; 
    a.setAttribute("href","#project");
    a =document.querySelector("#section5");
    a.innerHTML = "Resume"; 
    a.setAttribute("href","#resume");
    ul.appendChild(close); 
  };
  
  navbar();
  
 

  function aside(li){
    connect=document.querySelector(`#connect span.${li}`);
    connect.style.display="block";
  }
  function aside1(li){
    connect=document.querySelector(`#connect span.${li}`);
    /*connect.style.display = 'none';
   /* setTimeout(() => {
      
    }, 5000); // 5000 ملي ثانية = 5 ثواني
   // connect.style.display="none";*/
  }

  const minue=()=>{
    let button =document.createElement("button");
    button.setAttribute("class","menu__link");
    button.setAttribute("id","minue");
    button.setAttribute("onclick", `show("#navbar__list")`);
    button.innerHTML=`<img src="https://img.icons8.com/ios11/512/228BE6/menu.png" width="40px" height="40px">`
    const navbar_menu = document.querySelector(".navbar__menu");
    navbar_menu.insertAdjacentElement("afterbegin",button);
  }
  
  minue();
  function show(str){
    let mnue=document.querySelector(str);
    console.log(mnue);console.log(d);
    if(d==0){
    mnue.style.display= "flex";
     d=1;}

    else{
      mnue.style.display= "none";
      d=0;
    }

  }  
var h5=document.getElementById('bare');
var h6=document.getElementById('bare1');
var h7=document.getElementById('bare2');
var h8=document.getElementById('bare3');
var h9=document.getElementById('bare4');
var d1=0;
function showhide(){
  if(d1==0){h5.style.display='block';
h6.style.display='block';
h7.style.display='block';
h8.style.display='block';
h9.style.display='block';
d1=1;}
else{  h5.style.display='none'; 
  h6.style.display='none';
  h7.style.display='none';
  h8.style.display='none';
  h9.style.display='none';


  d1=0;
}
}

var use=document.getElementById('user');
var dis=0;
function hideshow(){
if(dis==0){
use.style.display="block";
dis=1;
}
else{
    use.style.display="none";
    dis=0;   
}
}

var div=document.getElementById('one');
var div2=document.getElementById('tow');
var div3=document.getElementById('three');
var display =0;

function hideShow(c){
  if (c==1){
    div.style.display = 'block';
    document.querySelector('#about .list div .listSkil').style.color="#0c6e65";
    document.querySelector('#about .list div .listex').style.color="black";
    document.querySelector('#about .list div .listed').style.color="black";
    div2.style.display = 'none';
    div3.style.display = 'none';
    display=1;
  }
  else if(c==2){
        div.style.display = 'none';
        div2.style.display = 'block';
        document.querySelector('#about .list div .listex').style.color="#0c6e65";
        document.querySelector('#about .list div .listSkil').style.color="black";
        document.querySelector('#about .list div .listed').style.color="black";
        div3.style.display = 'none';
        display=2;
  }
  else{
        div.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display ='block' ;
        document.querySelector('#about .list div .listed').style.color="#0c6e65";
        document.querySelector('#about .list div .listex').style.color="black";
        document.querySelector('#about .list div .listSkil').style.color="black";
        display=0;
  }
}

var h1=document.getElementById('s1');
var h2=document.getElementById('s1');
var h3=document.getElementById('s1');
var h4=document.getElementById('s1');
var d=0;
function h(){
if(d=0){
h1.scroll.display=
  d=1;
}
else{
  d=0;
}
}
const img = document.querySelector(".img2");
console.log(img)
if (window.innerWidth <= 820) {
    img.src = "static/photo/sit.png";  // Change to the small image
  }
  else {
    img.src = "static/photo/Relaxing.png";  // Default large image
}
