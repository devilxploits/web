<?php
$file = 'website.zip';

if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="medtruecare-website.zip"');
    header('Content-Length: ' . filesize($file));
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Expires: 0');
    
    ob_clean();
    flush();
    readfile($file);
    exit;
} else {
    echo "File not found!";
}
?>
