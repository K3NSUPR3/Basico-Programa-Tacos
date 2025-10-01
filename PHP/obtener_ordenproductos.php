<?php
include 'Conexion.php'; // Asegúrate de que tu archivo de conexión esté en el mismo directorio.

header('Content-Type: application/json');

$accion = $_GET['accion'] ?? $_POST['accion'] ?? null;

switch ($accion) {
    case 'obtener':
        $sql = "SELECT id, nombre, precio, descripcion FROM productos";
        $resultado = mysqli_query($enlace, $sql);
        $productos = [];
        while ($fila = mysqli_fetch_assoc($resultado)) {
            $productos[] = $fila;
        }
        echo json_encode($productos);
        break;

    case 'agregar':
        $nombre = $_POST['nombre'] ?? '';
        $precio = $_POST['precio'] ?? 0;
        $descripcion = $_POST['descripcion'] ?? '';

        $stmt = $enlace->prepare("INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)");
        $stmt->bind_param("sds", $nombre, $precio, $descripcion); // s: string, d: double, s: string
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true]);
        break;

    case 'eliminar':
        $id = $_POST['id'] ?? 0;
        $stmt = $enlace->prepare("DELETE FROM productos WHERE id = ?");
        $stmt->bind_param("i", $id); // i: integer
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true]);
        break;

    case 'editar':
        $id = $_POST['id'] ?? 0;
        $nombre = $_POST['nombre'] ?? '';
        $precio = $_POST['precio'] ?? 0;
        $descripcion = $_POST['descripcion'] ?? '';

        $stmt = $enlace->prepare("UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?");
        $stmt->bind_param("sdsi", $nombre, $precio, $descripcion, $id); // sdsi
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true]);
        break;
}

mysqli_close($enlace);
?>