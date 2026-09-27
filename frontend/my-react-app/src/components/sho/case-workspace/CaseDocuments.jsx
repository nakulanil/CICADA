import React, { useEffect, useMemo, useState } from 'react'
import { downloadDocument, getDocument, getProcessingResult, searchDocuments, verifyDocument } from '../../../utils/api'


const categories = ['All', 'FIR & Complaint', 'Investigation', 'Witness Statement', 'Evidence / Seizure', 'Forensic Report', 'Court / Legal', 'Other']
const processingStatuses = ['All', 'Processed', 'Processing', 'Pending']



function StatusBadge({ children, tone }) {
	return <span className={`sho-document-status ${tone}`}>{children}</span>
}

const backendCaseNumbers = {
        'FIR-2026-089': 'CICADA-TEST-001',
}

export default function CaseDocuments({ caseItem }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('All')
	const [activeProcessingStatus, setActiveProcessingStatus] = useState('All')
	const [selectedDocument, setSelectedDocument] = useState(null)
	const [downloadMessage, setDownloadMessage] = useState('')
	const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
	        const backendCaseNumber = backendCaseNumbers[caseItem.id]

			useEffect(() => {
					const loadDocuments = async () => {
							const token = localStorage.getItem('dems_auth_token')

							if (!token) {
									setError('Authentication token not found.')
									setLoading(false)
									return
							}

							if (!backendCaseNumber) {
									setDocuments([])
									setError('')
									setLoading(false)
									return
							}

							try {
									setLoading(true)
									setError('')

									const searchResult = await searchDocuments(
											backendCaseNumber,
											token
									)

									const loadedDocuments = await Promise.all(
											searchResult.results.map(async (result) => {
													const documentDetail = await getDocument(
															result.document_id,
															token
													)

													const latestVersion = documentDetail.versions[0]

													const processingResult = await getProcessingResult(
															latestVersion.version_id,
															token
													)

													const verificationResult = await verifyDocument(
															latestVersion.version_id,
															token
													)

													return {
															id: result.document_id,
															caseId: result.case_number,
															name: latestVersion.original_filename,
															category: result.document_type,
															version: latestVersion.version_number,
															uploadedBy: latestVersion.uploaded_by,
															uploadedDate: new Date(
																	latestVersion.uploaded_at
															).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: 'short',
																	year: 'numeric',
															}),
															processingStatus:
																	processingResult.status === 'COMPLETED'
																			? 'Processed'
																			: processingResult.status === 'PENDING'
																					? 'Pending'
																					: 'Processing',
															integrityStatus:
																	verificationResult.integrity === 'VALID'
																			? 'Verified'
																			: 'Altered',
															pageCount: processingResult.page_count,
															access: ['View', 'Download'],
															versionId: latestVersion.version_id,
															sha256: latestVersion.sha256,
													}
											})
									)

									setDocuments(loadedDocuments)
							} catch (requestError) {
									setError(
											requestError.message ||
											'Failed to load documents.'
									)
									setDocuments([])
							} finally {
									setLoading(false)
							}
					}

					loadDocuments()
			}, [backendCaseNumber])

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

	const handleDownload = async (document) => {
			try {
					const token = localStorage.getItem('dems_auth_token')

					if (!token) {
							setDownloadMessage('Authentication token not found.')
							return
					}

					const blob = await downloadDocument(document.versionId, token)
					const url = window.URL.createObjectURL(blob)
					const link = window.document.createElement('a')

					link.href = url
					link.download = document.name
					link.click()

					window.URL.revokeObjectURL(url)
			} catch (requestError) {
					setDownloadMessage(
							requestError.message || 'Document download failed.'
					)
			}
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

			{loading ? (
					<div className="sho-documents-empty">
							<h3>Loading documents...</h3>
					</div>
			) : error ? (
					<div className="sho-documents-empty">
							<h3>Unable to load documents</h3>
							<p>{error}</p>
					</div>
			) : filteredDocuments.length > 0 ? (
					<div className="sho-document-table-wrap">
							<table className="sho-document-table">
									<thead>
											<tr>
													<th>Document</th>
													<th>Category</th>
													<th>Version</th>
													<th>Uploaded by</th>
													<th>Date</th>
													<th>Processing</th>
													<th>Integrity</th>
													<th>Action</th>
											</tr>
									</thead>
									<tbody>
											{filteredDocuments.map((document) => (
													<tr key={document.id}>
															<td>
																	<strong className="sho-document-name">{document.name}</strong>
																	<span className="sho-document-pages">{document.pageCount} pages</span>
															</td>
															<td>{document.category}</td>
															<td>v{document.version}</td>
															<td>{document.uploadedBy}</td>
															<td className="sho-document-muted">{document.uploadedDate}</td>
															<td>
																	<StatusBadge tone={document.processingStatus.toLowerCase()}>
																			{document.processingStatus}
																	</StatusBadge>
															</td>
															<td>
																	<StatusBadge tone={document.integrityStatus === 'Verified' ? 'verified' : 'pending'}>
																			{document.integrityStatus}
																	</StatusBadge>
															</td>
															<td className="sho-document-actions">
																	<button
																			type="button"
																			className="sho-review-button"
																			onClick={() => setSelectedDocument(document)}
																	>
																			View
																	</button>
																	<button
																			type="button"
																			className="sho-review-button"
																			onClick={() => handleDownload(document)}
																	>
																			Download
																	</button>
															</td>
													</tr>
											))}
									</tbody>
							</table>
					</div>
			) : (
					<div className="sho-documents-empty">
							<h3>No documents found</h3>
							<p>Try a different search term or reset the document filters.</p>
							<button type="button" className="sho-secondary-button" onClick={resetFilters}>
									Reset filters
							</button>
					</div>
			)}

			{selectedDocument && <div className="sho-detail-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedDocument(null)}>
				<aside className="sho-detail-modal sho-document-detail" role="dialog" aria-modal="true" aria-labelledby="document-detail-title">
				<div className="sho-document-detail-heading"><div><p className="sho-eyebrow">Document metadata</p><h3 id="document-detail-title">{selectedDocument.name}</h3></div><button type="button" className="sho-detail-modal-close" aria-label="Close document details" onClick={() => setSelectedDocument(null)}>×</button></div>
				<dl className="sho-document-detail-fields">
					<div><dt>Category</dt><dd>{selectedDocument.category}</dd></div><div><dt>Version</dt><dd>v{selectedDocument.version}</dd></div><div><dt>Uploaded by</dt><dd>{selectedDocument.uploadedBy}</dd></div><div><dt>Upload date</dt><dd>{selectedDocument.uploadedDate}</dd></div>
					<div><dt>Page count</dt><dd>{selectedDocument.pageCount} pages</dd></div><div><dt>Processing status</dt><dd><StatusBadge tone={selectedDocument.processingStatus.toLowerCase()}>{selectedDocument.processingStatus}</StatusBadge></dd></div><div><dt>Integrity status</dt><dd><StatusBadge tone={selectedDocument.integrityStatus === 'Verified' ? 'verified' : 'pending'}>{selectedDocument.integrityStatus}</StatusBadge></dd></div>
					<div className="sho-document-access-field"><dt>Access permissions</dt><dd><span className="sho-document-access-note">Permission-controlled prototype access</span><span className="sho-document-access-list">{selectedDocument.access.join(' / ')}</span></dd></div>
				</dl>
				</aside>
			</div>}
		</section>
	)
}
