let processes=[]; //used as array to enter procceses//
let colors=["#ff7675","#74b9ff","#55efc4","#ffeaa7","#a29bfe","#fd79a8"];

function addProcess(){
 let pid=document.getElementById("pid").value;
 let bt=parseInt(document.getElementById("bt").value);
 let pr=parseInt(document.getElementById("pr").value);
  //used as object in form of struct//
 processes.push({pid,bt,pr,color:colors[processes.length%colors.length]});
 renderQueue(processes);
}

function renderQueue(arr){
 let div=document.getElementById("queueView");
 div.innerHTML="";

 arr.forEach(p=>{
  div.innerHTML+=`<div class="qitem" style="background:${p.color}">${p.pid}</div>`;
 });
}

async function run(){
 let algo=document.getElementById("algo").value;
 let arr=[...processes];

 document.getElementById("timeline").innerHTML="";

 if(algo==="sjf") arr.sort((a,b)=>a.bt-b.bt); //here sorting takes place for sortest job first//
 if(algo==="priority") arr.sort((a,b)=>a.pr-b.pr);

 if(algo==="rr"){
   roundRobin(arr); // use of circular queue function as it re enters ready state//
   return;
 }

 renderQueue(arr);

 let time=0,totalWT=0,totalTAT=0;

 for(let p of arr){
  let wt=time;
  let tat=wt+p.bt;

  totalWT+=wt;
  totalTAT+=tat;

  await animate(p);

  time+=p.bt;
 }

 showStats(totalWT,totalTAT,arr.length);
}

// ROUND ROBIN (CIRCULAR QUEUE 💀)
async function roundRobin(arr){
 let q=[...arr];
 let tq=parseInt(document.getElementById("quantum").value)||2;

 let time=0;

 while(q.length){
  let p=q.shift();
  //this q.shift is used as DEqueue as removing procces from ready queue//
  let exec=Math.min(p.bt,tq);

  await animate({...p,bt:exec});

  p.bt-=exec;
  time+=exec;

  if(p.bt>0) q.push(p);
 }

 document.getElementById("stats").innerHTML="Round Robin Completed";
}

// ANIMATION
function animate(p){
 return new Promise(resolve=>{
  let div=document.createElement("div");
  div.className="block";
  div.style.background=p.color;
  div.innerText=p.pid;

  document.getElementById("timeline").appendChild(div);

  setTimeout(resolve,500);
 });
}

function showStats(wt,tat,n){
 document.getElementById("stats").innerHTML=
  `Avg WT: ${(wt/n).toFixed(2)} | Avg TAT: ${(tat/n).toFixed(2)}`;
}
