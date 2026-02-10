const statusEl = document.getElementById("status");
const infoEl = document.getElementById("info");
const dataList = document.getElementById("dataList");

function updateStatus() {
  if (navigator.onLine) {
    statusEl.textContent = "🟢 Online";
    statusEl.className = "badge online";
    syncData();
  } else {
    statusEl.textContent = "🔴 Offline";
    statusEl.className = "badge offline";
  }
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
updateStatus();

// Ambil data dari localStorage
function getData() {
  return JSON.parse(localStorage.getItem("kunjungan")) || [];
}

// Simpan data ke localStorage
function saveData(data) {
  localStorage.setItem("kunjungan", JSON.stringify(data));
}

// SIMPAN DATA
function simpan() {
  const nama = document.getElementById("nama").value;
  const keluhan = document.getElementById("keluhan").value;
  const tanggal = document.getElementById("tanggal").value;

  if (!nama || !keluhan || !tanggal) {
    infoEl.textContent = "⚠️ Semua field wajib diisi!";
    return;
  }

  const data = getData();

  data.push({
    nama,
    keluhan,
    tanggal,
    status: navigator.onLine ? "online" : "offline",
    waktu: new Date().toLocaleString()
  });

  saveData(data);
  tampilkanData();

  infoEl.textContent = navigator.onLine
    ? "✅ Data tersimpan & online"
    : "📴 Offline – data disimpan lokal";

  document.getElementById("nama").value = "";
  document.getElementById("keluhan").value = "";
  document.getElementById("tanggal").value = "";
}

// TAMPILKAN HISTORY
function tampilkanData() {
  const data = getData();
  dataList.innerHTML = "";

  if (data.length === 0) {
    dataList.innerHTML = "<p>Belum ada data.</p>";
    return;
  }

  data.forEach((item, index) => {
    dataList.innerHTML += `
      <div class="data-item">
        <strong>${item.nama}</strong>
        <p>Keluhan: ${item.keluhan}</p>
        <p>Tanggal: ${item.tanggal}</p>
        <small>🕒 ${item.waktu}</small>
        <span class="status ${item.status}">
          ${item.status === "online" ? "🟢 Online" : "🔴 Offline"}
        </span>
      </div>
    `;
  });
}

// AUTO SYNC SAAT ONLINE
function syncData() {
  const data = getData();
  let changed = false;

  data.forEach(item => {
    if (item.status === "offline") {
      item.status = "online";
      changed = true;
    }
  });

  if (changed) {
    saveData(data);
    tampilkanData();
  }
}

// load awal
tampilkanData();
