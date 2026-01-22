<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name    = htmlspecialchars($_POST['name']);
    $email   = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = str_replace(["\r", "\n"], " ", $_POST['message']);
    $time    = date("Y-m-d H:i:s");

    $file = "../data/contact_messages.csv";

    // Buat file + header jika belum ada
    if (!file_exists($file)) {
        $header = fopen($file, "w");
        fputcsv($header, ["timestamp","name","email","subject","message"]);
        fclose($header);
    }

    // Simpan data
    $fp = fopen($file, "a");
    fputcsv($fp, [$time, $name, $email, $subject, $message]);
    fclose($fp);

    echo "OK";
}
?>
