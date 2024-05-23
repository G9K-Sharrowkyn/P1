import React from 'react';
import { connect } from 'react-redux';

function ClickCounter({ counterValue} ) {
  return (
    <div className="flex justify-end">
      <div className="space-y-4">
        <button 
          className="btn btn-xl"
        >
          Kliknij mnie!
        </button>
        <p className="w-50 h-12 bg-white dark:bg-slate-950 text-black dark:text-white rounded ring-slate-950 shadow-lg ring-4 text-2xl">
          Liczba kliknięć: {counterValue}
        </p>
      </div>
    </div>
  );
}


export default connect(state => {
  return {
    counterValue: state.counter.value
  }
})(ClickCounter)

