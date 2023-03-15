import json
import sounddevice as sd
import numpy as np
import requests

def play_audio_from_api(api, text, samplingrate=22050, maxwavvalue=32768):
    response = requests.post(f"{api}", json={"text": text})
    data = np.array(response.json())
    scaled = np.int16(data / np.max(np.abs(data)) * maxwavvalue)
    sd.play(scaled, samplingrate)


api = "http://159.203.49.85:5000/predict"

text = "I'm tired and ready to sleep"

play_audio_from_api(api, text)