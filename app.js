const DB_NAME = "roaddrive_offline";
const STORE = "queue";

function $(id){ return document.getElementById(id); }
const btnUpload = $("btnUpload");
const fileInput = $("fileInput");
const net = $("net");
const offlineList = $("offlineList");

function setNet(){
  const ok = navigator.onLine;
  net.textContent = ok ? "Online" : "Offline";
  net.className = "badge " + (ok ? "ok" : "off");
}
window.addEventListener("online", ()=>{ setNet(); syncQueue(); });
window.addEventListener("offline", setNet);
setNet();

function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open(DB_NAME,1);
    r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
}

async function getQueue(){
  const db=await openDB();
  return new Promise(res=>{
    const tx=db.transaction(STORE,"readonly");
    const q=tx.objectStore(STORE).getAll();
    q.onsuccess=()=>res(q.result||[]);
  });
}

async function addToQueue(file){
  const buf=await file.arrayBuffer();
  const db=await openDB();
  db.transaction(STORE,"readwrite").objectStore(STORE).add({
    name:file.name,
    size:file.size,
    type:file.type,
    data:buf,
    createdAt:Date.now()
  });
}

async function deleteQueued(id){
  const db=await openDB();
  db.transaction(STORE,"readwrite").objectStore(STORE).delete(id);
}

async function renderOfflineQueue(){
  if(!offlineList) return;
  offlineList.querySelectorAll(".row:not(.head)").forEach(e=>e.remove());

  const items = await getQueue();
  if(items.length===0){
    offlineList.innerHTML += `
      <div class="row">
        <div class="muted">Tidak ada file pending</div>
        <div></div>
        <div class="badge ok">—</div>
        <div></div>
      </div>`;
    return;
  }

  items.forEach(it=>{
    offlineList.innerHTML += `
      <div class="row">
        <div>${it.name}</div>
        <div>${(it.size/1024).toFixed(1)} KB</div>
        <div class="badge off">Pending</div>
        <div>${new Date(it.createdAt).toLocaleString()}</div>
      </div>`;
  });
}

async function syncQueue(){
  if(!navigator.onLine) return;
  const items=await getQueue();
  for(const it of items){
    const blob=new Blob([it.data],{type:it.type});
    const fd=new FormData();
    fd.append("file",new File([blob],it.name));
    await fetch("upload.php?ajax=1",{method:"POST",body:fd});
    await deleteQueued(it.id);
  }
  renderOfflineQueue();
  setTimeout(()=>location.reload(),700);
}

btnUpload.onclick=()=>fileInput.click();
fileInput.onchange=async()=>{
  const f=fileInput.files[0];
  if(!f) return;

  if(!navigator.onLine){
    await addToQueue(f);
    renderOfflineQueue();
  }else{
    const fd=new FormData();
    fd.append("file",f);
    await fetch("upload.php?ajax=1",{method:"POST",body:fd});
    location.reload();
  }
};

renderOfflineQueue();
syncQueue();

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
