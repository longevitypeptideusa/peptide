var gate=document.getElementById("entry-gate"),siteContent=document.getElementById("site-content"),gateChecks=Array.from(gate.querySelectorAll('input[type="checkbox"]')),gateButton=document.getElementById("gate-enter");
function updateGateButton(){gateButton.disabled=!gateChecks.every(function(input){return input.checked})}
function closeGate(){gate.hidden=true;siteContent.inert=false;document.body.classList.remove("gate-open");document.querySelector(".brand").focus()}
var accepted=false;try{accepted=sessionStorage.getItem("longevity-labs-entry-v1")==="accepted"}catch(error){}
if(accepted){closeGate()}else{document.body.classList.add("gate-open");gateChecks[0].focus()}
gateChecks.forEach(function(input){input.addEventListener("change",updateGateButton)});
updateGateButton();
gateButton.addEventListener("click",function(){if(gateButton.disabled)return;try{sessionStorage.setItem("longevity-labs-entry-v1","accepted")}catch(error){}closeGate()});
