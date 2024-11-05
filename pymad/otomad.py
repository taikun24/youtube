import os.path
import sys
from typing import TextIO

import mido

print("OTO MAD GENERATOR - taikun24 v1.0")
print("FPSを入力[FPS]:")
FPS = int(input())
index = 0
print("素材のパスを入力[絶対/相対パス]:")
PATH = os.path.abspath(input())
print("素材の周波数[Hz]を入力(素材のスペクトルなどから判断):")
SOUND_HZ = int(input())
print("MIDIのパスを入力[絶対/相対パス]:")
MIDI = os.path.abspath(input())
if MIDI.split('.')[-1] == 'mid' or MIDI.split('.')[-1] == 'midi':
    print('MIDIではありません')
    sys.exit(1)
print("出力するexoのファイル名を入力(直下に生成されます)")
EXO = input()


def to_f(n):
    return 440 * 2 ** ((n - 69) / 12)


def obj_write_video(pos, speed, path, file: TextIO):
    file.write("""[{}]\nstart={}\nend={}\nlayer=1\noverlay=1\ncamera=0
[{}.0]\n_name=動画ファイル\n再生位置=1\n再生速度={}\nループ再生=0\nアルファチャンネルを読み込む=0\nfile={}
[{}.1]\n_name=標準描画\nX=0.0\nY=0.0\nZ=0.0\n拡大率=100.00\n透明度=0.0\n回転=0.00\nblend=0\n"""
               .format(index, pos[0], pos[1], index, speed, path, index))


def obj_write_audio(pos, speed, path, file: TextIO):
    file.write(
        """[{}]\nstart={}\nend={}\nlayer=2\noverlay=1\naudio=1
[{}.0]\n_name=音声ファイル\n再生位置=0.00\n再生速度={}\nループ再生=0\n動画ファイルと連携=0\nfile={}
[{}.1]\n_name=標準再生\n音量=100.0\n左右=0.0\n"""
        .format(index, pos[0], pos[1], index, speed, path, index))


def do_task(time, time_end, note, file):
    global index
    speed = int(to_f(note + 12) / SOUND_HZ * 1000) / 10

    pos = (int(time * FPS) + 1, int(time_end * FPS - 1) + 1)
    if pos[0] + 1 < pos[1]:
        obj_write_video(pos, speed, PATH, file)
        index += 1
        obj_write_audio(pos, speed, PATH, file)
        index += 1


def convert_vtt_to_exo(midi_file, exo_file):
    global index
    messages = mido.MidiFile(midi_file)
    length = 0

    for m in messages:
        length += m.time
    with open(exo_file, 'w', encoding='shift_jis', newline='\r\n') as file:
        length += 1.5
        file.write(
            "[exedit]\nwidth=1920\nheight=1080\nrate={}\nscale=1\nlength={}\naudio_rate=44100\naudio_ch=2\n".format(
                FPS, int(length * FPS)))
        current_second = 0
        task = []
        r = 0
        for m in messages:
            if m.time != 0:
                r = 1
                current_second += m.time
            if m.type == 'note_on':
                if r == 2 and not len(task) == 0:
                    if task[-1][1] < m.note:
                        task.pop()
                        task.append((current_second, m.note))
                if r == 1:
                    task.append((current_second, m.note))
                    r = 2
        before = (-1, 1)
        for t in task:
            if before[0] == -1:
                before = t
                continue
            do_task(before[0], t[0], before[1], file)
            before = t
        do_task(t[0], t[0] + 1, t[1], file)


convert_vtt_to_exo(MIDI, EXO)
print("OK!")
