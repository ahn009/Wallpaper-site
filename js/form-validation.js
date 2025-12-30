document.addEventListener('DOMContentLoaded', function() {
    
    const phoneInput = document.getElementById('phoneInput');
    const form = document.getElementById('wallpaperContactForm');
    const successMessage = document.getElementById('form-success');

   
    phoneInput.value = '+1 (';
    let lastPhoneValue = '+1 (';

    
    phoneInput.addEventListener('input', function() {
        const cursorPos = this.selectionStart;
        const inputValue = this.value;
        
        
        const digits = inputValue.replace(/\D/g, '').substring(1);
        
        
        let formatted = '+1 (';
        if (digits.length > 0) formatted += digits.substring(0, 3);
        if (digits.length >= 3) formatted = '+1 (' + digits.substring(0, 3) + ')';
        if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
        if (digits.length > 6) formatted += '-' + digits.substring(6, 10);
        
        
        this.value = formatted;
        lastPhoneValue = formatted;
        
        
        let newCursorPos = cursorPos;
        if (digits.length <= 3) {
            newCursorPos = Math.min(4 + digits.length, formatted.length);
        } 
        else if (digits.length <= 6) {
            newCursorPos = Math.min(9 + (digits.length - 3), formatted.length);
        }
        else {
            newCursorPos = Math.min(14 + (digits.length - 6), formatted.length);
        }
        
        this.setSelectionRange(newCursorPos, newCursorPos);
    });

    
    phoneInput.addEventListener('keydown', function(e) {
        const cursorPos = this.selectionStart;
        
        if (cursorPos <= 4 && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
            return;
        }
        
        if (!/\d|Arrow|Backspace|Delete|Tab|Home|End/.test(e.key)) {
            e.preventDefault();
        }
    });

    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        
        resetErrors();
        
        
        const formData = new FormData(form);
        const phoneDigits = phoneInput.value.replace(/\D/g, '').substring(1);
        
        
        let isValid = true;
        
        
        if (formData.get('name').trim().length < 2) {
            showError(form.elements['name'], 'Name must be at least 2 characters');
            isValid = false;
        }
        
        
        if (phoneDigits.length !== 10) {
            showError(phoneInput, 'Please enter 10-digit phone number');
            isValid = false;
        }
        
        
        if (formData.get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
            showError(form.elements['email'], 'Invalid email address');
            isValid = false;
        }
        
        
        if (formData.get('city').trim().length < 2) {
            showError(form.elements['city'], 'City must be at least 2 characters');
            isValid = false;
        }
        
        if (isValid) {
            try {
                
                formData.set('phone', '+1' + phoneDigits);
                
                
                const response = await fetch('send.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    
                    setTimeout(() => {
                        form.style.display = 'block';
                        successMessage.style.display = 'none';
                        form.reset();
                        phoneInput.value = '+1 (';
                    }, 5000);
                } else {
                    alert(`Error: ${data.message || 'Server error'}`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Network error. Please try again.');
            }
        }
    });
    
    
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            margin-top: 5px;
            font-size: 14px;
            animation: fadeIn 0.3s ease;
        `;
        input.parentNode.appendChild(errorElement);
        input.style.borderColor = '#ff6b6b';
    }
    
    
    function resetErrors() {
        const inputs = Array.from(form.elements).filter(el => 
            el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
        );
        
        inputs.forEach(input => {
            input.style.borderColor = '';
            const errorElement = input.parentNode.querySelector('.error-message');
            if (errorElement) errorElement.remove();
        });
    }
});