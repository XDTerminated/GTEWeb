from django.http import JsonResponse
from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os
import tensorflowjs as tfjs
from stockfish import Stockfish
import chess.engine
import chess
import chess.pgn
import io
import pandas as pd
import re
import numpy as np



# model = tfjs.models.load_model("GTE/static/model/model.json")
model = tfjs.converters.load_keras_model(os.path.join("static", "model", "model.json"))
stockfish = Stockfish(path = os.path.join("static", "stockfish", "stockfish"), depth = 8, parameters = {"Threads": 1, "Hash": 2048, "Minimum Thinking Time": 1})
pd.options.mode.chained_assignment = None

@csrf_exempt
def prediction(request):
     data_game_report = pd.read_csv("static/data/game_report.csv")
     def get_game_report(pgn, openings):
          board = chess.Board()
          board2 = chess.Board()
          game = chess.pgn.read_game(io.StringIO(pgn))

          opening = True

          book = 0
          opening_name = ""
          best = 0
          bad = 0
          forced = 0
          length = 0

          moves = []

          node = game
          while node.variations:
               fen = board2.fen()
               move_made = node.variations[0].move
               moves.append(move_made)

               board2.push(move_made)
               s = board.variation_san(moves)

               length+=1
               node = node.variations[0]
               if opening:
                    try:
                         a = openings[s]
                         book+=1
                         opening_name = a[1]
                         continue

                    except:
                         is_opening = False
                         for key, value in openings.items():
                              if s in key:
                                   book+=1
                                   opening_name = value[1]
                                   is_opening = True
                                   break
                         
                         if not is_opening:
                              opening = False
                         else:
                              continue
                    
               c = stockfish.get_evaluation()["value"]
               stockfish.set_fen_position(fen)
               d = stockfish.get_evaluation()["value"]
               top_moves = stockfish.get_top_moves(7)



               if (len(top_moves) == 1):
                    forced+=1

               else:
                    if str(move_made) == top_moves[0]["Move"]:
                         best+=1
                         continue
                    
                    if board2.turn:
                         if d - c <= -2:
                              bad+=1

                    if not board2.turn:
                         if d- c >= 2:
                              bad+=1

          return book, best, forced, opening_name, bad, length

     # Define the path to the PGN file
     pgn_file = os.path.join("static", "opening_book", "eco.pgn")

     # Initialize the dictionary to store the openings
     openings = {}

     # Open the PGN file
     with open(pgn_file, "r") as file:
          pgn_text = file.read()

     # Extract the opening data using regular expressions
     pattern = r'\[ECO "(.*?)"]\n\[Opening "(.*?)"](?:\n\[Variation "(.*?)"])?\n\n(.*?)\n\n'
     matches = re.findall(pattern, pgn_text, re.DOTALL)


     # Iterate over the matches and store the data in the dictionary
     for match in matches:
          eco = match[0]
          opening = match[1]
          variation = match[2] if match[2] else None
          moves = match[3].strip().split("\n")
          move_str = ""

          for move in moves:
               move = move.strip()
               if move.startswith("1."):
                    move_str = move[:-1]  # Remove the asterisk at the end
               else:
                    move_str += f" {move}"

          if variation:
               # opening_key = f"{eco} - {opening} - {variation}"
               opening_key = [eco, opening, variation]
          else:
               # opening_key = f"{eco} - {opening}"
               opening_key = [eco, opening]

          if move_str not in openings:
               openings[move_str] = opening_key

     openings2 = {}

     for key, value in openings.items():
          new_key = key.rstrip(" *")
          openings2[new_key] = value

     openings = openings2
     del openings2


     if request.method == 'POST':
          data = request.POST.get('data')
          if (data == ""):
               return render(request, 'index.html')
          game_report = get_game_report(data, openings)
          print(game_report)
          data_game_report.at[0, "book"] = game_report[0]
          data_game_report.at[0, "best"] = game_report[1]
          data_game_report.at[0, "forced"] = game_report[2]
          data_game_report.at[0, "opening_" + str(game_report[3])] = 1  # Note the conversion of game_report[3] to a string
          data_game_report.at[0, "bad"] = game_report[4]
          data_game_report.at[0, "length"] = game_report[5]

          data_game_report = data_game_report.drop(columns=["Unnamed: 0"], axis=1)
          a = np.reshape(data_game_report.iloc[0], (-1, 113))
          b = model.predict(a)

          predicted_class = np.argmax(b)

          print(predicted_class)

          return JsonResponse({"result": str(predicted_class - 400)})



     else:
          return render(request, "index.html")

# Create your views here.
def index(request):
     # return HttpResponse("this is homepage")
     return render(request, "index.html")