<?php

include("Conexion.php");

// Permite solo peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit();
}

// Recupera los datos JSON del cuerpo de la petición
$inputJSON = file_get_contents('php://input');
$cartItems = json_decode($inputJSON, true);

// Prepara la respuesta por defecto
$response = ['success' => false, 'message' => 'No se recibieron datos del carrito.'];

if (is_array($cartItems) && count($cartItems) > 0) {
    // Usa una consulta preparada para mayor seguridad
    $sql = "INSERT INTO pedidos_web (nombre_producto, cantidad, precio) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($enlace, $sql);

    // Bindea los parámetros
    mysqli_stmt_bind_param($stmt, "sid", $nombre_producto, $cantidad, $precio);

    $all_success = true;

    // Recorre los items del carrito e inserta cada uno
    foreach ($cartItems as $item) {
        $nombre_producto = $item['name'];
        $cantidad = $item['quantity'];
        $precio = $item['price'];

        // Ejecuta la consulta
        if (!mysqli_stmt_execute($stmt)) {
            $all_success = false;
            break;
        }
    }

    if ($all_success) {
        $response = ['success' => true, 'message' => 'Pedido registrado con éxito.'];
    } else {
        $response = ['success' => false, 'message' => 'Hubo un error al registrar uno de los productos: ' . mysqli_stmt_error($stmt)];
    }

    // Cierra la consulta
    mysqli_stmt_close($stmt);

}

mysqli_close($enlace);

header('Content-Type: application/json');
echo json_encode($response);
exit();

?>