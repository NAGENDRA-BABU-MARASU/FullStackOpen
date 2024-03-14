CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

INSERT INTO
  blogs(author, url, title, likes)
VALUES
(
    'google',
    'https://blog.google/technology/ai/',
    'AI by Google',
    100
  );

INSERT INTO
  blogs(author, url, title)
VALUES
(
    ' OpenAI ',
    ' https://openai.com/sora',
    'Sora by OpenAI'
  );