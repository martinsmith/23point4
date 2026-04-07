<?php
/**
 * 23.4° Contact Form Handler
 *
 * Receives POST data from the contact form, validates it,
 * and sends an email. Redirects back with a status parameter.
 */

// ── Configuration ──────────────────────────────────────────
$to      = 'info@23point4.uk';
$subject = 'New enquiry from 23point4.uk';
$from    = 'noreply@23point4.uk';

// Where to redirect after submission
$redirect_success = '/?form=success#contact';
$redirect_error   = '/?form=error#contact';

// ── Guard: only accept POST ────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

// ── Honeypot check (bot trap) ──────────────────────────────
if (!empty($_POST['bot-field'])) {
    // Silently redirect — don't let bots know they were caught
    header("Location: $redirect_success");
    exit;
}

// ── Sanitise & validate ────────────────────────────────────
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim(strip_tags($_POST['email'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    header("Location: $redirect_error");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: $redirect_error");
    exit;
}

// ── Build the email ────────────────────────────────────────
$body  = "Name:    $name\n";
$body .= "Email:   $email\n";
$body .= "Message:\n\n$message\n";

$headers  = "From: $from\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: 23point4-contact-form\r\n";

// ── Send ───────────────────────────────────────────────────
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    header("Location: $redirect_success");
} else {
    header("Location: $redirect_error");
}
exit;
