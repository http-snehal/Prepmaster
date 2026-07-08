document.addEventListener('DOMContentLoaded', () => {
  const localVideo = document.getElementById('local-video');
  const toggleVideoBtn = document.getElementById('toggle-video');
  const toggleAudioBtn = document.getElementById('toggle-audio');
  const endCallBtn = document.getElementById('end-call');
  const connectBtn = document.getElementById('connect-btn');
  const waitingOverlay = document.getElementById('waiting-overlay');
  
  let localStream = null;
  let isVideoOn = true;
  let isAudioOn = true;
  let isConnected = false;
  
  // Initialize camera
  async function initCamera() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;
    } catch (err) {
      console.error("Error accessing media devices.", err);
      window.showToast("Could not access camera or microphone.", "error");
      
      // Setup mock video for demo purposes if real camera fails
      localVideo.parentElement.innerHTML = `
        <div class="flex items-center justify-center h-full w-full bg-tertiary">
          <div class="text-center text-secondary">
            <div class="mb-2 text-3xl"><i data-lucide="camera" style="width:1em;height:1em;vertical-align:middle;"></i></div>
            <p>Camera not available<br>(Demo Mode)</p>
          </div>
        </div>
      `;
    }
  }
  
  // Toggle Video
  toggleVideoBtn.addEventListener('click', () => {
    isVideoOn = !isVideoOn;
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
    }
    
    if (isVideoOn) {
      toggleVideoBtn.classList.remove('btn-danger');
      toggleVideoBtn.classList.add('btn-secondary');
      toggleVideoBtn.innerHTML = '<span class="icon"><i data-lucide="camera" style="width:1em;height:1em;vertical-align:middle;"></i></span> Stop Video';
    } else {
      toggleVideoBtn.classList.remove('btn-secondary');
      toggleVideoBtn.classList.add('btn-danger');
      toggleVideoBtn.innerHTML = '<span class="icon"><i data-lucide="camera-off" style="width:1em;height:1em;vertical-align:middle;"></i></span> Start Video';
    }
  });
  
  // Toggle Audio
  toggleAudioBtn.addEventListener('click', () => {
    isAudioOn = !isAudioOn;
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = isAudioOn);
    }
    
    if (isAudioOn) {
      toggleAudioBtn.classList.remove('btn-danger');
      toggleAudioBtn.classList.add('btn-secondary');
      toggleAudioBtn.innerHTML = '<span class="icon"><i data-lucide="mic" style="width:1em;height:1em;vertical-align:middle;"></i></span> Mute';
    } else {
      toggleAudioBtn.classList.remove('btn-secondary');
      toggleAudioBtn.classList.add('btn-danger');
      toggleAudioBtn.innerHTML = '<span class="icon"><i data-lucide="mic-off" style="width:1em;height:1em;vertical-align:middle;"></i></span> Unmute';
    }
  });
  
  // Connect to Peer (Mock)
  connectBtn.addEventListener('click', () => {
    connectBtn.innerHTML = '<div class="spinner spinner-sm" style="border-top-color: white;"></div>';
    connectBtn.disabled = true;
    
    // Simulate finding a peer
    setTimeout(() => {
      isConnected = true;
      waitingOverlay.classList.add('hidden');
      window.showToast("Connected with peer: Alex M.", "success");
      
      // Setup mock chat/events
      setTimeout(() => {
        addChatMessage("Alex M.", "Hi! Are you ready to start? Do you want to go first or should I?");
      }, 2000);
      
    }, 3000);
  });
  
  // End Call
  endCallBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to end the session?")) {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      window.location.href = 'dashboard.html';
    }
  });
  
  // Chat functionality
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      addChatMessage("You", text, true);
      chatInput.value = '';
      
      // Mock peer response
      if (isConnected) {
        setTimeout(() => {
          addChatMessage("Alex M.", "Sounds good. Let's start with a behavioral question. Tell me about a time you had to deal with a difficult teammate.");
        }, 3000);
      }
    }
  });
  
  function addChatMessage(sender, text, isSelf = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `mb-4 ${isSelf ? 'text-right' : ''}`;
    
    msgDiv.innerHTML = `
      <div class="text-xs text-secondary mb-1">${sender}</div>
      <div class="inline-block p-3 rounded-lg text-sm ${isSelf ? 'bg-primary text-white' : 'bg-tertiary'}" style="max-width: 85%; text-align: left;">
        ${text}
      </div>
    `;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Start Camera
  initCamera();
});
