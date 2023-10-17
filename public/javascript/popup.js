function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000); 
}

function closePopup() {
    const popup = document.getElementById('success-popup');
    popup.style.display = 'none';
}

module.exports = {
    showSuccessPopup,
    closePopup,
};
