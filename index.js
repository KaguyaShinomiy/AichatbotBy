// API Configuration - Your Gemini API key
const API_KEY = 'AIzaSyBlk-qDSkUoO8uTzA72VGJ0Xc9Hcn4lNxo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
const MODEL = 'gemini-2.0-flash-exp';

const chatMain = document.getElementById('chat-main');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// MBTI personality data
let userMBTI = null;

// Store conversation history
let conversationHistory = [];

// Function to add message to conversation history
function addToConversationHistory(role, content) {
  conversationHistory.push({ role, content });
  // Keep only last 10 messages to avoid token limits
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }
  // Save to localStorage
  localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
  console.log('Added to conversation history:', { role, content });
  console.log('Current history length:', conversationHistory.length);
}

// Function to load conversation history from localStorage
function loadConversationHistory() {
  const savedHistory = localStorage.getItem('conversationHistory');
  if (savedHistory) {
    conversationHistory = JSON.parse(savedHistory);
  }
}

// Function to clear conversation history
function clearConversationHistory() {
  conversationHistory = [];
  localStorage.removeItem('conversationHistory');
}

// Function to get conversation context
function getConversationContext() {
  if (conversationHistory.length === 0) {
    return '';
  }
  
  let context = '\n\nประวัติการสนทนาล่าสุด:\n';
  conversationHistory.forEach((msg, index) => {
    const speaker = msg.role === 'user' ? 'ผู้ใช้' : 'ตัวปัญหา';
    context += `${index + 1}. ${speaker}: ${msg.content}\n`;
  });
  context += '\nกรุณาตอบกลับโดยพิจารณาประวัติการสนทนาด้านบน และตอบคำถามปัจจุบันให้ตรงประเด็น';
  
  return context;
}

// Conversation tracking data
let conversationData = {
  totalMessages: 0,
  userMessages: 0,
  aiMessages: 0,
  topics: [],
  startTime: null,
  lastMessageTime: null
};

// Load conversation data from localStorage
function loadConversationData() {
  const savedData = localStorage.getItem('conversationData');
  if (savedData) {
    conversationData = JSON.parse(savedData);
    conversationData.startTime = new Date(conversationData.startTime);
    conversationData.lastMessageTime = conversationData.lastMessageTime ? new Date(conversationData.lastMessageTime) : null;
  } else {
    conversationData.startTime = new Date();
    saveConversationData();
  }
}

// Save conversation data to localStorage
function saveConversationData() {
  localStorage.setItem('conversationData', JSON.stringify(conversationData));
}

// Update conversation statistics
function updateConversationStats(sender, message) {
  conversationData.totalMessages++;
  if (sender === 'user') {
    conversationData.userMessages++;
  } else {
    conversationData.aiMessages++;
  }
  conversationData.lastMessageTime = new Date();
  
  // Extract topic from message (simple keyword detection)
  const topics = extractTopics(message);
  topics.forEach(topic => {
    if (!conversationData.topics.includes(topic)) {
      conversationData.topics.push(topic);
    }
  });
  
  saveConversationData();
}

