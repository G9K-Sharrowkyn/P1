export default function ChatForm() {
    return (
        <div className={"chatForm"}>
        <input type="text" className={'chatFormInput'} placeholder="Wpisz wiadomość..." />
        <button className={'chatFormSubmit'}>Wyślij wiadomość</button>
        <div className={'clearf9x'} />
        </div>
    )
}
