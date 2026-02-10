<?php
require __DIR__ . "/config/db.php";

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$res = $conn->query("SELECT * FROM files ORDER BY uploaded_at DESC");
$files = [];
if ($res) while ($row = $res->fetch_assoc()) $files[] = $row;

function humanSize($bytes){
  $units=["B","KB","MB","GB","TB"];
  $i=0; $b=(float)$bytes;
  while($b>=1024 && $i<count($units)-1){ $b/=1024; $i++; }
  return ($i===0? (string)intval($b) : number_format($b,1))." ".$units[$i];
}
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Road Drive</title>

<!-- STYLE TETAP SAMA -->
<style>
/* === STYLE ASLI KAMU (TIDAK DIUBAH) === */
:root{
  --bg:#070a12;
  --card:rgba(255,255,255,.06);
  --line:rgba(255,255,255,.10);
  --text:#eaf1ff;
  --muted:#9fb0d0;
  --accent:#7c3aed;
  --accent2:#60a5fa;
  --ok:#22c55e;
  --danger:#fb7185;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:system-ui,-apple-system,Segoe UI,Roboto;
  color:var(--text);
  background:
    radial-gradient(900px 600px at 12% 0%, rgba(96,165,250,.30), transparent 55%),
    radial-gradient(900px 600px at 88% 10%, rgba(124,58,237,.28), transparent 55%),
    radial-gradient(1200px 700px at 50% 100%, rgba(34,197,94,.10), transparent 60%),
    var(--bg);
}
.shell{max-width:1100px;margin:0 auto;padding:18px 14px 40px}
.badge{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid var(--line)}
.badge.ok{color:#bff7d0;background:rgba(34,197,94,.1)}
.badge.off{color:#ffd0d9;background:rgba(251,113,133,.1)}
.panel{margin-top:14px;border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.05)}
.panelHead{padding:14px;border-bottom:1px solid var(--line)}
.table{padding:14px}
.row{display:grid;grid-template-columns:1.7fr .6fr .9fr 1fr;gap:12px;padding:14px;border:1px solid var(--line);border-radius:18px;margin-bottom:10px}
.row.head{border:none;color:var(--muted)}
</style>
</head>

<body>
<div class=
