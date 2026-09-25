import React, { useEffect, useMemo, useState } from 'react'

const categories = ['All', 'FIR & Complaint', 'Investigation', 'Witness Statement', 'Evidence / Seizure', 'Forensic Report', 'Court / Legal', 'Other']
const processingStatuses = ['All', 'Processed', 'Processing', 'Pending']

const prototypeDocuments = {
	'FIR-2026-089': [
		{ id: 'DOC-089-001', caseId: 'FIR-2026-089', name: 'FIR_89_2026.pdf', category: 'FIR & Complaint', version: 2, uploadedBy: 'Central Police Station Desk', uploadedDate: '28-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 12, access: ['View', 'Download'] },
		{ id: 'DOC-089-002', caseId: 'FIR-2026-089', name: 'Scene_Inspection_Report.pdf', category: 'Investigation', version: 1, uploadedBy: 'Inspector Rajesh Kumar Sharma', uploadedDate: '29-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 8, access: ['View', 'Download', 'Share'] },
		{ id: 'DOC-089-003', caseId: 'FIR-2026-089', name: 'Witness_Statement_Nair.pdf', category: 'Witness Statement', version: 1, uploadedBy: 'SI Vikramaditya Singh', uploadedDate: '30-Aug-2026', processingStatus: 'Processing', integrityStatus: 'Verification Pending', pageCount: 5, access: ['View'] },
		{ id: 'DOC-089-004', caseId: 'FIR-2026-089', name: 'Ballistics_Request_Note.pdf', category: 'Forensic Report', version: 1, uploadedBy: 'Central Forensic Desk', uploadedDate: '01-Sep-2026', processingStatus: 'Pending', integrityStatus: 'Verification Pending', pageCount: 3, access: ['View', 'Download'] },
	],
	'FIR-2026-074': [
		{ id: 'DOC-074-001', caseId: 'FIR-2026-074', name: 'FIR_74_2026.pdf', category: 'FIR & Complaint', version: 1, uploadedBy: 'Central Police Station Desk', uploadedDate: '14-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 10, access: ['View', 'Download'] },
		{ id: 'DOC-074-002', caseId: 'FIR-2026-074', name: 'Forensic_Audit_Summary.pdf', category: 'Forensic Report', version: 2, uploadedBy: 'Inspector Rajesh Kumar Sharma', uploadedDate: '28-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 24, access: ['View', 'Download', 'Share'] },
	],
	'FIR-2026-061': [
		{ id: 'DOC-061-001', caseId: 'FIR-2026-061', name: 'FIR_61_2026.pdf', category: 'FIR & Complaint', version: 1, uploadedBy: 'Central Police Station Desk', uploadedDate: '02-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 9, access: ['View', 'Download'] },
		{ id: 'DOC-061-002', caseId: 'FIR-2026-061', name: 'Chargesheet_Submission_Receipt.pdf', category: 'Court / Legal', version: 1, uploadedBy: 'Court Liaison Desk', uploadedDate: '26-Aug-2026', processingStatus: 'Processed', integrityStatus: 'SHA-256 Verified', pageCount: 4, access: ['View', 'Download'] },
	],
}

function StatusBadge({ children, tone }) {
	return <span className={`sho-document-status ${tone}`}>{children}</span>
}

export default function CaseDocuments({ caseItem }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('All')
	const [activeProcessingStatus, setActiveProcessingStatus] = useState('All')
	const [selectedDocument, setSelectedDocument] = useState(null)
	const [downloadMessage, setDownloadMessage] = useState('')
	const documents = prototypeDocuments[caseItem.id] || []
	useEffect(() => {
		if (!selectedDocument) return undefined
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') setSelectedDocument(null)
		}
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedDocument])
	const filteredDocuments = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return documents.filter((document) => (
			(activeCategory === 'All' || document.category === activeCategory)
			&& (activeProcessingStatus === 'All' || document.processingStatus === activeProcessingStatus)
			&& (!query || [document.name, document.category, document.uploadedBy].some((field) => field.toLowerCase().includes(query)))
		))
	}, [activeCategory, activeProcessingStatus, documents, searchQuery])

	const resetFilters = () => {
		setSearchQuery('')
		setActiveCategory('All')
		setActiveProcessingStatus('All')
	}

	return (
		<section className="sho-documents-workspace" aria-labelledby="case-documents-title">
			<header className="sho-documents-heading">
				<div>
					<p className="sho-eyebrow">Case documents</p>
					<h2 id="case-documents-title">Documents</h2>
					<p>Case documents, versions and processing status</p>
				</div>
				<div className="sho-documents-scope"><span>Case scope</span><strong>{caseItem.id}</strong></div>
			</header>

			<div className="sho-documents-toolbar">
				<label className="sho-inbox-search"><span>Search documents</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Name, category or uploader" /></label>
				<label className="sho-document-filter"><span>Category</span><select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
				<label className="sho-document-filter"><span>Processing</span><select value={activeProcessingStatus} onChange={(event) => setActiveProcessingStatus(event.target.value)}>{processingStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
			</div>

			{downloadMessage && <div className="sho-document-notice" role="status">{downloadMessage}<button type="button" onClick={() => setDownloadMessage('')}>Dismiss</button></div>}
			<div className="sho-documents-summary"><strong>{filteredDocuments.length}</strong> of {documents.length} documents shown</div>

			{filteredDocuments.length > 0 ? <div className="sho-document-table-wrap">
				<table className="sho-document-table">
					<thead><tr><th>Document</th><th>Category</th><th>Version</th><th>Uploaded by</th><th>Date</th><th>Processing</th><th>Integrity</th><th>Action</th></tr></thead>
					<tbody>{filteredDocuments.map((document) => <tr key={document.id}>
						<td><strong className="sho-document-name">{document.name}</strong><span className="sho-document-pages">{document.pageCount} pages</span></td><td>{document.category}</td><td>v{document.version}</td><td>{document.uploadedBy}</td><td className="sho-document-muted">{document.uploadedDate}</td>
						<td><StatusBadge tone={document.processingStatus.toLowerCase()}>{document.processingStatus}</StatusBadge></td><td><StatusBadge tone={document.integrityStatus === 'SHA-256 Verified' ? 'verified' : 'pending'}>{document.integrityStatus}</StatusBadge></td>
						<td className="sho-document-actions"><button type="button" className="sho-review-button" onClick={() => setSelectedDocument(document)}>View</button></td>
					</tr>)}</tbody>
				</table>
			</div> : <div className="sho-documents-empty"><h3>No documents found</h3><p>Try a different search term or reset the document filters.</p><button type="button" className="sho-secondary-button" onClick={resetFilters}>Reset filters</button></div>}

			{selectedDocument && <div className="sho-detail-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedDocument(null)}>
				<aside className="sho-detail-modal sho-document-detail" role="dialog" aria-modal="true" aria-labelledby="document-detail-title">
				<div className="sho-document-detail-heading"><div><p className="sho-eyebrow">Document metadata</p><h3 id="document-detail-title">{selectedDocument.name}</h3></div><button type="button" className="sho-detail-modal-close" aria-label="Close document details" onClick={() => setSelectedDocument(null)}>×</button></div>
				<dl className="sho-document-detail-fields">
					<div><dt>Category</dt><dd>{selectedDocument.category}</dd></div><div><dt>Version</dt><dd>v{selectedDocument.version}</dd></div><div><dt>Uploaded by</dt><dd>{selectedDocument.uploadedBy}</dd></div><div><dt>Upload date</dt><dd>{selectedDocument.uploadedDate}</dd></div>
					<div><dt>Page count</dt><dd>{selectedDocument.pageCount} pages</dd></div><div><dt>Processing status</dt><dd><StatusBadge tone={selectedDocument.processingStatus.toLowerCase()}>{selectedDocument.processingStatus}</StatusBadge></dd></div><div><dt>Integrity status</dt><dd><StatusBadge tone={selectedDocument.integrityStatus === 'SHA-256 Verified' ? 'verified' : 'pending'}>{selectedDocument.integrityStatus}</StatusBadge></dd></div>
					<div className="sho-document-access-field"><dt>Access permissions</dt><dd><span className="sho-document-access-note">Permission-controlled prototype access</span><span className="sho-document-access-list">{selectedDocument.access.join(' / ')}</span></dd></div>
				</dl>
				</aside>
			</div>}
		</section>
	)
}
