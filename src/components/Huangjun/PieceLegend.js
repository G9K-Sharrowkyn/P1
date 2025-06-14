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
  { img: aImg, label: 'White Emperor', role: 'Cesarz', desc: 'Zasięg 3' },
  { img: bImg, label: 'Black Emperor', role: 'Cesarz', desc: 'Zasięg 3' },
  { img: cImg, label: 'White Archer', role: 'Łucznik', desc: 'Zasięg 2; po odczekaniu 1 tury może zaatakować z dystansu 3' },
  { img: dImg, label: 'Black Archer', role: 'Łucznik', desc: 'Zasięg 2; po odczekaniu 1 tury może zaatakować z dystansu 3' },
  { img: eImg, label: 'White General', role: 'Generał', desc: 'Zasięg 9' },
  { img: fImg, label: 'Black General', role: 'Generał', desc: 'Zasięg 9' },
  { img: gImg, label: 'White Cavalry', role: 'Kawaleria', desc: 'Zasięg 5; może szarżować, atakując dwie jednostki w jednej linii' },
  { img: hImg, label: 'Black Cavalry', role: 'Kawaleria', desc: 'Zasięg 5; może szarżować, atakując dwie jednostki w jednej linii' },
  { img: iImg, label: 'White Guard', role: 'Gwardia', desc: 'Zasięg 2; może zrobić roszadę z Cesarzem i chroni go w pobliżu' },
  { img: jImg, label: 'Black Guard', role: 'Gwardia', desc: 'Zasięg 2; może zrobić roszadę z Cesarzem i chroni go w pobliżu' },
  { img: kImg, label: 'White Infantry', role: 'Piechota', desc: 'Zasięg 1 – porusza się i atakuje po skosie lub do przodu' },
  { img: lImg, label: 'Black Infantry', role: 'Piechota', desc: 'Zasięg 1 – porusza się i atakuje po skosie lub do przodu' },
];

const PieceLegend = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={() => setShow(s => !s)}>
        {show ? 'Ukryj legendę' : 'Pokaż legendę'}
      </button>
      {show && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {pieces.map(({ img, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={img} alt={label} style={{ width: 40, height: 40 }} />
                <span style={{ fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>

          <table style={{ marginTop: '1.5rem', width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: 4 }}>Postać</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: 4 }}>Zdolności</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(pieces.map(p => p.role))).map(role => {
                const desc = pieces.find(p => p.role === role)?.desc;
                return (
                  <tr key={role}>
                    <td style={{ padding: '6px 0' }}>{role}</td>
                    <td style={{ padding: '6px 0' }}>{desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PieceLegend;
