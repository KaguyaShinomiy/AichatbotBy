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
    const conversationHistory = localStorage.getItem('conversationHistory');
    const conversationData = localStorage.getItem('conversationData');
    const chatConversation = localStorage.getItem('chatConversation');
    const selectedCategory = localStorage.getItem('selectedChatCategory');
    const categoryData = localStorage.getItem('selectedChatCategoryData');
    
    // Debug: Log all available data
    console.log('=== CONCLUSION PAGE DATA DEBUG ===');
    console.log('conversationHistory:', conversationHistory);
    console.log('conversationData:', conversationData);
    console.log('chatConversation:', chatConversation);
    console.log('selectedCategory:', selectedCategory);
    console.log('categoryData:', categoryData);
    console.log('================================');
    
    // Parse all available data
    let history = [];
    let stats = null;
    let chatData = [];
    let category = null;
    
    try {
        if (conversationHistory) {
            history = JSON.parse(conversationHistory);
            console.log('Parsed history:', history);
        }
        if (conversationData) {
            stats = JSON.parse(conversationData);
            console.log('Parsed stats:', stats);
        }
        if (chatConversation) {
            chatData = JSON.parse(chatConversation);
            console.log('Parsed chatData:', chatData);
        }
        if (categoryData) {
            category = JSON.parse(categoryData);
            console.log('Parsed category:', category);
        }
    } catch (e) {
        console.error('Error parsing conversation data:', e);
    }
    
    // Display the comprehensive summary
    displayComprehensiveSummary(history, stats, chatData, selectedCategory, category);
}

// Display comprehensive conversation summary
function displayComprehensiveSummary(history, stats, chatData, selectedCategory, category) {
    const summaryElement = document.getElementById('conversation-summary');
    const recommendationsElement = document.getElementById('action-recommendations');
    const insightsElement = document.getElementById('key-insights');
    const nextStepsElement = document.getElementById('next-steps');
    
    // Check if we have any meaningful data
    const hasHistory = history && history.length > 0;
    const hasStats = stats && stats.totalMessages > 0;
    const hasChatData = chatData && chatData.length > 0;
    
    if (!hasHistory && !hasStats && !hasChatData) {
        displayDefaultSummary();
        return;
    }
    
    // Display conversation statistics
    displayConversationStats(summaryElement, stats, history, chatData, selectedCategory, category);
    
    // Display AI-generated recommendations
    displayAIRecommendations(recommendationsElement, history, selectedCategory, category);
    
    // Display key insights
    displayKeyInsights(insightsElement, history, stats, selectedCategory);
    
    // Display next steps
    displayNextSteps(nextStepsElement, selectedCategory, category);
}

