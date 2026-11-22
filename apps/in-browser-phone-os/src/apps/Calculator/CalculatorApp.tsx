import { useState } from 'react';
import { soundEffects } from '../../utils/sound';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleDigit = (digit: string) => {
    soundEffects.playTap();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    soundEffects.playTap();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    soundEffects.playTap();
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleToggleSign = () => {
    soundEffects.playTap();
    const value = parseFloat(display);
    setDisplay((value * -1).toString());
  };

  const handlePercentage = () => {
    soundEffects.playTap();
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const performOperation = (nextOperator: string) => {
    soundEffects.playTap();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue;
      let newValue = currentValue;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '−':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
      }

      setPrevValue(newValue);
      setDisplay(parseFloat(newValue.toFixed(8)).toString());
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  // Backspace on display
  const handleBackspace = () => {
    soundEffects.playTap();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-end bg-black text-white p-4 pb-6 select-none">
      {/* Calculator Digital Screen */}
      <div
        onClick={handleBackspace}
        title="Tap to backspace"
        className="w-full text-right px-4 pb-4 overflow-hidden cursor-pointer"
      >
        <span className="font-light font-mono text-neutral-400 text-sm block mb-1">
          {prevValue !== null && operator ? `${prevValue} ${operator}` : ''}
        </span>
        <h1
          className={`font-light font-sans text-white tracking-tight break-all ${
            display.length > 9
              ? 'text-4xl'
              : display.length > 6
              ? 'text-5xl'
              : 'text-6xl sm:text-7xl'
          }`}
        >
          {display}
        </h1>
      </div>

      {/* Button Grid (4x5) */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="h-16 w-16 rounded-full bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 text-black font-medium text-xl flex items-center justify-center transition-colors"
        >
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button
          onClick={handleToggleSign}
          className="h-16 w-16 rounded-full bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 text-black font-medium text-xl flex items-center justify-center transition-colors"
        >
          ±
        </button>
        <button
          onClick={handlePercentage}
          className="h-16 w-16 rounded-full bg-neutral-400 hover:bg-neutral-300 active:bg-neutral-200 text-black font-medium text-xl flex items-center justify-center transition-colors"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className={`h-16 w-16 rounded-full text-white font-medium text-2xl flex items-center justify-center transition-all ${
            operator === '÷'
              ? 'bg-white text-ios-orange'
              : 'bg-ios-orange hover:bg-orange-400 active:bg-orange-300'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="h-16 w-16 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-white font-medium text-2xl flex items-center justify-center transition-colors"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => performOperation('×')}
          className={`h-16 w-16 rounded-full text-white font-medium text-2xl flex items-center justify-center transition-all ${
            operator === '×'
              ? 'bg-white text-ios-orange'
              : 'bg-ios-orange hover:bg-orange-400 active:bg-orange-300'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="h-16 w-16 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-white font-medium text-2xl flex items-center justify-center transition-colors"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => performOperation('−')}
          className={`h-16 w-16 rounded-full text-white font-medium text-2xl flex items-center justify-center transition-all ${
            operator === '−'
              ? 'bg-white text-ios-orange'
              : 'bg-ios-orange hover:bg-orange-400 active:bg-orange-300'
          }`}
        >
          −
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="h-16 w-16 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-white font-medium text-2xl flex items-center justify-center transition-colors"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => performOperation('+')}
          className={`h-16 w-16 rounded-full text-white font-medium text-2xl flex items-center justify-center transition-all ${
            operator === '+'
              ? 'bg-white text-ios-orange'
              : 'bg-ios-orange hover:bg-orange-400 active:bg-orange-300'
          }`}
        >
          +
        </button>

        {/* Row 5: 0, decimal, equals */}
        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 h-16 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-white font-medium text-2xl flex items-center px-7 transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-16 w-16 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-white font-medium text-2xl flex items-center justify-center transition-colors"
        >
          .
        </button>
        <button
          onClick={() => performOperation('=')}
          className="h-16 w-16 rounded-full bg-ios-orange hover:bg-orange-400 active:bg-orange-300 text-white font-medium text-2xl flex items-center justify-center transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
}
