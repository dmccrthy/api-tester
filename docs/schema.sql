-- Example scheme for api tester
-- App expects these tables to be implemented in the specified db.

CREATE TABLE Endpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT
);

CREATE TABLE Configurations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint_id INT,
    url VARCHAR(255),
    method VARCHAR(255),
    body JSON,
    FOREIGN KEY (endpoint_id) REFERENCES Endpoints(id)
);

CREATE TABLE Headers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    configuration_id INT,
    header_key TEXT,
    header_value TEXT,
    FOREIGN KEY (configuration_id) REFERENCES Configurations(id)
);

CREATE TABLE Results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint_id INT,
    result_content JSON,
    FOREIGN KEY (endpoint_id) REFERENCES Endpoints(id)
);