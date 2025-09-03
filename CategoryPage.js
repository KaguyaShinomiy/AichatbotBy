// Category data with detailed information
const categoryData = {
    'การเงิน': {
        title: "การเงิน 💰",
        description: "การจัดการเงิน การออม การลงทุน และการวางแผนทางการเงิน",
        tags: ["การออม", "การลงทุน", "การวางแผน", "การจัดการหนี้", "การสร้างรายได้"],
        color: "#28a745"
    },
    'ชีวิต': {
        title: "ชีวิต 🌟",
        description: "การใช้ชีวิต การพัฒนาตัวเอง ความสุข และการบรรลุเป้าหมาย",
        tags: ["การพัฒนาตัวเอง", "ความสุข", "เป้าหมาย", "ความสำเร็จ", "การเติบโต"],
        color: "#ffc107"
    },
    'ความรัก': {
        title: "ความรัก ❤️",
        description: "หัวข้อเกี่ยวกับความรัก การจัดการความสัมพันธ์ และการเข้าใจความรู้สึก",
        tags: ["ความสัมพันธ์", "การสื่อสาร", "ความเข้าใจ", "การให้อภัย", "การเติบโต"],
        color: "#e75480"
    },
    'ครอบครัว': {
        title: "ครอบครัว 👨‍👩‍👧‍👦",
        description: "ความสัมพันธ์ในครอบครัว การสื่อสาร และการสร้างความเข้าใจ",
        tags: ["การสื่อสาร", "ความเข้าใจ", "การให้เวลา", "การสนับสนุน", "การแก้ปัญหา"],
        color: "#17a2b8"
    },
    'การศึกษา': {
        title: "การศึกษา 📚",
        description: "การเรียน การศึกษา การพัฒนาความรู้ และการเติบโตทางวิชาการ",
        tags: ["การเรียน", "การศึกษา", "การพัฒนาความรู้", "การสอบ", "การเติบโต"],
        color: "#6f42c1"
    },
    'อาชีพ': {
        title: "อาชีพ 💼",
        description: "การพัฒนาอาชีพ การทำงาน การเลื่อนตำแหน่ง และการเติบโตในหน้าที่การงาน",
        tags: ["การพัฒนาตัวเอง", "การทำงานเป็นทีม", "การแก้ปัญหา", "การวางแผน", "การเติบโต"],
        color: "#6f42c1"
    },
    'สุขภาพ': {
        title: "สุขภาพ 🏥",
        description: "สุขภาพกาย สุขภาพจิต การออกกำลังกาย และการดูแลตัวเอง",
        tags: ["การออกกำลังกาย", "โภชนาการ", "การพักผ่อน", "สุขภาพจิต", "การป้องกัน"],
        color: "#fd7e14"
    },
    'ธุรกิจ': {
        title: "ธุรกิจ 🏢",
        description: "การทำธุรกิจ การค้า การลงทุน และการพัฒนาธุรกิจ",
        tags: ["การทำธุรกิจ", "การค้า", "การลงทุน", "การตลาด", "การเติบโต"],
        color: "#20c997"
    },
    'อื่นๆ': {
        title: "อื่นๆ 💬",
        description: "คุยทั่วไป เรื่องราวต่างๆ และการสนทนาอย่างอิสระ",
        tags: ["การสนทนา", "การแลกเปลี่ยนความคิด", "การฟัง", "การให้คำแนะนำ", "การเป็นเพื่อน"],
        color: "#6c757d"
    }
};

let selectedCategory = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            selectCategory(category);
        });
    });

    // Check if user has completed MBTI quiz
    checkMBTIStatus();
});

