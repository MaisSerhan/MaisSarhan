const nav=document.querySelector(".navbar__menu");
const ul=document.getElementById("navbar__list");

const navbar= ()=>{
  let close=document.createElement("button");
    close.innerHTML="X";
    close.setAttribute("onclick",`show("#navbar__list")`);
    close.classList.add("off");
    for(let i=1;i<9;i++){
    let n=`Section ${i}`;
    let c=`section${i}`;
    let a =`<a class="menu__link" id="${c}" href="#${c}" ></a>`;
    let li=document.createElement("li");
    li.setAttribute('class',`nav__item ${c}`);
    ul.appendChild(li);
    let s = document.querySelector(`.${c}`);
    s.innerHTML=a;
    };
    let a =document.querySelector("#section1");
    a.innerHTML = "Home";
    a.setAttribute("href","../index.html");
    a =document.querySelector("#section2");
    a.innerHTML = "Java";  
    a.setAttribute("href","#frontj");
    a =document.querySelector("#section3");
    a.innerHTML = "JS"; 
    a.setAttribute("href","#frontjs");
    a =document.querySelector("#section4");
    a.innerHTML = `Node JS`;  
    a.setAttribute("href","#frontNodejs");
    a =document.querySelector("#section5");
    a.innerHTML = `AI`;  
    a.setAttribute("href","#frontAI");
    a =document.querySelector("#section6");
    a.innerHTML = "PHP"; 
    a.setAttribute("href","#frontPhp");
    a =document.querySelector("#section7");
    a.innerHTML = `HTML & CSS`;  
    a.setAttribute("href","#frontHtml");
    a =document.querySelector("#section8");
    a.innerHTML = `Graphics`;  
    a.setAttribute("href","#frontG");
    ul.appendChild(close);  
  };
  navbar();



  const minue=()=>{
    let button =document.createElement("button");
    button.setAttribute("class","menu__link");
    button.setAttribute("id","minue");
    button.setAttribute("onclick", `show("#navbar__list")`);
    button.innerHTML=`<img src="https://static.vecteezy.com/system/resources/previews/002/292/406/non_2x/hamburger-menu-line-icon-free-vector.jpg " width="40px" height="40px">`
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
    div2.style.display = 'none';
    div3.style.display = 'none';
    display=1;
  }
  else if(c==2){
        div.style.display = 'none';
        div2.style.display = 'block';
        div3.style.display = 'none';
        display=2;
  }
  else{
        div.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display ='block' ;
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
