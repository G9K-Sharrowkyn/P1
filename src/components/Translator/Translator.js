import React, { useState, useRef } from 'react';
import axios from 'axios';

import '../../assets/css/Translator.css'; 

function Translator() {
    const [translatedText, setTranslatedText] = useState('');

    const textareaRef = useRef();

    const translateText = async () => {
        const encodedParams = new URLSearchParams();

        const text = textareaRef.current.value;

        encodedParams.set('q', text);
        encodedParams.set('target', 'en');

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '9cf4af5912msh36c0dc013981957p134258jsn6c501b8fcdc2',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },  
            data: encodedParams,
        };

        try {
            const response = await axios.request(options);
            setTranslatedText(response.data.data.translations[0].translatedText);
        } catch (error) {
            console.error('Translation error:', error);
        }
    };

    return (
        <div>
            <textarea 
                ref={textareaRef}
            />
            <button onClick={translateText}>Tłumacz</button>
            <div className="translator-response">
        <p>Przetłumaczony tekst: {translatedText}</p>
        </div>
        </div>
    );
}

export default Translator;