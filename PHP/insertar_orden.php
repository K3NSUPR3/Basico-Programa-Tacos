<?php
// Script para el PASO FINAL: Inserta el encabezado del pedido en la tabla 'ordenes'.

include("Conexion.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

$inputJSON = file_get_contents('php://input');
// Recibimos un objeto que contiene solo el número de orden (generado en JS)
$finalOrderData = json_decode($inputJSON, true);

if (empty($finalOrderData) || !isset($finalOrderData['orderNumber'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos de orden incompletos.']);
    exit();
}

$orderNumber = $finalOrderData['orderNumber'];
$all_success = true;

// --- VALORES DE PRUEBA SIMULADOS ---
// Puesto que tu JS no envía estos datos, usamos valores fijos por ahora.
$horaEstimada = "15 minutos";
$metodoEntrega = "Recoger en tienda";

// Prepara la consulta para la inserción en la tabla 'ordenes'
// Columnas de la tabla: numero_pedido, hora_estimada, metodo_entrega
$stmt = $enlace->prepare("INSERT INTO ordenes (numero_pedido, hora_estimada, metodo_entrega) VALUES (?, ?, ?)");

// Tipos: s=string (numero_pedido), s=string (hora_estimada), s=string (metodo_entrega)
$stmt->bind_param("sss", $orderNumber_param, $horaEstimada_param, $metodoEntrega_param);

// Asignar parámetros
$orderNumber_param = $orderNumber; 
$horaEstimada_param = $horaEstimada; 
$metodoEntrega_param = $metodoEntrega; 
    
// Ejecutar la inserción (solo una vez por orden)
if (!$stmt->execute()) {
    $all_success = false;
    error_log("Error al insertar encabezado de orden: " . $stmt->error);
}

$stmt->close();
$enlace->close();

if ($all_success) {
    echo json_encode(['success' => true, 'message' => 'Encabezado de pedido registrado con éxito.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar el encabezado del pedido.']);
}
?>