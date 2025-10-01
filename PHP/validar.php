<?php

include("Conexion.php");

// Recuperar los datos del formulario de forma segura
$username = $_POST['username'];
$password = $_POST['password'];

// Prepara la consulta para buscar el usuario en la tabla 'administradores'
// La columna 'Nombre' es donde se encuentra el nombre de usuario
$sql = "SELECT * FROM administradores WHERE Nombre = ?";
$stmt = mysqli_prepare($enlace, $sql);
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

// Verifica si se encontró un registro
if (mysqli_num_rows($resultado) > 0) {
    // Si se encontró un registro, obtener la fila
    $fila = mysqli_fetch_assoc($resultado);
    $hashed_password = $fila['Contraseña'];

    // ¡Aquí está el cambio clave!
    // Se compara directamente la contraseña ingresada con el hash de la base de datos
    // Esto es temporal porque tu contraseña es el hash completo
    if ($password === $hashed_password) {
        // Las credenciales son correctas, redirige al panel de administración
        header("Location:../html/tablaeditarese.html");
        exit();
    } else {
        // Contraseña incorrecta, redirige de vuelta al login
        header("Location:../html/login.html?error=1");
        exit();
    }
} else {
    // El usuario no existe, redirige de vuelta al login
    header("Location:../html/login.html?error=1");
    exit();
}

// Cierra la conexión y la consulta preparada
mysqli_stmt_close($stmt);
mysqli_close($enlace);

?>