from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Game logic
def determine_winner(user_choice):
    # Map of choices
    choices = {
        'rock': 'R',
        'paper': 'P',
        'scissors': 'S'
    }
    
    # Generate CPU's choice
    cpu_options = ['rock', 'paper', 'scissors']
    cpu_choice = random.choice(cpu_options)
    
    # Get letter representations
    user_value = choices[user_choice]
    cpu_value = choices[cpu_choice]
    
    # Game outcomes
    outcomes = {
        'RR': 'Draw',
        'RP': 'CPU',
        'RS': 'User',
        'PP': 'Draw',
        'PR': 'User',
        'PS': 'CPU',
        'SS': 'Draw',
        'SR': 'CPU',
        'SP': 'User'
    }
    
    # Determine the outcome
    outcome = outcomes[user_value + cpu_value]
    result = 'Match Draw' if outcome == 'Draw' else f'{outcome} Won!!'
    
    return {
        'user_choice': user_choice,
        'cpu_choice': cpu_choice,
        'result': result
    }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    user_choice = data.get('choice', 'rock').lower()
    
    if user_choice not in ['rock', 'paper', 'scissors']:
        return jsonify({'error': 'Invalid choice'}), 400
        
    game_result = determine_winner(user_choice)
    return jsonify(game_result)

if __name__ == '__main__':
    app.run(debug=True)
