<?php
require __DIR__."/config/db.php";

$id = (int)($_GET["id"] ?? 0);
$r = $conn->query("SELECT * FROM files WHERE id=$id")->fetch_assoc();
if(!$r) die("File tidak ditemukan");

$path = __DIR__."/uploads/".$r["stored_name"];
header("Content-Disposition: attachment; filename=\"".$r["original_name"]."\"");
readfile($path);
