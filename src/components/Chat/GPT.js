import React, {useState, useEffect} from 'react'
import axios from 'axios'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer' + API_KEY
} 

const API_KEY = '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'

const loadFromLocalStorage = () => {
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory'))
  return chatHistory ? JSON.parse(chatHistory) : []
}

const saveToLocalStorage = (items) => {
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
}

useEffect (() => {
  const chatHistory = loadFromLocalStorage()
  setMessages(chatHistory)
})

useEffect (() => {
  const savedMessages = loadFromLocalStorage()
  if (savedMessages.length>0) {
    setMessages(savedMessages)
  } 
}, [])

const data = {
  model : 'gpt-3.5-turbo',
  messages: [{role: 'user', content: input }]
}

const response = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  data, 
  {headers}
)

export default function GPT() {
  return (
    <div>
      
    </div>
  )
}
