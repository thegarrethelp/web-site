/**
 * THE GARRET - CONTACT FORM SCRIPT
 * Form validation and submission handling
 */

// ============================================
// FORM VALIDATION
// ============================================
function validateForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        // Let Netlify handle the submission
        // Just add visual feedback
        const submitBtn = form.querySelector('.submit-btn');
        
        if (submitBtn) {
            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;
        }
    });
}

// ============================================
// FORM FIELD VALIDATION
// ============================================
function setupFieldValidation() {
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    
    // Email validation
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#ff4444';
                showFieldError(this, 'Inserisci un\'email valida');
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    }
    
    // Phone validation (Italian format)
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            const phone = this.value;
            const phoneRegex = /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            
            if (phone && !phoneRegex.test(phone)) {
                this.style.borderColor = '#ff4444';
                showFieldError(this, 'Inserisci un numero di telefono valido');
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    }
}

// ============================================
// ERROR MESSAGES
// ============================================
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// ============================================
// CHARACTER COUNTER FOR TEXTAREA
// ============================================
function setupCharacterCounter() {
    const messageField = document.getElementById('message');
    
    if (!messageField) return;
    
    const maxLength = 500;
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.fontSize = '0.85rem';
    counter.style.color = 'var(--text-light)';
    counter.style.marginTop = '5px';
    counter.style.textAlign = 'right';
    
    messageField.parentElement.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        counter.textContent = `${length} / ${maxLength} caratteri`;
        
        if (length > maxLength) {
            counter.style.color = '#ff4444';
        } else if (length > maxLength * 0.9) {
            counter.style.color = 'var(--secondary)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter();
}

// ============================================
// SMOOTH SCROLL TO FORM
// ============================================
function setupFormScroll() {
    // If URL has #contact hash, scroll to form
    if (window.location.hash === '#contact') {
        setTimeout(() => {
            const form = document.querySelector('.contact-form-wrapper');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }
}

// ============================================
// FORM SUCCESS MESSAGE
// ============================================
function setupSuccessMessage() {
    // Check if URL has success parameter (Netlify redirects after form submission)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('success') === 'true') {
        showSuccessNotification();
    }
}

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--secondary);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.5s ease;
        ">
            <strong style="display: block; margin-bottom: 5px;">✓ Messaggio Inviato!</strong>
            <span>Ti risponderemo al più presto.</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }, 5000);
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    validateForm();
    setupFieldValidation();
    setupCharacterCounter();
    setupFormScroll();
    setupSuccessMessage();
});

// ============================================
// UTILITY: PHONE FORMATTING
// ============================================
function formatPhoneNumber() {
    const phoneField = document.getElementById('phone');
    
    if (!phoneField) return;
    
    phoneField.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 0 && !value.startsWith('39') && !value.startsWith('3')) {
            value = '39' + value;
        }
        
        // Format: +39 340 123 4567
        if (value.length > 2) {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + ' ' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + ' ' + value.substring(11, 15);
        }
        
        this.value = value;
    });
}