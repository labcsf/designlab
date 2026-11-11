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
        document.getElementById(targetTab).classList.add('active');
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

  if (kerningSlider) {
    const TARGET_KERNING = 0;

    kerningSlider.addEventListener('input', (e) => {
      movableLetter.style.transform = `translateX(${e.target.value}px)`;
    });

    btnCheckKerning.addEventListener('click', () => {
      const currentValue = parseInt(kerningSlider.value);
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

  if (hueSlider) {
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
    btnNewColor.addEventListener('click', generateNewTargetColor);

    btnCheckColor.addEventListener('click', () => {
      const userHue = parseInt(hueSlider.value);
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

    btnResetBezier.addEventListener('click', () => {
      userP1 = { x: 150, y: 200 };
      userP2 = { x: 450, y: 200 };
      bezierScore.textContent = 'Esperando trazo...';
      bezierScore.style.color = '#10b981';
      drawCanvas();
    });

    btnCheckBezier.addEventListener('click', () => {
      const d1 = Math.hypot(userP1.x - targetP1.x, userP1.y - targetP1.y);
      const d2 = Math.hypot(userP2.x - targetP2.x, userP2.y - targetP2.y);
      let accuracy = Math.max(0, Math.round(100 - ((d1 + d2) / 4)));

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
    });

    drawCanvas();
  }
});