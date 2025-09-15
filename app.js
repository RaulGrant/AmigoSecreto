// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
// Array principal para almacenar los nombres de los amigos
let amigos = [];

// Array para amigos ya sorteados (no se repiten)
let amigosSorteados = [];

// Array temporal para sorteos (se reduce con cada sorteo)
let amigosDisponibles = [];

// Variable para controlar si el juego está activo
let juegoActivo = false;

function validarNombre(nombre) {
    // Limpiar espacios extra
    nombre = nombre.trim();
    
    // Array de groserías (expandir según necesidad)
    const groserias = ['idiota', 'tonto', 'estupido', 'malo', 'feo', 'burro', 'pendejo', 'imbecil','menso', 'tarado', 'zopenco', 'gilipollas', 'cretino', 'subnormal', 'maldito', 'malparido', 'hijo de puta', 'cabron', 'cabrón', 'coño', 'joder', 'mierda', 'puta', 'puto', 'chinga tu madre', 'chingada', 'chingar', 'verga', 'pija', 'culo', 'carajo','pendeja', 'zorra', 'perra', 'maricón', 'marica', 'mariconazo', 'gilipollas', 'capullo', 'gilipollas', 'jilipollas', 'joputa', 'joputa', 'hijueputa', 'hijueputa', 'malparida', 'malparido    ', 'pendejo', 'pendeja', 'verga', 'vergas', 'chingada', 'chingadas', 'chingar', 'chingas','torpe', 'tonta', 'tontos', 'tontas', 'idiotas', 'imbeciles', 'imbéciles','estúpida', 'estúpidos', 'estúpidas'];
    
    // Validaciones
    const validaciones = {
        vacio: nombre === '',
        longitud: nombre.length < 3 || nombre.length > 30,
        soloLetras: !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre),
        groserias: groserias.some(groseria => 
            nombre.toLowerCase().includes(groseria.toLowerCase())
        ),
        duplicado: amigos.some(amigo => 
            amigo.toLowerCase() === nombre.toLowerCase()
        ),
        soloEspacios: nombre.replace(/\s/g, '') === ''
    };
    
    return {
        esValido: !Object.values(validaciones).some(v => v),
        errores: validaciones,
        nombreLimpio: formatearNombre(nombre)
    };
}

function formatearNombre(nombre) {
    return nombre.toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value;
    
    // Validar entrada
    const validacion = validarNombre(nombre);
    
    if (!validacion.esValido) {
        mostrarError(validacion.errores);
        return;
    }
    
    // Agregar al array principal
    amigos.push(validacion.nombreLimpio);
    
    // Solo agregar a disponibles si no hay sorteos en progreso
    // O si hay sorteos, agregar solo el nuevo amigo a disponibles
    if (amigosSorteados.length === 0) {
        // No hay sorteos previos, inicializar normalmente
        amigosDisponibles = [...amigos];
    } else {
        // Ya hay sorteos en progreso, solo agregar el nuevo amigo a disponibles
        amigosDisponibles.push(validacion.nombreLimpio);
    }
    
    // Limpiar input
    input.value = '';
    
    // Actualizar interfaz
    actualizarListaAmigos();
    
    // Animar nuevo elemento
    animarNuevoAmigo(validacion.nombreLimpio);
    
    // Habilitar botón sortear si hay suficientes amigos
    verificarEstadoJuego();
    
    // Mostrar mensaje de confirmación
    mostrarMensajeTemporal(`${validacion.nombreLimpio} agregado correctamente`, 'exito');
}

function mostrarError(errores) {
    let mensaje = '';
    
    if (errores.vacio) mensaje = 'Por favor, ingresa un nombre';
    else if (errores.longitud) mensaje = 'El nombre debe tener entre 3 y 30 caracteres';
    else if (errores.soloLetras) mensaje = 'Solo se permiten letras y espacios';
    else if (errores.groserias) mensaje = 'No se permiten palabras inapropiadas';
    else if (errores.duplicado) mensaje = 'Este nombre ya fue agregado';
    else if (errores.soloEspacios) mensaje = 'Ingresa un nombre válido';
    
    // Mostrar mensaje temporal
    mostrarMensajeTemporal(mensaje, 'error');
}


function animarNuevoAmigo(nombre) {
    // Encontrar el último elemento agregado y aplicar animación especial
    const lista = document.getElementById('listaAmigos');
    const ultimoItem = lista.lastElementChild;
    
    if (ultimoItem) {
        ultimoItem.style.animation = 'none';
        setTimeout(() => {
            ultimoItem.style.animation = 'aparecer 0.6s ease-out';
        }, 10);
    }
}

