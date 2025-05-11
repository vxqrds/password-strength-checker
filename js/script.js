document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const strengthMeterFill = document.getElementById('strengthMeterFill');
    const strengthText = document.getElementById('strengthText');
    const entropyScore = document.getElementById('entropyScore');
    const varietyScore = document.getElementById('varietyScore');
    const lengthScore = document.getElementById('lengthScore');
    const totalScore = document.getElementById('totalScore');
    const suggestions = document.getElementById('suggestions');
    
    // Requirements elements
    const lengthReq = document.getElementById('lengthReq');
    const uppercaseReq = document.getElementById('uppercaseReq');
    const lowercaseReq = document.getElementById('lowercaseReq');
    const numberReq = document.getElementById('numberReq');
    const specialReq = document.getElementById('specialReq');
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🔒';
    });
    
    // Check password strength on input
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    function checkPasswordStrength() {
      const password = passwordInput.value;
      
      // Basic requirements checks
      const hasLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      
      // Update requirement indicators
      updateRequirement(lengthReq, hasLength);
      updateRequirement(uppercaseReq, hasUppercase);
      updateRequirement(lowercaseReq, hasLowercase);
      updateRequirement(numberReq, hasNumber);
      updateRequirement(specialReq, hasSpecial);
      
      // Calculate scores
      const entropyValue = calculateEntropy(password);
      const varietyValue = calculateVarietyScore(hasUppercase, hasLowercase, hasNumber, hasSpecial);
      const lengthValue = calculateLengthScore(password.length);
      
      // Calculate total score (weighted sum)
      const total = Math.min(100, Math.floor(
        (entropyValue * 0.5) + 
        (varietyValue * 3) + 
        (lengthValue * 0.5)
      ));
      
      // Update score displays with animation
      animateScoreChange(entropyScore, entropyValue);
      animateScoreChange(varietyScore, varietyValue);
      animateScoreChange(lengthScore, lengthValue);
      animateScoreChange(totalScore, total);
      
      // Update strength meter
      let strengthClass = '';
      let strengthLabel = '';
      let fillWidth = '0%';
      
      if (password.length === 0) {
        strengthClass = '';
        strengthLabel = '';
        fillWidth = '0%';
      } else if (total < 20) {
        strengthClass = 'strength-very-weak';
        strengthLabel = 'Very Weak';
        fillWidth = '20%';
      } else if (total < 40) {
        strengthClass = 'strength-weak';
        strengthLabel = 'Weak';
        fillWidth = '40%';
      } else if (total < 60) {
        strengthClass = 'strength-medium';
        strengthLabel = 'Medium';
        fillWidth = '60%';
      } else if (total < 80) {
        strengthClass = 'strength-strong';
        strengthLabel = 'Strong';
        fillWidth = '80%';
      } else {
        strengthClass = 'strength-very-strong';
        strengthLabel = 'Very Strong';
        fillWidth = '100%';
      }
      
      // Update meter style
      strengthMeterFill.className = 'strength-meter-fill ' + strengthClass;
      strengthMeterFill.style.width = fillWidth;
      
      // Update strength text
      strengthText.textContent = strengthLabel ? `Password Strength: ${strengthLabel}` : '';
      strengthText.className = 'strength-text text-' + strengthClass.replace('strength-', '');
      
      // Generate suggestions
      generateSuggestions(password, hasUppercase, hasLowercase, hasNumber, hasSpecial);
    }
    
    function updateRequirement(element, isValid) {
  if (isValid) {
    element.textContent = '✅ ' + element.dataset.label;
    element.style.color = 'green';
  } else {
    element.textContent = '❌ ' + element.dataset.label;
    element.style.color = 'red';
  }
}
    
    function calculateEntropy(password) {
      if (password.length === 0) return 0;
      
      // Calculate character set size
      let charSetSize = 0;
      if (/[a-z]/.test(password)) charSetSize += 26;
      if (/[A-Z]/.test(password)) charSetSize += 26;
      if (/[0-9]/.test(password)) charSetSize += 10;
      if (/[^A-Za-z0-9]/.test(password)) charSetSize += 33;
      
      // If no character set is detected, assume at least one
      charSetSize = Math.max(charSetSize, 1);
      
      // Calculate entropy bits: log2(charSetSize^length)
      const entropyBits = Math.log2(Math.pow(charSetSize, password.length));
      
      // Scale entropy to a 0-20 score
      return Math.min(20, Math.floor(entropyBits / 3));
    }
    
    function calculateVarietyScore(hasUppercase, hasLowercase, hasNumber, hasSpecial) {
      return (hasUppercase ? 5 : 0) + 
             (hasLowercase ? 5 : 0) + 
             (hasNumber ? 5 : 0) + 
             (hasSpecial ? 5 : 0);
    }
    
    function calculateLengthScore(length) {
      if (length === 0) return 0;
      
      // 1 point per character, max 20 points
      return Math.min(20, length);
    }
    
    function animateScoreChange(element, newValue) {
      const currentValue = parseInt(element.textContent);
      
      if (currentValue !== newValue) {
        element.classList.add('animation-pulse');
        element.textContent = newValue;
        
        setTimeout(() => {
          element.classList.remove('animation-pulse');
        }, 1000);
      }
    }
    
    function generateSuggestions(password, hasUppercase, hasLowercase, hasNumber, hasSpecial) {
      if (password.length === 0) {
        suggestions.textContent = '';
        return;
      }
      
      let suggestionText = '';
      
      // Check for common password patterns
      if (/^[a-z]+$/.test(password) || /^[A-Z]+$/.test(password)) {
        suggestionText = 'Mix uppercase and lowercase letters for a stronger password.';
      } else if (/^[0-9]+$/.test(password)) {
        suggestionText = 'Using only numbers makes your password very weak. Add letters and special characters.';
      } else if (password.length < 8) {
        suggestionText = 'Your password is too short. Try adding more characters.';
      } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        suggestionText = 'Add more variety by including missing character types.';
      } else if (password.length < 12) {
        suggestionText = 'Good start! For even better security, consider a longer password.';
      } else {
        suggestionText = 'Excellent password! It has good length and character variety.';
      }
      
      suggestions.textContent = suggestionText;
    }
    
    // Initial check
    checkPasswordStrength();
  });