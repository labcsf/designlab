document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SISTEMA DE TABS PARA HERRAMIENTAS
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const toolPanels = document.querySelectorAll('.tool-panel');

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        toolPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        const panel = document.getElementById(targetTab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     2. HERRAMIENTA: KERNING
     ========================================================================== */
  const kerningSlider = document.getElementById('kerningSlider');
  const movableLetter = document.getElementById('movableLetter');
  const btnCheckKerning = document.getElementById('btnCheckKerning');
  const kerningScore = document.getElementById('kerningScore');

  if (kerningSlider && movableLetter && btnCheckKerning && kerningScore) {
    const TARGET_KERNING = 0;

    kerningSlider.addEventListener('input', (e) => {
      movableLetter.style.transform = `translateX(${e.target.value}px)`;
    });

    btnCheckKerning.addEventListener('click', () => {
      const currentValue = parseInt(kerningSlider.value, 10);
      const diff = Math.abs(currentValue - TARGET_KERNING);
      let accuracy = Math.max(0, 100 - (diff * 2));

      if (accuracy >= 90) {
        kerningScore.textContent = `¡Excelente! Precisión: ${accuracy}% 🎯`;
        kerningScore.style.color = '#10b981';
      } else if (accuracy >= 70) {
        kerningScore.textContent = `Aceptable. Precisión: ${accuracy}% 👌`;
        kerningScore.style.color = '#f59e0b';
      } else {
        kerningScore.textContent = `Sigue intentándolo. Precisión: ${accuracy}% 📐`;
        kerningScore.style.color = '#ef4444';
      }
    });
  }

  /* ==========================================================================
     3. HERRAMIENTA: COLOR MATCHING
     ========================================================================== */
  const targetColorSwatch = document.getElementById('targetColorSwatch');
  const userColorSwatch = document.getElementById('userColorSwatch');
  const hueSlider = document.getElementById('hueSlider');
  const btnNewColor = document.getElementById('btnNewColor');
  const btnCheckColor = document.getElementById('btnCheckColor');
  const colorScore = document.getElementById('colorScore');

  if (hueSlider && targetColorSwatch && userColorSwatch && btnCheckColor && colorScore) {
    let targetHue = 180;

    function generateNewTargetColor() {
      targetHue = Math.floor(Math.random() * 360);
      targetColorSwatch.style.backgroundColor = `hsl(${targetHue}, 70%, 50%)`;
      colorScore.textContent = 'Esperando prueba...';
      colorScore.style.color = '#10b981';
    }

    function updateUserColor() {
      userColorSwatch.style.backgroundColor = `hsl(${hueSlider.value}, 70%, 50%)`;
    }

    hueSlider.addEventListener('input', updateUserColor);
    if (btnNewColor) btnNewColor.addEventListener('click', generateNewTargetColor);

    btnCheckColor.addEventListener('click', () => {
      const userHue = parseInt(hueSlider.value, 10);
      let diff = Math.abs(userHue - targetHue);
      if (diff > 180) diff = 360 - diff;

      let accuracy = Math.round(100 - (diff / 180) * 100);

      if (accuracy >= 92) {
        colorScore.textContent = `¡Ojo de halcón! Precisión: ${accuracy}% 🎨`;
        colorScore.style.color = '#10b981';
      } else if (accuracy >= 75) {
        colorScore.textContent = `Muy cerca. Precisión: ${accuracy}% 👁️`;
        colorScore.style.color = '#f59e0b';
      } else {
        colorScore.textContent = `Sigue ajustando. Precisión: ${accuracy}% 🖌️`;
        colorScore.style.color = '#ef4444';
      }
    });

    generateNewTargetColor();
    updateUserColor();
  }

  /* ==========================================================================
     4. HERRAMIENTA: CURVA BÉZIER (CANVAS)
     ========================================================================== */
  const canvas = document.getElementById('bezierCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const btnResetBezier = document.getElementById('btnResetBezier');
    const btnCheckBezier = document.getElementById('btnCheckBezier');
    const bezierScore = document.getElementById('bezierScore');

    const p0 = { x: 50, y: 250 };
    const targetP1 = { x: 150, y: 50 };
    const targetP2 = { x: 450, y: 50 };
    const p3 = { x: 550, y: 250 };

    let userP1 = { x: 150, y: 200 };
    let userP2 = { x: 450, y: 200 };
    let activeHandle = null;

    function drawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Guía
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(targetP1.x, targetP1.y, targetP2.x, targetP2.y, p3.x, p3.y);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.setLineDash([]);

      // Líneas de control
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(userP1.x, userP1.y);
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(userP2.x, userP2.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Curva usuario
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(userP1.x, userP1.y, userP2.x, userP2.y, p3.x, p3.y);
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Puntos
      drawHandle(userP1.x, userP1.y, '#f59e0b');
      drawHandle(userP2.x, userP2.y, '#f59e0b');
      drawAnchor(p0.x, p0.y);
      drawAnchor(p3.x, p3.y);
    }

    function drawHandle(x, y, color) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawAnchor(x, y) {
      ctx.beginPath();
      ctx.rect(x - 6, y - 6, 12, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      if (Math.hypot(pos.x - userP1.x, pos.y - userP1.y) < 15) activeHandle = 'p1';
      else if (Math.hypot(pos.x - userP2.x, pos.y - userP2.y) < 15) activeHandle = 'p2';
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!activeHandle) return;
      const pos = getMousePos(e);
      if (activeHandle === 'p1') { userP1.x = pos.x; userP1.y = pos.y; }
      else if (activeHandle === 'p2') { userP2.x = pos.x; userP2.y = pos.y; }
      drawCanvas();
    });

    window.addEventListener('mouseup', () => { activeHandle = null; });

    if (btnResetBezier) {
      btnResetBezier.addEventListener('click', () => {
        userP1 = { x: 150, y: 200 };
        userP2 = { x: 450, y: 200 };
        if (bezierScore) {
          bezierScore.textContent = 'Esperando trazo...';
          bezierScore.style.color = '#10b981';
        }
        drawCanvas();
      });
    }

    if (btnCheckBezier) {
      btnCheckBezier.addEventListener('click', () => {
        const d1 = Math.hypot(userP1.x - targetP1.x, userP1.y - targetP1.y);
        const d2 = Math.hypot(userP2.x - targetP2.x, userP2.y - targetP2.y);
        let accuracy = Math.max(0, Math.round(100 - ((d1 + d2) / 4)));

        if (bezierScore) {
          if (accuracy >= 90) {
            bezierScore.textContent = `¡Trazo maestro! Precisión: ${accuracy}% ✒️`;
            bezierScore.style.color = '#10b981';
          } else if (accuracy >= 70) {
            bezierScore.textContent = `Buen control. Precisión: ${accuracy}% 👍`;
            bezierScore.style.color = '#f59e0b';
          } else {
            bezierScore.textContent = `Ajusta los puntos. Precisión: ${accuracy}% 📐`;
            bezierScore.style.color = '#ef4444';
          }
        }
      });
    }

    drawCanvas();
  }

  /* ==========================================================================
     5. SIMULADOR DE CÁMARA Y TRIÁNGULO DE EXPOSICIÓN
     ========================================================================== */
  const sliderAperture = document.getElementById('sliderAperture');
  const sliderShutter = document.getElementById('sliderShutter');
  const sliderIso = document.getElementById('sliderIso');

  if (sliderAperture && sliderShutter && sliderIso) {
    const apertures = [1.4, 2.8, 5.6, 8, 11, 16];
    const shutters = [2, 30, 125, 250, 1000, 4000];
    const isos = [100, 400, 800, 3200, 6400];

    const lblAperture = document.getElementById('lblAperture');
    const lblShutter = document.getElementById('lblShutter');
    const lblIso = document.getElementById('lblIso');
    const evValue = document.getElementById('evValue');
    
    const simBg = document.getElementById('simBg');
    const simLights = document.getElementById('simLights');
    const simLights2 = document.getElementById('simLights2');
    const simSubject = document.getElementById('simSubject');
    const simNoise = document.getElementById('simNoise');
    const btnCapture = document.getElementById('btnCapture');

    function updateCameraSimulation() {
      const fVal = apertures[sliderAperture.value];
      const sVal = shutters[sliderShutter.value];
      const isoVal = isos[sliderIso.value];

      if (lblAperture) lblAperture.textContent = `f/${fVal}`;
      if (lblShutter) lblShutter.textContent = sVal === 2 ? '1/2 s' : `1/${sVal} s`;
      if (lblIso) lblIso.textContent = `ISO ${isoVal}`;

      const evAperture = Math.log2(Math.pow(2.8 / fVal, 2));
      const evShutter = Math.log2(250 / sVal);
      const evIso = Math.log2(isoVal / 100);
      
      const totalEV = Math.round((evAperture + evShutter + evIso) * 10) / 10;

      const brightness = Math.max(0.1, Math.min(2.5, 1 + totalEV * 0.35));
      if (simBg) simBg.style.filter = `brightness(${brightness})`;
      if (simSubject) simSubject.style.filter = `brightness(${brightness})`;

      const blurAmount = Math.max(0, (16 - fVal) * 1.2);
      if (simLights) simLights.style.filter = `blur(${blurAmount + 4}px)`;
      if (simLights2) simLights2.style.filter = `blur(${blurAmount + 6}px)`;

      const noiseOpacity = (sliderIso.value / 4) * 0.45;
      if (simNoise) simNoise.style.opacity = noiseOpacity;

      if (simSubject) {
        if (sVal <= 30) {
          simSubject.style.transform = 'translateX(-50%) skewX(-20deg) scaleX(1.1)';
          simSubject.style.filter += ' blur(2px)';
        } else {
          simSubject.style.transform = 'translateX(-50%) skewX(0deg) scaleX(1)';
        }
      }

      if (evValue) {
        if (totalEV > 1.5) {
          evValue.textContent = `+${totalEV} EV (Sobreexpuesta ⚠️)`;
          evValue.style.color = '#ef4444';
        } else if (totalEV < -1.5) {
          evValue.textContent = `${totalEV} EV (Subexpuesta 🌑)`;
          evValue.style.color = '#f59e0b';
        } else {
          evValue.textContent = `${totalEV >= 0 ? '+' : ''}${totalEV} EV (Correcta 🎯)`;
          evValue.style.color = '#10b981';
        }
      }
    }

    sliderAperture.addEventListener('input', updateCameraSimulation);
    sliderShutter.addEventListener('input', updateCameraSimulation);
    sliderIso.addEventListener('input', updateCameraSimulation);

    if (btnCapture) {
      btnCapture.addEventListener('click', () => {
        btnCapture.textContent = '📸 ¡Foto Tomada!';
        btnCapture.style.backgroundColor = '#10b981';
        setTimeout(() => {
          btnCapture.textContent = '📸 Capturar Fotografía';
          btnCapture.style.backgroundColor = '';
        }, 1500);
      });
    }

    updateCameraSimulation();
  }

  /* ==========================================================================
     6. CÍRCULO CROMÁTICO INTERACTIVO RYB Y ARMONÍAS
     ========================================================================== */
  const rybColors = [
    { name: 'Rojo', hex: '#ef4444', type: 'Primario' },
    { name: 'Rojo-Naranja', hex: '#ea580c', type: 'Terciario' },
    { name: 'Naranja', hex: '#f97316', type: 'Secundario' },
    { name: 'Amarillo-Naranja', hex: '#f59e0b', type: 'Terciario' },
    { name: 'Amarillo', hex: '#eab308', type: 'Primario' },
    { name: 'Amarillo-Verde', hex: '#84cc16', type: 'Terciario' },
    { name: 'Verde', hex: '#22c55e', type: 'Secundario' },
    { name: 'Azul-Verde', hex: '#14b8a6', type: 'Terciario' },
    { name: 'Azul', hex: '#3b82f6', type: 'Primario' },
    { name: 'Azul-Violeta', hex: '#6366f1', type: 'Terciario' },
    { name: 'Violeta', hex: '#a855f7', type: 'Secundario' },
    { name: 'Rojo-Violeta', hex: '#ec4899', type: 'Terciario' }
  ];

  const wheelSlices = document.querySelectorAll('.wheel-slice');
  const harmonyBtns = document.querySelectorAll('.harmony-btn');

  if (wheelSlices.length > 0) {
    let selectedIndex = 0;
    let currentHarmony = 'complementary';

    // Clics en los botones de modo
    harmonyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        harmonyBtns.forEach(b => {
          b.classList.remove('active', 'btn-primary');
          b.classList.add('btn-secondary');
        });
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-secondary');

        currentHarmony = btn.getAttribute('data-harmony');
        updateHarmonyDisplay();
      });
    });

    // Clics en las rebanadas del círculo cromático
    wheelSlices.forEach(slice => {
      slice.addEventListener('click', () => {
        selectedIndex = parseInt(slice.getAttribute('data-index'), 10);
        updateHarmonyDisplay();
      });
    });

    function getHarmonyIndices(baseIdx, mode) {
      const total = 12;
      switch (mode) {
        case 'complementary':
          return [baseIdx, (baseIdx + 6) % total];
        case 'analogous':
          return [
            (baseIdx - 1 + total) % total,
            baseIdx,
            (baseIdx + 1) % total
          ];
        case 'triadic':
          return [
            baseIdx,
            (baseIdx + 4) % total,
            (baseIdx + 8) % total
          ];
        case 'split':
          return [
            baseIdx,
            (baseIdx + 5) % total,
            (baseIdx + 7) % total
          ];
        default:
          return [baseIdx];
      }
    }

    function updateHarmonyDisplay() {
      const targetIndices = getHarmonyIndices(selectedIndex, currentHarmony);

      // Resaltar u opacar rebanadas del círculo
      wheelSlices.forEach((slice, idx) => {
        if (targetIndices.includes(idx)) {
          slice.style.opacity = '1';
          slice.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,0.6))';
        } else {
          slice.style.opacity = '0.2';
          slice.style.filter = 'none';
        }
      });

      // Actualizar textos y tarjetas
      const title = document.getElementById('harmonyTitle');
      const desc = document.getElementById('harmonyDesc');
      const swatches = document.getElementById('harmonySwatches');

      if (!title || !desc || !swatches) return;

      const baseColor = rybColors[selectedIndex];

      if (currentHarmony === 'complementary') {
        title.textContent = `Complementario de ${baseColor.name}`;
        desc.textContent = 'Genera el máximo contraste óptico e intensidad visual al enfrentar tonos opuestos a 180°.';
      } else if (currentHarmony === 'analogous') {
        title.textContent = `Armonía Análoga de ${baseColor.name}`;
        desc.textContent = 'Combina el color elegido con sus vecinos contiguos. Crea composiciones naturales, serenas y fluidas.';
      } else if (currentHarmony === 'triadic') {
        title.textContent = `Tríada Armónica de ${baseColor.name}`;
        desc.textContent = 'Selecciona tres puntos equidistantes a 120°. Ofrece un fuerte dinamismo manteniendo riqueza cromática.';
      } else if (currentHarmony === 'split') {
        title.textContent = `Complementarios Divididos de ${baseColor.name}`;
        desc.textContent = 'Combina el color base con los dos matices adyacentes a su complementario directo.';
      }

      swatches.innerHTML = '';
      targetIndices.forEach(idx => {
        const item = rybColors[idx];
        const card = document.createElement('div');
        card.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:10px; text-align:center; min-width:90px; flex:1;';

        const colorBox = document.createElement('div');
        colorBox.style.cssText = `height:40px; background:${item.hex}; border-radius:6px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.2);`;

        const nameLabel = document.createElement('strong');
        nameLabel.style.cssText = 'display:block; font-size:0.85rem; color:var(--text-main);';
        nameLabel.textContent = item.name;

        const subLabel = document.createElement('small');
        subLabel.style.cssText = 'display:block; font-size:0.75rem; color:var(--text-muted);';
        subLabel.textContent = `${item.type} (${item.hex})`;

        card.appendChild(colorBox);
        card.appendChild(nameLabel);
        card.appendChild(subLabel);
        swatches.appendChild(card);
      });
    }

    updateHarmonyDisplay();
  }

});