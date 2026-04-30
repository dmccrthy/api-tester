-- Example scheme for api tester
-- these tables need to be implemented in the specified db.

CREATE TABLE Endpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    result TEXT
);

CREATE TABLE Configurations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint_id INT,
    url VARCHAR(255),
    method VARCHAR(255),
    body TEXT
);