// Display conversation statistics
function displayConversationStats(element, stats, history, chatData, selectedCategory, category) {
    let html = '<div class="stats-section">';
    
    // Basic statistics
    if (stats) {
        html += `
            <div class="stat-item">
                <strong>จำนวนข้อความทั้งหมด:</strong> ${stats.totalMessages}
            </div>
            <div class="stat-item">
                <strong>ข้อความจากคุณ:</strong> ${stats.userMessages}
            </div>
            <div class="stat-item">
                <strong>ข้อความจาก AI:</strong> ${stats.aiMessages}
            </div>
        `;
        
        if (stats.topics && stats.topics.length > 0) {
            html += `<div class="stat-item">
                <strong>หัวข้อที่สนทนา:</strong> ${stats.topics.join(', ')}
            </div>`;
        }
        
        if (stats.startTime) {
            html += `<div class="stat-item">
                <strong>ระยะเวลาการสนทนา:</strong> ${calculateDuration(stats.startTime)}
            </div>`;
        }
    }
    
    // Category information
    if (selectedCategory && category) {
        html += `
            <div class="stat-item">
                <strong>หัวข้อที่เลือก:</strong> ${category.title}
            </div>
            <div class="stat-item">
                <strong>คำอธิบาย:</strong> ${category.description}
            </div>
        `;
    }
    
    // Conversation highlights
    if (history && history.length > 0) {
        const userMessages = history.filter(msg => msg.role === 'user').map(msg => msg.content);
        const aiMessages = history.filter(msg => msg.role === 'assistant').map(msg => msg.content);
        
        html += `
            <div class="conversation-highlights">
                <h4>ไฮไลท์การสนทนา:</h4>
                <div class="highlight-item">
                    <strong>ข้อความแรกจากคุณ:</strong> "${userMessages[0] ? userMessages[0].substring(0, 50) + '...' : 'ไม่พบ'}"
                </div>
                <div class="highlight-item">
                    <strong>ข้อความล่าสุด:</strong> "${userMessages[userMessages.length - 1] ? userMessages[userMessages.length - 1].substring(0, 50) + '...' : 'ไม่พบ'}"
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    element.innerHTML = html;
}

// Display AI-generated recommendations
function displayAIRecommendations(element, history, selectedCategory, category) {
    const recommendations = generateAIRecommendations(history, selectedCategory, category);
    
    let html = '<div class="recommendations-section">';
    
    if (selectedCategory && category) {
        html += `<h4>คำแนะนำสำหรับ ${category.title}:</h4>`;
    } else {
        html += '<h4>คำแนะนำทั่วไป:</h4>';
    }
    
    html += '<ul>';
    recommendations.forEach(rec => {
        html += `<li>${rec}</li>`;
    });
    html += '</ul>';
    
    html += '</div>';
    element.innerHTML = html;
}

// Generate AI recommendations based on conversation
function generateAIRecommendations(history, selectedCategory, category) {
    const recommendations = [];
    
    if (!history || history.length === 0) {
        return getDefaultRecommendations(selectedCategory);
    }
    
    // Analyze conversation content
    const userMessages = history.filter(msg => msg.role === 'user').map(msg => msg.content.toLowerCase());
    const aiMessages = history.filter(msg => msg.role === 'assistant').map(msg => msg.content.toLowerCase());
    
    // Extract key themes from conversation
    const themes = extractConversationThemes(userMessages, aiMessages);
    
    // Generate category-specific recommendations
    if (selectedCategory) {
        const categoryRecs = getCategorySpecificRecommendations(selectedCategory, themes);
        recommendations.push(...categoryRecs);
    }
    
    // Generate general recommendations based on conversation patterns
    const generalRecs = getGeneralRecommendations(themes, userMessages.length);
    recommendations.push(...generalRecs);
    
    // Ensure we have at least 4 recommendations
    while (recommendations.length < 4) {
        recommendations.push(getDefaultRecommendations(selectedCategory)[recommendations.length % 4]);
    }
    
    return recommendations.slice(0, 6); // Limit to 6 recommendations
}

// Extract themes from conversation
function extractConversationThemes(userMessages, aiMessages) {
    const themes = {
        questions: 0,
        problems: 0,
        goals: 0,
        emotions: 0,
        practical: 0
    };
    
    const allText = [...userMessages, ...aiMessages].join(' ');
    
    // Simple keyword analysis
    if (allText.includes('ทำอย่างไร') || allText.includes('วิธี') || allText.includes('?')) {
        themes.questions++;
    }
    if (allText.includes('ปัญหา') || allText.includes('ยาก') || allText.includes('ไม่รู้')) {
        themes.problems++;
    }
    if (allText.includes('เป้าหมาย') || allText.includes('อยาก') || allText.includes('ต้องการ')) {
        themes.goals++;
    }
    if (allText.includes('รู้สึก') || allText.includes('เครียด') || allText.includes('กังวล') || allText.includes('ดีใจ')) {
        themes.emotions++;
    }
    if (allText.includes('ทำ') || allText.includes('เริ่ม') || allText.includes('ลงมือ')) {
        themes.practical++;
    }
    
    return themes;
}

// Get category-specific recommendations
function getCategorySpecificRecommendations(category, themes) {
    const recommendations = {
        'การเงิน': [
            'สร้างงบประมาณรายเดือนและติดตามค่าใช้จ่าย',
            'ออมเงินอย่างน้อย 10% ของรายได้ทุกเดือน',
            'ศึกษาการลงทุนที่ปลอดภัยและเหมาะสมกับตัวเอง',
            'สร้างเงินออมฉุกเฉินอย่างน้อย 6 เท่าของค่าใช้จ่ายรายเดือน'
        ],
        'ชีวิต': [
            'ตั้งเป้าหมายชีวิตที่ชัดเจนและวัดผลได้',
            'พัฒนาทักษะใหม่ๆ ที่สนใจอย่างต่อเนื่อง',
            'สร้างสมดุลระหว่างงานและชีวิตส่วนตัว',
            'ดูแลสุขภาพกายและใจอย่างสม่ำเสมอ'
        ],
        'ความรัก': [
            'สื่อสารอย่างเปิดเผยและซื่อสัตย์กับคนรัก',
            'ให้เวลาและความสนใจกับความสัมพันธ์',
            'เข้าใจและยอมรับความแตกต่างของกันและกัน',
            'สร้างความเชื่อมั่นและความปลอดภัยในความสัมพันธ์'
        ],
        'ครอบครัว': [
            'ใช้เวลาคุณภาพกับครอบครัวอย่างสม่ำเสมอ',
            'สื่อสารอย่างเปิดใจและเข้าใจกัน',
            'ช่วยเหลือและสนับสนุนกันในครอบครัว',
            'สร้างความทรงจำที่ดีร่วมกัน'
        ],
        'การศึกษา': [
            'ตั้งเป้าหมายการเรียนรู้ที่ชัดเจนและวัดผลได้',
            'พัฒนาทักษะการจัดการเวลาและการเรียน',
            'หาวิธีการเรียนรู้ที่เหมาะกับตัวเอง',
            'ประยุกต์ความรู้ในชีวิตจริง'
        ],
        'อาชีพ': [
            'พัฒนาทักษะที่จำเป็นสำหรับอาชีพอย่างต่อเนื่อง',
            'สร้างเครือข่ายความสัมพันธ์ในวงการ',
            'หาความสมดุลระหว่างงานและชีวิตส่วนตัว',
            'วางแผนการพัฒนาอาชีพระยะยาว'
        ],
        'สุขภาพ': [
            'ออกกำลังกายอย่างสม่ำเสมออย่างน้อย 30 นาทีต่อวัน',
            'รับประทานอาหารที่มีประโยชน์และครบถ้วน',
            'นอนหลับให้เพียงพอ 7-8 ชั่วโมงต่อคืน',
            'จัดการความเครียดอย่างเหมาะสม'
        ],
        'ธุรกิจ': [
            'ศึกษาตลาดและคู่แข่งอย่างต่อเนื่อง',
            'สร้างแผนธุรกิจที่ชัดเจนและปฏิบัติได้',
            'พัฒนาความสัมพันธ์กับลูกค้าและพันธมิตร',
            'จัดการการเงินอย่างรอบคอบและโปร่งใส'
        ],
        'อื่นๆ': [
            'สำรวจความสนใจใหม่ๆ อย่างต่อเนื่อง',
            'พัฒนาทักษะที่หลากหลายและทันสมัย',
            'สร้างสมดุลในชีวิตทุกด้าน',
            'เรียนรู้จากประสบการณ์และปรับปรุงตัวเอง'
        ]
    };
    
    return recommendations[category] || recommendations['อื่นๆ'];
}

// Get general recommendations based on conversation patterns
function getGeneralRecommendations(themes, messageCount) {
    const recommendations = [];
    
    if (themes.questions > 0) {
        recommendations.push('หาคำตอบจากแหล่งข้อมูลที่น่าเชื่อถือและหลากหลาย');
    }
    
    if (themes.problems > 0) {
        recommendations.push('แบ่งปัญหาออกเป็นส่วนย่อยและแก้ไขทีละขั้นตอน');
    }
    
    if (themes.goals > 0) {
        recommendations.push('ตั้งเป้าหมายที่ SMART (เฉพาะเจาะจง วัดผลได้ บรรลุได้ สัมพันธ์กับเวลา)');
    }
    
    if (themes.emotions > 0) {
        recommendations.push('ฝึกการจัดการอารมณ์และความเครียดอย่างเหมาะสม');
    }
    
    if (themes.practical > 0) {
        recommendations.push('ลงมือทำทันทีและไม่กลัวที่จะผิดพลาด');
    }
    
    if (messageCount > 10) {
        recommendations.push('กลับมาสนทนาเพื่อติดตามความก้าวหน้าและขอคำแนะนำเพิ่มเติม');
    }
    
    return recommendations;
}

// Get default recommendations
function getDefaultRecommendations(category) {
    return getCategorySpecificRecommendations(category || 'อื่นๆ', {});
}

// Display key insights
function displayKeyInsights(element, history, stats, selectedCategory) {
    const insights = generateKeyInsights(history, stats, selectedCategory);
    
    let html = '<div class="insights-section">';
    html += '<ul>';
    insights.forEach(insight => {
        html += `<li>${insight}</li>`;
    });
    html += '</ul>';
    html += '</div>';
    
    element.innerHTML = html;
}

// Generate key insights
function generateKeyInsights(history, stats, selectedCategory) {
    const insights = [];
    
    if (!history || history.length === 0) {
        return ['เริ่มสนทนาเพื่อเรียนรู้ประเด็นสำคัญจาก AI เพื่อน'];
    }
    
    // Analyze conversation patterns
    const userMessages = history.filter(msg => msg.role === 'user');
    const aiMessages = history.filter(msg => msg.role === 'assistant');
    
    // Basic insights
    insights.push(`คุณได้สนทนากับ AI เพื่อนเป็นเวลา ${calculateDuration(stats?.startTime)}`);
    
    if (userMessages.length > aiMessages.length) {
        insights.push('คุณเป็นคนที่ชอบถามและแชร์ความคิดเห็น');
    } else {
        insights.push('คุณเป็นคนที่รับฟังคำแนะนำจากผู้อื่น');
    }
    
    if (stats?.topics && stats.topics.length > 0) {
        insights.push(`คุณสนใจในหัวข้อ: ${stats.topics.join(', ')}`);
    }
    
    if (selectedCategory) {
        insights.push(`คุณเลือกที่จะเน้นการสนทนาในหัวข้อ ${selectedCategory}`);
    }
    
    // Add category-specific insights
    if (selectedCategory) {
        const categoryInsights = getCategoryInsights(selectedCategory);
        insights.push(...categoryInsights);
    }
    
    // Add general insights
    insights.push('การสนทนาช่วยให้เข้าใจตัวเองและสถานการณ์มากขึ้น');
    insights.push('การรับฟังคำแนะนำจากผู้อื่นช่วยให้เห็นมุมมองใหม่');
    
    return insights.slice(0, 5); // Limit to 5 insights
}

// Get category-specific insights
function getCategoryInsights(category) {
    const insights = {
        'การเงิน': [
            'การวางแผนการเงินที่ดีช่วยให้ชีวิตมั่นคง',
            'การออมเงินเป็นนิสัยที่ต้องสร้างและรักษา'
        ],
        'ชีวิต': [
            'การตั้งเป้าหมายที่ชัดเจนช่วยให้ชีวิตมีทิศทาง',
            'การพัฒนาตัวเองอย่างต่อเนื่องเป็นกุญแจสู่ความสำเร็จ'
        ],
        'ความรัก': [
            'การสื่อสารที่ดีเป็นพื้นฐานของความสัมพันธ์ที่ยืนยาว',
            'ความเข้าใจและยอมรับเป็นกุญแจสู่ความรักที่แท้จริง'
        ],
        'ครอบครัว': [
            'เวลาและความใส่ใจเป็นของขวัญที่ดีที่สุดสำหรับครอบครัว',
            'การสื่อสารที่ดีช่วยสร้างความเข้าใจในครอบครัว'
        ],
        'การศึกษา': [
            'การเรียนรู้ตลอดชีวิตช่วยให้ก้าวทันโลกที่เปลี่ยนแปลง',
            'การตั้งเป้าหมายการเรียนรู้ช่วยให้เรียนอย่างมีประสิทธิภาพ'
        ],
        'อาชีพ': [
            'การพัฒนาทักษะอย่างต่อเนื่องช่วยให้ก้าวหน้าในอาชีพ',
            'การสร้างเครือข่ายช่วยเปิดโอกาสใหม่ๆ ในอาชีพ'
        ],
        'สุขภาพ': [
            'การดูแลสุขภาพเป็นรากฐานของชีวิตที่ดี',
            'การสร้างนิสัยสุขภาพที่ดีต้องใช้เวลาและความสม่ำเสมอ'
        ],
        'ธุรกิจ': [
            'การวางแผนที่ดีเป็นกุญแจสู่ความสำเร็จในธุรกิจ',
            'การเข้าใจลูกค้าและตลาดช่วยให้ธุรกิจเติบโต'
        ],
        'อื่นๆ': [
            'การสำรวจความสนใจใหม่ๆ ช่วยให้ชีวิตน่าสนใจ',
            'การพัฒนาตัวเองในหลายด้านช่วยให้ชีวิตสมดุล'
        ]
    };
    
    return insights[category] || insights['อื่นๆ'];
}

// Display next steps
function displayNextSteps(element, selectedCategory, category) {
    const steps = generateNextSteps(selectedCategory, category);
    
    let html = '<div class="next-steps-section">';
    html += '<ol>';
    steps.forEach(step => {
        html += `<li>${step}</li>`;
    });
    html += '</ol>';
    html += '</div>';
    
    element.innerHTML = html;
}

// Generate next steps
function generateNextSteps(selectedCategory, category) {
    const steps = [];
    
    if (selectedCategory && category) {
        const categorySteps = getCategoryNextSteps(selectedCategory);
        steps.push(...categorySteps);
    } else {
        steps.push(
            'เริ่มสนทนากับ AI เพื่อนในหัวข้อที่สนใจ',
            'เลือกหัวข้อเฉพาะที่ต้องการคำแนะนำ',
            'นำคำแนะนำไปปฏิบัติในชีวิตประจำวัน',
            'ติดตามผลลัพธ์และปรับปรุงอย่างต่อเนื่อง',
            'กลับมาสนทนาเพื่อขอคำแนะนำเพิ่มเติม'
        );
    }
    
    // Add general next steps
    steps.push('แบ่งปันประสบการณ์และความรู้กับผู้อื่น');
    steps.push('ตั้งเป้าหมายใหม่และพัฒนาตัวเองอย่างต่อเนื่อง');
    
    return steps.slice(0, 6); // Limit to 6 steps
}

// Get category-specific next steps
function getCategoryNextSteps(category) {
    const steps = {
        'การเงิน': [
            'นำคำแนะนำเรื่องการเงินไปปฏิบัติทันที',
            'สร้างงบประมาณรายเดือนและติดตามค่าใช้จ่าย',
            'เริ่มออมเงินตามเป้าหมายที่ตั้งไว้',
            'ศึกษาการลงทุนที่เหมาะสมกับตัวเอง',
            'ติดตามผลลัพธ์และปรับปรุงแผนการเงิน'
        ],
        'ชีวิต': [
            'นำคำแนะนำไปปรับใช้ในชีวิตประจำวัน',
            'ตั้งเป้าหมายชีวิตที่ชัดเจนและวัดผลได้',
            'พัฒนาทักษะใหม่ๆ ตามที่สนใจ',
            'สร้างสมดุลระหว่างงานและชีวิตส่วนตัว',
            'ติดตามความก้าวหน้าและปรับปรุงอย่างต่อเนื่อง'
        ],
        'ความรัก': [
            'นำคำแนะนำไปใช้ในความสัมพันธ์ปัจจุบัน',
            'สื่อสารอย่างเปิดเผยและซื่อสัตย์กับคนรัก',
            'ให้เวลาและความสนใจกับความสัมพันธ์',
            'เข้าใจและยอมรับความแตกต่างของกันและกัน',
            'สร้างความเชื่อมั่นและความปลอดภัยในความสัมพันธ์'
        ],
        'ครอบครัว': [
            'นำคำแนะนำไปใช้กับครอบครัว',
            'ใช้เวลาคุณภาพกับครอบครัวอย่างสม่ำเสมอ',
            'สื่อสารอย่างเปิดใจและเข้าใจกัน',
            'ช่วยเหลือและสนับสนุนกันในครอบครัว',
            'สร้างความทรงจำที่ดีร่วมกัน'
        ],
        'การศึกษา': [
            'นำคำแนะนำไปใช้ในการเรียน',
            'ตั้งเป้าหมายการเรียนรู้ที่ชัดเจน',
            'พัฒนาทักษะการจัดการเวลาและการเรียน',
            'หาวิธีการเรียนรู้ที่เหมาะกับตัวเอง',
            'ประยุกต์ความรู้ในชีวิตจริง'
        ],
        'อาชีพ': [
            'นำคำแนะนำไปใช้ในการทำงาน',
            'พัฒนาทักษะที่จำเป็นสำหรับอาชีพ',
            'สร้างเครือข่ายความสัมพันธ์ในวงการ',
            'หาความสมดุลระหว่างงานและชีวิตส่วนตัว',
            'วางแผนการพัฒนาอาชีพระยะยาว'
        ],
        'สุขภาพ': [
            'นำคำแนะนำไปใช้ในการดูแลสุขภาพ',
            'ออกกำลังกายอย่างสม่ำเสมอ',
            'รับประทานอาหารที่มีประโยชน์และครบถ้วน',
            'นอนหลับให้เพียงพอ',
            'จัดการความเครียดอย่างเหมาะสม'
        ],
        'ธุรกิจ': [
            'นำคำแนะนำไปใช้ในการทำธุรกิจ',
            'ศึกษาตลาดและคู่แข่งอย่างต่อเนื่อง',
            'สร้างแผนธุรกิจที่ชัดเจนและปฏิบัติได้',
            'พัฒนาความสัมพันธ์กับลูกค้าและพันธมิตร',
            'จัดการการเงินอย่างรอบคอบและโปร่งใส'
        ],
        'อื่นๆ': [
            'นำคำแนะนำไปใช้ในชีวิตประจำวัน',
            'สำรวจความสนใจใหม่ๆ',
            'พัฒนาทักษะที่หลากหลาย',
            'สร้างสมดุลในชีวิตทุกด้าน',
            'เรียนรู้จากประสบการณ์และปรับปรุงตัวเอง'
        ]
    };
    
    return steps[category] || steps['อื่นๆ'];
}

// Display default summary when no data
function displayDefaultSummary() {
    const summaryElement = document.getElementById('conversation-summary');
    const recommendationsElement = document.getElementById('action-recommendations');
    const insightsElement = document.getElementById('key-insights');
    const nextStepsElement = document.getElementById('next-steps');
    
    summaryElement.innerHTML = `
        <div class="no-data-section">
            <p>ไม่พบข้อมูลการสนทนา</p>
            <p>คุณสามารถเริ่มสนทนาใหม่เพื่อสร้างสรุปได้</p>
        </div>
    `;
    
    recommendationsElement.innerHTML = `
        <div class="recommendations-section">
            <h4>คำแนะนำทั่วไป:</h4>
            <ul>
                <li>ตั้งเป้าหมายที่ชัดเจน</li>
                <li>ลงมือทำอย่างสม่ำเสมอ</li>
                <li>เรียนรู้จากประสบการณ์</li>
                <li>ไม่ยอมแพ้เมื่อเจออุปสรรค</li>
            </ul>
        </div>
    `;
    
    insightsElement.innerHTML = `
        <div class="insights-section">
            <p>เริ่มสนทนาเพื่อเรียนรู้ประเด็นสำคัญ</p>
        </div>
    `;
    
    nextStepsElement.innerHTML = `
        <div class="next-steps-section">
            <ol>
                <li>เริ่มสนทนากับ AI เพื่อน</li>
                <li>เลือกหัวข้อที่สนใจ</li>
                <li>รับคำแนะนำและคำปรึกษา</li>
                <li>นำไปปฏิบัติในชีวิตประจำวัน</li>
                <li>กลับมาสนทนาเพื่อพัฒนาต่อ</li>
            </ol>
        </div>
    `;
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
