DROP TABLE notes;
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
