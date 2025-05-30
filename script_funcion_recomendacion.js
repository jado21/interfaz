var nombre = localStorage.getItem("nombre_usuario");
var capital = localStorage.getItem("capital_usuario");

console.log(nombre);
console.log(capital);

document.getElementById("nombre_inversor").textContent=nombre;
document.getElementById("capital_inversor").textContent=capital;

fetch("datos_apple.json")
    .then(res => res.json())
    .then(data => {
      new Chart(document.getElementById("graficoApple"), {
        type: "line",
        data: {
          labels: data.fechas,
          datasets: [{
            label: "Precio de Cierre (AAPL)",
            data: data.cierres,
            borderColor: "blue",
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Rendimiento de Apple con yFinance"
            }
          }
        }
      });
    });


    async function main() {
  // Suponiendo que ya cargaste tu JSON con los precios
  const preciosJSON = await fetch("datos_apple.json").then(r => r.json());
  const listaCierre = preciosJSON.cierres;

  // Preparar etiquetas: 1 si sube, 0 si baja o igual
  const etiquetas = [0]; // primer valor no tiene anterior
  for (let i = 0; i < listaCierre.length - 1; i++) {
    const diff = listaCierre[i + 1] - listaCierre[i];
    etiquetas.push(diff > 0 ? 1 : 0);
  }

  // Crear tensores
  const historicoTensor = tf.tensor2d(listaCierre.map(x => [x]));
  const etiquetasTensor = tf.tensor1d(etiquetas, 'int32');

  // Crear modelo SVM-like (simple DNN binary classifier)
  const modelo = tf.sequential();
  modelo.add(tf.layers.dense({units: 10, activation: 'relu', inputShape: [1]}));
  modelo.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // salida binaria

  modelo.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  // Entrenar modelo
  await modelo.fit(historicoTensor, etiquetasTensor, {
    epochs: 50,
    shuffle: true
  });

  // Obtener precio actual (último de la lista)
  const precioActual = listaCierre[listaCierre.length - 1];

  // Hacer predicción
  const prediccion = modelo.predict(tf.tensor2d([[precioActual]]));
  const valor = (await prediccion.data())[0];

  if (valor > 0.5) {
    console.log("Sugerencia: COMPRAR esta acción");
    document.getElementById("respuesta").textContent="Sugerencia: COMPRAR esta acción";
  } else {
    console.log("Sugerencia: No invertir por ahora");
    document.getElementById("respuesta").textContent="Sugerencia: No invertir por ahora";
    
  }

  const pred = await modelo.predict(tf.tensor2d([[precioActual]])).data();
  console.log(`Probabilidad de subida: ${pred[0]}`);

}
main();