function mostrarMensajeTemporal(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-temporal mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    // Agregar al body
    document.body.appendChild(mensajeDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

function sortearAmigo() {
    // Verificar que hay amigos para sortear
    if (amigos.length === 0) {
        mostrarMensajeTemporal('Agrega al menos un amigo para sortear', 'error');
        return;
    }
    
    if (amigos.length === 1) {
        mostrarMensajeTemporal('Agrega al menos 2 amigos para un sorteo', 'error');
        return;
    }
    
    // Inicializar amigos disponibles si es el primer sorteo
    if (amigosDisponibles.length === 0) {
        amigosDisponibles = [...amigos]; // Copia del array original
        amigosSorteados = []; // Reiniciar sorteados
    }
    
    // Verificar si quedan amigos disponibles
    if (amigosDisponibles.length === 0) {
        mostrarModalSinAmigos();
        return;
    }
    
    // Generar índice aleatorio de los amigos disponibles
    const indiceAleatorio = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSorteado = amigosDisponibles[indiceAleatorio];
    
    // Mover el amigo de disponibles a sorteados
    amigosSorteados.push(amigoSorteado);
    amigosDisponibles.splice(indiceAleatorio, 1);
    
    // Mostrar resultado en modal
    mostrarModal(amigoSorteado);
}

function verificarEstadoJuego() {
    const botonSortear = document.querySelector('.button-draw');
    
    // Si no hay amigos disponibles para sortear, inicializar
    if (amigosDisponibles.length === 0 && amigos.length > 0) {
        amigosDisponibles = [...amigos];
    }
    
    // Considerar solo los amigos disponibles (no sorteados) para habilitar el botón
    const amigosParaSortear = amigosDisponibles.length;
    
    if (amigos.length >= 2 && amigosParaSortear > 0) {
        botonSortear.disabled = false;
        botonSortear.style.opacity = '1';
        juegoActivo = true;
        
        // Actualizar texto del botón basado en el estado del juego
        const textoBoton = botonSortear.childNodes[2]; // El texto después de la imagen
        if (amigosSorteados.length > 0) {
            textoBoton.textContent = ` Sortear amigo (${amigosParaSortear} disponibles)`;
        } else {
            textoBoton.textContent = ' Sortear amigo';
        }
    } else {
        botonSortear.disabled = true;
        botonSortear.style.opacity = '0.5';
        juegoActivo = false;
        
        // Restaurar texto original del botón
        const textoBoton = botonSortear.childNodes[2];
        if (textoBoton) {
            textoBoton.textContent = ' Sortear amigo';
        }
    }
}

function mostrarModal(nombreGanador) {
    const modal = document.getElementById('modalResultado');
    const textoResultado = document.getElementById('textoResultado');
    const contadorAmigos = document.getElementById('contadorAmigos');
    const btnCerrar = document.getElementById('btnCerrarModal');
    const btnSortearOtro = document.getElementById('btnSortearOtro');
    
    // Configurar texto del resultado
    textoResultado.innerHTML = `
        <strong style="color: #4B69FD; font-size: 28px;">${nombreGanador}</strong><br>
        <span style="color: #333;">es tu amigo secreto</span>
    `;
    
    // Configurar contador de amigos
    const restantes = amigosDisponibles.length;
    const total = amigos.length;
    contadorAmigos.innerHTML = `
        <div class="contador-stats">
            <div class="stat-item stat-sorteados">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <div class="stat-number">${amigosSorteados.length}</div>
                    <div class="stat-label">de ${total} sorteados</div>
                </div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item stat-restantes">
                <div class="stat-icon">🎲</div>
                <div class="stat-content">
                    <div class="stat-number">${restantes}</div>
                    <div class="stat-label">disponibles</div>
                </div>
            </div>
        </div>
    `;
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Configurar visibilidad del botón "Sortear Otro"
    if (restantes > 0) {
        btnSortearOtro.style.display = 'inline-block';
        btnSortearOtro.innerHTML = `� Volver a sortear (${restantes} amigos disponibles)`;
    } else {
        btnSortearOtro.style.display = 'none';
    }
    
    // Agregar confetti
    crearConfetti();
    
    // Configurar eventos de botones
    btnCerrar.onclick = function() {
        cerrarModalYReiniciar();
    };
    
    btnSortearOtro.onclick = function() {
        cerrarModalSinReiniciar();
        // Actualizar la interfaz para mostrar amigos sorteados
        actualizarListaAmigos();
        // Actualizar el estado del botón de sortear
        verificarEstadoJuego();
        // Actualizar estado del juego
        actualizarEstadoJuego();
        // Mostrar mensaje informativo
        mostrarMensajeTemporal(`${nombreGanador} ya fue sorteado. Puedes agregar más amigos o sortear de nuevo.`, 'exito');
    };
    
    // Cerrar con clic fuera del modal
    window.onclick = function(event) {
        if (event.target === modal) {
            // No cerrar automáticamente, el usuario debe elegir una opción
        }
    };
}

function crearConfetti() {
    const modalBody = document.querySelector('.modal-body');
    
    // Crear múltiples elementos de confetti
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.backgroundColor = getRandomColor();
        modalBody.appendChild(confetti);
        
        // Remover después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function getRandomColor() {
    const colores = ['#4B69FD', '#fe652b', '#2ed573', '#ff4757', '#ffa502'];
    return colores[Math.floor(Math.random() * colores.length)];
}

function cerrarModalYReiniciar() {
    const modal = document.getElementById('modalResultado');
    
    // Ocultar modal
    modal.style.display = 'none';
    
    // Reiniciar juego
    reiniciarJuego();
    
    // Forzar actualización del estado después del reinicio
    setTimeout(() => {
        actualizarEstadoJuego();
    }, 100);
}

function cerrarModalSinReiniciar() {
    const modal = document.getElementById('modalResultado');
    modal.style.display = 'none';
}

function mostrarModalSinAmigos() {
    const modal = document.getElementById('modalSinAmigos');
    const listaSorteados = document.getElementById('listaSorteados');
    const btnAgregarMas = document.getElementById('btnAgregarMas');
    const btnReiniciarJuego = document.getElementById('btnReiniciarJuego');
    
    // Llenar la lista de amigos sorteados
    listaSorteados.innerHTML = '';
    amigosSorteados.forEach((amigo, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${amigo}`;
        listaSorteados.appendChild(li);
    });
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Configurar eventos de botones
    btnAgregarMas.onclick = function() {
        cerrarModalSinAmigos();
        // NO restaurar amigos disponibles aquí - mantener el estado actual
        // Los nuevos amigos se agregarán a disponibles automáticamente
        mostrarMensajeTemporal('¡Puedes agregar más amigos y continuar sorteando!', 'exito');
    };
    
    btnReiniciarJuego.onclick = function() {
        cerrarModalSinAmigos();
        reiniciarJuego();
    };
    
    // Cerrar con clic fuera del modal
    modal.onclick = function(event) {
        if (event.target === modal) {
            // No cerrar automáticamente
        }
    };
}

function cerrarModalSinAmigos() {
    const modal = document.getElementById('modalSinAmigos');
    modal.style.display = 'none';
}

function reiniciarJuego() {
    // Limpiar todos los arrays
    amigos = [];
    amigosSorteados = [];
    amigosDisponibles = [];
    juegoActivo = false;
    
    // Limpiar input
    document.getElementById('amigo').value = '';
    
    // Limpiar interfaz
    actualizarListaAmigos();
    
    // Deshabilitar botón sortear
    verificarEstadoJuego();
    
    // Actualizar título y estado
    actualizarTituloJuego();
    
    // Mostrar mensaje de reinicio
    mostrarMensajeTemporal('¡Juego reiniciado! Agrega nuevos amigos para jugar', 'exito');
}

function actualizarTituloJuego() {
    // El título principal nunca cambia
    const titulo = document.querySelector('.section-title');
    titulo.textContent = 'Digite el nombre de sus amigos';
    titulo.style.color = 'var(--color-primary)';
    
    // Actualizar el estado del juego por separado siempre
    actualizarEstadoJuego();
}

function actualizarEstadoJuego() {
    const estadoJuego = document.getElementById('estadoJuego');
    
    // Debug: verificar que el elemento existe
    if (!estadoJuego) {
        console.error('Elemento estadoJuego no encontrado');
        return;
    }
    
    if (amigos.length === 0) {
        // No hay amigos agregados
        estadoJuego.textContent = '';
        estadoJuego.className = 'estado-juego';
        estadoJuego.style.opacity = '0';
    } else if (amigosSorteados.length === 0) {
        // Hay amigos pero no se ha sorteado ninguno (estado inicial o después de reinicio)
        estadoJuego.innerHTML = `📋&nbsp;<strong>${amigos.length}</strong>&nbsp;${amigos.length > 1 ? 'amigos' : 'amigo'}&nbsp;${amigos.length > 1 ? 'agregados' : 'agregado'}&nbsp;-&nbsp;¡Listos para sortear!`;
        estadoJuego.className = 'estado-juego estado-inicial visible';
        // Forzar visibilidad
        estadoJuego.style.opacity = '1';
    } else if (amigosDisponibles.length > 0) {
        // Hay sorteos en progreso
        const restantes = amigosDisponibles.length;
        estadoJuego.innerHTML = `
            🎯 <strong>Total:</strong> ${amigos.length} | 
            ✅ <strong>Sorteados:</strong> ${amigosSorteados.length} | 
            🎲 <strong>Disponibles:</strong> ${restantes}
        `;
        estadoJuego.className = 'estado-juego estado-progreso visible';
        estadoJuego.style.opacity = '1';
    } else {
        // Todos los amigos han sido sorteados
        estadoJuego.innerHTML = `🎉 <strong>¡Completo!</strong> Todos los ${amigos.length} amigos han sido sorteados`;
        estadoJuego.className = 'estado-juego estado-completo visible';
        estadoJuego.style.opacity = '1';
    }
}

function actualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    
    amigos.forEach((amigo, index) => {
        const li = document.createElement('li');
        const fueSorteado = amigosSorteados.includes(amigo);
        
        // Aplicar clase CSS según el estado del amigo
        if (fueSorteado) {
            li.className = 'nombre-item nombre-item-sorteado';
        } else {
            li.className = 'nombre-item';
        }
        
        li.innerHTML = `
            <span class="nombre-texto">
                ${index + 1}. ${amigo}
                ${fueSorteado ? '<span class="etiqueta-sorteado">✓ Sorteado</span>' : ''}
            </span>
            <button class="btn-eliminar" onclick="eliminarAmigo(${index})" title="Eliminar ${amigo}" ${fueSorteado ? 'disabled' : ''}>
                ✕
            </button>
        `;
        lista.appendChild(li);
    });
    
    // Actualizar título con contador
    actualizarTituloJuego();
}

function eliminarAmigo(index) {
    const amigo = amigos[index];
    
    // Verificar si el amigo ya fue sorteado
    if (amigosSorteados.includes(amigo)) {
        mostrarMensajeTemporal('No puedes eliminar un amigo que ya fue sorteado', 'error');
        return;
    }
    
    mostrarModalEliminar(index);
}

function mostrarModalEliminar(index) {
    const modal = document.getElementById('modalEliminar');
    const nombreEliminar = document.getElementById('nombreEliminar');
    const btnCancelar = document.getElementById('btnCancelarEliminar');
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');
    
    // Configurar el nombre del amigo a eliminar
    nombreEliminar.textContent = amigos[index];
    
    // Mostrar el modal
    modal.style.display = 'block';
    
    // Configurar eventos de los botones
    btnCancelar.onclick = function() {
        cerrarModalEliminar();
    };
    
    btnConfirmar.onclick = function() {
        confirmarEliminacion(index);
    };
    
    // Cerrar modal con clic fuera (solo en el fondo)
    modal.onclick = function(event) {
        if (event.target === modal) {
            cerrarModalEliminar();
        }
    };
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModalEliminar();
        }
    }, { once: true });
}

function cerrarModalEliminar() {
    const modal = document.getElementById('modalEliminar');
    modal.style.display = 'none';
}

function confirmarEliminacion(index) {
    const nombreEliminado = amigos[index];
    
    // Eliminar del array principal
    amigos.splice(index, 1);
    
    // Eliminar también de amigos disponibles si está ahí
    const indexDisponible = amigosDisponibles.indexOf(nombreEliminado);
    if (indexDisponible !== -1) {
        amigosDisponibles.splice(indexDisponible, 1);
    }
    
    // Si el amigo eliminado estaba en sorteados, también eliminarlo de ahí
    const indexSorteado = amigosSorteados.indexOf(nombreEliminado);
    if (indexSorteado !== -1) {
        amigosSorteados.splice(indexSorteado, 1);
    }
    
    // Actualizar interfaz
    actualizarListaAmigos();
    verificarEstadoJuego();
    
    // Cerrar modal
    cerrarModalEliminar();
    
    // Mostrar mensaje de confirmación
    mostrarMensajeTemporal(`${nombreEliminado} eliminado correctamente`, 'exito');
}