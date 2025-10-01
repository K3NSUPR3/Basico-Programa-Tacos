<?php

include("Conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Retrieve and sanitize the form data to prevent SQL injection
    $nombre = mysqli_real_escape_string($enlace, $_POST['nombre']);
    $correo = mysqli_real_escape_string($enlace, $_POST['correo']);
    $telefono = mysqli_real_escape_string($enlace, $_POST['telefono']);
    $fecha = mysqli_real_escape_string($enlace, $_POST['fecha']);
    $hora = mysqli_real_escape_string($enlace, $_POST['hora']);
    $invitados = mysqli_real_escape_string($enlace, $_POST['invitados']);
    $indicaciones = mysqli_real_escape_string($enlace, $_POST['indicaciones']);

    
    $sql = "INSERT INTO reservaciones (nombre, correo_electronico, telefono, fecha, hora, numero_de_personas, solicitudes_especiales) 
            VALUES ('$nombre', '$correo', '$telefono', '$fecha', '$hora', '$invitados', '$indicaciones')";

    // Execute the query
    if (mysqli_query($enlace, $sql)) {
        echo "Reservación realizada con éxito ";
        header("Location:../html/reservaciones.html");
    } else {
        // If the query fails, display an error message
        echo "Error al registrar la reservación: " . mysqli_error($enlace);
    }
} else {
    // If the user attempts to access this file directly without submitting the form, redirect them back to the reservations page
    header("Location:../html/reservaciones.html");
    exit();
}

mysqli_close($enlace);

?>