import React, { useEffect, useState } from 'react'

function getNotesStorageKey(caseId) {
	return `case-notes:${caseId}`
}

function loadLocalNotes(caseId) {
	try {
		const stored = localStorage.getItem(getNotesStorageKey(caseId))
		return stored ? JSON.parse(stored) : []
	} catch (error) {
		return []
	}
}

function getNoteAuthor(caseItem) {
	try {
		const activeUser = JSON.parse(localStorage.getItem('dems_active_user') || 'null')
		return activeUser?.name || caseItem.ioName || 'Assigned officer'
	} catch (error) {
		return caseItem.ioName || 'Assigned officer'
	}
}

function formatNoteDate(value) {
	const date = new Date(value)
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CaseOverview({ caseItem }) {
	const [noteText, setNoteText] = useState('')
	const [localNotes, setLocalNotes] = useState(() => loadLocalNotes(caseItem.id))

	useEffect(() => {
		setLocalNotes(loadLocalNotes(caseItem.id))
		setNoteText('')
	}, [caseItem.id])

	const saveLocalNotes = (nextNotes) => {
		setLocalNotes(nextNotes)
		localStorage.setItem(getNotesStorageKey(caseItem.id), JSON.stringify(nextNotes))
	}

	const addNote = (event) => {
		event.preventDefault()
		const text = noteText.trim()
		if (!text) return
		const nextNote = {
			id: `${caseItem.id}-${Date.now()}`,
			text,
			author: getNoteAuthor(caseItem),
			createdAt: new Date().toISOString(),
		}
		saveLocalNotes([nextNote, ...localNotes])
		setNoteText('')
	}

	const deleteNote = (noteId) => {
		saveLocalNotes(localNotes.filter((note) => note.id !== noteId))
	}

	const existingNotes = (caseItem.initialNotes || []).map((note) => ({
		...note,
		createdAt: note.createdAt || note.timestamp,
	}))
	const notes = [...localNotes, ...existingNotes]

	return (
		<div className="sho-case-overview">
			<div className="sho-overview-grid">
				<section className="sho-overview-panel sho-overview-summary"><p className="sho-eyebrow">Case summary</p><h2>Occurrence overview</h2><p>{caseItem.summary || 'No occurrence summary has been recorded for this case.'}</p></section>
				<section className="sho-overview-panel"><p className="sho-eyebrow">Current position</p><h2>Current position</h2><dl className="sho-overview-facts"><div><dt>Case status</dt><dd>{caseItem.progressStatus}</dd></div><div><dt>Investigation stage</dt><dd>{caseItem.stage || 'Not recorded'}</dd></div><div><dt>Primary IO</dt><dd>{caseItem.ioName || 'Not assigned'}</dd></div><div><dt>Priority</dt><dd>{caseItem.priority || 'Routine'}</dd></div></dl></section>
				<section className="sho-overview-panel"><p className="sho-eyebrow">Case record</p><h2>Case record</h2><dl className="sho-overview-facts"><div><dt>FIR date</dt><dd>{caseItem.date || 'Not recorded'}</dd></div><div><dt>Evidence items</dt><dd>{caseItem.evidenceItems ?? 0}</dd></div><div><dt>Case diary entries</dt><dd>{caseItem.caseDiaryEntries ?? 0}</dd></div><div><dt>Legal sections</dt><dd>{caseItem.sections || 'Not recorded'}</dd></div></dl></section>
			</div>
			<section className="sho-overview-panel sho-case-notes">
				<div className="sho-overview-panel-heading"><div><p className="sho-eyebrow">Case notes</p><h2>Case Notes</h2><p className="sho-case-notes-helper">Add observations, follow-ups, or internal notes for this case.</p></div></div>
				<form className="sho-case-notes-form" onSubmit={addNote}>
					<label className="sho-case-notes-label" htmlFor={`case-note-${caseItem.id}`}>Write a note</label>
					<textarea id={`case-note-${caseItem.id}`} value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Write a note..." />
					<div className="sho-case-notes-actions"><button type="submit" className="sho-primary-button">Add Note</button></div>
				</form>
				<div className="sho-case-notes-recent"><h3>Recent Notes</h3><p className="sho-case-notes-storage-note">Prototype notes are stored locally for this case.</p></div>
				{notes.length ? <div className="sho-case-notes-list">{notes.map((note) => <article className="sho-case-note" key={note.id}><div className="sho-case-note-meta"><strong>{note.author}</strong><time>{formatNoteDate(note.createdAt)}</time></div><p>{note.text}</p>{localNotes.some((localNote) => localNote.id === note.id) && <button type="button" className="sho-case-note-delete" onClick={() => deleteNote(note.id)}>Delete</button>}</article>)}</div> : <p className="sho-muted-copy sho-case-notes-empty">No notes have been added for this case yet.</p>}
			</section>
			<section className="sho-overview-panel sho-pending-actions"><p className="sho-eyebrow">Follow-up</p><h2>Pending actions</h2><p>{caseItem.stage ? `Current focus: ${caseItem.stage}.` : 'No pending actions are recorded for this case.'}</p></section>
		</div>
	)
}
