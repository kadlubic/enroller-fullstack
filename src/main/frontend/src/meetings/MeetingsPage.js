import {useState, useEffect} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    useEffect(() => {
        async function fetchMeetings() {
            const response = await fetch('/api/meetings');
            const data = await response.json();
            setMeetings(data);
        }
        fetchMeetings();
    }, []);

    async function handleNewMeeting(meeting) {
        console.log("Adding meeting:", meeting); 
        try {
            const response = await fetch('/api/meetings', {
                method: 'POST',
                body: JSON.stringify(meeting),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const newMeeting = await response.json();
                setMeetings([...meetings, newMeeting]);
                setAddingNewMeeting(false);
            } else {
                const errorText = await response.text();
                console.error("Failed to add meeting:", errorText);
                alert(`Failed to add meeting. Error: ${errorText}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the meeting. Please try again.");
        }
    }

    function handleDeleteMeeting(meeting) {
        const nextMeetings = meetings.filter(m => m !== meeting);
        setMeetings(nextMeetings);
    }

    function handleSignIn(meeting) {
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                m.participants = [...m.participants, username];
            }
            return m;
        });
        setMeetings(nextMeetings);
    }

    function handleSignOut(meeting) {
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                m.participants = m.participants.filter(u => u !== username);
            }
            return m;
        });
        setMeetings(nextMeetings);
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={handleNewMeeting} organizerLogin={username}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onSignIn={handleSignIn}
                              onSignOut={handleSignOut}/>}
        </div>
    )
}
