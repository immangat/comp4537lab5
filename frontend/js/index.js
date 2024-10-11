class SqlApp {
    constructor() {
        this.sqlInput = document.getElementById('sql-input');
        this.resultsDisplay = document.getElementById('results-display');
        this.sendButton = document.getElementById('send-button');
        this.populateButton = document.getElementById('populate-button');

        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.sendSqlStatement());
        this.populateButton.addEventListener('click', () => this.populateSampleData());
    }

    async sendSqlStatement() {
        const sqlStatement = this.sqlInput.value;
        try {
            const response = await fetch(`${serverURL}/execute-sql?sql=${encodeURIComponent(sqlStatement)}`, { // Replace with your actual backend URL
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            this.displayResults(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async populateSampleData() {
        try {
            const response = await fetch(`${serverURL}/post-sample-data`, { // Replace with your actual backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: patientData
                })
            });
            const data = await response.json();
            this.displayResults(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    displayResults(data) {
        this.resultsDisplay.textContent = JSON.stringify(data, null, 2);
    }
}

// Initialize the app
new SqlApp();
console.log("kahkjfkjsahf")
console.log(patientData)
