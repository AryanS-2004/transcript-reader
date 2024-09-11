import './App.css'
import { useRef, useState } from 'react';

type Word = {
  word: string,
  start_time: number,
  duration: number
}

interface TranscriptReaderProps {
  transcript: Word[]
}

const transcript: Word[] = [
  { word: 'Hello', start_time: 0, duration: 500 },
  { word: 'world', start_time: 200, duration: 700 },
  { word: 'This', start_time: 200, duration: 300 },
  { word: 'is', start_time: 200, duration: 200 },
  { word: 'a', start_time: 200, duration: 100 },
  { word: 'test', start_time: 200, duration: 400 },
  { word: 'transcript', start_time: 200, duration: 600 },
  { word: 'for', start_time: 200, duration: 200 },
  { word: 'playback', start_time: 200, duration: 500 },
  { word: 'and', start_time: 200, duration: 250 },
  { word: 'editing', start_time: 200, duration: 800 },
  { word: 'features.', start_time: 200, duration: 650 },
];


function App() {
  const [word, setWord] = useState<number>(0);
  const [editWord, setEditWord] = useState<number>(-1);
  const [newWord, setNewWord] = useState<string>("");
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [initialTranscript, setInitialTranscript] = useState<Word[]>(transcript);

  const TranscriptReader = ({ transcript }: TranscriptReaderProps) => {
    const synthRef = useRef(window.speechSynthesis);
    const [isReading, setIsReading] = useState(false);

    const readWord = (word: string) => {
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => resolve();
        synthRef.current.speak(utterance);
      });
    };

    const startReading = async () => {
      setIsReading(true);
      for (let i = 0; i < transcript.length; i++) {
        setWord(i);
        const { word, start_time } = transcript[i];
        if (i > 0) {
          const prevStartTime = transcript[i - 1].start_time;
          await new Promise((resolve) => setTimeout(resolve, start_time - prevStartTime));
        }
        await readWord(word);
      }
      setIsReading(false);
    };

    return (
      <div>
        <button onClick={startReading} disabled={isReading}>
          {isReading ? "Reading..." : "Start Reading"}
        </button>
      </div>
    );
  };

  const handleTextUpdate = () => {
    if (newWord.trim() === "") {
      alert("Please enter text!");
      return;
    }
    if (newWord.split(" ").length > 1) {
      alert("Please enter a single word!");
      return;
    }
    const updatedTranscript = initialTranscript.map((item, index) => {
      if (index === editWord) {
        return { ...item, word: newWord };
      }
      return item;
    });
    setInitialTranscript(updatedTranscript);
    setShowEditor(false);
  };
  const handleTextChange = (e: any) => {
    setNewWord(e.target.value)
  }

  return (
    <>
      <div className='flex gap-[0.05rem] w-3/4 flex-wrap mx-auto mb-4'>
        {initialTranscript.map((obj: Word, index: number) => (
          <div key={index} className='relative'>
            <div
              onClick={() => { setShowEditor(!showEditor); setEditWord(index); setNewWord(obj.word) }}
              className={`p-1 rounded-lg ${word === index ? "border border-orange-400" : ""}`}
            >
              {obj.word}
            </div>
            {showEditor && editWord === index ? <div className='absolute z-10 -bottom-[7.5rem] bg-gray-700 p-2 rounded-lg'>
              <div className='mb-1'>Edit Text</div>
              <input
                autoFocus={editWord === index}
                value={newWord}
                onChange={(e) => handleTextChange(e)}
                placeholder=''
                className='p-2 rounded-lg border border-orange-400'
              />
              <div className='flex mt-2 justify-center'>
                <div
                  className='py-1 px-4 rounded-lg bg-indigo-400'
                  onClick={handleTextUpdate}
                >
                  Edit
                </div>
              </div>
            </div> : <></>}
          </div>
        ))}
      </div>
      <TranscriptReader transcript={initialTranscript} />
    </>
  );
}

export default App;
