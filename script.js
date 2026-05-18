function generatePolynomialInputs() {
    let termsCountInput = document.getElementById("termsCount");
    let container = document.getElementById("termsContainer");

    // Clear old inputs before creating new ones
    container.innerHTML = "";

    let termsCount = parseInt(termsCountInput.value);

    // Check if the number of terms is valid
    if (isNaN(termsCount) || termsCount <= 0) {
        container.innerHTML = "<p class='error'>Please enter a valid number of terms.</p>";
        return;
    }

    // Create coefficient and power inputs for each term
    for (let i = 0; i < termsCount; i++) {
        container.innerHTML += `
            <div class="card">
                <h3>Term ${i + 1}</h3>

                <label for="coef${i}">Coefficient</label>
                <input type="number" id="coef${i}" step="any" placeholder="Example: 2">

                <label for="power${i}">Power</label>
                <input type="number" id="power${i}" step="1" placeholder="Example: 3">
            </div>
        `;
    }
}

function calculateFunctionValue(x) {
    let termsCountInput = document.getElementById("termsCount");
    let termsCount = parseInt(termsCountInput.value);

    let result = 0;

    for (let i = 0; i < termsCount; i++) {
        let coefficientInput = document.getElementById("coef" + i);
        let powerInput = document.getElementById("power" + i);

        let coefficient = parseFloat(coefficientInput.value);
        let power = parseFloat(powerInput.value);
        let termValue = coefficient * Math.pow(x, power);

        result += termValue;
    }

    return result;
}

function calculateDerivativeValue(x) {
    let termsCountInput = document.getElementById("termsCount");
    let termsCount = parseInt(termsCountInput.value);

    let result = 0;

    for (let i = 0; i < termsCount; i++) {
        let coefficientInput = document.getElementById("coef" + i);
        let powerInput = document.getElementById("power" + i);

        let coefficient = parseFloat(coefficientInput.value);
        let power = parseFloat(powerInput.value);

        let termDerivative;

        // The derivative of a constant term is 0
        if (power === 0) {
            termDerivative = 0;
        } else {
            termDerivative = coefficient * power * Math.pow(x, power - 1);
        }

        result += termDerivative;
    }

    return result;
}

function clearOutput() {
    let resultDiv = document.getElementById("result");
    let tableBody = document.getElementById("tableBody");

    // Clear result area if it exists
    if (resultDiv !== null) {
        resultDiv.innerHTML = "";
    }

    // Clear table rows if the table body exists
    if (tableBody !== null) {
        tableBody.innerHTML = "";
    }
}

// ====================================================================================
// ============================ Bisection =============================================
// ====================================================================================

