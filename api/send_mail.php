<?php
function sendMail($to, $subject, $htmlBody, $fromEmail = 'onboarding@resend.dev', $fromName = 'WhoGoHelp') {
    $config = require 'config.php';
    $apiKey = $config['resend_api_key']; // 🔐 You can move this to a config file for safety

    $from = "$fromName <$fromEmail>"; // Format: "Name <email>"

    $data = [
        "from" => $from,
        "to" => [$to],
        "subject" => $subject,
        "html" => $htmlBody
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.resend.com/emails");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        error_log("Resend API error: $err");
        return false;
    }

    $decoded = json_decode($response, true);
    return isset($decoded['id']); // Success if an email ID was returned
}