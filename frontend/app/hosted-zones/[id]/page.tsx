"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/api";

export default function DNSRecordsPage() {
    const router = useRouter();
    const params = useParams();
    const zoneId = params.id as string;
    
    const [zone, setZone] = useState<any>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("A");
    const [newValue, setNewValue] = useState("");
    const [newTtl, setNewTtl] = useState(300);
    
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        if (zoneId) {
            loadZoneAndRecords();
        }
    }, [zoneId]);

    async function loadZoneAndRecords(searchQuery = "") {
        try {
            setLoading(true);
            const [zoneData, recordsData] = await Promise.all([
                apiRequest(`/hosted-zones/${zoneId}`),
                apiRequest(`/hosted-zones/${zoneId}/records${searchQuery ? `?search=${searchQuery}` : ''}`)
            ]);
            setZone(zoneData);
            setRecords(recordsData);
        } catch (error) {
            console.error("Failed to load zone or records", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadZoneAndRecords(search);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        try {
            // DNS records names are typically prefixed to the zone name if not absolute, but here we just pass the user input.
            // A realistic clone would handle appending the domain if missing, but we'll stick to a simple pass-through.
            const recordName = newName.trim() === "" ? zone.name : newName.endsWith(zone.name) ? newName : `${newName}.${zone.name}`;
            
            await apiRequest(`/hosted-zones/${zoneId}/records`, {
                method: "POST",
                body: JSON.stringify({ 
                    name: recordName, 
                    record_type: newType, 
                    value: newValue,
                    ttl: newTtl
                })
            });
            setShowCreateModal(false);
            setNewName("");
            setNewType("A");
            setNewValue("");
            setNewTtl(300);
            loadZoneAndRecords();
        } catch (err: any) {
            setCreateError(err.message || "Failed to create DNS record");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (recordId: number) => {
        if (!confirm("Are you sure you want to delete this DNS record?")) return;
        try {
            await apiRequest(`/records/${recordId}`, { method: "DELETE" });
            loadZoneAndRecords();
        } catch (err) {
            alert("Failed to delete record");
        }
    };

    const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];

    if (!zone && !loading) {
        return <Layout><div style={{ padding: "40px" }}>Hosted zone not found.</div></Layout>;
    }

    return (
        <Layout>
            <style>{`
                .rec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .rec-header h1 { font-size: 24px; font-weight: 700; margin: 0; }
                .rec-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; margin-bottom: 12px; }
                .rec-breadcrumb-link { color: #0073bb; cursor: pointer; }
                .rec-breadcrumb-link:hover { text-decoration: underline; }
                
                .rec-panel { background: #fff; border: 1px solid #d5d9d9; border-radius: 8px; padding: 24px; }
                
                .rec-zone-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #d5d9d9; }
                .rec-detail-item { font-size: 13px; }
                .rec-detail-label { color: #555; margin-bottom: 4px; }
                .rec-detail-value { font-weight: 700; color: #0f1111; }
                
                .rec-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .rec-search-form { display: flex; gap: 8px; flex: 1; max-width: 400px; }
                .rec-input { flex: 1; border: 1px solid #aab7b8; border-radius: 2px; padding: 6px 10px; font-size: 13px; }
                .rec-select { border: 1px solid #aab7b8; border-radius: 2px; padding: 6px 10px; font-size: 13px; background: #fff; }
                
                .rec-btn-primary {
                    background: #ff9900; border: 1px solid #e47911; border-radius: 20px;
                    padding: 6px 16px; font-size: 13px; font-weight: 700; color: #0f1111; cursor: pointer;
                }
                .rec-btn-primary:hover { background: #ec8800; }
                
                .rec-btn-secondary {
                    background: #fff; border: 1px solid #545b64; border-radius: 20px;
                    padding: 6px 16px; font-size: 13px; font-weight: 700; color: #0f1111; cursor: pointer;
                }
                .rec-btn-secondary:hover { background: #f2f3f3; }
                
                .rec-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
                .rec-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid #d5d9d9; font-weight: 700; color: #555; }
                .rec-table td { padding: 12px 16px; border-bottom: 1px solid #d5d9d9; color: #0f1111; word-wrap: break-word; }
                .rec-table tr:hover td { background: #f2f8fd; }
                
                .rec-action-btn { background: none; border: 1px solid #d5d9d9; border-radius: 2px; padding: 4px 8px; cursor: pointer; font-size: 12px; color: #d13212; }
                .rec-action-btn:hover { background: #fdf0ef; border-color: #d13212; }
                
                /* Modal */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-content {
                    background: #fff; width: 600px; max-height: 90vh; overflow-y: auto; border-radius: 8px; padding: 24px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid #d5d9d9; padding-bottom: 12px; }
                .modal-field { margin-bottom: 16px; }
                .modal-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #d5d9d9; padding-top: 16px; }
                .modal-error { color: #d13212; font-size: 13px; margin-bottom: 12px; }
            `}</style>

            <div className="rec-breadcrumb">
                <span className="rec-breadcrumb-link" onClick={() => router.push('/hosted-zones')}>Hosted zones</span>
                <span>&gt;</span>
                <span style={{ fontWeight: 700, color: '#0f1111' }}>{zone?.name || "Loading..."}</span>
            </div>

            <div className="rec-header">
                <h1>{zone?.name || "Loading..."}</h1>
                <button className="rec-btn-primary" onClick={() => setShowCreateModal(true)} disabled={!zone}>Create record</button>
            </div>

            <div className="rec-panel">
                {zone && (
                    <div className="rec-zone-details">
                        <div className="rec-detail-item">
                            <div className="rec-detail-label">Hosted zone ID</div>
                            <div className="rec-detail-value">{zone.id}</div>
                        </div>
                        <div className="rec-detail-item">
                            <div className="rec-detail-label">Type</div>
                            <div className="rec-detail-value">{zone.zone_type}</div>
                        </div>
                        <div className="rec-detail-item">
                            <div className="rec-detail-label">Description</div>
                            <div className="rec-detail-value">{zone.description || "-"}</div>
                        </div>
                    </div>
                )}

                <div className="rec-controls">
                    <form className="rec-search-form" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            className="rec-input" 
                            placeholder="Find records by name" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="rec-btn-secondary">Search</button>
                    </form>
                </div>

                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center" }}>Loading records...</div>
                ) : (
                    <table className="rec-table">
                        <colgroup>
                            <col style={{ width: '25%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '45%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Record name</th>
                                <th>Type</th>
                                <th>Value/Route traffic to</th>
                                <th>TTL (seconds)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#555" }}>
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id}>
                                        <td style={{ fontWeight: 700 }}>{record.name}</td>
                                        <td>{record.record_type}</td>
                                        <td style={{ whiteSpace: 'pre-wrap' }}>{record.value}</td>
                                        <td>{record.ttl}</td>
                                        <td>
                                            <button className="rec-action-btn" onClick={() => handleDelete(record.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Record Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-title">Quick create record</div>
                        <form onSubmit={handleCreate}>
                            {createError && <div className="modal-error">{createError}</div>}
                            
                            <div className="modal-field">
                                <label className="modal-label">Record name</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="text" 
                                        className="rec-input" 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="subdomain"
                                    />
                                    <span style={{ fontSize: '13px', color: '#555' }}>.{zone?.name}</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                                    Leave blank to create a record at the zone apex.
                                </div>
                            </div>
                            
                            <div className="modal-field">
                                <label className="modal-label">Record type</label>
                                <select 
                                    className="rec-select" 
                                    style={{ width: "100%" }}
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                >
                                    {RECORD_TYPES.map(type => (
                                        <option key={type} value={type}>{type} - Routes traffic to an IPv4 address and some AWS resources</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">Value</label>
                                <textarea 
                                    className="rec-input" 
                                    style={{ width: "100%", height: "80px", resize: "vertical" }}
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    placeholder="192.0.2.235"
                                    required
                                />
                                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                                    Enter multiple values on separate lines.
                                </div>
                            </div>

                            <div className="modal-field">
                                <label className="modal-label">TTL (Seconds)</label>
                                <input 
                                    type="number" 
                                    className="rec-input" 
                                    value={newTtl}
                                    onChange={(e) => setNewTtl(Number(e.target.value))}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="rec-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="rec-btn-primary" disabled={creating}>
                                    {creating ? "Creating..." : "Create records"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
