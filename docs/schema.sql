-- Example scheme for api tester
-- App expects these tables to be implemented in the specified db.

CREATE TABLE Endpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    result TEXT
);

CREATE TABLE Configurations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint_id INT, -- are foreign keys unique here?
    url VARCHAR(255),
    method VARCHAR(255),
    body JSON,
);

-- CREATE TABLE Headers (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     configuration_id INT,
--     header_key TEXT,
--     header_value TEXT,
-- );

-- CREATE TABLE Results (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     endpoint_id INT,
--     result_content JSON,
-- );

-- INSERT INTO Endpoints (name) VALUES ('test 1');
-- INSERT INTO Endpoints (name) VALUES ('test 2');
-- INSERT INTO Endpoints (name) VALUES ('test 3');

-- INSERT INTO Configurations (endpoint_id, url, method, body) VALUES (1, 'https://google.com', "GET", "{}");
-- INSERT INTO Configurations (endpoint_id, url, method, body) VALUES (2, 'https://outlook.com', "GET", "{}");
-- INSERT INTO Configurations (endpoint_id, url, method, body) VALUES (3, 'https://gmail.com', "GET", "{}");

-- INSERT INTO Results (endpoint_id, result_content) VALUES (1, '{"test": "test"}');
-- INSERT INTO Results (endpoint_id, result_content) VALUES (1, '[]');