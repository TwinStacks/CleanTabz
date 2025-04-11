document.addEventListener('DOMContentLoaded', () => {
  const timeInput = document.getElementById('timeInput');
  const timeUnit = document.getElementById('timeUnit');
  const presetSelect = document.getElementById('presetSelect');
  const applyBtn = document.getElementById('applyBtn');
  const countdown = document.getElementById('countdown');
  const nextCheck = document.getElementById('nextCheck');

  // Load saved settings
  chrome.storage.local.get(['checkInterval', 'nextCheckTime'], (result) => {
    if (result.checkInterval) {
      timeInput.value = result.checkInterval.value;
      timeUnit.value = result.checkInterval.unit;
      updateCountdown(result.nextCheckTime);
    }
  });

  // Handle preset selection
  presetSelect.addEventListener('change', () => {
    timeInput.value = presetSelect.value;
    timeUnit.value = 'minutes';
  });

  // Apply button click handler
  applyBtn.addEventListener('click', () => {
    const value = parseInt(timeInput.value);
    const unit = timeUnit.value;
    
    if (isNaN(value) || value <= 0) {
      alert('Vui lòng nhập thời gian hợp lệ');
      return;
    }

    const checkInterval = {
      value,
      unit
    };

    // Calculate next check time
    const now = Date.now();
    const intervalMs = unit === 'minutes' ? value * 60 * 1000 : value * 60 * 60 * 1000;
    const nextCheckTime = now + intervalMs;

    // Save settings
    chrome.storage.local.set({
      checkInterval,
      nextCheckTime
    }, () => {
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'START_CHECK',
        checkInterval,
        nextCheckTime
      });

      updateCountdown(nextCheckTime);
    });
  });

  function updateCountdown(nextCheckTime) {
    if (!nextCheckTime) return;

    countdown.classList.remove('hidden');
    updateNextCheckText();

    // Update countdown every second
    setInterval(updateNextCheckText, 1000);
  }

  function updateNextCheckText() {
    const now = Date.now();
    const timeLeft = nextCheckTime - now;

    if (timeLeft <= 0) {
      nextCheck.textContent = 'Đang kiểm tra...';
      return;
    }

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

    nextCheck.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
}); 