function solveBisection() {
    clearOutput();

    let resultDiv = document.getElementById("result");
    let tableBody = document.getElementById("tableBody");

    // Get input elements
    let aInput = document.getElementById("a");
    let bInput = document.getElementById("b");
    let toleranceInput = document.getElementById("tolerance");
    let maxIterationsInput = document.getElementById("maxIterations");

    // Check if input elements exist
    if ( aInput === null || bInput === null || toleranceInput === null || maxIterationsInput === null) {
        resultDiv.innerHTML = "<div class='error'>Missing one or more input fields in HTML.</div>";
        return;
    }

    // Read inputs
    let a = parseFloat(aInput.value);
    let b = parseFloat(bInput.value);
    let tolerance = parseFloat(toleranceInput.value);
    let maxIterations = parseInt(maxIterationsInput.value);

    let fa = calculateFunctionValue(a);
    let fb = calculateFunctionValue(b);

    // Check if one endpoint is already the root
    if (Math.abs(fa) < tolerance) {
        resultDiv.innerHTML = `
            <div class="result">
                <h3>Final Result</h3>
                <p><strong>Root:</strong> ${a.toFixed(6)}</p>
                <p><strong>f(root):</strong> ${fa.toFixed(6)}</p>
                <p><strong>Iterations:</strong> 0</p>
            </div>
        `;
        return;
    }

    if (Math.abs(fb) < tolerance) {
        resultDiv.innerHTML = `
            <div class="result">
                <h3>Final Result</h3>
                <p><strong>Root:</strong> ${b.toFixed(6)}</p>
                <p><strong>f(root):</strong> ${fb.toFixed(6)}</p>
                <p><strong>Iterations:</strong> 0</p>
            </div>
        `;
        return;
    }

    // In Bisection, f(a) and f(b) must have opposite signs
    if (fa * fb > 0) {
        resultDiv.innerHTML =
            "<div class='error'>There is no guaranteed root because f(a) and f(b) do not have opposite signs.</div>";
        return;
    }

    let c = 0;
    let fc = 0;
    let error = 0;
    let iteration = 0;

    for (let i = 1; i <= maxIterations; i++) {
        iteration = i;

        // Calculate midpoint
        c = (a + b) / 2;

        // Calculate f(c) 
        fc = calculateFunctionValue(c);

        // Bisection error 
        error = Math.abs(b - a) / 2;

        // Add this iteration to the table
        tableBody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${a.toFixed(6)}</td>
                <td>${b.toFixed(6)}</td>
                <td>${c.toFixed(6)}</td>
                <td>${fa.toFixed(6)}</td>
                <td>${fb.toFixed(6)}</td>
                <td>${fc.toFixed(6)}</td>
                <td>${error.toFixed(6)}</td>
            </tr>
        `;

        // Stop if f(c) is close to zero or error is small enough
        if (Math.abs(fc) < tolerance || error < tolerance) {
            break;
        }

        // Decide the new interval
        if (fa * fc > 0) {
            a = c;
            fa = fc;
        } 
        else {
            b = c;
            fb = fc;
        }
    }

    // final result
    resultDiv.innerHTML = `
        <div class="result">
            <h3>Final Result</h3>
            <p><strong>Root:</strong> ${c.toFixed(6)}</p>
            <p><strong>f(root):</strong> ${fc.toFixed(6)}</p>
            <p><strong>Error:</strong> ${error.toFixed(6)}</p>
            <p><strong>Iterations:</strong> ${iteration}</p>
        </div>
    `;
}

// ====================================================================================
// ============================== False Position ======================================
// ====================================================================================

function solveFalsePosition() {
    clearOutput();

    let resultDiv = document.getElementById("result");
    let tableBody = document.getElementById("tableBody");

    // Get input elements
    let xOldInput = document.getElementById("xOld");
    let xCurrentInput = document.getElementById("xCurrent");
    let toleranceInput = document.getElementById("tolerance");
    let maxIterationsInput = document.getElementById("maxIterations");

    // Check if input elements exist
    if (xOldInput === null || xCurrentInput === null || toleranceInput === null || maxIterationsInput === null) {
        resultDiv.innerHTML = "<div class='error'>Missing one or more input fields in HTML.</div>";
        return;
    }

    // Read inputs
    let xOld = parseFloat(xOldInput.value);
    let xCurrent = parseFloat(xCurrentInput.value);
    let tolerance = parseFloat(toleranceInput.value);
    let maxIterations = parseInt(maxIterationsInput.value);

    let fOld = calculateFunctionValue(xOld);
    let fCurrent = calculateFunctionValue(xCurrent);

    // Check if one endpoint is already the root
    if (Math.abs(fOld) < tolerance) {
        resultDiv.innerHTML = `
            <div class="result">
                <h3>Final Result</h3>
                <p><strong>Root:</strong> ${xOld.toFixed(6)}</p>
                <p><strong>f(root):</strong> ${fOld.toFixed(6)}</p>
                <p><strong>Iterations:</strong> 0</p>
            </div>
        `;
        return;
    }

    if (Math.abs(fCurrent) < tolerance) {
        resultDiv.innerHTML = `
            <div class="result">
                <h3>Final Result</h3>
                <p><strong>Root:</strong> ${xCurrent.toFixed(6)}</p>
                <p><strong>f(root):</strong> ${fCurrent.toFixed(6)}</p>
                <p><strong>Iterations:</strong> 0</p>
            </div>
        `;
        return;
    }

    // False Position needs opposite signs
    if (fOld * fCurrent > 0) {
        resultDiv.innerHTML =
            "<div class='error'>There is no guaranteed root because the two starting points do not have opposite signs.</div>";
        return;
    }

    let xNew = 0;
    let fNew = 0;
    let error = 0;
    let iteration = 0;
    let previousXNew = null;

    for (let i = 1; i <= maxIterations; i++) {
        iteration = i;

        let denominator = fCurrent - fOld;

        // Prevent division by zero or very tiny denominator
        if (Math.abs(denominator) < 1e-12) {
            resultDiv.innerHTML =
                "<div class='error'>Cannot continue because the denominator became too close to zero.</div>";
            return;
        }

        // Apply the False Position formula
        xNew = xCurrent - (fCurrent * (xCurrent - xOld)) / denominator;
        fNew = calculateFunctionValue(xNew);


        // Calculate error
        if (previousXNew === null) {
            error = Math.abs(xNew - xCurrent);
        } else {
            error = Math.abs(xNew - previousXNew);
        }

        // Add this iteration to the table
        tableBody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${xOld.toFixed(6)}</td>
                <td>${xCurrent.toFixed(6)}</td>
                <td>${xNew.toFixed(6)}</td>
                <td>${fOld.toFixed(6)}</td>
                <td>${fCurrent.toFixed(6)}</td>
                <td>${fNew.toFixed(6)}</td>
                <td>${error.toFixed(6)}</td>
            </tr>
        `;

        // Stop if f(xNew) is close to zero or error is small
        if (Math.abs(fNew) < tolerance || error < tolerance) {
            break;
        }

        previousXNew = xNew;

        // Decide which endpoint should be replaced by xNew
        if (fOld * fNew > 0) {
            xOld = xNew;
            fOld = fNew;
        } else {
            xCurrent = xNew;
            fCurrent = fNew;
        }
    }

    // Show final result
    resultDiv.innerHTML = `
        <div class="result">
            <h3>Final Result</h3>
            <p><strong>Root:</strong> ${xNew.toFixed(6)}</p>
            <p><strong>f(root):</strong> ${fNew.toFixed(6)}</p>
            <p><strong>Error:</strong> ${error.toFixed(6)}</p>
            <p><strong>Iterations:</strong> ${iteration}</p>
        </div>
    `;
}