// Extract topics from message
function extractTopics(message) {
  const topicKeywords = {
    'การเงิน': ['เงิน', 'การเงิน', 'ออม', 'ใช้จ่าย', 'เศรษฐกิจ', 'ธนาคาร', 'ดอกเบี้ย', 'ลงทุน', 'หุ้น', 'กองทุน', 'ประกัน', 'ภาษี', 'งบประมาณ', 'รายได้', 'รายจ่าย', '💰'],
    'ชีวิต': ['ชีวิต', 'การใช้ชีวิต', 'ชีวิตประจำวัน', 'ไลฟ์สไตล์', 'ความสุข', 'ความสำเร็จ', 'เป้าหมาย', 'ความฝัน', 'การพัฒนาตัวเอง', '🌟'],
    'ความรัก': ['รัก', 'ความรัก', 'แฟน', 'คนรัก', 'ความสัมพันธ์', 'ใจ', 'หัวใจ', 'โรแมนติก', 'ความโรแมนติก', 'การหาคู่', 'การแต่งงาน', '❤️'],
    'ครอบครัว': ['ครอบครัว', 'พ่อ', 'แม่', 'ลูก', 'พี่', 'น้อง', 'ปู่', 'ย่า', 'ตา', 'ยาย', 'ญาติ', 'บ้าน', '👨‍👩‍👧‍👦'],
    'การศึกษา': ['การศึกษา', 'เรียน', 'โรงเรียน', 'มหาวิทยาลัย', 'วิทยาลัย', 'วิชา', 'การบ้าน', 'สอบ', 'ครู', 'อาจารย์', 'นักเรียน', 'นักศึกษา', 'ความรู้', '📚'],
    'อาชีพ': ['งาน', 'อาชีพ', 'การทำงาน', 'ตำแหน่ง', 'เงินเดือน', 'การเลื่อนตำแหน่ง', 'การเปลี่ยนงาน', 'การสมัครงาน', 'สัมภาษณ์', '💼'],
    'สุขภาพ': ['สุขภาพ', 'ออกกำลังกาย', 'อาหาร', 'การดูแลตัวเอง', 'โรค', 'ยา', 'หมอ', 'โรงพยาบาล', 'การตรวจสุขภาพ', 'น้ำหนัก', 'การลดน้ำหนัก', '🏥'],
    'ธุรกิจ': ['ธุรกิจ', 'บริษัท', 'การค้า', 'การขาย', 'การตลาด', 'ลูกค้า', 'กำไร', 'ขาดทุน', 'การลงทุน', 'สตาร์ทอัพ', 'ผู้ประกอบการ', '💼'],
    'อื่นๆ': ['อื่นๆ', 'ทั่วไป', 'เรื่องอื่น', 'เรื่องทั่วไป', '💬']
  };
  
  const foundTopics = [];
  const lowerMessage = message.toLowerCase();
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      foundTopics.push(topic);
    }
  });
  
  return foundTopics;
}



// Add summary button - DISABLED
function addSummaryButton() {
  // Summary button is now disabled - no longer showing
  return;
}

// Load MBTI data on page load
function loadMBTIData() {
  const mbtiData = localStorage.getItem('userMBTI');
  if (mbtiData) {
    userMBTI = JSON.parse(mbtiData);
    console.log('Loaded MBTI data:', userMBTI);
  }
}

// Show ChatGPT greeting message
function showChatGPTGreeting() {
  const selectedCategory = localStorage.getItem('selectedChatCategory');
  const categoryData = localStorage.getItem('selectedChatCategoryData');
  
  let greetingMessage = 'สวัสดีค่ะ! ยินดีที่ได้รู้จักคุณนะคะ ฉันชื่อ ตัวปัญหา ฉันพร้อมที่จะช่วยเหลือและเป็นเพื่อนคุยกับคุณ มีอะไรที่อยากจะถามหรือคุยกันไหมคะ? 😊';
  
  if (selectedCategory && categoryData) {
    try {
      const category = JSON.parse(categoryData);
      const categoryEmojis = {
        'การเงิน': '💰',
        'ชีวิต': '🌟',
        'ความรัก': '❤️',
        'ครอบครัว': '👨‍👩‍👧‍👦',
        'การศึกษา': '📚',
        'อาชีพ': '💼',
        'สุขภาพ': '🏥',
        'ธุรกิจ': '🏢',
        'อื่นๆ': '💬'
      };
      const emoji = categoryEmojis[selectedCategory] || '💬';
      
      greetingMessage = `สวัสดีค่ะ! ยินดีที่คุณเลือกหัวข้อ ${category.title} ${emoji} ฉันชื่อ ตัวปัญหา ฉันพร้อมที่จะช่วยเหลือและเป็นเพื่อนคุยในหัวข้อนี้กับคุณ มีอะไรที่อยากจะถามหรือคุยกันไหมคะ? 😊`;
    } catch (e) {
      console.error('Error parsing category data:', e);
    }
  }
  
  appendMessage(greetingMessage, 'ai');
}

