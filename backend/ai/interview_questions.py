def get_interview_questions(role):

    questions = {
        "Python Developer": [
            "Explain Flask and its advantages.",
            "What is REST API?",
            "Difference between GET and POST methods.",
            "Explain Python decorators.",
            "What is List Comprehension?",
            "Explain Exception Handling.",
            "What is JWT Authentication?",
            "Difference between List and Tuple?",
            "Explain Multithreading.",
            "What is ORM?"
        ],

        "Frontend Developer": [
            "What is React?",
            "Explain Virtual DOM.",
            "Difference between State and Props.",
            "What are React Hooks?",
            "Explain useEffect.",
            "Explain useState.",
            "Difference between let, var and const.",
            "What is JSX?",
            "Explain React Router.",
            "What is Axios?"
        ],
        "Full Stack Developer": [
            "Explain MERN Stack.",
            "Difference between SQL and MongoDB.",
            "What is JWT?",
            "Explain REST APIs.",
            "What is Authentication?",
            "What is Authorization?",
            "Explain Express Middleware.",
            "Explain MVC Architecture.",
            "Difference between GET and POST.",
            "Explain CRUD Operations."
        ],

        "AI Engineer": [
            "What is Machine Learning?",
            "Difference between AI and ML.",
            "Explain NLP.",
            "What is TF-IDF?",
            "Explain Sentence Transformers.",
            "Difference between Supervised and Unsupervised Learning.",
            "Explain Semantic Similarity.",
            "What is Feature Extraction?",
            "Difference between Classification and Regression.",
            "Explain Overfitting."
        ]
        
    }

    return questions.get(
        role,
        [
            "Tell me about yourself.",
            "Why should we hire you?",
            "What are your strengths?",
            "Describe one challenging project.",
            "Where do you see yourself in five years?"
        ]
    )