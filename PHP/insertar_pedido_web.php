<?php
// Incluye la conexión a la base de datos
include("Conexion.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

$inputJSON = file_get_contents('php://input');
$cartItems = json_decode($inputJSON, true);

if (empty($cartItems)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos del carrito.']);
    exit();
}

$all_success = true;

// Columna de pedidos_web: nombre_producto, cantidad, precio
$stmt = $enlace->prepare("INSERT INTO pedidos_web (nombre_producto, cantidad, precio) VALUES (?, ?, ?)");

// 'sid': s=string (nombre), i=integer (cantidad), d=double/decimal (precio)
$stmt->bind_param("sid", $productName_param, $quantity_param, $price_param);

foreach ($cartItems as $item) {
    $productName_param = $item['name'];
    $quantity_param = $item['quantity'];
    $price_param = $item['price'];
    
    // Ejecutar la inserción
    if (!$stmt->execute()) {
        $all_success = false;
        error_log("Error al insertar en pedidos_web: " . $stmt->error);
        break; 
    }
}

$stmt->close();
$enlace->close();

if ($all_success) {
    echo json_encode(['success' => true, 'message' => 'Detalles guardados en pedidos_web.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar algunos productos en pedidos_web.']);
}
?>