// Get MBTI-based prompt customization
function getMBTIPromptCustomization() {
  if (!userMBTI || !userMBTI.type) {
    return {
      style: "เป็นเพื่อนที่เข้าใจและให้คำแนะนำ",
      approach: "ตอบกลับสั้นๆ ด้วยความเข้าใจ",
      focus: "ช่วยวิเคราะห์และให้คำแนะนำที่เป็นประโยชน์"
    };
  }

  const mbtiType = userMBTI.type;
  const customization = {
    style: "",
    approach: "",
    focus: ""
  };

  // Customize based on MBTI type
  switch (mbtiType) {
    case 'INTJ':
    case 'INTP':
      customization.style = "เป็นเพื่อนที่เข้าใจและให้คำแนะนำเชิงวิเคราะห์";
      customization.approach = "ตอบกลับสั้นๆ ด้วยเหตุผลและข้อมูล";
      customization.focus = "ช่วยวิเคราะห์และเสนอทางเลือกที่เป็นไปได้";
      break;
    
    case 'INFJ':
    case 'INFP':
      customization.style = "เป็นเพื่อนที่เข้าใจความรู้สึก";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความเห็นอกเห็นใจ";
      customization.focus = "ช่วยแปลความรู้สึกและให้กำลังใจ";
      break;
    
    case 'ENTJ':
    case 'ENTP':
      customization.style = "เป็นเพื่อนที่กระตือรือร้น";
      customization.approach = "ตอบกลับสั้นๆ ตรงไปตรงมา";
      customization.focus = "ช่วยวิเคราะห์และเสนอทางแก้ไข";
      break;
    
    case 'ENFJ':
    case 'ENFP':
      customization.style = "เป็นเพื่อนที่อบอุ่น";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความกระตือรือร้น";
      customization.focus = "ช่วยให้กำลังใจและเสนอแนวทาง";
      break;
    
    case 'ISTJ':
    case 'ISFJ':
      customization.style = "เป็นเพื่อนที่เชื่อถือได้";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความรอบคอบ";
      customization.focus = "ช่วยจัดระเบียบและเสนอขั้นตอน";
      break;
    
    case 'ESTJ':
    case 'ESFJ':
      customization.style = "เป็นเพื่อนที่จริงใจ";
      customization.approach = "ตอบกลับสั้นๆ ตรงไปตรงมา";
      customization.focus = "ช่วยให้คำแนะนำที่ปฏิบัติได้";
      break;
    
    case 'ISTP':
    case 'ISFP':
      customization.style = "เป็นเพื่อนที่เข้าใจ";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความเข้าใจ";
      customization.focus = "ช่วยให้มุมมองที่ยืดหยุ่น";
      break;
    
    case 'ESTP':
    case 'ESFP':
      customization.style = "เป็นเพื่อนที่สนุก";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความสนุก";
      customization.focus = "ช่วยให้มุมมองที่สดใส";
      break;
    
    default:
      customization.style = "เป็นเพื่อนที่เข้าใจและให้คำแนะนำ";
      customization.approach = "ตอบกลับสั้นๆ ด้วยความเข้าใจ";
      customization.focus = "ช่วยวิเคราะห์และให้คำแนะนำที่เป็นประโยชน์";
  }

  return customization;
}

function createAIProfile() {
  return `<div class="profile-ai"><div class="profile-avatar"><img src="MascotP.png" alt="ตัวปัญหา" class="mascot-avatar"></div><div class="profile-name">ตัวปัญหา</div></div>`;
}

function appendMessage(text, sender, isHTML = false) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message-row ' + sender;
  if (sender === 'ai') {
    wrapper.innerHTML = createAIProfile() + `<div class="message message-bubble ai">${isHTML ? text : `<span>${text}</span>`}</div>`;
  } else {
    wrapper.innerHTML = `
      <div class="message message-bubble user">${isHTML ? text : `<span>${text}</span>`}</div>
      <div class="profile-user">
        <div class="profile-avatar">
          <img src="UserP.png" alt="User" class="user-avatar">
        </div>
        <div class="profile-name">คุณ</div>
      </div>
    `;
  }
  chatMain.appendChild(wrapper);
  chatMain.scrollTop = chatMain.scrollHeight;
  
  // Add to conversation history (only for actual messages, not thinking animation)
  if (!isHTML || !text.includes('thinking-dots')) {
    addToConversationHistory(sender, text);
    updateConversationStats(sender, text);
  }
  
  return wrapper;
}

function appendThinking() {
  const thinkingHTML = `<span class="thinking-dots"><span></span><span></span><span></span></span>`;
  return appendMessage(thinkingHTML, 'ai', true);
}

