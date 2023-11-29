import React, { useState } from 'react';
import axios from 'axios';

import '../../assets/css/Translator.css'; 

function Translator() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const translateText = async () => {
        const encodedParams = new URLSearchParams();
        encodedParams.set('q', text);
        encodedParams.set('target', 'en');

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
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

    const handleTranslation = () => {
        translateText();
    };

    return (
        <div>
            <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleTranslation}>Tłumacz</button>
            <div className="translator-response">
        <p>Przetłumaczony tekst: {translatedText}</p>
        </div>
        </div>
    );
}

export default Translator;