
import * as React from 'react';

const Mycom = () => (
            <div>
                <h1>US Dollar to Euro:</h1>
                <Amount toCurrency={(amount) => <Euro amount={amount} />} />
            
                <h1>US Dollar to Pound:</h1>
                <Amount toCurrency={(amount) => <Pound amount={amount} />} />
           
           
        <Cm count="10"  mod={<p>pppppppppp</p>} />
           </div>
            );

const Amount = ({ toCurrency }) => {
    const [amount, setAmount] = React.useState(0);

    const handleIncrement = () => setAmount(amount + 1);
    const handleDecrement = () => setAmount(amount - 1);

    return (
            <div>
                <button type="button" onClick={handleIncrement}>
                    +
                </button>
                <button type="button" onClick={handleDecrement}>
                    -
                </button>
            
                <p>US Dollar: {amount}</p>
                {toCurrency(amount)}
            </div>
            );
};

const Euro = ({ amount }) => <p>Euro: {amount * 0.86}</p>;

const Pound = ({ amount }) => <p>Pound: {amount * 0.76}</p>;



const Cm = ({count,mod}) => {
  const [ val, setVal] = React.useState(parseInt(count));
   const handleClick = () => {

        setVal((val) => val + 1);
    }

  return (
    <div>
      <Button onClick={handleClick}>
        {val}
      </Button>
              {mod}
    </div>
  );
};

const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

export default Mycom;
