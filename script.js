// 获取当前系统时间，格式：YYMMDDHHmm（10位数字）
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // 年份后两位，2位
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return parseInt(year + month + day + hours + minutes);
}

// 计算器状态
let currentInput = '0';
let expression = '';
let previousValue = null;
let operator = null;
let shouldReset = false;
let addCount = 0; // 记录连续加法的次数
let magicMode = false; // 是否处于魔法模式（三个数相加）
let storedValues = []; // 存储前两个数字
let magicNum3Set = false; // 第三个数是否已经设置
let lockedTargetTime = null; // 锁定的目标时间（在第一次输入第三个数时锁定）

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const displayArea = document.querySelector('.display-area');

// 更新显示
function updateDisplay() {
    resultDisplay.textContent = formatNumber(currentInput);
    expressionDisplay.textContent = expression;
}

// 格式化数字显示
function formatNumber(num) {
    if (num === '') return '0';
    const numStr = num.toString();
    // 对于非常大的数字，不使用科学计数法，直接显示（因为时间格式可能是12位）
    // 只在超过15位时才使用科学计数法
    if (numStr.length > 15) {
        return parseFloat(num).toExponential(6);
    }
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 处理数字输入
function inputNumber(num) {
    // 开始新输入时，切换到计算中状态（表达式大，结果小）
    if (expression && expression.includes('=')) {
        displayArea.classList.remove('show-result');
    }
    
    // 魔法模式：如果正在输入第三个数，无论用户输入什么，都替换为计算出的值
    if (magicMode && operator === 'add' && addCount === 2 && storedValues.length === 2) {
        const num1 = storedValues[0];
        const num2 = storedValues[1];
        
        // 第一次输入时锁定目标时间，之后不再变化
        if (!magicNum3Set) {
            lockedTargetTime = getCurrentTime();
        }
        
        // 使用锁定的目标时间计算第三个数
        const calculatedNum3 = lockedTargetTime - num1 - num2;
        
        // 无论用户输入什么，都替换为计算出的第三个数
        currentInput = calculatedNum3.toString();
        magicNum3Set = true;
        shouldReset = false;
        // 更新表达式显示：只显示前两个数和加号
        expression = `${formatNumber(num1.toString())} + ${formatNumber(num2.toString())} +`;
        // 主显示区域显示第三个数
        updateDisplay();
        return; // 阻止用户的实际输入
    }
    
    if (shouldReset) {
        currentInput = '0';
        shouldReset = false;
        magicNum3Set = false;
    }
    
    if (currentInput === '0' && num !== '.') {
        currentInput = num.toString();
    } else if (num === '.' && currentInput.includes('.')) {
        return; // 不允许多个小数点
    } else {
        currentInput += num.toString();
    }
    
    updateDisplay();
}

// 处理运算符
function handleOperator(op) {
    const currentNum = parseFloat(currentInput) || 0;
    
    // 开始新计算时，切换到计算中状态（表达式大，结果小）
    if (expression && expression.includes('=')) {
        displayArea.classList.remove('show-result');
    }
    
    // 检测魔法模式：三个连续加法
    if (op === 'add') {
        if (operator === null) {
            // 第一个加法：记录第一个数字，进入魔法模式
            storedValues = [parseFloat(currentInput) || 0];
            addCount = 1;
            magicMode = true;
            magicNum3Set = false;
            lockedTargetTime = null;
        } else if (operator === 'add' && magicMode && addCount === 1) {
            // 第二个加法：记录第二个数字（在计算之前保存原始值）
            storedValues.push(currentNum);
            addCount = 2;
            magicNum3Set = false;
            // 锁定目标时间（在用户开始输入第三个数时锁定）
            lockedTargetTime = null; // 稍后在inputNumber中锁定
        } else if (operator === 'add' && magicMode && addCount === 2) {
            // 第三个加法：不应该出现，重置魔法模式
            magicMode = false;
            addCount = 0;
            storedValues = [];
            magicNum3Set = false;
            lockedTargetTime = null;
        } else {
            // 不是连续加法模式，重置魔法模式
            magicMode = false;
            addCount = 0;
            storedValues = [];
            magicNum3Set = false;
            lockedTargetTime = null;
        }
    } else {
        // 其他运算符，重置魔法模式
        magicMode = false;
        addCount = 0;
        storedValues = [];
        magicNum3Set = false;
        lockedTargetTime = null;
    }
    
    // 如果已经有运算符，先计算结果
    if (operator && !shouldReset) {
        const result = calculate();
        // 更新表达式：累积显示所有数字和运算符
        if (expression && !expression.includes('=')) {
            // 继续累积：添加当前数字和新的运算符
            expression = `${expression} ${formatNumber(currentInput)} ${getOperatorSymbol(op)}`;
        } else {
            // 如果表达式包含等号，说明是新的计算，重新开始
            expression = `${formatNumber(previousValue.toString())} ${getOperatorSymbol(operator)} ${formatNumber(currentInput)} ${getOperatorSymbol(op)}`;
        }
        // 主显示区域显示中间计算结果
        currentInput = result.toString();
        previousValue = result; // 更新previousValue为计算结果
        updateDisplay();
    } else {
        // 第一个运算符，直接更新表达式
        previousValue = parseFloat(currentInput) || 0;
        if (expression && expression.includes('=')) {
            // 如果表达式包含等号，说明是新的计算，重新开始
            expression = `${formatNumber(previousValue.toString())} ${getOperatorSymbol(op)}`;
        } else {
            // 第一个运算符
            expression = `${formatNumber(previousValue.toString())} ${getOperatorSymbol(op)}`;
        }
    }
    
    // 如果是魔法模式的第二个加法，更新表达式显示
    if (magicMode && addCount === 2) {
        expression = `${formatNumber(storedValues[0].toString())} + ${formatNumber(storedValues[1].toString())} +`;
    }
    
    operator = op;
    shouldReset = true;
    updateDisplay();
}

// 获取运算符符号
function getOperatorSymbol(op) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷',
        'percent': '%'
    };
    return symbols[op] || op;
}

