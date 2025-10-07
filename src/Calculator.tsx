import { useState } from 'react';
import './Calculator.css'

function Calculator() {
  
  const [numberLeft, setNumberLeft] = useState<string>('');
  const [numberRight, setNumberRight] = useState<string>('');
  const [op, setOp] = useState<string>('');

  let result = 0;
  let display = ''

  if (numberLeft == '') {
    display = '0'
  } else {
    display = numberLeft + ' ' + op + ' ' + numberRight 
  } 

  const handleNumber = (value: string) => {
      if (op == '') {
        setNumberLeft(prev => prev + value)
      } else {
        setNumberRight(prev => prev + value)
      }
    }

    const handleOperator = (value: string) => {
      setOp(value)
    }

    const handleResult = () => {
      const a = parseFloat(numberLeft);
      const b = parseFloat(numberRight);

      switch (op) {
        case '/':
          result = a / b;
          break;
          
        case '*':
          result = a * b;
          break;
          
        case '-':
          result = a - b;
          break;
            
        case '+':
          result = a + b;

      }
      console.log({message: "resultado -> " + result });
      
      if (!isNaN(result)) {
        setNumberLeft(result.toString());
        setNumberRight('');
        setOp('');
      }
    }

    const handleClear = () => {
      setNumberLeft('')
      setNumberRight('')
      setOp('')
    }
    
    // console.log(op);
    console.log({message: "numero a -> " + numberLeft});
    console.log({message: "numero b -> " + numberRight});
    console.log({message: "operador -> " + op});
    
    
  
    return (
    <>
      <div id="main">
        <div id='container-caulculator'>

          <div id='container-view'>
            <h1> {display}</h1>
          </div>

          <div id="container-buttons">
            <div id='container-numbers'>
              <button onClick={() => {handleNumber('7') }}>7</button>
              <button onClick={() => {handleNumber('8') }}>8</button>
              <button onClick={() => {handleNumber('9') }}>9</button> 
              <button onClick={() => {handleNumber('4') }}>4</button>
              <button onClick={() => {handleNumber('5') }}>5</button>
              <button onClick={() => {handleNumber('6') }}>6</button> 
              <button onClick={() => {handleNumber('1') }}>1</button>
              <button onClick={() => {handleNumber('2') }}>2</button>
              <button onClick={() => {handleNumber('3') }}>3</button> 
              <button onClick={() => {handleNumber('.')}}>,</button>
              <button onClick={() => {handleNumber('0') }}>0</button>
              <button className='button-result' onClick={() => {handleResult()}}>=</button>
            </div>
            
            <div id='container-operational'>
              <button className='button-clear' onClick={() => {handleClear()}}>C</button>
              <button onClick={() => {handleOperator('/')}}>÷</button>
              <button onClick={() => {handleOperator('*')}}>X</button>
              <button onClick={() => {handleOperator('-')}}>-</button>
              <button onClick={() => {handleOperator('+')}}>+</button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Calculator
