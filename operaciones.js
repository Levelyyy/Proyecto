//Agregar una nueva columna a la tabla esa
const boton1=document.getElementById('agregar');
    const tabla=document.getElementById('tablitaa').getElementsByTagName('tbody')[0];
    boton1.addEventListener("click", function(e){
        const nueva_fila=tabla.insertRow();        
        nueva_fila.classList.add('tere');
        const inpu=document.createElement('input');
        const inpu2=document.createElement('input');
        const celda1 = nueva_fila.insertCell(0);
        const celda2 = nueva_fila.insertCell(1);
        const celda3 = nueva_fila.insertCell(2);
        const celda4 = nueva_fila.insertCell(3);    
         
        celda1.classList.add('columnas');
        celda2.classList.add('columnas');
        celda3.classList.add('columnas');
        celda4.classList.add('columnas');
        inpu.type='number';
        inpu2.type='number';
        inpu.placeholder="F";
        inpu.classList.add('inp');
        inpu2.placeholder="A";
        inpu2.classList.add('inp');
        celda1.appendChild(inpu);
        celda2.appendChild(inpu2);  
        setTimeout(() => {
            celda1.classList.add('col_nueva');
            celda2.classList.add('col_nueva');
            celda3.classList.add('col_nueva');
            celda4.classList.add('col_nueva');
        },0);      

    })
    //OPERACIONES
     
const botonCalcular = document.getElementById('btn_calcular');
const tablaCuerpo = document.getElementById('tablitaa').getElementsByTagName('tbody')[0];

botonCalcular.addEventListener('click', function() {
    let sumFx = 0;  
    let sumFy = 0;  

    
    const filas = tablaCuerpo.getElementsByClassName('tere');
    
    for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const fuerzaInput = fila.cells[0].getElementsByTagName('input')[0];
        const anguloInput = fila.cells[1].getElementsByTagName('input')[0];
        fila.classList.add("col_nueva");
    
        const fuerza = parseFloat(fuerzaInput.value);
        const angulo = parseFloat(anguloInput.value);
        
        if (!isNaN(fuerza) && !isNaN(angulo)) {
            
            const anguloRadianes = angulo * (Math.PI / 180);

            
            const Fx = fuerza * Math.cos(anguloRadianes);
            const Fy = fuerza * Math.sin(anguloRadianes);

            
            sumFx += Fx;
            sumFy += Fy;
            fila.cells[2].innerHTML = Fx.toFixed(2);  // Componente X
            
            fila.cells[3].innerHTML = Fy.toFixed(2);  // Componente Y
        }
    }

    
    const resultante = Math.sqrt((sumFx * sumFx) + (sumFy * sumFy));
    const anguloResultante = Math.atan2(sumFy, sumFx) * (180 / Math.PI);
    

    
    const resultado = `
        <div class='resultadito'">
            La resultante total es: ${resultante.toFixed(2)} N<br>
            El ángulo es: ${anguloResultante.toFixed(2)} °
        </div>
        <br>
    `;

    
    document.getElementById("resultado").innerHTML = resultado;

     
    dibujarVectores(sumFx, sumFy, 150, 150, resultante, anguloResultante);
});

function dibujarVectores(sumFx, sumFy, canvasX, canvasY, resultante, anguloResultante) {
    const canvas = document.getElementById("canva");
    const ctx = canvas.getContext("2d");

    //limpiar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    
    const filas = document.getElementById('tablitaa').getElementsByTagName('tbody')[0].getElementsByClassName('tere');
    
    let vectorsito = 1;  
    
    // recorrer cada filp
    Array.from(filas).forEach(fila => {
        const fuerzaInput = fila.cells[0].getElementsByTagName('input')[0];
        const anguloInput = fila.cells[1].getElementsByTagName('input')[0];
        
        const fuerza = parseFloat(fuerzaInput.value);
        const angulo = parseFloat(anguloInput.value);
        
        if (!isNaN(fuerza) && !isNaN(angulo)) {
            
            const anguloRadianes = angulo * (Math.PI / 180);
            
            
            const Fx = fuerza * Math.cos(anguloRadianes);
            const Fy = fuerza * Math.sin(anguloRadianes);
            
            
            let color = 'red';  
            if (vectorsito === 2) color = 'green';
            else if (vectorsito === 3) color = 'blue';
            
            
            
            const startX = canvas.width / 2;
            const startY = canvas.height / 2;
            
            
            

            const { x: vectorX, y: vectorY } = polarACartesiano(fuerza, angulo);
            
            // vector
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + vectorX, startY - vectorY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // vector
            ctx.fillStyle = color;
            ctx.font = '14px Arial';
            ctx.fillText(`F${vectorsito}: |${fuerza}| N`, startX + vectorX + 5, startY - vectorY);

        
            ctx.fillText(`${angulo}°`, startX + vectorX / 2, startY - vectorY / 2);
            
            vectorsito++;  
        }
    });    
    
    if (resultante && anguloResultante) {
        //console.log("si entro");
        const { x: resultanteX, y: resultanteY } = polarACartesiano(resultante, anguloResultante);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + resultanteX, canvas.height / 2 - resultanteY);
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 3;
        ctx.stroke();

        
        
        ctx.fillStyle = 'purple';
        ctx.fillText(`Resultante: |${resultante}| N`, canvas.width / 2 + resultanteX + 5, canvas.height / 2 - resultanteY);
        ctx.fillText(`${anguloResultante.toFixed(2)}°`, canvas.width / 2 + resultanteX / 2, canvas.height / 2 - resultanteY / 2);
    }
    function polarACartesiano(magnitud, angulo) {
        const radian = angulo * Math.PI / 180; 
        return {
            x: magnitud * Math.cos(radian) * 4,  
            y: magnitud * Math.sin(radian) * 4   
        };
    }
}







