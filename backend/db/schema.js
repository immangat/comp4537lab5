// schema.js
const userTableSchema = `
    patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dateOfBirth datetime
`;

module.exports = {
    userTableSchema,
};
