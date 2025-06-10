import React, { useState } from 'react';
import aImg from '../../assets/new chess files/a.png';
import bImg from '../../assets/new chess files/b.png';
import cImg from '../../assets/new chess files/c.png';
import dImg from '../../assets/new chess files/d.png';
import eImg from '../../assets/new chess files/e.png';
import fImg from '../../assets/new chess files/f.png';
import gImg from '../../assets/new chess files/g.png';
import hImg from '../../assets/new chess files/h.png';
import iImg from '../../assets/new chess files/i.png';
import jImg from '../../assets/new chess files/j.png';
import kImg from '../../assets/new chess files/k.png';
import lImg from '../../assets/new chess files/l.png';

const pieces = [
  { img: aImg, label: 'White Emperor' },
  { img: bImg, label: 'Black Emperor' },
  { img: cImg, label: 'White Archer' },
  { img: dImg, label: 'Black Archer' },
  { img: eImg, label: 'White General' },
  { img: fImg, label: 'Black General' },
  { img: gImg, label: 'White Cavalry' },
  { img: hImg, label: 'Black Cavalry' },
  { img: iImg, label: 'White Guard' },
  { img: jImg, label: 'Black Guard' },
  { img: kImg, label: 'White Infantry' },
  { img: lImg, label: 'Black Infantry' },
];

const PieceLegend = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={() => setShow(s => !s)}>
        {show ? 'Hide Legend' : 'Show Legend'}
      </button>
      {show && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {pieces.map(({ img, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={img} alt={label} style={{ width: 40, height: 40 }} />
              <span style={{ fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieceLegend;