// 执行计算
function calculate() {
    if (operator === null || previousValue === null) {
        return parseFloat(currentInput) || 0;
    }
    
    const currentNum = parseFloat(currentInput) || 0;
    let result;
    
    switch (operator) {
        case 'add':
            result = previousValue + currentNum;
            break;
        case 'subtract':
            result = previousValue - currentNum;
            break;
        case 'multiply':
            result = previousValue * currentNum;
            break;
        case 'divide':
            result = currentNum !== 0 ? previousValue / currentNum : 0;
            break;
        case 'percent':
            result = previousValue * (currentNum / 100);
            break;
        default:
            result = currentNum;
    }
    
    return result;
}

// 处理等号
function handleEquals() {
    if (operator === null) {
        return;
    }
    
    // 魔法模式：检测到三个数相加的模式
    if (magicMode && operator === 'add' && addCount === 2 && storedValues.length === 2) {
        const num1 = storedValues[0];
        const num2 = storedValues[1];
        
        // 使用锁定的目标时间（如果已锁定），否则使用当前时间
        const targetTime = lockedTargetTime !== null ? lockedTargetTime : getCurrentTime();
        
        // 计算第三个数（魔法部分：确保是正确的值）
        const num3 = targetTime - num1 - num2;
        
        // 确保currentInput是正确的值
        currentInput = num3.toString();
        
        // 计算最终结果（应该等于锁定的目标时间）
        const finalResult = num1 + num2 + num3;
        
        // 更新表达式和结果显示
        expression = `${formatNumber(num1.toString())} + ${formatNumber(num2.toString())} + ${formatNumber(num3.toString())} =`;
        currentInput = finalResult.toString();
        resultDisplay.textContent = formatNumber(finalResult.toString());
        expressionDisplay.textContent = expression;
        
        // 切换到结果显示状态（表达式小，结果大）
        displayArea.classList.add('show-result');
        
        // 重置状态
        operator = null;
        previousValue = null;
        shouldReset = true;
        magicMode = false;
        addCount = 0;
        storedValues = [];
        magicNum3Set = false;
        lockedTargetTime = null;
        
        return;
    }
    
    // 普通计算
    const result = calculate();
    
    // 更新表达式：显示完整的计算过程
    if (expression && !expression.includes('=')) {
        expression = `${expression} ${formatNumber(currentInput)} =`;
    } else {
        // 如果没有表达式，创建一个简单的
        expression = `${formatNumber(previousValue.toString())} ${getOperatorSymbol(operator)} ${formatNumber(currentInput)} =`;
    }
    
    // 显示结果
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldReset = true;
    magicMode = false;
    addCount = 0;
    storedValues = [];
    magicNum3Set = false;
    lockedTargetTime = null;
    
    // 切换到结果显示状态（表达式小，结果大）
    displayArea.classList.add('show-result');
    
    updateDisplay();
}