// ====================================================================================
// ===============================   Secant   =========================================
// ====================================================================================

function solveSecant() {
    clearOutput();

    let resultDiv = document.getElementById("result");
    let tableBody = document.getElementById("tableBody");

    // Get input elements
    let xOldInput = document.getElementById("xOld");
    let xCurrentInput = document.getElementById("xCurrent");
    let toleranceInput = document.getElementById("tolerance");
    let maxIterationsInput = document.getElementById("maxIterations");

    // Check if input elements exist
    if (xOldInput === null ||xCurrentInput === null ||toleranceInput === null ||maxIterationsInput === null) {
        resultDiv.innerHTML = "<div class='error'>Missing one or more input fields in HTML.</div>";
        return;
    }

    // Read inputs
    let xOld = parseFloat(xOldInput.value);
    let xCurrent = parseFloat(xCurrentInput.value);
    let tolerance = parseFloat(toleranceInput.value);
    let maxIterations = parseInt(maxIterationsInput.value);

    let xNew = 0;
    let fOld = 0;
    let fCurrent = 0;
    let fNew = 0;
    let error = 0;
    let iteration = 0;

    for (let i = 1; i <= maxIterations; i++) {
        iteration = i;

        // Calculate function values
        fOld = calculateFunctionValue(xOld);
        fCurrent = calculateFunctionValue(xCurrent);
        let denominator = fCurrent - fOld;

        // Stop if denominator is zero or very close to zero
        if (Math.abs(denominator) < 1e-12) {
            resultDiv.innerHTML =
                "<div class='error'>Cannot continue because the denominator became too close to zero.</div>";
            return;
        }

        // Apply the Secant formula
        xNew = xCurrent - (fCurrent * (xCurrent - xOld)) / denominator;

        // Calculate f(xNew) 
        fNew = calculateFunctionValue(xNew);

        // Calculate error between new and current value
        error = Math.abs(xNew - xCurrent);

        // Add this iteration to the table
        tableBody.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${xOld.toFixed(6)}</td>
                <td>${xCurrent.toFixed(6)}</td>
                <td>${xNew.toFixed(6)}</td>
                <td>${fOld.toFixed(6)}</td>
                <td>${fCurrent.toFixed(6)}</td>
                <td>${fNew.toFixed(6)}</td>
                <td>${error.toFixed(6)}</td>
            </tr>
        `;

        // Stop if f(xNew) is close to zero or the error is small
        if (Math.abs(fNew) < tolerance || error < tolerance) {
            break;
        }

        // Move the values forward for the next iteration
        xOld = xCurrent;
        xCurrent = xNew;
    }

    // Show final result
    resultDiv.innerHTML = `
        <div class="result">
            <h3>Final Result</h3>
            <p><strong>Root:</strong> ${xNew.toFixed(6)}</p>
            <p><strong>f(root):</strong> ${fNew.toFixed(6)}</p>
            <p><strong>Error:</strong> ${error.toFixed(6)}</p>
            <p><strong>Iterations:</strong> ${iteration}</p>
        </div>
    `;
}


// ====================================================================================
// ==============================   NewtonRaphson   ===================================
// ====================================================================================

function calculateNewtonRaphson() {
    let n = parseInt(document.getElementById("termsCount").value);
    let x = parseFloat(document.getElementById("initial").value);
    let absoluteError = parseFloat(document.getElementById("tolerance").value);
    let maxIterations = parseInt(document.getElementById("maxIterations").value);

    // Clear old output
    document.getElementById("result").innerHTML = "";
    document.getElementById("tableBody").innerHTML = "";

    // Check if initial guess is valid
    if (isNaN(x)) {
        document.getElementById("result").innerHTML = "<p class='error'>Invalid initial guess</p>";
        return;
    }

    // Function to calculate f(x)
    function f(x) {
        let sum = 0;

        // Calculate polynomial value
        for (let i = 0; i < n; i++) {
            let a = parseFloat(document.getElementById("coef" + i).value);
            let p = parseFloat(document.getElementById("power" + i).value);

            // Stop if terms are missing or invalid
            if (isNaN(a) || isNaN(p)) {
                document.getElementById("result").innerHTML = "<p class='error'>Please fill all coefficient and power inputs.</p>";
                return null;
            }

            // Add term value to sum
            sum += a * Math.pow(x, p);
        }

        return sum;
    }

    // Function to calculate f'(x)
    function fPrime(x) {
        let sum = 0;

        // Calculate derivative value
        for (let i = 0; i < n; i++) {
            let a = parseFloat(document.getElementById("coef" + i).value);
            let p = parseFloat(document.getElementById("power" + i).value);

            // Stop if terms are missing or invalid
            if (isNaN(a) || isNaN(p)) {
                document.getElementById("result").innerHTML = "<p class='error'>Please fill all coefficient and power inputs.</p>";
                return null;
            }

            // Add derivative of current term
            // Constant term derivative is 0
            if (p !== 0) {
                sum += a * p * Math.pow(x, p - 1);
            }
        }

        return sum;
    }

    // Start Newton-Raphson iterations
    for (let i = 1; i <= maxIterations; i++) {

        // Calculate f(x) and f'(x)
        let fx = f(x);
        let dfx = fPrime(x);

        // Stop if f(x) or derivative could not be calculated
        if (fx === null || dfx === null) {
            return;
        }

        // Stop if derivative is invalid or zero
        if (!isFinite(dfx) || dfx == 0) {
            document.getElementById("result").innerHTML = "<p class='error'>Derivative invalid or zero. Stopping.</p>";
            return;
        }

        // Apply Newton-Raphson formula
        let nextX = x - (fx / dfx);

        // Stop if result becomes invalid
        if (!isFinite(nextX)) {
            document.getElementById("result").innerHTML = "<p class='error'>Diverged. x became invalid.</p>";
            return;
        }

        // Calculate error
        let error = Math.abs(nextX - x);

        // Print current iteration result in table
        document.getElementById("tableBody").innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${x.toFixed(6)}</td>
                <td>${fx.toFixed(6)}</td>
                <td>${dfx.toFixed(6)}</td>
                <td>${nextX.toFixed(6)}</td>
                <td>${error.toFixed(6)}</td>
            </tr>
        `;

        // Stop if error is small enough
        if (error < absoluteError) {
            document.getElementById("result").innerHTML = `
                <div class="result">
                    Root found: ${nextX.toFixed(6)}<br>
                    Error: ${error.toFixed(6)}
                </div>
            `;
            return;
        }

        // Update x for next iteration
        x = nextX;
    }

    // If loop ends without finding the root
    document.getElementById("result").innerHTML = `
        <div class="error">
            The method did not reach the required tolerance within the maximum number of iterations.
        </div>
    `;
}