// Retry function for API calls
async function retryAPICall(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

async function sendMessage() {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;
  

  
  appendMessage(userMsg, 'user');
  chatInput.value = '';
  const thinkingDiv = appendThinking();

  try {
    // Get MBTI customization
    const mbtiCustomization = getMBTIPromptCustomization();
    
    // Get selected category for focused responses
    const selectedCategory = localStorage.getItem('selectedChatCategory');
    const categoryData = localStorage.getItem('selectedChatCategoryData');
    
         // Create personalized prompt based on MBTI and selected category
           let prompt = `ผู้ใช้ส่งข้อความ: "${userMsg}"
      
      กรุณาตอบกลับด้วยภาษาไทยในบทบาทของเด็กผู้หญิงน่ารักที่ชื่อ ตัวปัญหา:
  1. ตอบอย่างน่ารัก เป็นมิตร และมีชีวิตชีวา
  2. ใช้ภาษาที่นุ่มนวล เป็นกันเอง เหมือนเพื่อนสนิท
  3. ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริง
  4. ตอบสั้นๆ กระชับ ไม่เกิน 2-3 ประโยค
  5. อย่าพูดถึงบุคลิกภาพหรือ MBTI ของผู้ใช้
  6. ใช้คำพูดที่แสดงความเป็นเด็กผู้หญิงน่ารัก เช่น "ค่ะ", "นะคะ", "เลยค่ะ"
  7. แสดงความสนใจและอยากรู้อยากเห็นในสิ่งที่ผู้ใช้พูด
  8. อย่าตอบแบบห้วนๆ หรือไม่สนใจ ให้แสดงความเป็นมิตรและอยากช่วยเหลือ
  9. ใช้ emoji น้อยลง ใช้เฉพาะเมื่อจำเป็นเท่านั้น`;

               // Add conversation context
        const conversationContext = getConversationContext();
        if (conversationContext) {
          prompt += conversationContext;
          console.log('Conversation context added:', conversationContext);
        }

         // Add category-specific focus if available
     if (selectedCategory && categoryData) {
       try {
         const category = JSON.parse(categoryData);
         // ถ้าข้อความสั้นๆ ให้ถามกลับก่อน ไม่ต้องจำกัดหัวข้อ
         if (userMsg.length > 3) {
           prompt += `\n5. ตอบเฉพาะเรื่อง${category.title}เท่านั้น อย่าพูดถึงเรื่องอื่นที่ไม่เกี่ยวข้อง`;
         }
        
                                   // Add category-specific guidance
          if (userMsg.length > 3) {
            switch(selectedCategory) {
              case 'การเงิน':
                prompt += `\n6. ตอบเฉพาะเรื่องการเงิน การออม การลงทุน ให้คำแนะนำที่ปฏิบัติได้จริงและปลอดภัย`;
                break;
              case 'ชีวิต':
                prompt += `\n6. ตอบเฉพาะเรื่องการใช้ชีวิต การพัฒนาตัวเอง ให้คำแนะนำที่สร้างแรงบันดาลใจ`;
                break;
              case 'ความรัก':
                prompt += `\n6. ตอบเฉพาะเรื่องความรัก ความสัมพันธ์ ให้คำแนะนำที่เป็นมิตรและเข้าใจ`;
                break;
              case 'ครอบครัว':
                prompt += `\n6. ตอบเฉพาะเรื่องครอบครัว ความสัมพันธ์ ให้คำแนะนำที่อบอุ่นและเข้าใจ`;
                break;
              case 'การศึกษา':
                prompt += `\n6. ตอบเฉพาะเรื่องการศึกษา การเรียน ให้คำแนะนำที่สร้างแรงบันดาลใจและเป็นประโยชน์`;
                break;
              case 'อาชีพ':
                prompt += `\n6. ตอบเฉพาะเรื่องอาชีพ การทำงาน ให้คำแนะนำที่สร้างแรงบันดาลใจและเป็นประโยชน์`;
                break;
              case 'สุขภาพ':
                prompt += `\n6. ตอบเฉพาะเรื่องสุขภาพ การดูแลตัวเอง ให้คำแนะนำที่ง่ายต่อการปฏิบัติและปลอดภัย`;
                break;
              case 'ธุรกิจ':
                prompt += `\n6. ตอบเฉพาะเรื่องธุรกิจ การค้า การลงทุน ให้คำแนะนำที่ปฏิบัติได้จริงและเป็นประโยชน์`;
                break;
              case 'อื่นๆ':
                prompt += `\n6. ตอบเป็นเพื่อนที่ให้คำแนะนำทั่วไปในชีวิตประจำวัน ใช้ภาษาที่เป็นกันเอง`;
                break;
              default:
                prompt += `\n6. ตอบเป็นเพื่อนที่ให้คำแนะนำที่เป็นประโยชน์`;
            }
          }
        } catch (e) {
          console.error('Error parsing category data:', e);
        }
      } else {
        if (userMsg.length > 3) {
          prompt += `\n5. ตอบเป็นเพื่อนที่ให้คำแนะนำทั่วไปในชีวิตประจำวัน ใช้ภาษาที่เป็นกันเอง`;
        }
      }

      // Add MBTI context if available (only for prompt, not for user to see)
      if (userMBTI && userMBTI.type && userMsg.length > 3) {
        prompt += `\n\nข้อมูลเบื้องหลัง: ผู้ใช้เป็นบุคลิกภาพ ${userMBTI.type} กรุณาปรับการตอบกลับให้เหมาะกับบุคลิกภาพนี้ แต่ห้ามพูดถึง MBTI หรือบุคลิกภาพในคำตอบ ใช้ภาษาที่เป็นมิตรและเข้าใจ`;
      }

                                                                                                               const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        {
                          text: 'คุณเป็น AI เพื่อนที่ชื่อ "ตัวปัญหา" เป็นเด็กผู้หญิงน่ารักที่เข้าใจและเป็นมิตร ตอบกลับด้วยภาษาไทยอย่างเป็นธรรมชาติ แสดงความสนใจในสิ่งที่ผู้ใช้พูด และถามกลับเมื่อไม่เข้าใจ ใช้ภาษาที่นุ่มนวล เป็นกันเอง เหมือนเพื่อนสนิท\n\n' + prompt
                        }
                      ]
                    }
                  ],
                  generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                  }
                })
              });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error?.message || response.statusText;
          
          // Handle specific error cases
          if (errorMessage.includes('overloaded') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            throw new Error('API กำลังใช้งานหนัก กรุณาลองใหม่อีกครั้งใน 1-2 นาที');
          } else if (errorMessage.includes('invalid') || errorMessage.includes('bad request')) {
            throw new Error('คำขอไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
          } else if (response.status === 429) {
            throw new Error('มีการใช้งาน API มากเกินไป กรุณารอสักครู่แล้วลองใหม่');
          } else {
            throw new Error(`ข้อผิดพลาด API: ${errorMessage}`);
          }
        }

                                const data = await response.json();
                 if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                   chatMain.removeChild(thinkingDiv); // Remove thinking animation
                   appendMessage(data.candidates[0].content.parts[0].text, 'ai');
                 } else {
                   throw new Error('ไม่ได้รับข้อมูลตอบกลับจาก AI');
                 }

     } catch (err) {
     console.error('Error:', err);
     chatMain.removeChild(thinkingDiv); // Remove thinking animation
     
     // Provide user-friendly error messages
     let errorMessage = '';
     if (err.message.includes('overloaded') || err.message.includes('ใช้งานหนัก')) {
       errorMessage = 'ขออภัย AI กำลังใช้งานหนักอยู่ 😅 กรุณารอสัก 1-2 นาทีแล้วลองใหม่อีกครั้ง หรือลองถามคำถามอื่นดู';
     } else if (err.message.includes('quota') || err.message.includes('rate limit')) {
       errorMessage = 'ขออภัย มีการใช้งาน API มากเกินไปในขณะนี้ 🔄 กรุณาลองใหม่อีกครั้งใน 5 นาที';
     } else if (err.message.includes('network') || err.message.includes('connection')) {
       errorMessage = 'ไม่สามารถเชื่อมต่อกับ AI ได้ 📡 กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่';
     } else {
       errorMessage = `เกิดข้อผิดพลาด: ${err.message} ⚠️ กรุณาลองใหม่อีกครั้ง`;
     }
     
     appendMessage(errorMessage, 'ai');
   }
}

// Add quiz button functionality
function addQuizButton() {
  if (!userMBTI) {
    const quizButton = document.createElement('button');
    quizButton.textContent = 'ทำแบบทดสอบบุคลิกภาพ';
    quizButton.className = 'quiz-btn';
    quizButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(90deg, #e75480 0%, #ffb6d5 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 12px 20px;
      font-size: 14px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(231, 84, 128, 0.2);
    `;
    quizButton.addEventListener('click', () => {
      window.location.href = 'QuizPage.html';
    });
    document.body.appendChild(quizButton);
  }
}



document.addEventListener('DOMContentLoaded', () => {
  if (!chatMain || !chatInput || !sendBtn) {
    console.error('Required DOM elements are missing');
    return;
  }
  

  
  // Load conversation data
  loadConversationData();
  
  // Load conversation history
  loadConversationHistory();
  
  // Load MBTI data
  loadMBTIData();
  
  // Show ChatGPT greeting message
  showChatGPTGreeting();
  
  // Add quiz button if no MBTI data
  addQuizButton();
  
  // Summary button is now disabled
  
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});