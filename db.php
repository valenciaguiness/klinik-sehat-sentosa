<?php
$conn = new mysqli("localhost", "root", "", "roaddrive");

if ($conn->connect_error) {
  die("DB Error: " . $conn->connect_error);
}
