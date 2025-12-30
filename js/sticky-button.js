 const stickyBtn = document.getElementById('stickyBtn');
        
        
        setTimeout(() => {
            stickyBtn.style.opacity = '1';
        }, 1000);


        stickyBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.getElementById('quote').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});