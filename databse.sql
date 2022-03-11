CREATE TABLE admin(
    admin_id SERIAL PRIMARY KEY,
    adminName VARCHAR(255),
    adminPassword VARCHAR(255)
);


CREATE TABLE candidate(
    candidate_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    candidatePassword VARCHAR(255),
    candidateName VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(10),
    areaOfInterest VARCHAR(255),
    currentStatus VARCHAR(255)
);
