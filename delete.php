<?php
require __DIR__."/config/db.php";

$id = (int)$_POST["id"];
$r = $conn->query("SELECT * FROM files WHERE id=$id")->fetch_assoc();
if($r){
  @unlink(__DIR__."/uploads/".$r["stored_name"]);
  $conn->query("DELETE FROM files WHERE id=$id");
}
header("Location: index.php");
