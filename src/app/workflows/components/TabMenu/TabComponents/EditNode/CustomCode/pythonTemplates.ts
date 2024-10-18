// pythonTemplates.ts
export const pythonTemplates = {
    "basic-function": `def my_function():
    """
    A simple function that prints a greeting message.
    """
    print("Hello, world!")`,

    "http-request": `import requests

def fetch_data(url):
    """
    Fetch data from a given URL and return the JSON response.
    
    Args:
        url (str): The URL to fetch data from.

    Returns:
        dict: The JSON response from the API.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

# Example usage:
data = fetch_data('https://api.example.com/data')
if data:
    print(data)`,

    "data-analysis": `import pandas as pd

def analyze_data(file_path):
    """
    Read a CSV file and print a summary of the dataset.

    Args:
        file_path (str): The path to the CSV file.
    """
    try:
        df = pd.read_csv(file_path)
        print("Data Summary:")
        print(df.describe())
    except FileNotFoundError:
        print("The specified file was not found.")

# Example usage:
analyze_data('data.csv')`,

    "sql-query": `import sqlite3

def fetch_users_above_age(age):
    """
    Fetch users from the database whose age is above the specified value.

    Args:
        age (int): The age threshold for fetching users.

    Returns:
        list: A list of users above the specified age.
    """
    connection = sqlite3.connect('example.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE age > ?", (age,))
    results = cursor.fetchall()
    connection.close()
    return results

# Example usage:
users = fetch_users_above_age(30)
print(users)`,

    "error-handling": `def divide_numbers(a, b):
    """
    Divide two numbers and handle division by zero error.

    Args:
        a (float): The numerator.
        b (float): The denominator.

    Returns:
        float: The result of the division or None if there was an error.
    """
    try:
        return a / b
    except ZeroDivisionError as e:
        print('An error occurred: Cannot divide by zero.')
        return None

# Example usage:
result = divide_numbers(10, 0)
print(result)`,
}
