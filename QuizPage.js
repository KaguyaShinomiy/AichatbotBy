// MBTI Quiz state management
let currentQuestion = 0;
let userAnswers = [];
let quizCompleted = false;
let mbtiScores = {
    I: 0, E: 0,  // Introversion vs Extroversion
    S: 0, N: 0,  // Sensing vs Intuition  
    T: 0, F: 0,  // Thinking vs Feeling
    J: 0, P: 0   // Judging vs Perceiving
};

// MBTI Quiz data structure - 40 questions total (10 per dimension)
const mbtiQuizData = [
    // I vs E Questions (1-10)
    {
        question: "ฉันชอบใช้เวลาว่างในวันหยุดแบบเงียบๆ มากกว่าไปเที่ยวกับคนเยอะๆ",
        dimension: "I-E",
        leftTrait: "I",  // Strongly Agree = Introversion
        rightTrait: "E"  // Strongly Disagree = Extroversion
    },
    {
        question: "ฉันชอบสังสรรค์และทำความรู้จักกับคนใหม่ในงานปาร์ตี้",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "หลังจากใช้เวลากับเพื่อนหลายชั่วโมง ฉันรู้สึกมีพลังและสดชื่น",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบนำเสนองานต่อหน้าคนจำนวนมากและรู้สึกตื่นเต้นกับมัน",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบสำรวจและเรียนรู้สิ่งใหม่ในสถานการณ์ที่ไม่คุ้นเคย",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบแก้ปัญหาด้วยการปรึกษาและหารือกับคนอื่น",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบแสดงความคิดเห็นและเข้าร่วมการอภิปรายในห้องเรียนหรือการประชุม",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบเป็นผู้นำและประสานงานในทีมมากกว่าทำงานตามลำพัง",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "ฉันชอบตัดสินใจอย่างรวดเร็วและลงมือทำทันทีในสถานการณ์ฉุกเฉิน",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    {
        question: "เมื่อเครียดหรือเหนื่อย ฉันชอบออกไปเที่ยวหรือพบปะกับเพื่อนเพื่อผ่อนคลาย",
        dimension: "I-E",
        leftTrait: "I",
        rightTrait: "E"
    },
    
    // S vs N Questions (11-20)
    {
        question: "ฉันชอบอ่านหนังสือที่เน้นรายละเอียดและข้อเท็จจริงมากกว่าความคิดสร้างสรรค์",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบครูที่สอนแบบเน้นทฤษฎีและแนวคิดมากกว่าการปฏิบัติจริง",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบแก้ปัญหาด้วยการคิดนอกกรอบและหาแนวทางใหม่ๆ",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันเชื่อถือข้อมูลที่เป็นข้อเท็จจริงและสามารถพิสูจน์ได้มากกว่าความรู้สึก",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบวางแผนการเดินทางแบบละเอียดและมีตารางเวลาที่แน่นอน",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบงานศิลปะที่แสดงความหมายลึกซึ้งและความคิดสร้างสรรค์มากกว่าความสวยงาม",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบเรียนรู้ทักษะใหม่แบบค่อยเป็นค่อยไปและเน้นการปฏิบัติจริง",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันชอบทำงานที่เน้นรายละเอียดและความแม่นยำมากกว่าความคิดสร้างสรรค์",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "เมื่อต้องตัดสินใจเรื่องสำคัญ ฉันพึ่งพาสัญชาตญาณและความรู้สึกมากกว่าข้อเท็จจริง",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    {
        question: "ฉันสนใจเรื่องที่เป็นรูปธรรมและสามารถสัมผัสได้มากกว่าความคิดนามธรรม",
        dimension: "S-N",
        leftTrait: "S",
        rightTrait: "N"
    },
    
    // T vs F Questions (21-30)
    {
        question: "เมื่อเพื่อนมาปรึกษาปัญหาส่วนตัว ฉันชอบให้คำแนะนำที่เป็นเหตุเป็นผลมากกว่าการให้กำลังใจ",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "ในการทำงานเป็นทีม ฉันให้ความสำคัญกับความสัมพันธ์และบรรยากาศมากกว่าผลงาน",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "เมื่อต้องให้คำติชม ฉันชอบให้คำติชมที่ตรงไปตรงมาและเน้นข้อผิดพลาดมากกว่าการให้กำลังใจ",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "ในการตัดสินใจเรื่องที่เกี่ยวข้องกับคนอื่น ฉันให้ความสำคัญกับความรู้สึกของคนอื่นมากกว่าผลประโยชน์",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "เมื่อมีคนทำผิดพลาด ฉันชอบวิเคราะห์สาเหตุและหาทางแก้ไขมากกว่าการให้อภัย",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "ในการแก้ไขความขัดแย้ง ฉันชอบหาทางประนีประนอมและรักษาความสัมพันธ์มากกว่าการหาความถูกต้อง",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "เมื่อต้องประเมินผลงานของคนอื่น ฉันเน้นที่คุณภาพและประสิทธิภาพมากกว่าความพยายาม",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "ในการเลือกงานหรืออาชีพ ฉันให้ความสำคัญกับความหมายและคุณค่าของงานมากกว่าความมั่นคง",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "เมื่อต้องตัดสินใจในสถานการณ์ที่ตึงเครียด ฉันให้ความสำคัญกับความรู้สึกของคนอื่นมากกว่าผลลัพธ์",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    {
        question: "ในการสร้างความสัมพันธ์กับคนใหม่ ฉันชอบสังเกตและประเมินคนอื่นก่อนมากกว่าการเปิดใจทันที",
        dimension: "T-F",
        leftTrait: "T",
        rightTrait: "F"
    },
    
    // J vs P Questions (31-40)
    {
        question: "ในชีวิตประจำวัน ฉันชอบมีตารางเวลาและแผนการที่แน่นอนมากกว่าการทำตามอารมณ์",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "เมื่อต้องทำงานที่มีกำหนดเวลา ฉันชอบทำงานให้เสร็จก่อนกำหนดมากกว่าการทำงานในนาทีสุดท้าย",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "ในการจัดระเบียบห้องหรือโต๊ะทำงาน ฉันชอบให้ทุกอย่างอยู่ในที่ที่กำหนดไว้มากกว่าการจัดเรียงตามความสะดวก",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "เมื่อต้องวางแผนสำหรับวันหยุดหรือการเดินทาง ฉันชอบวางแผนแบบละเอียดและมีตารางเวลาที่แน่นอน",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "ในการทำงานโปรเจกต์หรืองานใหญ่ ฉันชอบทำงานแบบค่อยเป็นค่อยไปและมีแผนการที่ชัดเจน",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "เมื่อต้องตัดสินใจเรื่องที่ไม่เร่งด่วน ฉันชอบตัดสินใจอย่างรวดเร็วและไม่ลังเลมากกว่าการคิดนาน",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "ในการจัดการกับงานหลายอย่างพร้อมกัน ฉันชอบทำงานหลายอย่างพร้อมกันและปรับเปลี่ยนตามสถานการณ์",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "เมื่อต้องทำตามกฎหรือระเบียบ ฉันชอบทำตามกฎอย่างเคร่งครัดมากกว่าการปรับเปลี่ยนตามความเหมาะสม",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "ในการเตรียมตัวสำหรับเหตุการณ์สำคัญ ฉันชอบเตรียมตัวแบบละเอียดและมีแผนการที่ชัดเจน",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    },
    {
        question: "เมื่อต้องเลือกระหว่างตัวเลือกหลายอย่าง ฉันชอบตัดสินใจอย่างรวดเร็วและไม่ลังเลมากกว่าการคิดนาน",
        dimension: "J-P",
        leftTrait: "J",
        rightTrait: "P"
    }
];

// Initialize MBTI quiz
function initQuiz() {
    userAnswers = new Array(mbtiQuizData.length).fill(null);
    mbtiScores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    currentQuestion = 0;
    quizCompleted = false;
    updateQuizDisplay();
}

// Update quiz display
function updateQuizDisplay() {
    const question = mbtiQuizData[currentQuestion];
    
    // Update question text
    document.getElementById('question-text').textContent = question.question;
    
    // Update progress
    const progress = ((currentQuestion + 1) / mbtiQuizData.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // Update question counter
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = mbtiQuizData.length;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update scale selection
    updateScaleSelection();
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.submit-btn');
    
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === mbtiQuizData.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Update scale selection
function updateScaleSelection() {
    const scaleOptions = document.querySelectorAll('.scale-option');
    const selectedAnswer = userAnswers[currentQuestion];
    
    scaleOptions.forEach((option, index) => {
        option.classList.remove('selected');
        if (selectedAnswer === index) {
            option.classList.add('selected');
        }
    });
}

// Select scale option
function selectScaleOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    updateScaleSelection();
}

// Next question
function nextQuestion() {
    if (currentQuestion < mbtiQuizData.length - 1) {
        currentQuestion++;
        updateQuizDisplay();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateQuizDisplay();
    }
}

// Calculate MBTI scores
function calculateMBTIScores() {
    // Reset scores
    mbtiScores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    // Calculate scores based on 7-choice scale answers
    userAnswers.forEach((answer, index) => {
        if (answer !== null) {
            const question = mbtiQuizData[index];
            // Convert 0-6 scale to 1-7 scale
            const scaleValue = answer + 1;
            
            // Calculate weighted score for each trait
            if (scaleValue <= 3) {
                // Left side (1-3): Add points to left trait
                mbtiScores[question.leftTrait] += (4 - scaleValue); // 3, 2, 1 points
            } else if (scaleValue >= 5) {
                // Right side (5-7): Add points to right trait
                mbtiScores[question.rightTrait] += (scaleValue - 4); // 1, 2, 3 points
            }
            // Middle (4): Neutral, no points added
        }
    });
}

// Determine MBTI type
function determineMBTIType() {
    let mbtiType = '';
    
    // I vs E
    mbtiType += mbtiScores.I > mbtiScores.E ? 'I' : 'E';
    
    // S vs N
    mbtiType += mbtiScores.S > mbtiScores.N ? 'S' : 'N';
    
    // T vs F
    mbtiType += mbtiScores.T > mbtiScores.F ? 'T' : 'F';
    
    // J vs P
    mbtiType += mbtiScores.J > mbtiScores.P ? 'J' : 'P';
    
    return mbtiType;
}

// Store MBTI result and redirect to main page
function storeMBTIAndRedirect(mbtiType, mbtiScores) {
    // Store MBTI data in localStorage
    const mbtiData = {
        type: mbtiType,
        scores: mbtiScores,
        timestamp: new Date().toISOString(),
        description: getMBTIDescription(mbtiType)
    };
    
    localStorage.setItem('userMBTI', JSON.stringify(mbtiData));
    
    // Show success message and redirect
    const resultsHTML = `
        <h2>🎉 ผลการทดสอบบุคลิกภาพของคุณ 🎉</h2>
        <div class="mbti-result">
            <div class="mbti-type">${mbtiType}</div>
            <div class="mbti-description">${getMBTIDescription(mbtiType)}</div>
        </div>
        
        <div class="scores-breakdown">
            <h3>คะแนนของคุณ:</h3>
            <div class="score-pair">
                <div class="score-item">
                    <span class="trait">I (เก็บตัว):</span>
                    <span class="score">${mbtiScores.I}</span>
                </div>
                <div class="score-item">
                    <span class="trait">E (เปิดเผย):</span>
                    <span class="score">${mbtiScores.E}</span>
                </div>
            </div>
            <div class="score-pair">
                <div class="score-item">
                    <span class="trait">S (ประสาทสัมผัส):</span>
                    <span class="score">${mbtiScores.S}</span>
                </div>
                <div class="score-item">
                    <span class="trait">N (สัญชาตญาณ):</span>
                    <span class="score">${mbtiScores.N}</span>
                </div>
            </div>
            <div class="score-pair">
                <div class="score-item">
                    <span class="trait">T (คิด):</span>
                    <span class="score">${mbtiScores.T}</span>
                </div>
                <div class="score-item">
                    <span class="trait">F (รู้สึก):</span>
                    <span class="score">${mbtiScores.F}</span>
                </div>
            </div>
            <div class="score-pair">
                <div class="score-item">
                    <span class="trait">J (ตัดสิน):</span>
                    <span class="score">${mbtiScores.J}</span>
                </div>
                <div class="score-item">
                    <span class="trait">P (รับรู้):</span>
                    <span class="score">${mbtiScores.P}</span>
                </div>
            </div>
        </div>
        
        <div class="redirect-message">
            <p>บันทึกบุคลิกภาพของคุณแล้ว! กำลังไปยังแชท...</p>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    document.getElementById('quiz-results').innerHTML = resultsHTML;
    
    // Hide quiz main and show results
    document.querySelector('.quiz-main').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    // Redirect to category page after 3 seconds
    setTimeout(() => {
        window.location.href = 'CategoryPage.html';
    }, 3000);
}

// Submit quiz
function submitQuiz() {
    const unansweredQuestions = userAnswers.filter(answer => answer === null).length;
    
    if (unansweredQuestions > 0) {
        alert(`กรุณาตอบคำถามให้ครบก่อนส่ง คุณยังไม่ได้ตอบ ${unansweredQuestions} ข้อ`);
        return;
    }
    
    calculateMBTIScores();
    const mbtiType = determineMBTIType();
    storeMBTIAndRedirect(mbtiType, mbtiScores);
}

// Get MBTI description
function getMBTIDescription(type) {
    const descriptions = {
        'INTJ': 'สถาปนิก - นักคิดเชิงกลยุทธ์ที่มีจินตนาการและมีแผนสำหรับทุกสิ่ง',
        'INTP': 'นักตรรกศาสตร์ - นักประดิษฐ์ที่สร้างสรรค์และกระหายความรู้ไม่สิ้นสุด',
        'ENTJ': 'ผู้บัญชาการ - ผู้นำที่กล้าหาญ มีจินตนาการ และมีเจตจำนงแข็งแกร่ง',
        'ENTP': 'นักโต้วาที - นักคิดที่ฉลาดและอยากรู้อยากเห็นที่ไม่สามารถต้านทานความท้าทายทางปัญญาได้',
        'INFJ': 'ผู้สนับสนุน - คนที่เงียบและลึกลับ แต่เป็นแรงบันดาลใจและไม่เหน็ดเหนื่อย',
        'INFP': 'ผู้ไกล่เกลี่ย - คนที่โรแมนติก ใจดี และเสียสละ พร้อมช่วยเหลือสาเหตุที่ดีเสมอ',
        'ENFJ': 'ตัวเอก - ผู้นำที่มีเสน่ห์และเป็นแรงบันดาลใจ สามารถทำให้ผู้ฟังหลงใหลได้',
        'ENFP': 'นักรณรงค์ - วิญญาณอิสระที่กระตือรือร้น สร้างสรรค์ และเข้าสังคม',
        'ISTJ': 'นักโลจิสติกส์ - คนที่ปฏิบัติจริงและเชื่อถือได้ ความน่าเชื่อถือไม่ต้องสงสัย',
        'ISFJ': 'ผู้พิทักษ์ - ผู้ปกป้องที่อุทิศตนและอบอุ่น พร้อมปกป้องคนที่รักเสมอ',
        'ESTJ': 'ผู้บริหาร - ผู้บริหารที่ยอดเยี่ยม ไม่มีใครเทียบในการจัดการสิ่งต่างๆ หรือผู้คน',
        'ESFJ': 'กงสุล - คนที่ห่วงใย สังคม และเป็นที่นิยมอย่างไม่ธรรมดา',
        'ISTP': 'ศิลปิน - นักทดลองที่กล้าหาญและปฏิบัติจริง ปรมาจารย์ของเครื่องมือทุกชนิด',
        'ISFP': 'นักผจญภัย - ศิลปินที่ยืดหยุ่นและมีเสน่ห์ พร้อมสำรวจและสัมผัสประสบการณ์ใหม่เสมอ',
        'ESTP': 'ผู้ประกอบการ - คนที่ฉลาด มีพลัง และรับรู้ได้อย่างมาก',
        'ESFP': 'ผู้ให้ความบันเทิง - ผู้ให้ความบันเทิงที่เกิดขึ้นเอง มีพลัง และกระตือรือร้น'
    };
    
    return descriptions[type] || 'บุคลิกภาพพิเศษที่มีลักษณะเฉพาะของคุณเอง!';
}

// Restart quiz
function restartQuiz() {
    initQuiz();
    document.querySelector('.quiz-main').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
}

// Navigation functions
function goHome() {
    window.location.href = 'FrontPage.html';
}

function toggleMenu() {
    const menuPopup = document.getElementById('menu-popup');
    menuPopup.classList.toggle('active');
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('darkmode');
    const isDarkMode = document.body.classList.contains('darkmode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize dark mode from localStorage
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('darkmode');
        document.getElementById('dark-mode-toggle').checked = true;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile-specific optimizations
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
    }
    
    // Handle orientation changes
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    });
    
    initQuiz();
    initDarkMode();
    
    // Dark mode toggle event
    document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const menuPopup = document.getElementById('menu-popup');
        const menuIcon = document.querySelector('.menu-icon');
        
        if (!menuPopup.contains(event.target) && !menuIcon.contains(event.target)) {
            menuPopup.classList.remove('active');
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (quizCompleted) return;
    
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
            if (currentQuestion < mbtiQuizData.length - 1) {
                nextQuestion();
            }
            break;
        case 'ArrowLeft':
            if (currentQuestion > 0) {
                previousQuestion();
            }
            break;
        case '1':
            selectScaleOption(0);
            break;
        case '2':
            selectScaleOption(1);
            break;
        case '3':
            selectScaleOption(2);
            break;
        case '4':
            selectScaleOption(3);
            break;
        case '5':
            selectScaleOption(4);
            break;
        case '6':
            selectScaleOption(5);
            break;
        case '7':
            selectScaleOption(6);
            break;
    }
}); 