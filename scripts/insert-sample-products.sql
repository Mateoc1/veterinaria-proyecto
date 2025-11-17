-- Insertar productos de ejemplo para la tienda
INSERT INTO productos (nombre, precio, stock, url_imagen) VALUES
('Alimento para perros Premium', 3500.00, 50, '/img/alimento-perros.jpg'),
('Juguete para gato con plumas', 1200.00, 30, '/img/juguete-gato.jpg'),
('Shampoo para mascotas hipoalergénico', 2500.00, 25, '/img/shampoo-mascotas.jpg'),
('Collar antipulgas para perros', 1800.00, 40, '/img/collar-antipulgas.jpg'),
('Cama para mascotas pequeñas', 4500.00, 15, '/img/cama-mascotas.jpg'),
('Transportadora para gatos', 8900.00, 10, '/img/transportadora.jpg'),
('Vitaminas para perros', 3200.00, 35, '/img/vitaminas-perros.jpg'),
('Correa extensible para paseos', 2100.00, 20, '/img/correa-extensible.jpg');

-- Verificar que se insertaron correctamente
SELECT * FROM productos;