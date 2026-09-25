// palabras.js - Banco de preguntas/palabras para niños de 14 años (8º y 9º Grado)
// Asignaturas: Matemáticas, Ciencias Naturales y Geografía

const BANCO_PALABRAS = [
    // ==========================================
    // --- MATEMÁTICAS ---
    // ==========================================
    { word: "HIPOTENUSA", hint: "Matemáticas: El lado más largo de un triángulo rectángulo, opuesto al ángulo recto." },
    { word: "ECUACION", hint: "Matemáticas: Igualdad matemática que contiene una o más variables o incógnitas." },
    { word: "PERIMETRO", hint: "Matemáticas: La suma de las longitudes de todos los lados de una figura geométrica." },
    { word: "VARIANZA", hint: "Matemáticas: Medida de dispersión estadística que representa la variabilidad de un conjunto de datos." },
    { word: "POLINOMIO", hint: "Matemáticas: Expresión algebraica formada por la suma o resta de varios monomios." },
    { word: "RECTANGULO", hint: "Matemáticas: Paralelogramo con cuatro ángulos rectos de 90 grados." },
    { word: "EXPONENTE", hint: "Matemáticas: Número que indica cuántas veces se debe multiplicar la base por sí misma." },
    { word: "DIAGONAL", hint: "Matemáticas: Segmento que une dos vértices no consecutivos de un polígono." },
    { word: "PROBABILIDAD", hint: "Matemáticas: Cálculo matemático de la posibilidad de que un evento ocurra al azar." },
    { word: "FACTORIZAR", hint: "Matemáticas: Proceso de descomponer una expresión matemática en producto de factores." },
    { word: "PARABOLA", hint: "Matemáticas: Curva abierta formada por los puntos que equidistan de un foco y una directriz." },
    { word: "PENTAGONO", hint: "Matemáticas: Polígono plano regular o irregular que tiene cinco lados." },
    { word: "RADICAL", hint: "Matemáticas: Símbolo matemático usado para indicar la extracción de una raíz." },
    { word: "CILINDRO", hint: "Matemáticas: Cuerpo geométrico formado por una superficie curva y dos bases circulares planas." },
    { word: "ALGEBRA", hint: "Matemáticas: Rama de las matemáticas que utiliza letras para representar números en operaciones." },

    // ==========================================
    // --- CIENCIAS NATURALES ---
    // ==========================================
    { word: "MITOCONDRIA", hint: "Ciencias: Organelo celular encargado de producir la energía (ATP) para la célula." },
    { word: "PHOTOSYNTHESIS", hint: "Ciencias: Proceso mediante el cual las plantas convierten la luz solar en energía química." },
    { word: "ELECTRON", hint: "Ciencias: Partícula subatómica con carga eléctrica negativa que gira alrededor del núcleo." },
    { word: "ECOSISTEMA", hint: "Ciencias: Comunidad de seres vivos interactuando entre sí y con su entorno físico." },
    { word: "GRAVEDAD", hint: "Ciencias: Fuerza invisible que atrae los cuerpos hacia el centro de la Tierra." },
    { word: "ATMOSFERA", hint: "Ciencias: Capa gaseosa que envuelve la Tierra y la protege de la radiación solar." },
    { word: "CROMOSOMA", hint: "Ciencias: Estructura del núcleo celular formada por ADN que contiene la información genética." },
    { word: "ELEMENTO", hint: "Ciencias: Sustancia pura formada por átomos del mismo tipo, listada en la tabla periódica." },
    { word: "EVOLUCION", hint: "Ciencias: Proceso de cambio biológico gradual de las especies a lo largo de las generaciones." },
    { word: "CELULA", hint: "Ciencias: Unidad morfológica y funcional fundamental de todo ser vivo." },
    { word: "PROTEINA", hint: "Ciencias: Macromolécula formada por aminoácidos esencial para la estructura del cuerpo." },
    { word: "MUTACION", hint: "Ciencias: Cambio o alteración en la secuencia del ADN de un organismo." },
    { word: "CONDENSACION", hint: "Ciencias: Cambio de estado de la materia de gas a líquido por enfriamiento." },
    { word: "NEURONA", hint: "Ciencias: Célula especializada del sistema nervioso que transmite impulsos eléctricos." },
    { word: "BIODIVERSIDAD", hint: "Ciencias: Variedad de seres vivos que habitan en un ecosistema o en la Tierra." },

    // ==========================================
    // --- GEOGRAFÍA ---
    // ==========================================
    { word: "CORDILLERA", hint: "Geografía: Gran cadena o sucesión de montañas entrelazadas entre sí." },
    { word: "ECUADOR", hint: "Geografía: Línea imaginaria horizontal que divide la Tierra en Hemisferio Norte y Sur." },
    { word: "MERIDIANO", hint: "Geografía: Semicírculo imaginario vertical que va de polo a polo; el principal es el de Greenwich." },
    { word: "AMAZONAS", hint: "Geografía: El río más largo y caudaloso del mundo, ubicado en América del Sur." },
    { word: "CONTINENTE", hint: "Geografía: Gran extensión de tierra emergida separada por los océanos." },
    { word: "METEOROLOGIA", hint: "Geografía: Ciencia que estudia el estado del tiempo y los fenómenos atmosféricos." },
    { word: "ARCHIPIELAGO", hint: "Geografía: Conjunto o grupo de islas agrupadas en una superficie marina." },
    { word: "ACUIFERO", hint: "Geografía: Capa subterránea de agua acumulada entre rocas y arena." },
    { word: "CARTOGRAFIA", hint: "Geografía: Ciencia y arte encargados de la realización y estudio de los mapas." },
    { word: "MESETA", hint: "Geografía: Planicie extensa situada a una determinada altura sobre el nivel del mar." },
    { word: "PENINSULA", hint: "Geografía: Extensión de tierra rodeada de agua por todas partes excepto por una franja." },
    { word: "VOLCAN", hint: "Geografía: Abertura en la corteza terrestre por donde expulsan magma, cenizas y gases." },
    { word: "POBLACION", hint: "Geografía: Conjunto de habitantes que viven en un lugar o territorio determinado." },
    { word: "TROPICO", hint: "Geografía: Paralelos ubicados al norte (Cáncer) y sur (Capricornio) de la línea del ecuador." },
    { word: "ESTRECHO", hint: "Geografía: Canal de agua estrecho que conecta dos cuerpos de agua más grandes." }
];