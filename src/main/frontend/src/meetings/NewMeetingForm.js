import {useState} from "react";

export default function NewMeetingForm({onSubmit, organizerLogin}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function submit(event) {
        event.preventDefault();
        if (!title || !description) {
            alert("Both fields are required!");
            return;
        }
        onSubmit({
            title,
            description,
            participants: [],
            organizer: { login: organizerLogin }
        });
    }

    return (
        <form onSubmit={submit}>
            <h3>Dodaj nowe spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <label>Opis</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            <button type="submit">Dodaj</button>
        </form>
    );
}
