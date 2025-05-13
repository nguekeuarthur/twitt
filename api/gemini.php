<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration de l'API GPT4All
$API_URL = 'http://localhost:4891/v1/chat/completions';

// Récupération du message envoyé
$data = json_decode(file_get_contents('php://input'), true);
$userMessage = $data['message'] ?? '';

if (empty($userMessage)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message requis']);
    exit;
}

// Préparation de la requête pour GPT4All
$payload = [
    'model' => 'mistral-openorca',
    'messages' => [
        [
            'role' => 'user',
            'content' => $userMessage
        ]
    ],
    'max_tokens' => 150,
    'temperature' => 0.7
];

// Log de la requête pour le débogage
error_log('Requête GPT4All: ' . json_encode($payload));

// Appel à l'API GPT4All
$ch = curl_init($API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_VERBOSE => true
]);

// Capture des erreurs cURL
$verbose = fopen('php://temp', 'w+');
curl_setopt($ch, CURLOPT_STDERR, $verbose);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Log de la réponse pour le débogage
error_log('Code HTTP: ' . $httpCode);
error_log('Réponse: ' . $response);

if ($response === false) {
    error_log('Erreur cURL: ' . curl_error($ch));
    rewind($verbose);
    $verboseLog = stream_get_contents($verbose);
    error_log('Log verbose: ' . $verboseLog);
}

curl_close($ch);
fclose($verbose);

if ($httpCode === 200) {
    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('Erreur de décodage JSON: ' . json_last_error_msg());
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de décodage de la réponse']);
        exit;
    }
    
    // Le format de réponse de GPT4All est différent de celui de Gemini
    $botResponse = $result['choices'][0]['message']['content'] ?? "Désolé, je n'ai pas compris votre message.";
    echo json_encode(['response' => $botResponse]);
} else {
    http_response_code($httpCode);
    echo json_encode([
        'error' => 'Erreur lors de la communication avec GPT4All',
        'status' => $httpCode,
        'details' => $response
    ]);
}
?> 