// Select a category
function selectCategory(category) {
    // Remove previous selection
    if (selectedCategory) {
        const previousCard = document.querySelector(`[data-category="${selectedCategory}"]`);
        if (previousCard) {
            previousCard.classList.remove('selected');
        }
    }

    // Select new category
    selectedCategory = category;
    const selectedCard = document.querySelector(`[data-category="${category}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Show category information
    showCategoryInfo(category);

    // Enable start chat button
    const startChatBtn = document.getElementById('start-chat-btn');
    if (startChatBtn) {
        startChatBtn.disabled = false;
    }

    // Add selection animation
    addSelectionAnimation(selectedCard);
}

// Show category information
function showCategoryInfo(category) {
    const categoryInfo = document.getElementById('selected-category-info');
    const categoryTitle = document.getElementById('selected-category-title');
    const categoryDescription = document.getElementById('selected-category-description');
    const categoryTags = document.getElementById('category-tags');

    if (categoryData[category]) {
        const data = categoryData[category];
        
        categoryTitle.textContent = data.title;
        categoryDescription.textContent = data.description;
        
        // Clear previous tags
        categoryTags.innerHTML = '';
        
        // Add new tags
        data.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'category-tag';
            tagElement.textContent = tag;
            categoryTags.appendChild(tagElement);
        });

        // Show the info section with animation
        categoryInfo.style.display = 'block';
        categoryInfo.style.animation = 'none';
        categoryInfo.offsetHeight; // Trigger reflow
        categoryInfo.style.animation = 'slideIn 0.5s ease-out';
    }
}

// Add selection animation
function addSelectionAnimation(card) {
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(156, 39, 176, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
    `;
    
    card.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Start chat with selected category
function startChat() {
    if (!selectedCategory) {
        alert('กรุณาเลือกหัวข้อก่อนเริ่มสนทนา');
        return;
    }

    // Store selected category in localStorage for the chatbot page
    localStorage.setItem('selectedChatCategory', selectedCategory);
    localStorage.setItem('selectedChatCategoryData', JSON.stringify(categoryData[selectedCategory]));

    // Show loading animation
    showLoadingAnimation();

    // Redirect to chatbot page after a short delay
    setTimeout(() => {
        // For now, redirect to MainPage.html (you can change this to your chatbot page)
        window.location.href = 'MainPage.html';
    }, 1500);
}

// Show loading animation
function showLoadingAnimation() {
    const startChatBtn = document.getElementById('start-chat-btn');
    if (startChatBtn) {
        const originalText = startChatBtn.innerHTML;
        startChatBtn.innerHTML = '<div class="loading-spinner"></div> กำลังโหลด...';
        startChatBtn.disabled = true;
        
        // Reset button after redirect
        setTimeout(() => {
            startChatBtn.innerHTML = originalText;
            startChatBtn.disabled = false;
        }, 2000);
    }
}

// Navigate back to previous page
function goBack() {
    // Check if user came from quiz page
    const referrer = document.referrer;
    if (referrer.includes('QuizPage.html')) {
        window.location.href = 'QuizPage.html';
    } else {
        window.location.href = 'FrontPage.html';
    }
}

// Navigate to home page
function goHome() {
    window.location.href = 'FrontPage.html';
}

// Check MBTI status and show indicator
function checkMBTIStatus() {
    const mbtiData = localStorage.getItem('userMBTI');
    if (mbtiData) {
        // User has completed MBTI quiz
        addMBTIIndicator();
    }
}

// Add MBTI completion indicator
function addMBTIIndicator() {
    const header = document.querySelector('.category-header h1');
    if (header) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #28a745;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        `;
        indicator.textContent = '✓';
        header.style.position = 'relative';
        header.appendChild(indicator);
    }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goBack();
    } else if (e.key === 'Enter' && selectedCategory) {
        startChat();
    }
});

// Add category card keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const cards = Array.from(document.querySelectorAll('.category-card'));
        const currentIndex = selectedCategory ? cards.findIndex(card => card.dataset.category === selectedCategory) : -1;
        
        if (currentIndex !== -1) {
            let newIndex;
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % cards.length;
            } else {
                newIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            
            selectCategory(cards[newIndex].dataset.category);
            cards[newIndex].focus();
        }
    }
});

// Add focus styles for accessibility
document.querySelectorAll('.category-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', function() {
        this.style.outline = '3px solid #e75480';
        this.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});
