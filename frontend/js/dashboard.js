import { mockUser, mockLeaderboard, mockDailyChallenge } from './mock-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check Auth
  const currentUser = { name: "Guest User", email: "guest@example.com" }; // Mock user since login is removed
  
  const userGreeting = document.getElementById('user-greeting');
  if (userGreeting) {
    userGreeting.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
  }
  
  // Render Dashboard
  renderWelcomeBanner();
  renderStats();
  renderLeaderboard();
  renderDailyChallenge();
  
  // Init Canvas Charts
  initLineChart();
  initRadarChart();
  
  // -- Render Functions --
  
  function renderWelcomeBanner() {
    document.getElementById('user-name').textContent = mockUser.name;
    document.getElementById('user-streak').textContent = mockUser.streak;
  }
  
  function renderStats() {
    // Total Sessions
    document.getElementById('stat-sessions').textContent = mockUser.stats.totalSessions;
    // Avg Score
    document.getElementById('stat-score').textContent = mockUser.stats.avgScore;
    document.getElementById('stat-score-change').textContent = mockUser.stats.recentScoreChange;
    // Questions Solved
    document.getElementById('stat-solved').textContent = mockUser.stats.questionsSolved;
    document.getElementById('stat-solved-change').textContent = mockUser.stats.recentSolvedChange;
    // Hours
    document.getElementById('stat-hours').textContent = mockUser.stats.hoursPracticed;
    document.getElementById('stat-hours-change').textContent = mockUser.stats.recentHoursChange;
  }
  
  function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    
    const html = mockLeaderboard.slice(0, 5).map(entry => {
      let rankClass = '';
      if (entry.rank === 1) rankClass = 'rank-gold';
      else if (entry.rank === 2) rankClass = 'rank-silver';
      else if (entry.rank === 3) rankClass = 'rank-bronze';
      
      return `
        <tr class="${rankClass} ${entry.isCurrentUser ? 'highlight' : ''}">
          <td class="font-bold">#${entry.rank}</td>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar avatar-sm"><i data-lucide="user"></i></div>
              ${entry.name} ${entry.isCurrentUser ? '<span class="badge badge-primary ml-2">You</span>' : ''}
            </div>
          </td>
          <td class="font-bold">${entry.score.toLocaleString()}</td>
          <td>${entry.sessions}</td>
          <td class="text-right">
          <span class="badge ${entry.streak > 10 ? 'badge-error' : 'badge-primary'}">
            <i data-lucide="flame" style="width: 14px; height: 14px; margin-right: 4px;"></i> ${entry.streak}
          </span>
        </td>
        </tr>
      `;
    }).join('');
    
    tbody.innerHTML = html;
    window.lucide.createIcons();
  }
  
  function renderDailyChallenge() {
    const container = document.getElementById('daily-challenge');
    if (!container) return;
    
    const h = Math.floor(mockDailyChallenge.timeRemainingMs / (1000 * 60 * 60));
    const m = Math.floor((mockDailyChallenge.timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    container.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="badge badge-primary mb-2">Daily Challenge</span>
          <h3 class="text-xl mb-1">${mockDailyChallenge.title}</h3>
          <p class="text-sm text-secondary">${mockDailyChallenge.category}</p>
        </div>
        <div class="text-right">
          <div class="timer text-sm mb-1">${h}h ${m}m remaining</div>
          <p class="text-xs text-muted">+${mockDailyChallenge.points} XP</p>
        </div>
      </div>
      
      <div class="flex justify-between items-center mt-6">
        <div class="text-xs text-secondary">
          <span class="font-bold text-primary">${mockDailyChallenge.completedBy.toLocaleString()}</span> already completed
        </div>
        <a href="coding-round.html?id=${mockDailyChallenge.questionId}" class="btn btn-primary btn-sm">Start Challenge</a>
      </div>
    `;
    window.refreshIcons();
  }
  
  // -- Charting Functions (Vanilla JS Canvas) --
  
  function initLineChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set internal resolution
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    
    const data = mockUser.progressData;
    const maxScore = 100;
    
    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(100 - (i * 20), padding.left - 10, y);
    }
    
    // X labels
    const stepX = chartW / (data.labels.length - 1);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.labels.forEach((label, i) => {
      const x = padding.left + i * stepX;
      ctx.fillText(label, x, height - padding.bottom + 10);
    });
    
    // Draw Technical Line (Primary Accent)
    drawLine(ctx, data.technicalScores, '#6366f1', stepX, padding, chartH, maxScore, true);
    
    // Draw Behavioral Line (Cyan)
    drawLine(ctx, data.behavioralScores, '#06b6d4', stepX, padding, chartH, maxScore, false);
  }
  
  function drawLine(ctx, dataArr, color, stepX, padding, chartH, maxScore, fill) {
    ctx.beginPath();
    
    dataArr.forEach((score, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (score / maxScore) * chartH;
      
      if (i === 0) ctx.moveTo(x, y);
      else {
        // Curve
        const prevX = padding.left + (i - 1) * stepX;
        const prevY = padding.top + chartH - (dataArr[i - 1] / maxScore) * chartH;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Gradient Fill
    if (fill) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, `${color}40`); // 25% opacity
      gradient.addColorStop(1, 'transparent');
      
      ctx.lineTo(padding.left + (dataArr.length - 1) * stepX, padding.top + chartH);
      ctx.lineTo(padding.left, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Draw Points
    dataArr.forEach((score, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + chartH - (score / maxScore) * chartH;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0e1a'; // bg-primary
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  }
  
  function initRadarChart() {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight / 2;
    const radius = Math.min(cx, cy) - 30; // 30px padding
    
    const data = mockUser.skills;
    const numPoints = data.length;
    const angleStep = (Math.PI * 2) / numPoints;
    
    // Draw Web (Background)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let level = 1; level <= 4; level++) {
      const r = (radius / 4) * level;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw Axes & Labels
    ctx.font = '11px Inter';
    ctx.fillStyle = '#9ca3af'; // text-secondary
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      // Axis
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
      
      // Label
      const labelRadius = radius + 20;
      const lx = cx + Math.cos(angle) * labelRadius;
      const ly = cy + Math.sin(angle) * labelRadius;
      ctx.fillText(data[i].name, lx, ly);
    }
    
    // Draw Data Polygon
    ctx.beginPath();
    data.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (skill.value / 100) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    
    // Style Data
    ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'; // accent-primary with opacity
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#6366f1';
    ctx.stroke();
    
    // Data Points
    data.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (skill.value / 100) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    });
  }
});
