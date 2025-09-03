// Conclusion Page JavaScript

// Navigation functions
function goHome() {
    window.location.href = 'FrontPage.html';
}

function goBack() {
    window.location.href = 'MainPage.html';
}

// Load conversation data and display summary
function loadConversationSummary() {
    const conversationData = localStorage.getItem('conversationData');
    const selectedCategory = localStorage.getItem('selectedChatCategory');
    const categoryData = localStorage.getItem('selectedChatCategoryData');
    
    if (conversationData) {
        try {
            const data = JSON.parse(conversationData);
            displayConversationSummary(data, selectedCategory, categoryData);
        } catch (e) {
            console.error('Error parsing conversation data:', e);
            displayDefaultSummary();
        }
    } else {
        displayDefaultSummary();
    }
}

// Display conversation summary
function displayConversationSummary(data, selectedCategory, categoryData) {
    const summaryElement = document.getElementById('conversation-summary');
    const recommendationsElement = document.getElementById('action-recommendations');
    const insightsElement = document.getElementById('key-insights');
    const nextStepsElement = document.getElementById('next-steps');
    
    if (data.totalMessages === 0) {
        displayDefaultSummary();
        return;
    }
    
    // Display conversation statistics
    summaryElement.innerHTML = `
        <p><strong>จำนวนข้อความทั้งหมด:</strong> ${data.totalMessages}</p>
        <p><strong>ข้อความจากคุณ:</strong> ${data.userMessages}</p>
        <p><strong>ข้อความจาก AI:</strong> ${data.aiMessages}</p>
        <p><strong>หัวข้อที่สนทนา:</strong> ${data.topics.join(', ') || 'ทั่วไป'}</p>
        <p><strong>ระยะเวลาการสนทนา:</strong> ${calculateDuration(data.startTime)}</p>
    `;
    
    // Display category-specific recommendations
    if (selectedCategory && categoryData) {
        try {
            const category = JSON.parse(categoryData);
            displayCategoryRecommendations(recommendationsElement, selectedCategory, category);
        } catch (e) {
            console.error('Error parsing category data:', e);
            displayGeneralRecommendations(recommendationsElement);
        }
    } else {
        displayGeneralRecommendations(recommendationsElement);
    }
    
    // Display key insights
    displayKeyInsights(insightsElement, data, selectedCategory);
    
    // Display next steps
    displayNextSteps(nextStepsElement, selectedCategory);
}

// Display default summary when no data
function displayDefaultSummary() {
    const summaryElement = document.getElementById('conversation-summary');
    const recommendationsElement = document.getElementById('action-recommendations');
    const insightsElement = document.getElementById('key-insights');
    const nextStepsElement = document.getElementById('next-steps');
    
    summaryElement.innerHTML = `
        <p>ไม่พบข้อมูลการสนทนา</p>
        <p>คุณสามารถเริ่มสนทนาใหม่เพื่อสร้างสรุปได้</p>
    `;
    
    displayGeneralRecommendations(recommendationsElement);
    
    insightsElement.innerHTML = `
        <p>เริ่มสนทนาเพื่อเรียนรู้ประเด็นสำคัญ</p>
    `;
    
    nextStepsElement.innerHTML = `
        <ol>
            <li>เริ่มสนทนากับ AI เพื่อน</li>
            <li>เลือกหัวข้อที่สนใจ</li>
            <li>รับคำแนะนำและคำปรึกษา</li>
            <li>นำไปปฏิบัติในชีวิตประจำวัน</li>
            <li>กลับมาสนทนาเพื่อพัฒนาต่อ</li>
        </ol>
    `;
}

