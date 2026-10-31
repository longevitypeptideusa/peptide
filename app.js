var raw=[
["Tesamorelin","2 mg",2500],["Tesamorelin","5 mg",4500],["Tesamorelin","10 mg",7500],["Tesamorelin","20 mg",12500],
["Semax","5 mg",2000],["Semax","10 mg",3000],["Semaglutide","10 mg",3000],["Semaglutide","15 mg",4000],["Semaglutide","20 mg",5000],
["Tirzepatide","5 mg",2000],["Tirzepatide","10 mg",3000],["Tirzepatide","15 mg",4000],["Tirzepatide","20 mg",5000],["Tirzepatide","30 mg",6500],["Tirzepatide","40 mg",8500],["Tirzepatide","50 mg",10500],["Tirzepatide","60 mg",12000],
["PT-141","10 mg",3000],["ARA290 (Cibinetide)","10 mg",3000],["Retatrutide","5 mg",3000],["Retatrutide","10 mg",5000],["Retatrutide","15 mg",6500],["Retatrutide","20 mg",8500],["Retatrutide","30 mg",11000],
["Selank","5 mg",2000],["Selank","10 mg",3000],["Ipamorelin","5 mg",2000],["Ipamorelin","10 mg",2500],
["Wolverine","10 mg · BPC-157 5 mg + TB-500 5 mg",4500],["Wolverine","20 mg · BPC-157 10 mg + TB-500 10 mg",6500],
["GLOW","70 mg · BPC-157 10 mg + GHK-Cu 50 mg + TB-500 10 mg",7500],["KLOW Serum","80 mg · BPC-157 10 mg + GHK-Cu 50 mg + TB-500 10 mg + KPV 10 mg",35000],
["KPV","5 mg",2000],["KPV","10 mg",3000],["Melanotan II","10 mg",3000],["MOTS-C (Human)","10 mg",3000],["MOTS-C (Human)","40 mg",8000],
["NAD+","1000 mg",6000],["GHRP-2","15 mg",3500],["GHRP-6","10 mg",2500],["IGF-1 LR3","100 mcg",1500],["IGF-1 LR3","1 mg",8000],
["CJC-1295 (w/o DAC)","10 mg",6000],["CJC-1295 + Ipamorelin","10 mg · 5 mg + 5 mg",4000],["GHK-Cu","50 mg",3000],["GHK-Cu","100 mg",5000],
["DSIP","2 mg",2000],["Epithalon","10 mg",1500],["Epithalon","50 mg",6000],["BPC-157","2 mg",1000],["BPC-157","5 mg",1500],["BPC-157","10 mg",3000],
["TB-500","2 mg",1500],["TB-500","5 mg",3000],["TB-500","10 mg",6000],["SS-31","10 mg",4000],["AOD9604","2 mg",2500],["AOD9604","5 mg",4000],["AOD9604","10 mg",7000]
];
function cat(n){if(/tesamorelin|semaglutide|tirzepatide|retatrutide|aod9604/i.test(n))return "Metabolik araştırma";if(/wolverine|glow|klow|bpc|tb-500|ghk-cu|kpv/i.test(n))return "Peptit serileri";if(/semax|selank|dsip/i.test(n))return "Araştırma peptitleri";return "Diğer araştırma ürünleri"}
var items=raw.map(function(x,i){return {name:x[0],size:x[1],price:x[2],cat:cat(x[0]),id:i,image:"assets/products/item-"+i+".svg"}});
var shopierProducts=[
["Le Peptide AHK-Cu + GHK-Cu Saç Serumu","30 ml",3000,"Cilt ve saç bakımı"],
["Le Peptide GHK-CU + SNAP8 Derma Cooper Yüz Serumu","30 ml",750,"Cilt ve saç bakımı"],
["Le Peptide GHK-CU Derma Cooper Yüz Bakım Kremi","30 ml",750,"Cilt ve saç bakımı"],
["Le Peptide GHK-Cu Pept Scalp Saç Toniği","100 ml",1500,"Cilt ve saç bakımı"],
["GHK-CU Topikal Krem","50 mg",5000,"SYM ürünleri"],
["GHK-CU Topikal Serum","50 mg",5000,"SYM ürünleri"],
["NAD+ Nasal Sprey","1000 mg",20000,"SYM ürünleri"],
["NAD+ Serum","1000 mg",20000,"SYM ürünleri"],
["GHK-CU Nasal Sprey","50 mg",5000,"SYM ürünleri"],
["PT-141 Nasal Sprey","10 mg",7500,"SYM ürünleri"],
["GHK-CU Serum","50 / 100 mg",5000,"SYM ürünleri"],
["Retatrutide Serum","5 / 10 / 15 mg",10000,"SYM ürünleri"]
];
items=items.concat(shopierProducts.map(function(x,i){var id=raw.length+i;return {name:x[0],size:x[1],price:x[2],cat:x[3],id:id,image:"assets/products/item-"+id+".svg"}}));
var cats=["Tümü"].concat(Array.from(new Set(items.map(function(p){return p.cat})))),active="Tümü",filterBox=document.getElementById("filters");
cats.forEach(function(name,i){var b=document.createElement("button");b.textContent=name;b.className=i?"filter":"filter active";b.onclick=function(){active=name;document.querySelectorAll(".filter").forEach(function(x){x.classList.toggle("active",x===b)});render()};filterBox.appendChild(b)});
function render(){var q=document.getElementById("search").value.trim().toLocaleLowerCase("tr"),list=items.filter(function(p){return(active==="Tümü"||p.cat===active)&&(p.name+" "+p.size).toLocaleLowerCase("tr").indexOf(q)>=0});document.getElementById("count").textContent=list.length+" ürün";document.getElementById("empty").hidden=!!list.length;document.getElementById("products").innerHTML=list.map(function(p){var photo=p.image?'<img src="'+p.image+'" alt="'+p.name+'" loading="lazy">':'<div class="photo-placeholder"><span>∞</span><small>'+p.name+'</small></div>';return '<article class="card">'+photo+'<div class="cardtop"><small>'+p.cat+'</small><i>∞</i></div><h3>'+p.name+'</h3><p>'+p.size+'</p><div class="cardbottom"><strong>'+p.price.toLocaleString("tr-TR")+' <small>₺</small></strong><button data-id="'+p.id+'">WhatsApp’tan sor ↗</button></div></article>'}).join("");document.querySelectorAll(".card button").forEach(function(b){b.onclick=function(){order(items[Number(b.dataset.id)])}})}
function order(p){var phone=(typeof WHATSAPP_NUMBER==="string"?WHATSAPP_NUMBER:"").replace(/\D/g,"");if(!phone){alert("WhatsApp sipariş bağlantısı için config.js dosyasına ülke koduyla numara ekleyin.");return}var msg="Merhaba, "+p.name+" ("+p.size+") hakkında bilgi almak istiyorum. Listelenen fiyat: "+p.price.toLocaleString("tr-TR")+" TL.";window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer")}
document.getElementById("search").addEventListener("input",render);document.getElementById("year").textContent=new Date().getFullYear();render();
var coas=[["50AM","50AM-20260908S6179_report.pdf"],["AOD5","AOD5-20260908S6179_report.pdf"],["BB20","BB20-20260908S6179_report.pdf"],["GLOW70","GLOW70-20260908S6179_report.pdf"],["TR30","TR30-20260908S6179_report.pdf"],["TSM5","TSM5-20260908S6179_report.pdf"]];
document.getElementById("coa-list").innerHTML=coas.map(function(x){return '<a class="coa-row" href="'+x[1]+'" target="_blank" rel="noreferrer"><span class="pdf">PDF</span><span><b>'+x[0]+'</b><small>Analiz raporu</small></span><i>↗</i></a>'}).join("");

var gate=document.getElementById("entry-gate"),siteContent=document.getElementById("site-content"),gateChecks=Array.from(gate.querySelectorAll('input[type="checkbox"]')),gateButton=document.getElementById("gate-enter");
function updateGateButton(){gateButton.disabled=!gateChecks.every(function(input){return input.checked})}
function closeGate(){gate.hidden=true;siteContent.inert=false;document.body.classList.remove("gate-open");document.querySelector(".brand").focus()}
var accepted=false;try{accepted=sessionStorage.getItem("longevity-labs-entry-v1")==="accepted"}catch(error){}
if(accepted){closeGate()}else{document.body.classList.add("gate-open");gateChecks[0].focus()}
gateChecks.forEach(function(input){input.addEventListener("change",updateGateButton)});
gateButton.addEventListener("click",function(){if(gateButton.disabled)return;try{sessionStorage.setItem("longevity-labs-entry-v1","accepted")}catch(error){}closeGate()});
