<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/mailer/Exception.php';
require __DIR__ . '/mailer/PHPMailer.php';
require __DIR__ . '/mailer/SMTP.php';

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $service = trim($_POST['service'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($phone) || empty($service)) {
        echo "error: Missing required fields";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "error: Invalid email address";
        exit;
    }

    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'] ?? 'mail.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'] ?? 'info@medtruecareservices.com';
        $mail->Password = $_ENV['SMTP_PASSWORD'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['SMTP_PORT'] ?? 587;
        
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $mail->setFrom($_ENV['FROM_EMAIL'] ?? 'info@medtruecareservices.com', 'MedTrueCare Website');
        $mail->addAddress($_ENV['TO_EMAIL'] ?? 'info@medtruecareservices.com', 'Admin');
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = "New Consultation Request from $name";
        $mail->Body = "
            <h2>New Consultation Request</h2>
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>
            <p><strong>Service:</strong> " . htmlspecialchars($service) . "</p>
            <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
        ";
        $mail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\nMessage:\n$message";

        $mail->send();
        echo "success";
    } catch (Exception $e) {
        error_log("Email error: " . $mail->ErrorInfo);
        echo "error: " . $mail->ErrorInfo;
    }
} else {
    echo "error: Invalid request method";
}
?>
