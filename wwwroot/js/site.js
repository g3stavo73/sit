let currentInput = "0";
let firstOperand = null;
let currentOperation = null;
let waitingForSecondOperand = false;

const mainDisplay = document.getElementById("mainDisplay");
const subDisplay = document.getElementById("subDisplay");
const errorMessage = document.getElementById("errorMessage");

function updateDisplay() {
    mainDisplay.innerText = currentInput;
    if (firstOperand !== null && currentOperation !== null) {
        subDisplay.innerText = `${firstOperand} ${currentOperation}`;
    } else {
        subDisplay.innerText = "";
    }
}

function showError(msg) {
    errorMessage.innerText = msg;
    errorMessage.classList.remove("hidden");
}

function clearError() {
    errorMessage.classList.add("hidden");
    errorMessage.innerText = "";
}

function appendNum(num) {
    clearError();
    if (waitingForSecondOperand) {
        currentInput = num;
        waitingForSecondOperand = false;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput = currentInput === "0" && num !== '.' ? num : currentInput + num;
    }
    updateDisplay();
}

function deleteLast() {
    clearError();
    if (waitingForSecondOperand) return;
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateDisplay();
}

function clearCalculator() {
    clearError();
    currentInput = "0";
    firstOperand = null;
    currentOperation = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function setOp(op) {
    clearError();
    firstOperand = parseFloat(currentInput);
    currentOperation = op;
    waitingForSecondOperand = true;
    updateDisplay();
}

async function calculate() {
    if (firstOperand === null || currentOperation === null || waitingForSecondOperand) return;

    const secondOperand = parseFloat(currentInput);

    try {
        const response = await fetch('/Home/Calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number1: firstOperand,
                number2: secondOperand,
                operation: currentOperation
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || "Erro no cálculo.");
            return;
        }

        currentInput = data.result.toString();
        firstOperand = null;
        currentOperation = null;
        waitingForSecondOperand = true;
        updateDisplay();
        updateHistory(data.history);
    } catch (err) {
        showError("Falha na conexão com o servidor .NET.");
    }
}

function updateHistory(historyItems) {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    historyItems.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.number1} ${item.operation} ${item.number2}</span><strong>= ${item.result}</strong>`;
        historyList.appendChild(li);
    });
}

async function clearHistory() {
    try {
        await fetch('/Home/ClearHistory', { method: 'POST' });
        document.getElementById("historyList").innerHTML = "";
    } catch (err) {
        showError("Erro ao limpar histórico.");
    }
}
