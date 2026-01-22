<?php
$file = "data/contact_messages.csv";
$data = [];

if (file_exists($file)) {
    if (($handle = fopen($file, "r")) !== FALSE) {
        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== FALSE) {
            $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }
}

header('Content-Type: application/json');
echo json_encode($data);