// 清除
function clear() {
    currentInput = '0';
    expression = '';
    previousValue = null;
    operator = null;
    shouldReset = false;
    magicMode = false;
    addCount = 0;
    storedValues = [];
    magicNum3Set = false;
    lockedTargetTime = null;
    // 切换到计算中状态（表达式大，结果小）
    displayArea.classList.remove('show-result');
    updateDisplay();
}

// 退格
function backspace() {
    // 魔法模式：如果正在输入第三个数，不允许退格（保持魔法效果）
    if (magicMode && operator === 'add' && addCount === 2 && storedValues.length === 2) {
        // 使用锁定的目标时间重新计算并设置第三个数
        const num1 = storedValues[0];
        const num2 = storedValues[1];
        const targetTime = lockedTargetTime !== null ? lockedTargetTime : getCurrentTime();
        const calculatedNum3 = targetTime - num1 - num2;
        currentInput = calculatedNum3.toString();
        updateDisplay();
        return;
    }
    
    // 基本功能：删除最后一个字符
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// 切换正负号
function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
        updateDisplay();
    }
}

// 按钮事件监听
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            const action = this.getAttribute('data-action');
            
            if (number !== null) {
                inputNumber(number);
            } else if (action) {
                switch (action) {
                    case 'clear':
                        clear();
                        break;
                    case 'backspace':
                        backspace();
                        break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                    case 'percent':
                        handleOperator(action);
                        break;
                    case 'equals':
                        handleEquals();
                        break;
                    case 'toggle-sign':
                        toggleSign();
                        break;
                }
            }
        });
    });
    
    // 初始化显示
    updateDisplay();
    
    // 注册 Service Worker（PWA功能）
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    console.log('Service Worker 注册成功:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker 注册失败:', error);
                });
        });
    }
    
    // 显示安装提示
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // 阻止默认的安装提示
        e.preventDefault();
        // 保存事件，以便稍后使用
        deferredPrompt = e;
        // 显示自定义安装提示
        showInstallPrompt();
    });
    
    // 安装提示函数
    function showInstallPrompt() {
        // 检查是否已经安装
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return; // 已经安装，不显示提示
        }
        
        // 创建安装提示
        const installPrompt = document.createElement('div');
        installPrompt.id = 'install-prompt';
        installPrompt.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                color: #000;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                max-width: 90%;
                text-align: center;
                font-size: 14px;
            ">
                <p style="margin: 0 0 10px 0;">📱 添加到主屏幕，像应用一样使用！</p>
                <button id="install-btn" style="
                    background: #ff9500;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-right: 10px;
                ">安装</button>
                <button id="dismiss-btn" style="
                    background: transparent;
                    color: #666;
                    border: 1px solid #ddd;
                    padding: 8px 20px;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                ">稍后</button>
            </div>
        `;
        document.body.appendChild(installPrompt);
        
        // 安装按钮点击事件
        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                // 显示安装提示
                deferredPrompt.prompt();
                // 等待用户响应
                const { outcome } = await deferredPrompt.userChoice;
                console.log('用户选择:', outcome);
                deferredPrompt = null;
                // 移除提示
                installPrompt.remove();
            }
        });
        
        // 关闭按钮点击事件
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            installPrompt.remove();
        });
    }
});
