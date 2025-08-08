document.addEventListener('DOMContentLoaded', () => {
    
    const display = document.getElementById('display');
    const keypad = document.querySelector('.keypad');
    const clearButton = document.querySelector('[data-action="clear"]');

    let currentExpression = '';
    let shouldResetDisplay = false;

    keypad.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        const { key, action } = target.dataset;
        
        // If a result was just calculated, start a new expression
        if (shouldResetDisplay && key && !target.classList.contains('operator')) {
            currentExpression = '';
            shouldResetDisplay = false;
        }
        // Always reset display if an action follows a result
        if (shouldResetDisplay && action) {
             shouldResetDisplay = false;
        }
        
        if (key) {
            currentExpression += key;
            // Change AC to C after first input
            if (clearButton.textContent === 'AC') {
                clearButton.textContent = 'C';
            }
        }
        
        if (action) {
            handleAction(action);
        }
        
        updateDisplay();
    });

    function handleAction(action) {
        switch (action) {
            case 'clear':
                currentExpression = '';
                clearButton.textContent = 'AC';
                break;
            case 'negate':
                // Check if there's something to negate
                if (currentExpression !== '') {
                    // Use math.js to correctly negate the last number or the whole expression
                    try {
                       currentExpression = math.evaluate(`-1 * (${currentExpression})`).toString();
                    } catch (e) {
                        // handle error if expression is not valid
                    }
                }
                break;
            case 'percentage':
                if (currentExpression !== '') {
                    currentExpression = `(${currentExpression}) / 100`;
                }
                break;
            case 'equals':
                calculateResult();
                break;
        }
    }

    function updateDisplay() {
        display.value = currentExpression === '' ? '0' : currentExpression;
    }



    function calculateResult() {
        if (currentExpression === '') return;
        try {
            // Use math.js to safely evaluate the expression with order of operations
            const result = math.evaluate(currentExpression);
            display.value = result;
            currentExpression = result.toString();
            shouldResetDisplay = true;
        } catch (error) {
            display.value = 'Error';
            currentExpression = '';
            shouldResetDisplay = true;
        }
    }
});