// Display category-specific recommendations
function displayCategoryRecommendations(element, category, categoryData) {
    const recommendations = getCategoryRecommendations(category);
    
    element.innerHTML = `
        <h4>คำแนะนำสำหรับ ${categoryData.title}:</h4>
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;
}

// Display general recommendations
function displayGeneralRecommendations(element) {
    element.innerHTML = `
        <h4>คำแนะนำทั่วไป:</h4>
        <ul>
            <li>ตั้งเป้าหมายที่ชัดเจน</li>
            <li>ลงมือทำอย่างสม่ำเสมอ</li>
            <li>เรียนรู้จากประสบการณ์</li>
            <li>ไม่ยอมแพ้เมื่อเจออุปสรรค</li>
        </ul>
    `;
}

// Display key insights
function displayKeyInsights(element, data, category) {
    const insights = getKeyInsights(data, category);
    
    element.innerHTML = `
        <ul>
            ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    `;
}

// Display next steps
function displayNextSteps(element, category) {
    const steps = getNextSteps(category);
    
    element.innerHTML = `
        <ol>
            ${steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;
}

// Get category-specific recommendations
function getCategoryRecommendations(category) {
    const recommendations = {
        'การเงิน': [
            'สร้างงบประมาณรายเดือน',
            'ออมเงินอย่างน้อย 10% ของรายได้',
            'ศึกษาการลงทุนที่ปลอดภัย',
            'ติดตามค่าใช้จ่ายอย่างสม่ำเสมอ'
        ],
        'ชีวิต': [
            'ตั้งเป้าหมายชีวิตที่ชัดเจน',
            'พัฒนาทักษะใหม่ๆ',
            'สร้างสมดุลระหว่างงานและชีวิต',
            'ดูแลสุขภาพกายและใจ'
        ],
        'ความรัก': [
            'สื่อสารอย่างเปิดเผยและซื่อสัตย์',
            'ให้เวลาและความสนใจกับคนรัก',
            'เข้าใจและยอมรับความแตกต่าง',
            'สร้างความเชื่อมั่นและความปลอดภัย'
        ],
        'ครอบครัว': [
            'ใช้เวลาคุณภาพกับครอบครัว',
            'สื่อสารอย่างเปิดใจและเข้าใจ',
            'ช่วยเหลือและสนับสนุนกัน',
            'สร้างความทรงจำที่ดีร่วมกัน'
        ],
        'การศึกษา': [
            'ตั้งเป้าหมายการเรียนรู้ที่ชัดเจน',
            'พัฒนาทักษะการจัดการเวลา',
            'หาวิธีการเรียนรู้ที่เหมาะกับตัวเอง',
            'ประยุกต์ความรู้ในชีวิตจริง'
        ],
        'อาชีพ': [
            'พัฒนาทักษะที่จำเป็นสำหรับอาชีพ',
            'สร้างเครือข่ายความสัมพันธ์',
            'หาความสมดุลระหว่างงานและชีวิต',
            'วางแผนการพัฒนาอาชีพระยะยาว'
        ],
        'สุขภาพ': [
            'ออกกำลังกายอย่างสม่ำเสมอ',
            'รับประทานอาหารที่มีประโยชน์',
            'นอนหลับให้เพียงพอ',
            'จัดการความเครียดอย่างเหมาะสม'
        ],
        'ธุรกิจ': [
            'ศึกษาตลาดและคู่แข่ง',
            'สร้างแผนธุรกิจที่ชัดเจน',
            'พัฒนาความสัมพันธ์กับลูกค้า',
            'จัดการการเงินอย่างรอบคอบ'
        ],
        'อื่นๆ': [
            'สำรวจความสนใจใหม่ๆ',
            'พัฒนาทักษะที่หลากหลาย',
            'สร้างสมดุลในชีวิต',
            'เรียนรู้จากประสบการณ์'
        ]
    };
    
    return recommendations[category] || recommendations['อื่นๆ'];
}

// Get key insights based on conversation data
function getKeyInsights(data, category) {
    const insights = [
        'การสนทนาช่วยให้เข้าใจตัวเองมากขึ้น',
        'การรับฟังคำแนะนำจากผู้อื่นมีประโยชน์',
        'การตั้งเป้าหมายที่ชัดเจนช่วยให้ประสบความสำเร็จ',
        'การลงมือทำเป็นกุญแจสำคัญสู่ความสำเร็จ'
    ];
    
    if (data.topics && data.topics.length > 0) {
        insights.unshift(`คุณสนใจในหัวข้อ: ${data.topics.join(', ')}`);
    }
    
    return insights;
}

// Get next steps based on category
function getNextSteps(category) {
    const steps = {
        'การเงิน': [
            'นำคำแนะนำเรื่องการเงินไปปฏิบัติ',
            'ติดตามผลลัพธ์และปรับปรุงอย่างต่อเนื่อง',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'ตั้งเป้าหมายใหม่และพัฒนาตัวเอง'
        ],
        'ชีวิต': [
            'นำคำแนะนำไปปรับใช้ในชีวิตประจำวัน',
            'ติดตามความก้าวหน้าและปรับปรุง',
            'กลับมาสนทนาเพื่อพัฒนาต่อ',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'ตั้งเป้าหมายใหม่และพัฒนาตัวเอง'
        ],
        'ความรัก': [
            'นำคำแนะนำไปใช้ในความสัมพันธ์',
            'สื่อสารและปรับปรุงความสัมพันธ์',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'พัฒนาตัวเองเพื่อความสัมพันธ์ที่ดีขึ้น'
        ],
        'ครอบครัว': [
            'นำคำแนะนำไปใช้กับครอบครัว',
            'สร้างความสัมพันธ์ที่ดีกับครอบครัว',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'พัฒนาตัวเองเพื่อครอบครัวที่ดีขึ้น'
        ],
        'การศึกษา': [
            'นำคำแนะนำไปใช้ในการเรียน',
            'พัฒนาทักษะการเรียนรู้',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'ตั้งเป้าหมายการศึกษาใหม่'
        ],
        'อาชีพ': [
            'นำคำแนะนำไปใช้ในการทำงาน',
            'พัฒนาทักษะอาชีพ',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'วางแผนการพัฒนาอาชีพ'
        ],
        'สุขภาพ': [
            'นำคำแนะนำไปใช้ในการดูแลสุขภาพ',
            'สร้างนิสัยสุขภาพที่ดี',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'ตั้งเป้าหมายสุขภาพใหม่'
        ],
        'ธุรกิจ': [
            'นำคำแนะนำไปใช้ในการทำธุรกิจ',
            'พัฒนาธุรกิจอย่างต่อเนื่อง',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'วางแผนการพัฒนาธุรกิจ'
        ],
        'อื่นๆ': [
            'นำคำแนะนำไปใช้ในชีวิตประจำวัน',
            'พัฒนาตัวเองอย่างต่อเนื่อง',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม',
            'แบ่งปันประสบการณ์กับผู้อื่น',
            'ตั้งเป้าหมายใหม่และพัฒนาตัวเอง'
        ]
    };
    
    return steps[category] || steps['อื่นๆ'];
}

// Calculate conversation duration
function calculateDuration(startTime) {
    if (!startTime) return 'ไม่ทราบ';
    
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'น้อยกว่า 1 นาที';
    if (diffMinutes < 60) return `${diffMinutes} นาที`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours} ชั่วโมง ${minutes} นาที`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadConversationSummary();
});
