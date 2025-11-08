PRAGMA foreign_keys = ON;

CREATE TABLE cliente(
 idusuario INTEGER PRIMARY KEY NOT NULL,
  mail VARCHAR(45) NOT NULL,
  contraseña VARCHAR(20) NOT NULL
);

CREATE TABLE formulario(
  idformulario INTEGER PRIMARY KEY NOT NULL,
  tipo_vivienda VARCHAR(10) NOT NULL,
  espacio_seguro VARCHAR(2) NOT NULL,
  tiempo_solo INTEGER NOT NULL,
  personas_encasa INTEGER NOT NULL,
  familia_deacuerdo VARCHAR(2) NOT NULL,
  otras_mascotas_anteriormente VARCHAR(2) NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  eventos VARCHAR(45) NOT NULL,
  otras_mascotas_actualmente INTEGER NOT NULL,
  tipo_mascotas_actual VARCHAR(45) NOT NULL,
  recursos VARCHAR(2) NOT NULL,
  vacunar_y_esterilizar VARCHAR(2) NOT NULL,
  encargado_cuidado VARCHAR(20) NOT NULL,
  sitio_animal_solo VARCHAR(25) NOT NULL,
  rol_del_animal VARCHAR(25) NOT NULL,
  estado VARCHAR(10) NOT NULL
);

CREATE TABLE productos(
  idproducto INTEGER PRIMARY KEY NOT NULL,
  nombre VARCHAR(45),
  url_imagen TEXT
  stock INTEGER
);

CREATE TABLE compra(
idcompra INTEGER PRIMARY KEY NOT NULL,
producto INTEGER,
unidades INTEGER,
precio INTEGER,
FOREIGN KEY (producto) REFERENCES productos(idproducto)
);

CREATE TABLE animal(
idanimal INTEGER PRIMARY KEY NOT NULL,
nombre VARCHAR(45),
edad INTEGER,
descripcion TEXT,
imagen_m TEXT,
dueño INTEGER,
FOREIGN KEY (dueño) REFERENCES cliente(idusuario)
);

CREATE TABLE turno(
idturno INTEGER PRIMARY KEY NOT NULL,
mascota INTEGER,
motivo TEXT,
fecha TEXT,
estado TEXT NOT NULL,
FOREIGN KEY (mascota) REFERENCES animal(idanimal)
);

CREATE TABLE perfil(
idperfil INTEGER PRIMARY KEY NOT NULL,
nombre TEXT,
mascota INTEGER,
FOREIGN KEY (mascota) REFERENCES animal(idanimal)
);

CREATE TABLE consultas(
idconsulta INTEGER PRIMARY KEY NOT NULL,
nombre INTEGER,
descripcion TEXT,
FOREIGN KEY (nombre) REFERENCES perfil(idperfil)
);

CREATE TABLE historial_medico(
idhistorial INTEGER PRIMARY KEY NOT NULL,
mascota INTEGER,
turnos_pasados TEXT,
vacunas TEXT,
FOREIGN KEY (mascota) REFERENCES animal(idanimal)
);