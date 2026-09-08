"use client";

import Layout from "@/components/Layout";

export default function DashboardPage() {
    return (
        <Layout>
            <style>{`
                .db-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
                .db-header h1 { font-size: 24px; font-weight: 700; margin: 0; }
                .db-info-link { color: #0073bb; font-size: 13px; font-weight: 700; text-decoration: none; }
                .db-info-link:hover { text-decoration: underline; }
                
                .db-features {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px;
                    background: #fff; border: 1px solid #d5d9d9; border-radius: 8px; padding: 24px;
                }
                .db-feature-col { display: flex; flex-direction: column; align-items: center; text-align: center; }
                .db-feature-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
                .db-feature-desc { font-size: 13px; color: #555; margin-bottom: 20px; line-height: 1.5; flex: 1; }
                
                .db-btn {
                    background: #fff; border: 1px solid #545b64; border-radius: 20px;
                    padding: 6px 16px; font-size: 13px; font-weight: 700; color: #0073bb; cursor: pointer;
                }
                .db-btn:hover { background: #f2f8fd; }
                
                .db-error { color: #d13212; font-size: 20px; margin-bottom: 8px; }

                .db-section {
                    background: #fff; border: 1px solid #d5d9d9; border-radius: 8px; padding: 24px; margin-bottom: 24px;
                }
                .db-section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
                .db-section-desc { font-size: 13px; margin-bottom: 16px; }
                
                .db-input-group { display: flex; gap: 8px; }
                .db-input { flex: 1; border: 1px solid #aab7b8; border-radius: 2px; padding: 6px 10px; font-size: 13px; }
                .db-hint { font-size: 11px; color: #555; margin-top: 8px; display: block; }
                
                .db-notifications-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .db-notifications-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
                .db-refresh-btn { background: none; border: 1px solid #aab7b8; border-radius: 2px; padding: 4px; cursor: pointer; color: #0073bb; }
            `}</style>

            <div className="db-header">
                <h1>Route 53 Dashboard</h1>
                <a href="#" className="db-info-link">Info</a>
            </div>

            <div className="db-features">
                <div className="db-feature-col">
                    <div className="db-feature-title">DNS management</div>
                    <div className="db-feature-desc">
                        A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
                    </div>
                    <button className="db-btn">Create hosted zone</button>
                </div>
                <div className="db-feature-col">
                    <div className="db-feature-title">Availability monitoring</div>
                    <div className="db-feature-desc">
                        Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
                    </div>
                    <button className="db-btn">Create health check</button>
                </div>
                <div className="db-feature-col">
                    <div className="db-feature-title">Traffic management</div>
                    <div className="db-feature-desc">
                        A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
                    </div>
                    <button className="db-btn">Create policy</button>
                </div>
            </div>

            <div className="db-section">
                <div className="db-section-title">Register domain</div>
                <div className="db-section-desc">
                    Find and register an available domain, or <a href="#">transfer your existing domains</a> to Route 53.
                </div>
                <div className="db-input-group">
                    <input type="text" className="db-input" placeholder="Enter a domain name" />
                </div>
                <span className="db-hint">
                    Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
                </span>
                <button className="db-btn" style={{ marginTop: "12px" }}>Check</button>
            </div>

            <div className="db-section" style={{ padding: "16px 24px" }}>
                <div className="db-notifications-header">
                    <h2>Notifications</h2>
                    <button className="db-refresh-btn">↻</button>
                </div>
                <div className="db-input-group">
                    <input type="text" className="db-input" placeholder="Find notifications" />
                </div>
            </div>
        </Layout>
    );
}