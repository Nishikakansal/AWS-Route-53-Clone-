"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/api";
import { Search, Settings, RefreshCw, Info } from "lucide-react";

export default function HostedZonesPage() {
    const router = useRouter();
    const [hostedZones, setHostedZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    useEffect(() => {
        loadHostedZones();
    }, []);

    async function loadHostedZones(searchQuery = "") {
        try {
            setLoading(true);
            const data = await apiRequest(`/hosted-zones${searchQuery ? `?search=${searchQuery}` : ''}`);
            setHostedZones(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadHostedZones(search);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        try {
            await apiRequest("/hosted-zones", {
                method: "POST",
                body: JSON.stringify({ name: newName, description: newDesc, zone_type: "PUBLIC" })
            });
            setShowCreateModal(false);
            setNewName("");
            setNewDesc("");
            loadHostedZones();
        } catch (err: any) {
            setCreateError(err.message || "Failed to create hosted zone");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this hosted zone?")) return;
        try {
            await apiRequest(`/hosted-zones/${id}`, { method: "DELETE" });
            loadHostedZones();
        } catch (err) {
            alert("Failed to delete hosted zone");
        }
    };

    return (
        <Layout>
            <style>{`
                .hz-header-container { margin-bottom: 24px; }
                .hz-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; border-bottom: 1px solid #d5d9d9; padding-bottom: 16px; }
                .hz-title-area { display: flex; align-items: baseline; gap: 8px; }
                .hz-title { font-size: 24px; font-weight: 700; margin: 0; color: #0f1111; }
                .hz-count { font-size: 20px; color: #545b64; font-weight: 300; }
                
                .hz-header-actions { display: flex; align-items: center; gap: 8px; }
                .hz-icon-btn { 
                    background: #fff; border: 1px solid #d5d9d9; border-radius: 50%; width: 32px; height: 32px; 
                    display: flex; align-items: center; justify-content: center; color: #0073bb; cursor: pointer; 
                }
                .hz-icon-btn:hover { background: #f2f8fd; border-color: #0073bb; }
                
                .hz-btn-primary {
                    background: #ff9900; border: 1px solid #e47911; border-radius: 20px;
                    padding: 4px 20px; font-size: 14px; font-weight: 700; color: #0f1111; cursor: pointer; height: 32px;
                }
                .hz-btn-primary:hover { background: #ec8800; }
                
                .hz-btn-disabled {
                    background: #fff; border: 1px solid #d5d9d9; border-radius: 20px;
                    padding: 4px 16px; font-size: 14px; font-weight: 700; color: #879596; cursor: not-allowed; height: 32px;
                }
                
                .hz-info-text { font-size: 13px; color: #545b64; margin-bottom: 16px; }
                .hz-info-link { color: #0073bb; text-decoration: none; cursor: pointer; }
                .hz-info-link:hover { text-decoration: underline; }
                
                .hz-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                
                .hz-search-wrapper { position: relative; flex: 1; max-width: 600px; }
                .hz-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #545b64; }
                .hz-search-input { 
                    width: 100%; border: 1px solid #aab7b8; border-radius: 2px; padding: 6px 10px 6px 32px; font-size: 13px; color: #0f1111; 
                }
                .hz-search-input::placeholder { color: #545b64; font-style: italic; }
                .hz-search-input:focus { border-color: #0073bb; outline: none; box-shadow: 0 0 0 1px #0073bb; }
                
                .hz-pagination { display: flex; align-items: center; gap: 12px; color: #545b64; font-size: 13px; }
                .hz-page-controls { display: flex; align-items: center; gap: 8px; }
                .hz-page-btn { background: none; border: none; color: #d5d9d9; cursor: not-allowed; font-size: 16px; font-weight: bold; }
                .hz-page-number { font-weight: 700; color: #0f1111; }
                .hz-settings-icon { color: #545b64; cursor: pointer; }
                
                .hz-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
                .hz-table th { text-align: left; padding: 8px 10px; border-top: 1px solid #d5d9d9; border-bottom: 1px solid #d5d9d9; font-weight: 700; color: #0f1111; position: relative; }
                .hz-table th::after { content: "▼"; font-size: 8px; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #545b64; }
                .hz-table th:first-child::after { display: none; }
                .hz-table td { padding: 10px; border-bottom: 1px solid #d5d9d9; color: #0f1111; }
                .hz-table tr:hover td { background: #f2f8fd; }
                .hz-table-link { color: #0073bb; text-decoration: none; font-weight: 700; cursor: pointer; }
                .hz-table-link:hover { text-decoration: underline; }
                
                .hz-empty-state { text-align: center; padding: 40px 20px; }
                .hz-empty-title { font-size: 16px; font-weight: 700; color: #0f1111; margin-bottom: 8px; }
                .hz-empty-desc { font-size: 13px; color: #545b64; margin-bottom: 24px; }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-content {
                    background: #fff; width: 500px; border-radius: 8px; padding: 24px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid #d5d9d9; padding-bottom: 12px; }
                .modal-field { margin-bottom: 16px; }
                .modal-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #d5d9d9; padding-top: 16px; }
                .modal-error { color: #d13212; font-size: 13px; margin-bottom: 12px; }
                .modal-btn-secondary { background: #fff; border: 1px solid #545b64; border-radius: 20px; padding: 6px 16px; font-size: 13px; font-weight: 700; color: #0f1111; cursor: pointer; }
                .modal-btn-secondary:hover { background: #f2f3f3; }
            `}</style>

            <div className="hz-header-container">
                <div className="hz-header">
                    <div className="hz-title-area">
                        <h1 className="hz-title">Hosted zones</h1>
                        <span className="hz-count">({hostedZones.length})</span>
                    </div>
                    <div className="hz-header-actions">
                        <button className="hz-icon-btn" onClick={() => loadHostedZones(search)} title="Refresh">
                            <RefreshCw size={14} />
                        </button>
                        <button className="hz-btn-disabled">View details</button>
                        <button className="hz-btn-disabled">Edit</button>
                        <button className="hz-btn-disabled">Delete</button>
                        <button className="hz-btn-primary" onClick={() => setShowCreateModal(true)}>Create hosted zone</button>
                    </div>
                </div>
                <div className="hz-info-text">
                    Automatic mode is the current search behavior optimized for best filter results. <span className="hz-info-link">To change modes go to settings.</span>
                </div>
            </div>

            <div className="hz-controls">
                <form className="hz-search-wrapper" onSubmit={handleSearch}>
                    <Search className="hz-search-icon" size={14} />
                    <input 
                        type="text" 
                        className="hz-search-input" 
                        placeholder="Filter records by property or value" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="hz-pagination">
                    <div className="hz-page-controls">
                        <button className="hz-page-btn">&lt;</button>
                        <span className="hz-page-number">1</span>
                        <button className="hz-page-btn">&gt;</button>
                    </div>
                    <Settings className="hz-settings-icon" size={16} />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
            ) : (
                <table className="hz-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Hosted zone name</th>
                            <th>Type</th>
                            <th>Created by</th>
                            <th>Record count</th>
                            <th>Description</th>
                            <th>Hosted zone ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hostedZones.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: 0 }}>
                                    <div className="hz-empty-state">
                                        <div className="hz-empty-title">No hosted zones</div>
                                        <div className="hz-empty-desc">There are no hosted zones created for this account.</div>
                                        <button className="hz-btn-primary" onClick={() => setShowCreateModal(true)}>Create hosted zone</button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            hostedZones.map((zone) => (
                                <tr key={zone.id}>
                                    <td style={{ textAlign: 'center' }}><input type="radio" name="selected_zone" /></td>
                                    <td>
                                        <span 
                                            className="hz-table-link"
                                            onClick={() => router.push(`/hosted-zones/${zone.id}`)}
                                        >
                                            {zone.name}
                                        </span>
                                    </td>
                                    <td>{zone.zone_type}</td>
                                    <td>-</td>
                                    <td>0</td>
                                    <td>{zone.description || "-"}</td>
                                    <td>{zone.id}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-title">Create hosted zone</div>
                        <form onSubmit={handleCreate}>
                            {createError && <div className="modal-error">{createError}</div>}
                            
                            <div className="modal-field">
                                <label className="modal-label">Domain name</label>
                                <input 
                                    type="text" 
                                    className="hz-search-input" 
                                    style={{ width: "100%", paddingLeft: "10px" }}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="example.com"
                                    required
                                />
                                <div style={{ fontSize: '11px', color: '#545b64', marginTop: '4px' }}>
                                    Enter the domain name. Example: example.com
                                </div>
                            </div>
                            
                            <div className="modal-field">
                                <label className="modal-label">Description - optional</label>
                                <textarea 
                                    className="hz-search-input" 
                                    style={{ width: "100%", height: "80px", resize: "vertical", paddingLeft: "10px" }}
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    placeholder="Hosted zone for example.com"
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="modal-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="hz-btn-primary" disabled={creating}>
                                    {creating ? "Creating..." : "Create hosted zone"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}