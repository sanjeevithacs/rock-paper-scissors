from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Game logic
def get_computer_choice():
    return random.choice(['rock', 'paper', 'scissors'])

def determine_winner(user_choice, computer_choice):
    if user_choice == computer_choice:
        return "It's a tie!"
    
    winning_combinations = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    }
    
    if winning_combinations[user_choice] == computer_choice:
        return "You win!"
    return "Computer wins!"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    user_choice = data.get('choice')
    
    if user_choice not in ['rock', 'paper', 'scissors']:
        return jsonify({'error': 'Invalid choice'}), 400
    
    computer_choice = get_computer_choice()
    result = determine_winner(user_choice, computer_choice)
    
    return jsonify({
        'user_choice': user_choice,
        'computer_choice': computer_choice,
        'result': result
    })

if __name__ == '__main__':
    app.run(debug=True)
